import { Action } from "@/types/action";

export function filterActions(actions: Action[], query: string): Action[] {
  if (!query) return actions;
  const normalizedQuery = query.toLowerCase().trim();
  return actions.filter((action) =>
    action.label.toLowerCase().includes(normalizedQuery)
  );
}
