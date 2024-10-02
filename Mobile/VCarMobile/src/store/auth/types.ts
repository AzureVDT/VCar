export interface AuthState {
  email: string;
  imageUrl: string;
  display_name: string;
  access_token: string;
  refresh_token: string;
  email_verified: boolean;
  verification_code: string;
  provider: string;
  loading: boolean;
  error: null | string;
  isRecheckToken: boolean;
}
