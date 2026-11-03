import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-700">应用程序出现错误</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="destructive">
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  抱歉，应用程序遇到了一个意外的错误。我们已经记录了这个问题。
                </AlertDescription>
              </Alert>

              {this.state.error && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">错误详情：</h3>
                  <code className="text-sm text-red-600 break-all">
                    {this.state.error.toString()}
                  </code>
                </div>
              )}

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="bg-gray-50 rounded-lg p-4">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    技术详情 (仅开发环境显示)
                  </summary>
                  <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleRefresh} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  刷新页面
                </Button>
                <Button onClick={this.handleGoHome} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <Home className="w-4 h-4" />
                  返回首页
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  如果问题持续存在，请联系系统管理员
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
