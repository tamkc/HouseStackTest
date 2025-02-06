"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { AudioLines, Globe, Search, Send } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import useShortcut from "@/hooks/useShortcut";
import { filterActions } from "@/lib/searchUtils";
import { Action } from "@/types/action";
import ActionList from "./ActionList";

interface ActionSearchBarProps {
  actions?: Action[];
}

const allActions: Action[] = [
  { id: "1", label: "Add a note", icon: <Send className="h-4 w-4 text-blue-500" />, description: "Operator", short: "⌘A", end: "ADD" },
  { id: "2", label: "Update a note", icon: <Send className="h-4 w-4 text-orange-500" />, description: "gpt-4o", short: "⌘U", end: "Update" },
  { id: "3", label: "Delete a note", icon: <Send className="h-4 w-4 text-purple-500" />, description: "gpt-4o", short: "⌘D", end: "Delete" },
  { id: "4", label: "Talk to Jarvis", icon: <AudioLines className="h-4 w-4 text-green-500" />, description: "coming soon", short: "", end: "" },
  { id: "5", label: "Translate", icon: <Globe className="h-4 w-4 text-blue-500" />, description: "coming soon", short: "", end: "" },
];

function ActionSearchBar({ actions = allActions }: ActionSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredActions, setFilteredActions] = useState<Action[]>([]);
  const debouncedQuery = useDebounce(query, 200);

  // Handle shortcut (Cmd + K to open, Esc to close)
  useShortcut(() => setIsFocused((prev) => !prev), ["k"]);
  useShortcut(() => setIsFocused(false), ["Escape"]);

  useEffect(() => {
    if (!isFocused) {
      setFilteredActions([]);
      return;
    }
    setFilteredActions(filterActions(actions, debouncedQuery));
  }, [debouncedQuery, isFocused, actions]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative flex flex-col items-center min-h-[300px]">
        {/* Search Input */}
        <div className="w-full max-w-sm sticky top-0 bg-background z-10 pt-4 pb-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Search Commands</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="What's up?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="pl-3 pr-9 py-1.5 h-9 text-sm rounded-lg"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
              <AnimatePresence mode="popLayout">
                {query.length > 0 ? (
                  <motion.div key="send" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Send className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                ) : (
                  <motion.div key="search" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Action List */}
        <ActionList isFocused={isFocused} actions={filteredActions} />
      </div>
    </div>
  );
}

export default ActionSearchBar;