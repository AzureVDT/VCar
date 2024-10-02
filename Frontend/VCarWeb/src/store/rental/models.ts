
export const ENDPOINTS = {
  // [REQUEST]
  RENT_REQUEST: "/rental-requests/rent",
  LESSOR_APPROVE_REQUEST: "/rental-requests/approve",
  LESSOR_REJECT_REQUEST: "/rental-requests/reject",
  GET_LESSEE_REQUESTS: "/rental-requests/lessee",
  GET_LESSOR_REQUESTS: "/rental-requests/lessor",
  // [CONTRACT]
  GET_LESSEE_CONTRACTS: "/rental-contracts/lessee",
  GET_LESSOR_CONTRACTS: "/rental-contracts/lessor",
  GET_CONTRACT_BY_ID: (id: string) => `/rental-contracts/${id}`,
  LESSEE_APPROVE_CONTRACT: "/rental-contracts/lessee-approve",
  // [HANDOVER]
  CREATE_VEHICLE_HANDOVER: "/vehicle-handover",
  LESSEE_APPROVE_HANDOVER: (id: string) => `/vehicle-handover/${id}/approve-lessee`,
  LESSEE_RETURN_VEHICLE: (id: string) => `/vehicle-handover/${id}/return`,
  LESSOR_APPROVE_RETURN: (id: string) => `/vehicle-handover/${id}/approve-lessor`,
  GET_VEHICLE_HANDOVER_BY_CONTRACT_ID: (id: string) => `/vehicle-handover/rental-contract/${id}`,
};

export const RentalRequestParams = {
  sortDescending: "",
  page: "0",
  size: "10",
  status: "",
};

export const ContractParams = {
  sortDescending: "",
  page: "0",
  size: "10",
};
