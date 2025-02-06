import { motion } from "framer-motion";
import { Action } from "@/types/action";

interface ActionItemProps {
  action: Action;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function ActionItem({ action }: ActionItemProps) {
  return (
    <motion.li className="px-3 py-2 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-zinc-900 cursor-pointer rounded-md" variants={itemVariants}>
      <div className="flex items-center gap-2">
        <span className="text-gray-500">{action.icon}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{action.label}</span>
        <span className="text-xs text-gray-400">{action.description}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{action.short}</span>
        <span className="text-xs text-gray-400">{action.end}</span>
      </div>
    </motion.li>
  );
}

export default ActionItem;