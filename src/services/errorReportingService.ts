/**
 * Error Reporting Service - Advanced error tracking and analytics
 */

interface ErrorReport {
  id: string;
  timestamp: number;
  level: 'global' | 'feature' | 'component';
  severity: 'low' | 'medium' | 'high' | 'critical';
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  context: {
    featureName?: string;
    userId?: string;
    sessionId: string;
    componentStack?: string;
    url?: string;
    userAgent: string;
  };
  recovery: {
    attempted: boolean;
    successful: boolean;
    strategy?: string;
    retryCount: number;
  };
  performance: {
    memory?: number;
    timing?: number;
    renderCount?: number;
  };
  metadata: Record<string, any>;
}

interface ErrorAnalytics {
  totalErrors: number;
  errorsByLevel: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  recoveryRate: number;
  mostCommonErrors: Array<{ message: string; count: number }>;
  errorTrends: Array<{ date: string; count: number }>;
}

class ErrorReportingService {
  private reports: ErrorReport[] = [];
  private sessionId: string;
  private maxReports = 100;
  private isEnabled = true;

  constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.loadStoredReports();
  }

  /**
   * Report an error with full context
   */
  reportError(
    error: Error,
    level: 'global' | 'feature' | 'component' = 'component',
    context: Partial<ErrorReport['context']> = {},
    metadata: Record<string, any> = {}
  ): string {
    if (!this.isEnabled) return '';

    const severity = this.determineSeverity(error, level);
    const reportId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const report: ErrorReport = {
      id: reportId,
      timestamp: Date.now(),
      level,
      severity,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context: {
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        url: window.location?.href,
        ...context,
      },
      recovery: {
        attempted: false,
        successful: false,
        retryCount: 0,
      },
      performance: {
        memory: this.getMemoryUsage(),
        timing: performance.now(),
      },
      metadata,
    };

    this.addReport(report);
    this.processReport(report);

    return reportId;
  }

  /**
   * Update recovery information for an error
   */
  updateRecovery(
    reportId: string,
    recovery: Partial<ErrorReport['recovery']>
  ): void {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      report.recovery = { ...report.recovery, ...recovery };
      this.persistReports();
    }
  }

  /**
   * Add performance metrics to an error report
   */
  addPerformanceData(
    reportId: string,
    performance: Partial<ErrorReport['performance']>
  ): void {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      report.performance = { ...report.performance, ...performance };
      this.persistReports();
    }
  }

  /**
   * Get error analytics and insights
   */
  getAnalytics(): ErrorAnalytics {
    const analytics: ErrorAnalytics = {
      totalErrors: this.reports.length,
      errorsByLevel: this.groupBy(this.reports, 'level'),
      errorsBySeverity: this.groupBy(this.reports, 'severity'),
      recoveryRate: this.calculateRecoveryRate(),
      mostCommonErrors: this.getMostCommonErrors(),
      errorTrends: this.getErrorTrends(),
    };

    return analytics;
  }

  /**
   * Get recent error reports
   */
  getRecentReports(limit = 10): ErrorReport[] {
    return this.reports
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get error reports by criteria
   */
  getReportsByCriteria(criteria: {
    level?: string;
    severity?: string;
    timeRange?: { start: number; end: number };
    featureName?: string;
  }): ErrorReport[] {
    return this.reports.filter(report => {
      if (criteria.level && report.level !== criteria.level) return false;
      if (criteria.severity && report.severity !== criteria.severity) return false;
      if (criteria.featureName && report.context.featureName !== criteria.featureName) return false;
      if (criteria.timeRange) {
        if (report.timestamp < criteria.timeRange.start || report.timestamp > criteria.timeRange.end) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Clear old reports to prevent memory bloat
   */
  cleanup(): void {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.reports = this.reports.filter(report => report.timestamp > oneWeekAgo);
    
    // Keep only the most recent reports if we exceed the limit
    if (this.reports.length > this.maxReports) {
      this.reports = this.reports
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, this.maxReports);
    }

    this.persistReports();
  }

  /**
   * Enable or disable error reporting
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Export reports for external analysis
   */
  exportReports(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      exportTimestamp: Date.now(),
      reports: this.reports,
      analytics: this.getAnalytics(),
    }, null, 2);
  }

  private determineSeverity(
    error: Error,
    level: 'global' | 'feature' | 'component'
  ): 'low' | 'medium' | 'high' | 'critical' {
    // Critical errors
    if (level === 'global' || error.message.includes('Network Error') || error.name === 'ChunkLoadError') {
      return 'critical';
    }

    // High severity errors
    if (level === 'feature' || error.name === 'TypeError' || error.message.includes('undefined')) {
      return 'high';
    }

    // Medium severity errors
    if (error.name === 'ReferenceError' || error.message.includes('not a function')) {
      return 'medium';
    }

    // Default to low severity
    return 'low';
  }

  private addReport(report: ErrorReport): void {
    this.reports.push(report);
    
    // Automatic cleanup if we have too many reports
    if (this.reports.length > this.maxReports * 1.2) {
      this.cleanup();
    } else {
      this.persistReports();
    }
  }

  private processReport(report: ErrorReport): void {
    if (__DEV__) {
      console.group(`🚨 Error Report (${report.level} - ${report.severity})`);
      console.error('Error:', report.error);
      console.log('Context:', report.context);
      console.log('Report ID:', report.id);
      console.groupEnd();
    }

    // In production, you would send this to your error reporting service
    this.sendToExternalService(report);
  }

  private async sendToExternalService(report: ErrorReport): Promise<void> {
    try {
      // Example: Send to external error reporting service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(report),
      // });

      console.log('📤 Error report would be sent to external service:', report.id);
    } catch (error) {
      console.error('Failed to send error report:', error);
    }
  }

  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory?.usedJSHeapSize;
    }
    return undefined;
  }

  private groupBy<T extends Record<string, any>>(
    array: T[],
    key: keyof T
  ): Record<string, number> {
    return array.reduce((result, item) => {
      const value = String(item[key]);
      result[value] = (result[value] || 0) + 1;
      return result;
    }, {} as Record<string, number>);
  }

  private calculateRecoveryRate(): number {
    const attemptedRecoveries = this.reports.filter(r => r.recovery.attempted);
    if (attemptedRecoveries.length === 0) return 0;

    const successfulRecoveries = attemptedRecoveries.filter(r => r.recovery.successful);
    return (successfulRecoveries.length / attemptedRecoveries.length) * 100;
  }

  private getMostCommonErrors(): Array<{ message: string; count: number }> {
    const errorMessages = this.groupBy(this.reports.map(r => ({ message: r.error.message })), 'message');
    
    return Object.entries(errorMessages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([message, count]) => ({ message, count }));
  }

  private getErrorTrends(): Array<{ date: string; count: number }> {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      count: this.reports.filter(report => {
        const reportDate = new Date(report.timestamp).toISOString().split('T')[0];
        return reportDate === date;
      }).length,
    }));
  }

  private persistReports(): void {
    try {
      localStorage.setItem('errorReports', JSON.stringify({
        sessionId: this.sessionId,
        reports: this.reports.slice(-50), // Keep only last 50 reports in storage
      }));
    } catch (error) {
      console.warn('Failed to persist error reports:', error);
    }
  }

  private loadStoredReports(): void {
    try {
      const stored = localStorage.getItem('errorReports');
      if (stored) {
        const data = JSON.parse(stored);
        // Only load reports from the last session to avoid stale data
        if (data.sessionId !== this.sessionId) {
          this.reports = [];
        } else {
          this.reports = data.reports || [];
        }
      }
    } catch (error) {
      console.warn('Failed to load stored error reports:', error);
      this.reports = [];
    }
  }
}

// Export singleton instance
export const errorReportingService = new ErrorReportingService();

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorReportingService.reportError(
      new Error(event.message),
      'global',
      { url: event.filename },
      { lineno: event.lineno, colno: event.colno }
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorReportingService.reportError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      'global',
      {},
      { reason: event.reason }
    );
  });
}

export type { ErrorReport, ErrorAnalytics };