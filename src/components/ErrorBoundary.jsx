import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
            maxWidth: "640px",
            margin: "2rem auto",
          }}
        >
          <h1 style={{ color: "#dc2626" }}>Something went wrong</h1>
          <p>{this.state.error.message}</p>
          <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
            Try: stop the dev server (Ctrl+C), run <code>npm install</code>, then{" "}
            <code>npm run dev</code>, and open the exact URL shown in the terminal.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
