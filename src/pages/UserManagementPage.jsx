import { useState, useMemo, useEffect } from "react";
import { AppLayout } from "../components/AppLayout.jsx";
import { loadUsers, saveUsers } from "../utils/userStorage.js";
import "./UserManagementPage.css";

const ROLES = ["Admin", "User"];

const USER_FIELDS = [
  { key: "name", label: "Name", type: "text", placeholder: "Enter name" },
  { key: "email", label: "Email", type: "email", placeholder: "Enter email" },
  { key: "role", label: "Role", type: "select", options: ROLES },
];

const EMPTY = Object.fromEntries(USER_FIELDS.map((f) => [f.key, ""]));

const SEED_USERS = [
  { id: 1, name: "Ram", email: "ram@gmail.com", role: "Admin" },
  { id: 2, name: "Priya", email: "priya@gmail.com", role: "User" },
];

function formFromUser(user) {
  return Object.fromEntries(
    USER_FIELDS.map((f) => [f.key, user[f.key] ?? ""])
  );
}

function userPayload(form) {
  return Object.fromEntries(
    USER_FIELDS.map((f) => [
      f.key,
      f.type === "select" ? form[f.key] : (form[f.key] ?? "").trim(),
    ])
  );
}

function validate(data, users, editingId) {
  const errors = {};

  for (const field of USER_FIELDS) {
    const value = (data[field.key] ?? "").trim();

    if (!value) {
      errors[field.key] = `${field.label} is required`;
      continue;
    }

    if (field.key === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = "Invalid email";
      } else if (
        users.some(
          (u) =>
            u.email.toLowerCase() === value.toLowerCase() && u.id !== editingId
        )
      ) {
        errors.email = "Email already in use";
      }
    }

    if (field.type === "select" && field.options && !field.options.includes(value)) {
      errors[field.key] = `Select a ${field.label.toLowerCase()}`;
    }
  }

  return errors;
}

function UserFields({ form, errors, onChange }) {
  return USER_FIELDS.map((field) => (
    <label key={field.key}>
      {field.label}
      {field.type === "select" ? (
        <select name={field.key} value={form[field.key]} onChange={onChange}>
          <option value="">Select {field.label.toLowerCase()}</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={field.key}
          type={field.type}
          value={form[field.key]}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      )}
      {errors[field.key] && (
        <span className="um-error">{errors[field.key]}</span>
      )}
    </label>
  ));
}

const MODAL_TITLES = {
  add: "Add user",
  view: "View user",
  edit: "Edit user",
};

function getDisplayedUsers(users, search, roleFilter, sortKey, sortDir) {
  const q = search.trim().toLowerCase();
  let list = users.filter((user) => {
    if (roleFilter !== "all" && user.role !== roleFilter) return false;
    if (!q) return true;
    return USER_FIELDS.some((f) =>
      String(user[f.key] ?? "").toLowerCase().includes(q)
    );
  });

  if (sortKey) {
    list = [...list].sort((a, b) => {
      const aVal = String(a[sortKey] ?? "").toLowerCase();
      const bVal = String(b[sortKey] ?? "").toLowerCase();
      const cmp = aVal.localeCompare(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  return list;
}

export function UserManagementPage({ activePage = "users", onNavigate }) {
  const [users, setUsers] = useState(() => loadUsers(SEED_USERS));

  useEffect(() => {
    saveUsers(users);
  }, [users]);
  const [modal, setModal] = useState(null);
  const [modalForm, setModalForm] = useState(EMPTY);
  const [modalErrors, setModalErrors] = useState({});
  const [toDelete, setToDelete] = useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const closeModal = () => {
    setModal(null);
    setModalForm(EMPTY);
    setModalErrors({});
  };

  const openAddModal = () => {
    setModalForm(EMPTY);
    setModalErrors({});
    setModal({ mode: "add" });
  };

  const openUserModal = (user, mode) => {
    setModalForm(formFromUser(user));
    setModalErrors({});
    setModal({ mode, userId: user.id });
  };

  const onModalChange = (e) => {
    const { name, value } = e.target;
    setModalForm((f) => ({ ...f, [name]: value }));
    setModalErrors((err) => {
      const next = { ...err };
      delete next[name];
      return next;
    });
  };

  const saveUser = (e) => {
    e?.preventDefault?.();
    if (!modal) return;

    const isAdd = modal.mode === "add";
    const errors = validate(modalForm, users, isAdd ? null : modal.userId);
    if (Object.keys(errors).length) {
      setModalErrors(errors);
      return;
    }

    const payload = userPayload(modalForm);
    if (isAdd) {
      setUsers((list) => [...list, { id: Date.now(), ...payload }]);
    } else {
      setUsers((list) =>
        list.map((u) => (u.id === modal.userId ? { ...u, ...payload } : u))
      );
    }
    closeModal();
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setUsers((list) => list.filter((u) => u.id !== toDelete.id));
    if (modal?.userId === toDelete.id) closeModal();
    setToDelete(null);
  };

  const modalMode = modal?.mode;
  const isView = modalMode === "view";

  const displayedUsers = useMemo(
    () => getDisplayedUsers(users, search, roleFilter, sortKey, sortDir),
    [users, search, roleFilter, sortKey, sortDir]
  );

  const hasFilters = search.trim() !== "" || roleFilter !== "all";

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
  };

  const addButton = (
    <button
      type="button"
      className="um-btn um-btn--primary um-btn--add"
      onClick={openAddModal}
    >
      + Add user
    </button>
  );

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={onNavigate}
      title="Users"
      subtitle={
        hasFilters
          ? `Showing ${displayedUsers.length} of ${users.length} users`
          : `${users.length} user${users.length === 1 ? "" : "s"} in the system`
      }
      headerAction={addButton}
    >
      <section className="um-section">
        <div className="um-section__head">
          <h2 className="um-section__title">All users</h2>
          {users.length > 0 && (
            <div className="um-toolbar">
              <label className="um-search">
                <span className="um-search__icon" aria-hidden="true">
                  🔍
                </span>
                <input
                  type="search"
                  placeholder="Search name, email, role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search users"
                />
              </label>
              <label className="um-filter">
                Role
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  aria-label="Filter by role"
                >
                  <option value="all">All roles</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>
              {hasFilters && (
                <button
                  type="button"
                  className="um-btn um-btn--ghost"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {users.length === 0 ? (
          <p className="um-empty">No users yet. Click &quot;Add user&quot; to create one.</p>
        ) : displayedUsers.length === 0 ? (
          <p className="um-empty">No users match your search or filter.</p>
        ) : (
          <table className="um-table">
            <thead>
              <tr>
                {USER_FIELDS.map((col) => (
                  <th key={col.key}>
                    <button
                      type="button"
                      className={`um-sort-btn${sortKey === col.key ? " um-sort-btn--active" : ""}`}
                      onClick={() => toggleSort(col.key)}
                      aria-label={`Sort by ${col.label} ${sortKey === col.key ? sortDir : ""}`}
                    >
                      {col.label}
                      <span className="um-sort-btn__arrow" aria-hidden="true">
                        {sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  </th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <tr key={user.id}>
                  {USER_FIELDS.map((col) => (
                    <td key={col.key}>{user[col.key]}</td>
                  ))}
                  <td className="um-actions">
                    <button
                      type="button"
                      className="um-icon-btn"
                      title="View"
                      onClick={() => openUserModal(user, "view")}
                    >
                      👁
                    </button>
                    <button
                      type="button"
                      className="um-icon-btn"
                      title="Edit"
                      onClick={() => openUserModal(user, "edit")}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="um-icon-btn um-icon-btn--danger"
                      title="Delete"
                      onClick={() => setToDelete(user)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {modal && (
        <div className="um-overlay" onClick={closeModal}>
          <div className="um-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{MODAL_TITLES[modalMode]}</h3>

            {isView ? (
              <div className="um-view">
                {USER_FIELDS.map((field) => (
                  <p key={field.key}>
                    <strong>{field.label}:</strong> {modalForm[field.key]}
                  </p>
                ))}
              </div>
            ) : (
              <form className="um-form um-form--modal" onSubmit={saveUser}>
                <UserFields
                  form={modalForm}
                  errors={modalErrors}
                  onChange={onModalChange}
                />
              </form>
            )}

            <div className="um-modal-actions">
              {isView ? (
                <>
                  <button type="button" className="um-btn" onClick={closeModal}>
                    Close
                  </button>
                  <button
                    type="button"
                    className="um-btn um-btn--primary"
                    onClick={() => setModal({ ...modal, mode: "edit" })}
                  >
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="um-btn" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="um-btn um-btn--primary"
                    onClick={saveUser}
                  >
                    {modalMode === "add" ? "Add user" : "Update"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {toDelete && (
        <div className="um-overlay" onClick={() => setToDelete(null)}>
          <div className="um-modal um-modal--small" onClick={(e) => e.stopPropagation()}>
            <h3>Delete user?</h3>
            <p>
              Delete <strong>{toDelete.name}</strong>? This cannot be undone.
            </p>
            <div className="um-modal-actions">
              <button type="button" className="um-btn" onClick={() => setToDelete(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="um-btn um-btn--danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
