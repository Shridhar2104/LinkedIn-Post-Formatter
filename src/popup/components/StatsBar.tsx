import { TrendingUp, Crown } from 'lucide-react';

interface StatsBarProps {
  isPro: boolean;
  formatsUsedToday: number;
  totalFormats: number;
}

export default function StatsBar({ isPro, formatsUsedToday, totalFormats }: StatsBarProps) {
  const dailyLimit = 10;
  const remaining = isPro ? '∞' : Math.max(0, dailyLimit - formatsUsedToday);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-600">
            <TrendingUp size={14} />
            <span>Total: <span className="font-semibold">{totalFormats}</span></span>
          </div>
          {!isPro && (
            <div className="flex items-center gap-1 text-gray-600">
              <span>Today: <span className="font-semibold">{remaining}/{dailyLimit}</span></span>
            </div>
          )}
        </div>
        {isPro && (
          <div className="flex items-center gap-1 text-yellow-600 font-semibold">
            <Crown size={14} />
            <span>PRO</span>
          </div>
        )}
      </div>
    </div>
  );
}
