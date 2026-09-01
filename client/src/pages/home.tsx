import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import TaskForm from "@/components/task-form";
import TaskFilters from "@/components/task-filters";
import TaskCard from "@/components/task-card";
import { Task } from "@shared/schema";
import { ClipboardList, Plus } from "lucide-react";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks", sortBy],
  });

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === "all") return true;
    return task.status === activeFilter;
  });

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    "in-progress": tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="bg-white rounded-xl h-48 border border-gray-200"></div>
            <div className="bg-white rounded-xl h-16 border border-gray-200"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-64 border border-gray-200"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskForm />
        
        <TaskFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          taskCounts={taskCounts}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <ClipboardList className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeFilter === "all" ? "No tasks found" : `No ${activeFilter.replace("-", " ")} tasks`}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeFilter === "all" 
                ? "Get started by creating your first task above."
                : `No tasks match the current filter. Try viewing all tasks.`
              }
            </p>
            {activeFilter === "all" && (
              <button
                onClick={() => document.getElementById("title")?.focus()}
                className="bg-primary hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Create Your First Task
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
