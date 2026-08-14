export class APILogger {
  private recentLogs: Array<{ type: string; data: unknown }> = [];

  logRequest(method: string, url: string, headers: Record<string, string>, body?: unknown) {
    this.recentLogs.push({ type: 'Request Details', data: { method, url, headers, body } });
  }

  logResponse(statusCode: number, body?: unknown) {
    this.recentLogs.push({ type: 'Response Details', data: { statusCode, body } });
  }

  getRecentLogs() {
    return this.recentLogs
      .map((log) => `===${log.type}===\n${JSON.stringify(log.data, null, 2)}`)
      .join('\n\n');
  }
}
