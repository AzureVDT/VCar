export const ENDPOINTS = {
  GET_ME: `/users/me`,
  UPDATE_ME: `/users/update`,
  FIND_USER_BY_ID: (id: string) => `/users/${id}`,
  UPDATE_LICENSE: `/users/update-license`,
  UPDATE_CITIZEN_IDENTIFICATION: `/users/update-citizen-identification`,
};
