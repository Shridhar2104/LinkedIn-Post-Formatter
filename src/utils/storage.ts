import { FormatType } from './formatter';

export interface UserData {
  isPro: boolean;
  formatsUsedToday: number;
  totalFormats: number;
  lastFormatDate: string;
  savedTemplates: SavedTemplate[];
  preferences: UserPreferences;
}

export interface SavedTemplate {
  id: string;
  name: string;
  content: string;
  formatType: FormatType;
  createdAt: string;
}

export interface UserPreferences {
  defaultFormatType: FormatType;
  addLineBreaks: boolean;
  addEmojis: boolean;
  addBulletPoints: boolean;
  addHook: boolean;
  addCTA: boolean;
}

const DEFAULT_USER_DATA: UserData = {
  isPro: false,
  formatsUsedToday: 0,
  totalFormats: 0,
  lastFormatDate: new Date().toISOString().split('T')[0],
  savedTemplates: [],
  preferences: {
    defaultFormatType: 'thread',
    addLineBreaks: true,
    addEmojis: true,
    addBulletPoints: true,
    addHook: true,
    addCTA: true,
  },
};

export class StorageManager {

  static async getUserData(): Promise<UserData> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['userData'], (result) => {
        if (result.userData) {
          resolve(result.userData as UserData);
        } else {
          resolve(DEFAULT_USER_DATA);
        }
      });
    });
  }

  static async saveUserData(data: Partial<UserData>): Promise<void> {
    const currentData = await this.getUserData();
    const updatedData = { ...currentData, ...data };

    return new Promise((resolve) => {
      chrome.storage.sync.set({ userData: updatedData }, () => {
        resolve();
      });
    });
  }

  static async incrementFormatCount(): Promise<boolean> {
    const userData = await this.getUserData();
    const today = new Date().toISOString().split('T')[0];

    // Reset daily count if new day
    if (userData.lastFormatDate !== today) {
      userData.formatsUsedToday = 0;
      userData.lastFormatDate = today;
    }

    // Check if user hit free tier limit (10 formats/day)
    if (!userData.isPro && userData.formatsUsedToday >= 10) {
      return false;
    }

    // Increment counts
    userData.formatsUsedToday += 1;
    userData.totalFormats += 1;

    await this.saveUserData(userData);
    return true;
  }

  static async canFormat(): Promise<{ allowed: boolean; reason?: string }> {
    const userData = await this.getUserData();
    const today = new Date().toISOString().split('T')[0];

    // Pro users have unlimited formats
    if (userData.isPro) {
      return { allowed: true };
    }

    // Reset daily count if new day
    if (userData.lastFormatDate !== today) {
      return { allowed: true };
    }

    // Check free tier limit
    if (userData.formatsUsedToday >= 10) {
      return {
        allowed: false,
        reason: 'Daily limit reached. Upgrade to Pro for unlimited formatting!',
      };
    }

    return { allowed: true };
  }

  static async saveTemplate(template: Omit<SavedTemplate, 'id' | 'createdAt'>): Promise<void> {
    const userData = await this.getUserData();

    const newTemplate: SavedTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    userData.savedTemplates.push(newTemplate);

    await this.saveUserData({ savedTemplates: userData.savedTemplates });
  }

  static async deleteTemplate(templateId: string): Promise<void> {
    const userData = await this.getUserData();

    userData.savedTemplates = userData.savedTemplates.filter(t => t.id !== templateId);

    await this.saveUserData({ savedTemplates: userData.savedTemplates });
  }

  static async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    const userData = await this.getUserData();

    userData.preferences = {
      ...userData.preferences,
      ...preferences,
    };

    await this.saveUserData({ preferences: userData.preferences });
  }

  static async upgradeToPro(): Promise<void> {
    await this.saveUserData({ isPro: true });
  }
}
