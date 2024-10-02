export interface ICar {
  id: string;
  owner: Owner;
  name: string;
  status: string;
  image_url: string[];
  province: string;
  location: string;
  daily_rate: number;
  seat: number;
  transmission: string;
  fuel: string;
  fuel_consumption: number;
  description: string;
  features: string[];
  license_plate: string;
  registration_number: string;
  registration_date: Date;
  registration_location: string;
  average_rating: number;
}

export interface Owner {
  id: string;
  display_name: string;
  email: string;
  phone_number: string;
  image_url?: string;
}

export interface IReview {
  id: string;
  comment: string;
  rating: number;
  lessee: Owner;
}

export type CarDetail = {
  car: ICar;
  reviews: IReview[];
  related_cars: ICar[];
};

export interface IQuerySearchCar {
  query: string;
  province: string;
  page: number | string;
  size: number | string;
  transmission: string;
  seats: string;
  minConsumption: number | string;
  maxRate: string | number;
  rentalStartDate: number | string;
  rentalEndDate: number | string;
  rating: string | number;
}
