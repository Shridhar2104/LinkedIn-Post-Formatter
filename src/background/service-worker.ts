// Background Service Worker
// Handles extension lifecycle and communication between components

console.log('LinkedIn Post Formatter: Service worker initialized');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');

    // Open welcome page or set default settings
    chrome.storage.sync.set({
      userData: {
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
      },
    });

    // Optional: Open onboarding page
    // chrome.tabs.create({ url: 'https://linkedinpostformatter.com/welcome' });
  } else if (details.reason === 'update') {
    console.log('Extension updated');
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'openPopup') {
    // Can't directly open popup, but we can provide feedback
    sendResponse({ success: false, message: 'Click the extension icon to open' });
  }

  if (request.action === 'trackEvent') {
    // Handle analytics events
    console.log('Event tracked:', request.event);
    sendResponse({ success: true });
  }

  return true;
});

// Reset daily format count at midnight
chrome.alarms.create('resetDailyCount', {
  when: getNextMidnight(),
  periodInMinutes: 24 * 60, // Every 24 hours
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'resetDailyCount') {
    chrome.storage.sync.get(['userData'], (result) => {
      if (result.userData) {
        const userData = result.userData;
        userData.formatsUsedToday = 0;
        userData.lastFormatDate = new Date().toISOString().split('T')[0];

        chrome.storage.sync.set({ userData });
        console.log('Daily format count reset');
      }
    });
  }
});

function getNextMidnight(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

// Badge management
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.userData) {
    const userData = changes.userData.newValue;

    if (!userData.isPro && userData.formatsUsedToday >= 10) {
      // Show badge when limit reached
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#ff4444' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  }
});
