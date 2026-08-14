import { test, expect } from './fixtures';

type Product = { id: number; name: string; price: string };

function uniqueEmail() {
  return `e2e.${Date.now()}.${Math.floor(Math.random() * 10000)}@yandetesting.com`;
}

function accountForm(email: string) {
  return {
    name: 'Yande Tester',
    email,
    password: 'TestPass123!',
    title: 'Mr',
    birth_date: '18',
    birth_month: '5',
    birth_year: '1992',
    firstname: 'Yande',
    lastname: 'Tester',
    company: 'QA',
    address1: '10 Test Street',
    address2: '',
    country: 'United Kingdom',
    zipcode: 'SW1A 1AA',
    state: 'London',
    city: 'London',
    mobile_number: '07700900000',
  };
}

test.describe('Shop API (fluent client)', () => {
  test('lists products with names and prices', async ({ api }) => {
    const body = await api.endpoint('/api/productsList').get(200);
    const products = body.products as Product[];

    expect(body.responseCode).toBe(200);
    expect(products.length).toBeGreaterThan(5);
    expect(products[0].name).toBeTruthy();
    expect(products[0].price).toMatch(/Rs\./);
  });

  test('searching for Dress returns dress products', async ({ api }) => {
    const body = await api
      .endpoint('/api/searchProduct')
      .withForm({ search_product: 'Dress' })
      .post(200);
    const products = body.products as Product[];

    expect(body.responseCode).toBe(200);
    expect(products.length).toBeGreaterThan(0);
    expect(products.some((item) => /dress/i.test(item.name))).toBeTruthy();
  });

  test('creating an account with a unique email succeeds', async ({ api }) => {
    const email = uniqueEmail();
    const body = await api.endpoint('/api/createAccount').withForm(accountForm(email)).post(200);

    expect(body.responseCode).toBe(201);
    expect(String(body.message)).toMatch(/created/i);
  });

  test('creating an account with an existing email is rejected', async ({ api }) => {
    const email = uniqueEmail();
    const created = await api.endpoint('/api/createAccount').withForm(accountForm(email)).post(200);
    expect(created.responseCode).toBe(201);

    const duplicate = await api.endpoint('/api/createAccount').withForm(accountForm(email)).post(200);
    expect(duplicate.responseCode).toBe(400);
    expect(String(duplicate.message)).toMatch(/already exists/i);
  });
});
