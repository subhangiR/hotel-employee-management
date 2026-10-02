import { lazy, Suspense, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { UserManagementPage } from "./pages/UserManagementPage.jsx";

const TaskManagementPage = lazy(() =>
  import("./pages/TaskManagementPage.jsx").then((m) => ({
    default: m.TaskManagementPage,
  }))
);

function PageLoader() {
  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "var(--text)" }}>
      Loading…
    </div>
  );
}

function App() {
  const [page, setPage] = useState("users");

  return (
    <ErrorBoundary>
      {page === "tasks" ? (
        <Suspense fallback={<PageLoader />}>
          <TaskManagementPage activePage={page} onNavigate={setPage} />
        </Suspense>
      ) : (
        <UserManagementPage activePage={page} onNavigate={setPage} />
      )}
    </ErrorBoundary>
  );
}

export default App;
