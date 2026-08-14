import { test as base } from '@playwright/test';
import { APIClient } from '../utils/api-client';
import { APILogger } from '../utils/logger';
import { config } from '../config';

type Fixtures = {
  api: APIClient;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    const logger = new APILogger();
    await use(new APIClient(request, config.apiUrl, logger));
  },
});

export { expect } from '@playwright/test';
