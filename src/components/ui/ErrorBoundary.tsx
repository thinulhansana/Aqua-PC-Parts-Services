"use client";

import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  title?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let message = error.message || "An unexpected error occurred.";
    try {
      const parsed = JSON.parse(error.message) as {
        error?: string;
        operationType?: string;
        path?: string;
      };
      if (parsed && typeof parsed.error === "string") {
        if (parsed.error.toLowerCase().includes("permission")) {
          message = `Cloud access check blocked ${parsed.operationType || "this action"} on ${parsed.path || "your workspace"}. Please ensure you are signed in with a verified Google account.`;
        } else {
          message = parsed.error;
        }
      }
    } catch {
      // Non-JSON error message; keep original
    }
    return { hasError: true, message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("ErrorBoundary caught error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-error/40 bg-surface-container p-6 text-on-surface shadow-glass">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-container/30 text-error">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-syne text-title-lg font-bold text-on-surface">
                {this.props.title || "Something went wrong"}
              </h2>
              <p className="mt-1.5 text-body-sm text-on-surface-variant">
                {this.state.message}
              </p>
              <button
                type="button"
                onClick={this.handleReset}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 font-jakarta text-body-sm font-semibold text-on-primary shadow-cyan-glow transition hover:opacity-95 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reload Section</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
