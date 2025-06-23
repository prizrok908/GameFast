const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(() => mockAxios),
  defaults: {
    headers: {
      common: {}
    }
  },
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn()
    },
    response: {
      use: jest.fn(),
      eject: jest.fn()
    }
  },
  isAxiosError: jest.fn(),
  CancelToken: {
    source: jest.fn(() => ({
      token: 'mock-token',
      cancel: jest.fn()
    }))
  }
};

module.exports = mockAxios; 