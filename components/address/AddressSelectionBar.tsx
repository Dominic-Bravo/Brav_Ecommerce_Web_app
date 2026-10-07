"use client";

interface AddressSelectionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  isDeleting: boolean;
}

export default function AddressSelectionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  isDeleting,
}: AddressSelectionBarProps) {
  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-brav-lg border border-brav-border bg-white p-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSelectAll}
          className="text-sm font-medium text-brav-primary hover:underline"
        >
          Select All
        </button>

        {selectedCount > 0 && (
          <button
            type="button"
            onClick={onClearSelection}
            className="text-sm text-brav-muted hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-brav-muted">
            {selectedCount} selected
          </span>

          <button
            type="button"
            onClick={onDeleteSelected}
            disabled={isDeleting}
            className="rounded-brav-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete Selected"}
          </button>
        </div>
      )}
    </div>
  );
}