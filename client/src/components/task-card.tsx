import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Play, 
  Check, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Undo2,
  TriangleAlert,
  Minus
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async (updates: Partial<Task>) => {
      const response = await apiRequest("PATCH", `/api/tasks/${task.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          icon: TriangleAlert,
          label: "High Priority"
        };
      case "medium":
        return {
          bgColor: "bg-amber-100",
          textColor: "text-amber-600",
          icon: Minus,
          label: "Medium Priority"
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-500",
          icon: Minus,
          label: "Low Priority"
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "in-progress":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
          label: "In Progress"
        };
      case "completed":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-600",
          label: "Completed"
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          label: "Pending"
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);
  const PriorityIcon = priorityConfig.icon;

  const handleStatusChange = (newStatus: string) => {
    updateTaskMutation.mutate({ status: newStatus as any });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate();
    }
  };

  // Calculate mock progress for in-progress tasks
  const mockProgress = task.status === "in-progress" ? 
    Math.floor(Math.random() * 80) + 20 : 0;

  return (
    <div className={`task-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${
      task.status === "completed" ? "opacity-75" : ""
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`${priorityConfig.bgColor} ${priorityConfig.textColor} text-xs font-medium px-2 py-1 rounded-full flex items-center`}>
            <PriorityIcon className="w-3 h-3 mr-1" />
            {priorityConfig.label}
          </span>
          <span className={`${statusConfig.bgColor} ${statusConfig.textColor} text-xs font-medium px-2 py-1 rounded-full flex items-center`}>
            {task.status === "completed" && <Check className="w-3 h-3 mr-1" />}
            {statusConfig.label}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className={`font-semibold text-gray-900 mb-2 ${task.status === "completed" ? "line-through" : ""}`}>
        {task.title}
      </h3>
      {task.description && (
        <p className={`text-gray-600 text-sm mb-4 ${task.status === "completed" ? "line-through" : ""}`}>
          {task.description}
        </p>
      )}

      {task.status === "in-progress" && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{mockProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${mockProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>Created {formatDistanceToNow(new Date(task.createdAt))} ago</span>
        {task.status === "completed" ? (
          <span className="text-green-600 font-medium flex items-center">
            <Check className="w-3 h-3 mr-1" />
            Completed {formatDistanceToNow(new Date(task.updatedAt))} ago
          </span>
        ) : (
          <span>Updated {formatDistanceToNow(new Date(task.updatedAt))} ago</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {task.status === "pending" && (
          <Button
            onClick={() => handleStatusChange("in-progress")}
            disabled={updateTaskMutation.isPending}
            className="flex-1 bg-primary hover:bg-indigo-700 text-white text-sm font-medium"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Task
          </Button>
        )}
        
        {task.status === "in-progress" && (
          <Button
            onClick={() => handleStatusChange("completed")}
            disabled={updateTaskMutation.isPending}
            className="flex-1 bg-success hover:bg-green-600 text-white text-sm font-medium"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
        )}
        
        {task.status === "completed" && (
          <Button
            onClick={() => handleStatusChange("pending")}
            disabled={updateTaskMutation.isPending}
            variant="outline"
            className="flex-1 text-sm font-medium"
          >
            <Undo2 className="w-4 h-4 mr-2" />
            Reopen Task
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          <Edit className="w-4 h-4" />
        </Button>

        <Button
          onClick={handleDelete}
          disabled={deleteTaskMutation.isPending}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
