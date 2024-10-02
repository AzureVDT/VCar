
export const ENDPOINTS = {
    GET_ME: '/users/me',
    FIND_USER_BY_ID: (id: string) =>  `/users/${id}`,
    UPDATE_PROFILE: '/users/update',
    UPDATE_LICENSE: '/users/update-license',
    UPDATE_CITIZEN_IDENTIFICATION: '/users/update-citizen-identification',
}