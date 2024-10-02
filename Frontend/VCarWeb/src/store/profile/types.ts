import { IUser } from "../auth/types";

export interface UpdateProfilePayload {
    display_name: string;
    phone_number: string;
}

export interface UpdateLicensePayload {
    id: string; // id of the license
    full_name: string;
    dob: string;
    license_image_url: string;
}

export interface UpdateCitizenIdentificationPayload {
    identification_number: string;
    issued_date: string;
    issued_location: string;
    permanent_address: string;
    contact_address: string;
    identification_image_url: string
}

export type ProfileState = {
    user: IUser,
    loading: boolean,
    error: string | null
}

export type LicenseData = {
    address: string;
    address_prob: string;
    address_raw: string;
    address_raw_prob: string;
    class: string;
    class_prob: string;
    date: string;
    date_prob: string;
    dob: string;
    dob_prob: string;
    doe: string;
    doe_prob: string;
    id: string;
    id_prob: string;
    name: string;
    name_prob: string;
    nation: string;
    nation_prob: string;
    overall_score: string;
    place_issue: string;
    place_issue_prob: string;   
    type: string;
}

export type CitizenIdentificationData = {
    address: string;
    address_entities: {
        province: string;
        district: string;
        ward: string;
        street: string;
    }
    address_prob: string;
    dob: string;
    dob_prob: string;
    doe: string;
    doe_prob: string;
    home: string;
    home_prob: string;
    id: string;
    name: string;
    name_prob: string;
    nationality: string;
    nationality_prob: string;
    number_of_name_lines: string;
    overall_score: string;
    sex: string;
    sex_prob: string;
    type: string;
    type_new: string;
}