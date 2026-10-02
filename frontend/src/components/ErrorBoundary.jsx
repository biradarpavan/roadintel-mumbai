import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto my-12 p-6 bg-white border border-[#D9E0E7] border-l-4 border-l-[#C62828] rounded-lg shadow-sm">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-[#C62828] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#1F2937]">
                Notice: An issue occurred while rendering this section
              </h2>
              <p className="text-xs text-[#5B6573] leading-relaxed">
                The application encountered an unexpected data formatting event. You can reset the view or navigate back to the main portal.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    window.location.reload();
                  }}
                  className="px-3.5 py-1.5 rounded-md bg-[#0B5CAD] hover:bg-[#084887] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reload System</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
