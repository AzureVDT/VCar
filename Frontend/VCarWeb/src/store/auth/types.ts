export interface ILoginResponse {
  code: number;
  message: string;
  data: {
    id: string;
    display_name: string;
    email: string;
    image_url: string;
    access_token: string;
    refresh_token: string;
  };
}

export interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: null | string;
}

export interface IUser {
  id: string;
  display_name: string;
  email: string;
  image_url: string;
  phone_number?: string;
  car_license?: {
    id: string;
    full_name: string;
    dob: string;
    license_image_url: string;
  }
  citizen_identification?: {
    citizen_identification_number: string;
    issued_date: string;
    issued_location: string;
    permanent_address: string;
    contact_address: string;
    citizen_identification_image: string;
  }
}
