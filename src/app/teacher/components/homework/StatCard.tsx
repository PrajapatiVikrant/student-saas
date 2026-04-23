import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  count: number;
  label: string;
  theme: 'green' | 'red' | 'blue';
}

const themeStyles = {
  green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
  },
  red: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    iconBg: 'bg-rose-100',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
};

export function StatCard({ icon: Icon, count, label, theme }: StatCardProps) {
  const styles = themeStyles[theme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`${styles.bg} dark:bg-slate-800 dark:text-white rounded-2xl p-6 shadow-sm border border-white/50 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center gap-4">
        <div className={`${styles.iconBg} dark:bg-slate-700 p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${styles.text}`} />
        </div>
        <div>
          <div className={`text-3xl font-semibold ${styles.text}`}>{count}</div>
          <div className="text-sm text-gray-600 mt-1">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}
