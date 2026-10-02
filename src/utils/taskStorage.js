export const TASKS_STORAGE_KEY = "user-management-app:tasks";

export function loadTasks(fallback) {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore quota / private mode errors
  }
}
