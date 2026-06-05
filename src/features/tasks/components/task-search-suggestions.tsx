import { memo } from "react";
import { useTaskSuggestions } from "../hooks/use-tasks";

interface Props {
  open: boolean;
  query: string;
  onSelect: (value: string) => void;
}

export const SuggestionsDropdown = memo(({ open, query, onSelect }: Props) => {
  const { data = [], isPending } = useTaskSuggestions(query);

  if (!open || query.length < 2) {
    return null;
  }

  return (
    <div className="absolute top-full mt-1 z-50 w-full rounded-md border bg-background shadow-lg">
      {isPending ? (
        <div className="p-3 text-sm text-muted-foreground">Searching...</div>
      ) : data.length > 0 ? (
        data.map((item) => (
          <button
            key={item}
            type="button"
            onMouseDown={() => onSelect(item)}
            className="w-full px-3 py-2 text-left hover:bg-muted"
          >
            {item}
          </button>
        ))
      ) : (
        <div className="p-3 text-sm text-muted-foreground">No matches</div>
      )}
    </div>
  );
});
