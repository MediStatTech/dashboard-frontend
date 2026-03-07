export interface Position {
  position_id: string;
  name: string;
}

export interface Staff {
  staff_id: string;
  first_name: string;
  last_name: string;
  selfie_url?: string;
  selfie_thumb_url?: string;
  status: string;
  email: string;
  position: Position;
}

export interface ContactInfo {
  contact_id: string;
  phone: string;
  email: string;
  primary: boolean;
}

export interface CreateContactInfo {
  phone: string;
  email: string;
  primary: boolean;
}

export interface Address {
  place_id: string;
  line_1: string;
  city: string;
  state: string;
}

export interface CreateAddress {
  line_1: string;
  city: string;
  state: string;
}

export interface Diseas {
  diseas_id: string;
  name: string;
  code: string;
}

export interface Metric {
  value: number;
  symbol: string;
  created_at: string;
}

export interface Sensor {
  sensor_id: string;
  name: string;
  code: string;
  symbol: string;
  status: string;
  metrics: Metric[];
}

export interface PatientListItem {
  patient_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  status: string;
}

export interface PatientRead {
  patient_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  status: string;
  contact_info: ContactInfo;
  address: Address;
  diseases: Diseas[];
  sensors: Sensor[];
}

export interface PatientCreate {
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  contact_info: CreateContactInfo;
  address: CreateAddress;
  diseas_ids: string[];
}
