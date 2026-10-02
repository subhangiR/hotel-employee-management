import { DragDropContext } from "@hello-pangea/dnd";
import { TASK_STATUSES } from "../../constants/tasks.js";
import { TaskColumn } from "./TaskColumn.jsx";
import "./TaskBoard.css";

export function TaskBoard({ tasks, onDragEnd, onEdit, onStatusChange }) {
  const tasksByStatus = TASK_STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="task-board">
        {TASK_STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
