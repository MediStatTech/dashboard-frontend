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

export interface MetricType {
  metric_type_id: string;
  sensor_id: string;
  code: string;
  name: string;
  symbol: string;
  min_value: number;
  max_value: number;
}

export interface MeasurementComponent {
  metric_type_id: string;
  code: string;
  name: string;
  value: number;
  symbol: string;
}

export interface Measurement {
  sensor_id: string;
  patient_id: string;
  created_at: string;
  components: MeasurementComponent[];
}

export interface Sensor {
  sensor_id: string;
  name: string;
  code: string;
  symbol: string;
  status: string;
  metric_types: MetricType[];
  measurements: Measurement[];
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

export interface EquipmentMetric {
  metric_id: string;
  value: number;
  unit_symbol: string;
  created_at: string;
}

export interface Equipment {
  equipment_id: string;
  name: string;
  code: string;
  equipment_type: string;
  unit_symbol: string;
  metric_name: string;
  min_value: number;
  max_value: number;
  status: string;
  metrics: EquipmentMetric[];
}

export interface RoomPatient {
  patient_id: string;
  first_name: string;
  last_name: string;
  status: string;
  admitted_at: string;
}

export interface RoomListItem {
  room_id: string;
  number: string;
  floor: number;
  department: string;
  room_type: string;
  status: string;
  patient_name?: string;
  equipment_count: number;
}

export interface RoomRead {
  room_id: string;
  number: string;
  floor: number;
  department: string;
  room_type: string;
  status: string;
  patient?: RoomPatient;
  equipment: Equipment[];
}
