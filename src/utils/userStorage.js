/** Key visible in browser DevTools → Application → Local Storage */
export const USERS_STORAGE_KEY = "user-management-app:users";

export function loadUsers(fallback) {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore quota / private mode errors
  }
}
