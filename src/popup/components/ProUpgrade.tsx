import { Crown, Check, X, Zap } from 'lucide-react';

interface ProUpgradeProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export default function ProUpgrade({ onClose, onUpgrade }: ProUpgradeProps) {
  const features = [
    'Unlimited formatting (no daily limits)',
    'Post analytics & performance tracking',
    'AI-powered hook suggestions',
    'Save custom templates',
    'A/B testing different formats',
    'Priority support',
    'Early access to new features',
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-yellow-50 to-orange-50 p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crown className="text-yellow-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Upgrade to Pro</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
        <div className="text-center mb-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-gray-800">$5</span>
            <span className="text-gray-500">/month</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Billed monthly • Cancel anytime</p>
        </div>

        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 py-3 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-500 transition flex items-center justify-center gap-2"
        >
          <Zap size={18} />
          Upgrade Now
        </button>
      </div>

      {/* Social Proof */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">Why Pro Users Love It</p>
        <div className="space-y-3">
          <div className="border-l-2 border-linkedin-500 pl-3">
            <p className="text-xs text-gray-700">"Increased my post engagement by 300%!"</p>
            <p className="text-[10px] text-gray-500 mt-1">- Sarah K., Content Creator</p>
          </div>
          <div className="border-l-2 border-linkedin-500 pl-3">
            <p className="text-xs text-gray-700">"The analytics helped me find the best posting times."</p>
            <p className="text-[10px] text-gray-500 mt-1">- Mike R., Marketing Manager</p>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-linkedin-50 rounded-lg p-4">
        <p className="text-xs font-semibold text-linkedin-800 mb-2">💡 Quick ROI Calculation</p>
        <div className="space-y-1 text-xs text-gray-700">
          <p>• Better formatted posts = 3-5x more engagement</p>
          <p>• More engagement = more opportunities</p>
          <p>• Just 1 client from LinkedIn = 100x ROI</p>
        </div>
      </div>

      {/* Skip */}
      <div className="text-center mt-4">
        <button
          onClick={onClose}
          className="text-xs text-gray-500 hover:text-gray-700 transition"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
