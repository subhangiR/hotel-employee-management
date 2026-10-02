import "./AppLayout.css";

const NAV_ITEMS = [
  { id: "users", label: "Users", icon: "👥" },
  { id: "tasks", label: "Tasks", icon: "📋" },
  { id: "settings", label: "Settings", icon: "⚙️", disabled: true },
];

export function AppLayout({
  title,
  subtitle,
  headerAction,
  children,
  activePage = "users",
  onNavigate,
}) {
  return (
    <div className="app-shell">
      <header className="app-global-header">
        <div className="app-global-header__left">
          <span className="app-global-header__logo" aria-hidden="true">
            UM
          </span>
          <div>
            <p className="app-global-header__brand">Hotel Employee Manager</p>
            <p className="app-global-header__breadcrumb">
              Admin <span aria-hidden="true">/</span> {title}
            </p>
          </div>
        </div>

        <div className="app-global-header__right">
          <span className="app-global-header__badge">Admin</span>
          <span className="app-global-header__avatar" title="Admin user" aria-label="Admin user">
            A
          </span>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar" aria-label="Main navigation">
          <nav className="app-sidebar__nav">
            <p className="app-sidebar__section">Menu</p>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`app-sidebar__link${activePage === item.id ? " app-sidebar__link--active" : ""}`}
                    disabled={item.disabled}
                    aria-current={activePage === item.id ? "page" : undefined}
                    title={item.disabled ? "Coming soon" : item.label}
                    onClick={() => !item.disabled && onNavigate?.(item.id)}
                  >
                    <span className="app-sidebar__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <p className="app-sidebar__note">Saved in this browser (localStorage).</p>
        </aside>

        <div className="app-main">
          <div className="app-page-header">
            <div className="app-page-header__text">
              <h1 className="app-page-header__title">{title}</h1>
              {subtitle ? (
                <p className="app-page-header__subtitle">{subtitle}</p>
              ) : null}
            </div>
            {headerAction ? (
              <div className="app-page-header__action">{headerAction}</div>
            ) : null}
          </div>

          <main className="app-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
