import type { FeatureCardProps } from './types';

export function FeatureCard({ title, icon }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
        {icon}
      </div>
      <span className="small-bold text-white">{title}</span>
    </div>
  );
}