import { test, expect, request, APIRequestContext } from '@playwright/test';

test.describe('Cars API', () => {
  async function createApiContext(baseURL: string | undefined): Promise<APIRequestContext> {
    return request.newContext({
      baseURL,
      storageState: 'playwright/.auth/user.json',
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });
  }

  async function createCar(
    apiContext: APIRequestContext,
    body: { carBrandId?: number; carModelId?: number; mileage?: number | null }
  ) {
    const response = await apiContext.post('/api/cars', { data: body });
    const responseBody = await response.json();
    return { response, responseBody };
  }

  test('Positive: should create car with valid brand model and mileage', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const requestBody = {
      carBrandId: 1,
      carModelId: 1,
      mileage: 1234,
    };

    const { response, responseBody } = await createCar(apiContext, requestBody);

    expect(response.ok()).toBeTruthy();
    expect(responseBody.status).toBe('ok');
    expect(responseBody.data.carBrandId).toBe(requestBody.carBrandId);
    expect(responseBody.data.carModelId).toBe(requestBody.carModelId);
    expect(responseBody.data.mileage).toBe(requestBody.mileage);

    await apiContext.dispose();
  });

  test('Positive: should create car with another valid brand model and mileage', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const requestBody = {
      carBrandId: 2,
      carModelId: 8,
      mileage: 5678,
    };

    const { response, responseBody } = await createCar(apiContext, requestBody);

    expect(response.ok()).toBeTruthy();
    expect(responseBody.status).toBe('ok');
    expect(responseBody.data.carBrandId).toBe(requestBody.carBrandId);
    expect(responseBody.data.carModelId).toBe(requestBody.carModelId);
    expect(responseBody.data.mileage).toBe(requestBody.mileage);

    await apiContext.dispose();
  });

  test('Positive: should create car with zero mileage', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const requestBody = {
      carBrandId: 3,
      carModelId: 11,
      mileage: 0,
    };

    const { response, responseBody } = await createCar(apiContext, requestBody);

    expect(response.ok()).toBeTruthy();
    expect(responseBody.status).toBe('ok');
    expect(responseBody.data.carBrandId).toBe(requestBody.carBrandId);
    expect(responseBody.data.carModelId).toBe(requestBody.carModelId);
    expect(responseBody.data.mileage).toBe(requestBody.mileage);

    await apiContext.dispose();
  });

  test('Negative: should not create car with invalid brand id', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const requestBody = {
      carBrandId: 9999,
      carModelId: 1,
      mileage: 1000,
    };

    const { response, responseBody } = await createCar(apiContext, requestBody);

    expect(response.ok()).toBeFalsy();
    expect(responseBody.status).toBe('error');

    await apiContext.dispose();
  });

  test('Negative: should not create car with invalid model id', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const requestBody = {
      carBrandId: 1,
      carModelId: 9999,
      mileage: 1000,
    };

    const { response, responseBody } = await createCar(apiContext, requestBody);

    expect(response.ok()).toBeFalsy();
    expect(responseBody.status).toBe('error');

    await apiContext.dispose();
  });

  test('Negative: should not create car with empty mileage', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const requestBody = {
      carBrandId: 1,
      carModelId: 1,
      mileage: null,
    };

    const { response, responseBody } = await createCar(apiContext, requestBody);

    expect(response.ok()).toBeFalsy();
    expect(responseBody.status).toBe('error');

    await apiContext.dispose();
  });

  test('Negative: should not create car with negative mileage', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const requestBody = {
      carBrandId: 1,
      carModelId: 1,
      mileage: -1,
    };

    const { response, responseBody } = await createCar(apiContext, requestBody);

    expect(response.ok()).toBeFalsy();
    expect(responseBody.status).toBe('error');

    await apiContext.dispose();
  });

  test('Negative: should not create car without brand id', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const { response, responseBody } = await createCar(apiContext, {
      carModelId: 1,
      mileage: 1000,
    });

    expect(response.ok()).toBeFalsy();
    expect(responseBody.status).toBe('error');

    await apiContext.dispose();
  });

  test('Negative: should not create car without model id', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const { response, responseBody } = await createCar(apiContext, {
      carBrandId: 1,
      mileage: 1000,
    });

    expect(response.ok()).toBeFalsy();
    expect(responseBody.status).toBe('error');

    await apiContext.dispose();
  });

  test('Negative: should not create car without mileage', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const { response, responseBody } = await createCar(apiContext, {
      carBrandId: 1,
      carModelId: 1,
    });

    expect(response.ok()).toBeFalsy();
    expect(responseBody.status).toBe('error');

    await apiContext.dispose();
  });

  test('Positive: should return created car in cars list', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const requestBody = {
      carBrandId: 1,
      carModelId: 1,
      mileage: 2222,
    };

    const { responseBody: createdCarResponse } = await createCar(apiContext, requestBody);
    const createdCarId = createdCarResponse.data.id;

    const getResponse = await apiContext.get('/api/cars');
    const getResponseBody = await getResponse.json();

    expect(getResponse.ok()).toBeTruthy();
    expect(getResponseBody.status).toBe('ok');
    expect(
      getResponseBody.data.some((car: { id: number }) => car.id === createdCarId)
    ).toBeTruthy();

    await apiContext.dispose();
  });

  test('Positive: should delete created car', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const requestBody = {
      carBrandId: 2,
      carModelId: 8,
      mileage: 3333,
    };

    const { responseBody: createdCarResponse } = await createCar(apiContext, requestBody);
    const createdCarId = createdCarResponse.data.id;

    const deleteResponse = await apiContext.delete(`/api/cars/${createdCarId}`);
    const deleteResponseBody = await deleteResponse.json();

    expect(deleteResponse.ok()).toBeTruthy();
    expect(deleteResponseBody.status).toBe('ok');

    await apiContext.dispose();
  });

  test('Positive: should not return deleted car in cars list', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const requestBody = {
      carBrandId: 3,
      carModelId: 11,
      mileage: 4444,
    };

    const { responseBody: createdCarResponse } = await createCar(apiContext, requestBody);
    const createdCarId = createdCarResponse.data.id;

    const deleteResponse = await apiContext.delete(`/api/cars/${createdCarId}`);
    expect(deleteResponse.ok()).toBeTruthy();

    const getResponse = await apiContext.get('/api/cars');
    const getResponseBody = await getResponse.json();

    expect(getResponse.ok()).toBeTruthy();
    expect(getResponseBody.status).toBe('ok');
    expect(
      getResponseBody.data.some((car: { id: number }) => car.id === createdCarId)
    ).toBeFalsy();

    await apiContext.dispose();
  });

  test('Negative: should not delete non existing car', async ({ baseURL }) => {
    const apiContext = await createApiContext(baseURL);

    const deleteResponse = await apiContext.delete('/api/cars/999999');
    const deleteResponseBody = await deleteResponse.json();

    expect(deleteResponse.ok()).toBeFalsy();
    expect(deleteResponseBody.status).toBe('error');

    await apiContext.dispose();
  });
});