import { APIRequestContext, test } from '@playwright/test';
import { APILogger } from './logger';

type JsonBody = Record<string, unknown>;

export class APIClient {
  private customBaseUrl?: string;
  private endpointPath = '';
  private queryParams: Record<string, string | number> = {};
  private customHeaders: Record<string, string> = {};
  private jsonPayload?: JsonBody;
  private formPayload?: Record<string, string>;

  constructor(
    private readonly httpClient: APIRequestContext,
    private readonly baseUrl: string,
    private readonly logger: APILogger
  ) {}

  withBaseUrl(baseUrl: string) {
    this.customBaseUrl = baseUrl;
    return this;
  }

  endpoint(path: string) {
    this.endpointPath = path;
    return this;
  }

  withParams(params: Record<string, string | number>) {
    this.queryParams = params;
    return this;
  }

  withHeaders(headers: Record<string, string>) {
    this.customHeaders = headers;
    return this;
  }

  withPayload(payload: JsonBody) {
    this.jsonPayload = payload;
    this.formPayload = undefined;
    return this;
  }

  withForm(payload: Record<string, string>) {
    this.formPayload = payload;
    this.jsonPayload = undefined;
    return this;
  }

  async get(expectedStatus: number) {
    return this.execute('GET', expectedStatus);
  }

  async post(expectedStatus: number) {
    return this.execute('POST', expectedStatus);
  }

  async put(expectedStatus: number) {
    return this.execute('PUT', expectedStatus);
  }

  async delete(expectedStatus: number) {
    return this.execute('DELETE', expectedStatus);
  }

  private async execute(method: string, expectedStatus: number) {
    const url = this.buildUrl();
    const headers = { ...this.customHeaders };
    const options: Record<string, unknown> = { headers };
    if (this.formPayload) {
      options.form = this.formPayload;
    } else if (this.jsonPayload) {
      options.data = this.jsonPayload;
    }

    let responseData: unknown;
    await test.step(`${method} ${url}`, async () => {
      this.logger.logRequest(method, url, headers, this.formPayload ?? this.jsonPayload);
      const verb = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
      const response = await this.httpClient[verb](url, options);
      this.reset();
      const actualStatus = response.status();
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { raw: text };
      }
      this.logger.logResponse(actualStatus, responseData);
      if (actualStatus !== expectedStatus) {
        throw new Error(
          `Expected status ${expectedStatus} but got ${actualStatus}\n\nRecent API activity:\n${this.logger.getRecentLogs()}`
        );
      }
    });
    return responseData as JsonBody;
  }

  private buildUrl() {
    const url = new URL(`${this.customBaseUrl ?? this.baseUrl}${this.endpointPath}`);
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, String(value));
    }
    return url.toString();
  }

  private reset() {
    this.customBaseUrl = undefined;
    this.endpointPath = '';
    this.queryParams = {};
    this.customHeaders = {};
    this.jsonPayload = undefined;
    this.formPayload = undefined;
  }
}
