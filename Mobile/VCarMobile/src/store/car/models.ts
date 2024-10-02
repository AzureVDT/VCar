export const ENDPOINTS = {
  CREATE_CAR: '/cars',
  FIND_CAR_BY_ID: (id: string) => `/cars/${id}`,
  UPDATE_CAR: (id: string) => `/cars/${id}`,
  DELETE_CAR: (id: string) => `/cars/${id}`,
  AUTOCOMPLETE: (query: string, province: string) =>
    `/cars/autocomplete?query=${query}&province=${province}`,
  SEARCH: `/cars/search`,
};

export const QuerySearchCar = {
  query: '',
  province: 'Ho_Chi_Minh',
  page: 1,
  size: 10,
  transmission: 'MANUAL,AUTO',
  seats: '',
  minConsumption: 0,
  maxRate: '',
  rentalStartDate: 1729828230000,
  rentalEndDate: 1732506630000,
  rating: '',
};
