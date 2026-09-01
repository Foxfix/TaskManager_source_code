import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  taskCounts: {
    all: number;
    pending: number;
    "in-progress": number;
    completed: number;
  };
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function TaskFilters({
  activeFilter,
  onFilterChange,
  taskCounts,
  sortBy,
  onSortChange,
}: TaskFiltersProps) {
  const filters = [
    { key: "all", label: "All Tasks", count: taskCounts.all },
    { key: "pending", label: "Pending", count: taskCounts.pending },
    { key: "in-progress", label: "In Progress", count: taskCounts["in-progress"] },
    { key: "completed", label: "Completed", count: taskCounts.completed },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeFilter === filter.key
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter.label}{" "}
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.key
                    ? "bg-white text-primary"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm text-gray-600">
            Sort by:
          </label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
