import { TASK_PRIORITIES, TASK_STATUSES } from "../../constants/tasks.js";

export function TaskForm({ form, errors, employees, onChange }) {
  return (
    <div className="um-form um-form--modal">
      <label>
        Task Title
        <input
          name="title"
          type="text"
          value={form.title}
          onChange={onChange}
          placeholder="Enter task title"
        />
        {errors.title && <span className="um-error">{errors.title}</span>}
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Describe the task"
          rows={3}
          className="task-form__textarea"
        />
        {errors.description && (
          <span className="um-error">{errors.description}</span>
        )}
      </label>

      <label>
        Assign Employee
        <select
          name="assignedEmployeeId"
          value={form.assignedEmployeeId}
          onChange={onChange}
        >
          <option value="">Select employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.role})
            </option>
          ))}
        </select>
        {errors.assignedEmployeeId && (
          <span className="um-error">{errors.assignedEmployeeId}</span>
        )}
      </label>

      <label>
        Priority
        <select name="priority" value={form.priority} onChange={onChange}>
          <option value="">Select priority</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors.priority && <span className="um-error">{errors.priority}</span>}
      </label>

      <label>
        Due Date
        <input
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={onChange}
        />
        {errors.dueDate && <span className="um-error">{errors.dueDate}</span>}
      </label>

      <label>
        Status
        <select name="status" value={form.status} onChange={onChange}>
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.status && <span className="um-error">{errors.status}</span>}
      </label>
    </div>
  );
}
