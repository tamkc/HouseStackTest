import { AnimatePresence, motion } from "framer-motion";
import { Action } from "@/types/action";
import ActionItem from "./search/ActionItem";

interface ActionListProps {
    isFocused: boolean;
    actions: Action[];
}

const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    show: { opacity: 1, height: "auto", transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

function ActionList({ isFocused, actions }: ActionListProps) {
    return (
        <AnimatePresence>
            {isFocused && actions.length > 0 && (
                <motion.div className="w-full border rounded-md shadow-sm overflow-hidden bg-white dark:bg-black mt-1" variants={containerVariants} initial="hidden" animate="show" exit="exit">
                    <motion.ul>
                        {actions.map((action) => (
                            <ActionItem key={action.id} action={action} />
                        ))}
                    </motion.ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ActionList;