import { motion } from "motion/react";
import { BookOpen, Users, FileText } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface HomeworkCardProps {
  className: string;
  batch: string;
  subject: string;
  homework: string;
  status: "assigned" | "pending";
  delay?: number;
}

export function HomeworkCard({
  className,
  batch,
  subject,
  homework,
  status,
  delay = 0,
}: HomeworkCardProps) {
  const isPending = status === "pending";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="
        bg-white dark:bg-slate-900
        text-gray-900 dark:text-white
        border border-gray-100 dark:border-slate-800
        rounded-xl p-5 shadow-sm hover:shadow-md transition-all
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">

          {/* HEADER INFO */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">

            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
              <BookOpen className="w-4 h-4 text-blue-500" />
              {className}
            </div>

            <span className="text-gray-300 dark:text-slate-600">•</span>

            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-400">
              <Users className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              {batch}
            </div>

            <span className="text-gray-300 dark:text-slate-600">•</span>

            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-400">
              <FileText className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              {subject}
            </div>

          </div>

          {/* HOMEWORK TEXT */}
          <p
            className={`text-sm ${
              isPending
                ? "text-gray-400 dark:text-slate-500 italic"
                : "text-gray-700 dark:text-slate-300"
            }`}
          >
            {homework}
          </p>
        </div>

        {/* STATUS */}
        <div className="flex-shrink-0">
          <StatusBadge status={status} />
        </div>
      </div>
    </motion.div>
  );
}