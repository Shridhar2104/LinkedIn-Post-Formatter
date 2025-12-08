import { useState, useEffect } from 'react';
import { Sparkles, Copy, Send, Settings, Crown, TrendingUp } from 'lucide-react';
import { LinkedInFormatter, FormatOptions, FormatType } from '../utils/formatter';
import { StorageManager, UserData } from '../utils/storage';
import { Analytics } from '../utils/analytics';
import FormatSelector from './components/FormatSelector';
import TextEditor from './components/TextEditor';
import PreviewPanel from './components/PreviewPanel';
import ProUpgrade from './components/ProUpgrade';
import StatsBar from './components/StatsBar';

function App() {
  const [inputText, setInputText] = useState('');
  const [formattedText, setFormattedText] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formatOptions, setFormatOptions] = useState<FormatOptions>({
    addLineBreaks: true,
    addEmojis: true,
    addBulletPoints: true,
    addHook: true,
    addCTA: true,
    formatType: 'thread',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const data = await StorageManager.getUserData();
    setUserData(data);
    setFormatOptions(prev => ({
      ...prev,
      ...data.preferences,
      formatType: data.preferences.defaultFormatType as FormatType,
    }));
  };

  const handleFormat = async () => {
    if (!inputText.trim()) return;

    // Check if user can format
    const { allowed, reason } = await StorageManager.canFormat();

    if (!allowed) {
      alert(reason);
      Analytics.trackLimitReached(userData?.formatsUsedToday || 0);
      setShowUpgrade(true);
      return;
    }

    // Format the post
    const result = LinkedInFormatter.formatPost(inputText, formatOptions);
    setFormattedText(result.content);

    // Track and update counts
    await StorageManager.incrementFormatCount();
    Analytics.trackFormatted(
      formatOptions.formatType,
      inputText.length,
      userData?.isPro ? 'pro' : 'free'
    );

    // Reload user data to update stats
    await loadUserData();
  };

  const handleCopy = async () => {
    if (!formattedText) return;

    await navigator.clipboard.writeText(formattedText);
    setCopied(true);
    Analytics.trackCopied(formatOptions.formatType);

    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = async () => {
    if (!formattedText) return;

    // Send message to content script to insert text
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id && tab.url?.includes('linkedin.com')) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'insertFormatted',
        content: formattedText,
      });

      Analytics.trackInserted();
    } else {
      alert('Please open LinkedIn to insert the formatted post');
    }
  };

  const handleUpgrade = () => {
    Analytics.trackUpgradeClicked('main_cta');
    setShowUpgrade(true);
  };

  if (showUpgrade) {
    return (
      <ProUpgrade
        onClose={() => setShowUpgrade(false)}
        onUpgrade={async () => {
          await StorageManager.upgradeToPro();
          await loadUserData();
          setShowUpgrade(false);
          Analytics.trackUpgraded('pro', 5);
        }}
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-linkedin-50 to-white">
      {/* Header */}
      <div className="bg-linkedin-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} />
            <h1 className="text-lg font-bold">LinkedIn Formatter</h1>
          </div>
          <div className="flex items-center gap-2">
            {!userData?.isPro && (
              <button
                onClick={handleUpgrade}
                className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-linkedin-800 rounded-full text-xs font-semibold hover:bg-yellow-300 transition"
              >
                <Crown size={14} />
                Go Pro
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 hover:bg-linkedin-500 rounded transition"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {userData && (
        <StatsBar
          isPro={userData.isPro}
          formatsUsedToday={userData.formatsUsedToday}
          totalFormats={userData.totalFormats}
        />
      )}

      {/* Main Content */}
      <div className="p-4 space-y-4 max-h-[480px] overflow-y-auto">
        {/* Format Type Selector */}
        <FormatSelector
          selectedFormat={formatOptions.formatType}
          onSelectFormat={(type) => setFormatOptions({ ...formatOptions, formatType: type })}
        />

        {/* Text Editor */}
        <TextEditor
          value={inputText}
          onChange={setInputText}
          placeholder="Paste your LinkedIn post here..."
        />

        {/* Options */}
        <div className="bg-white rounded-lg p-3 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-600">Formatting Options</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formatOptions.addHook}
                onChange={(e) => setFormatOptions({ ...formatOptions, addHook: e.target.checked })}
                className="rounded"
              />
              <span>Add Hook</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formatOptions.addEmojis}
                onChange={(e) => setFormatOptions({ ...formatOptions, addEmojis: e.target.checked })}
                className="rounded"
              />
              <span>Add Emojis</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formatOptions.addBulletPoints}
                onChange={(e) => setFormatOptions({ ...formatOptions, addBulletPoints: e.target.checked })}
                className="rounded"
              />
              <span>Bullet Points</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formatOptions.addCTA}
                onChange={(e) => setFormatOptions({ ...formatOptions, addCTA: e.target.checked })}
                className="rounded"
              />
              <span>Add CTA</span>
            </label>
          </div>
        </div>

        {/* Format Button */}
        <button
          onClick={handleFormat}
          disabled={!inputText.trim()}
          className="w-full bg-linkedin-600 text-white py-3 rounded-lg font-semibold hover:bg-linkedin-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <TrendingUp size={18} />
          Format Post
        </button>

        {/* Preview Panel */}
        {formattedText && (
          <PreviewPanel content={formattedText} />
        )}

        {/* Action Buttons */}
        {formattedText && (
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 bg-white border border-linkedin-600 text-linkedin-600 py-2 rounded-lg font-semibold hover:bg-linkedin-50 transition flex items-center justify-center gap-2"
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleInsert}
              className="flex-1 bg-linkedin-600 text-white py-2 rounded-lg font-semibold hover:bg-linkedin-700 transition flex items-center justify-center gap-2"
            >
              <Send size={16} />
              Insert
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
