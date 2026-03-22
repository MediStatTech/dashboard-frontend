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

// =====================================================
// Room Service types
// TODO: Replace with proto-generated types when room-service backend is ready
// Proto file: proto/models/v1/room_dash.proto
// =====================================================

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
  equipment_type: string; // 'ventilator' | 'infusion_pump' | 'cardiac_monitor' | 'oxygen_concentrator'
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
  room_type: string; // 'icu' | 'general' | 'surgery' | 'recovery'
  status: string;    // 'free' | 'occupied' | 'maintenance'
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
