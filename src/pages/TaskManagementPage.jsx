import { useState, useMemo, useEffect } from "react";
import { AppLayout } from "../components/AppLayout.jsx";
import { TaskBoard } from "../components/tasks/TaskBoard.jsx";
import { TaskForm } from "../components/tasks/TaskForm.jsx";
import {
  EMPTY_TASK_FORM,
  SEED_TASKS,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "../constants/tasks.js";
import { loadTasks, saveTasks } from "../utils/taskStorage.js";
import { loadUsers } from "../utils/userStorage.js";
import "../pages/UserManagementPage.css";
import "./TaskManagementPage.css";

const SEED_USERS = [
  { id: 1, name: "Ram", email: "ram@gmail.com", role: "Admin" },
  { id: 2, name: "Priya", email: "priya@gmail.com", role: "User" },
];

function validateTaskForm(form, employees) {
  const errors = {};

  if (!form.title.trim()) errors.title = "Task title is required";
  if (!form.description.trim()) errors.description = "Description is required";
  if (!form.assignedEmployeeId) errors.assignedEmployeeId = "Select an employee";
  if (!form.priority) errors.priority = "Select a priority";
  if (!form.dueDate) errors.dueDate = "Due date is required";
  if (!TASK_STATUSES.includes(form.status)) errors.status = "Select a valid status";

  const empId = Number(form.assignedEmployeeId);
  if (form.assignedEmployeeId && !employees.some((e) => e.id === empId)) {
    errors.assignedEmployeeId = "Invalid employee";
  }
  if (form.priority && !TASK_PRIORITIES.includes(form.priority)) {
    errors.priority = "Invalid priority";
  }

  return errors;
}

function taskFromForm(form, employees) {
  const employee = employees.find((e) => e.id === Number(form.assignedEmployeeId));
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    assignedEmployeeId: employee.id,
    assignedEmployeeName: employee.name,
    priority: form.priority,
    status: form.status,
    dueDate: form.dueDate,
  };
}

export function TaskManagementPage({ activePage, onNavigate }) {
  const [tasks, setTasks] = useState(() => loadTasks(SEED_TASKS));
  const [employees, setEmployees] = useState(() => loadUsers(SEED_USERS));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_TASK_FORM);
  const [formErrors, setFormErrors] = useState({});

  const [search, setSearch] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "To Do").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      done: tasks.filter((t) => t.status === "Done").length,
    }),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((task) => {
      if (employeeFilter !== "all" && task.assignedEmployeeId !== Number(employeeFilter)) {
        return false;
      }
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }
      if (q && !task.title.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [tasks, search, employeeFilter, priorityFilter]);

  const hasFilters =
    search.trim() !== "" || employeeFilter !== "all" || priorityFilter !== "all";

  const openAddModal = () => {
    setEmployees(loadUsers(SEED_USERS));
    setEditingId(null);
    setForm(EMPTY_TASK_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEmployees(loadUsers(SEED_USERS));
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      assignedEmployeeId: String(task.assignedEmployeeId),
      priority: task.priority,
      dueDate: task.dueDate,
      status: task.status,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_TASK_FORM);
    setFormErrors({});
  };

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setFormErrors((err) => {
      const next = { ...err };
      delete next[name];
      return next;
    });
  };

  const saveTask = () => {
    const errors = validateTaskForm(form, employees);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    const payload = taskFromForm(form, employees);

    if (editingId) {
      setTasks((list) =>
        list.map((t) => (t.id === editingId ? { ...t, ...payload } : t))
      );
    } else {
      setTasks((list) => [...list, { id: Date.now(), ...payload }]);
    }
    closeModal();
  };

  const handleStatusChange = (taskId, newStatus) => {
    if (!TASK_STATUSES.includes(newStatus)) return;
    setTasks((list) =>
      list.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const taskId = Number(result.draggableId);
    const newStatus = result.destination.droppableId;
    if (!TASK_STATUSES.includes(newStatus)) return;
    handleStatusChange(taskId, newStatus);
  };

  const clearFilters = () => {
    setSearch("");
    setEmployeeFilter("all");
    setPriorityFilter("all");
  };

  const addButton = (
    <button
      type="button"
      className="um-btn um-btn--primary um-btn--add"
      onClick={openAddModal}
      disabled={employees.length === 0}
      title={employees.length === 0 ? "Add users first" : undefined}
    >
      + Add Task
    </button>
  );

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={onNavigate}
      title="Tasks"
      subtitle={
        hasFilters
          ? `Showing ${filteredTasks.length} of ${tasks.length} tasks`
          : `${stats.total} task${stats.total === 1 ? "" : "s"} on the board`
      }
      headerAction={addButton}
    >
      <div className="tm-stats">
        <div className="tm-stat">
          <span className="tm-stat__value">{stats.total}</span>
          <span className="tm-stat__label">Total Tasks</span>
        </div>
        <div className="tm-stat">
          <span className="tm-stat__value">{stats.todo}</span>
          <span className="tm-stat__label">To Do</span>
        </div>
        <div className="tm-stat">
          <span className="tm-stat__value">{stats.inProgress}</span>
          <span className="tm-stat__label">In Progress</span>
        </div>
        <div className="tm-stat">
          <span className="tm-stat__value">{stats.done}</span>
          <span className="tm-stat__label">Completed</span>
        </div>
      </div>

      <section className="tm-section">
        <div className="um-section__head">
          <h2 className="um-section__title">Employee Task Board</h2>
          <div className="um-toolbar">
            <label className="um-search">
              <span className="um-search__icon" aria-hidden="true">
                🔍
              </span>
              <input
                type="search"
                placeholder="Search task title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search tasks"
              />
            </label>
            <label className="um-filter">
              Employee
              <select
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                aria-label="Filter by employee"
              >
                <option value="all">All employees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="um-filter">
              Priority
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter by priority"
              >
                <option value="all">All priorities</option>
                {TASK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            {hasFilters && (
              <button type="button" className="um-btn um-btn--ghost" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        </div>

        {employees.length === 0 ? (
          <p className="um-empty">
            No employees found. Add users on the Users page before creating tasks.
          </p>
        ) : filteredTasks.length === 0 && tasks.length > 0 ? (
          <p className="um-empty">No tasks match your search or filters.</p>
        ) : (
          <TaskBoard
            tasks={filteredTasks}
            onDragEnd={handleDragEnd}
            onEdit={openEditModal}
            onStatusChange={handleStatusChange}
          />
        )}
      </section>

      {modalOpen && (
        <div className="um-overlay" onClick={closeModal}>
          <div
            className="um-modal um-modal--task"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{editingId ? "Edit Task" : "Add Task"}</h3>
            <TaskForm
              form={form}
              errors={formErrors}
              employees={employees}
              onChange={onFormChange}
            />
            <div className="um-modal-actions">
              <button type="button" className="um-btn" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className="um-btn um-btn--primary"
                onClick={saveTask}
              >
                {editingId ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
