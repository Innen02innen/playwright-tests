export function generateUniqueEmail(prefix: string = 'aqa'): string {
  return `${prefix}-${Date.now()}@test.com`;
}

export function createValidUser() {
  const password = 'Test1234';

  return {
    name: 'Inna',
    lastName: 'Onosovska',
    email: generateUniqueEmail('aqa'),
    password,
    repeatPassword: password,
  };
}