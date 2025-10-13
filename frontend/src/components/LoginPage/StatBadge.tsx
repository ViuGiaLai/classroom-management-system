import type { StatBadgeProps } from './types';

export function StatBadge({ count, label, icon }: StatBadgeProps) {
  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 min-w-[140px]">
      {icon && (
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-gray-900 font-bold text-lg leading-tight">{count}</span>
        <span className="text-gray-600 text-sm leading-tight">{label}</span>
      </div>
    </div>
  );
}