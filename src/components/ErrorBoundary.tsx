import { Component, type ErrorInfo, type ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("City Pharmacy app error", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center bg-cream px-4">
          <div className="max-w-md rounded-3xl border border-line bg-white p-7 text-center shadow-card">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-coral-50 text-2xl">!</div>
            <h1 className="mt-4 text-xl font-extrabold text-apollo-950">Something went wrong</h1>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Please refresh the page. If the problem continues, call City Pharmacy on +91 98710 40480.
            </p>
            <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-5 px-5 py-2.5 text-xs">
              Reload the page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
