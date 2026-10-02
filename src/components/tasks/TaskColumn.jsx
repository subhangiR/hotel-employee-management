import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard.jsx";
import "./TaskColumn.css";

export function TaskColumn({ status, tasks, onEdit, onStatusChange }) {
  return (
    <section className="task-column">
      <header className="task-column__header">
        <h3 className="task-column__title">{status}</h3>
        <span className="task-column__count">{tasks.length}</span>
      </header>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`task-column__body${snapshot.isDraggingOver ? " task-column__body--over" : ""}`}
          >
            {tasks.length === 0 ? (
              <p className="task-column__empty">Drop tasks here</p>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={onEdit}
                  onStatusChange={onStatusChange}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}
