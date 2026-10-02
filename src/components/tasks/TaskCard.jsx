import { Draggable } from "@hello-pangea/dnd";
import { TASK_STATUSES } from "../../constants/tasks.js";
import "./TaskCard.css";

export function TaskCard({ task, index, onEdit, onStatusChange }) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card${snapshot.isDragging ? " task-card--dragging" : ""}`}
        >
          <div className="task-card__head">
            <h4 className="task-card__title">{task.title}</h4>
            <button
              type="button"
              className="task-card__edit"
              title="Edit task"
              onClick={() => onEdit(task)}
            >
              ✏️
            </button>
          </div>

          <p className="task-card__employee">
            <span className="task-card__label">Assignee</span>
            {task.assignedEmployeeName}
          </p>

          <div className="task-card__meta">
            <span className={`task-card__priority task-card__priority--${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
            <span className="task-card__due">{task.dueDate}</span>
          </div>

          <label className="task-card__status">
            <span className="task-card__label">Status</span>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              aria-label={`Change status for ${task.title}`}
            >
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </article>
      )}
    </Draggable>
  );
}
