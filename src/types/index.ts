export interface User {
  id: string;
  name: string;
  email: string;
  role: 'national_admin' | 'provincial_admin' | 'regional_admin' | 'branch_admin' | 'vd_manager' | 'member';
  ward_id?: string;
  vd_id?: string;
  branch_id?: string;
  region_id?: string;
  province_id?: string;
  contact_info: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
}

export interface Office {
  id: string;
  name: string;
  type: 'national' | 'province' | 'region' | 'branch' | 'vd';
  parent_office_id?: string;
  location_data?: string;
}

export interface Membership {
  id: string;
  user_id: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'expired' | 'pending';
  qr_code: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  organiser_id: string;
  office_id: string;
  rsvp_count: number;
}

export interface Vote {
  id: string;
  title: string;
  description: string;
  level: string;
  start_date: string;
  end_date: string;
  created_by: string;
  status: 'active' | 'closed' | 'pending';
}

// IEC Voter Details types
export interface VoterAllDetails {
  Voter: VoterDetails;
  WardCouncilor?: WardCouncilor;
  SpecialVoter?: SpecialVoter;
}

export interface VoterDetails {
  Id: string;
  VoterStatus: string;
  VoterStatusID: number;
  bRegistered: boolean;
  VotingStation?: VotingStation;
  VoterId: number;
}

export interface VotingStation {
  Name: string;
  Delimitation: Delimitation;
  Location: StationLocation;
}

export interface Delimitation {
  ProvinceID: number;
  Province: string;
  MunicipalityID: number;
  Municipality: string;
  WardID: number;
  VDNumber: number;
}

export interface StationLocation {
  Town: string;
  Suburb: string;
  Street: string;
  Latitude: number;
  Longitude: number;
  ProvinceID: number;
  Province: string;
  MunicipalityID: number;
  Municipality: string;
  WardID: number;
  VDNumber: number;
  VotingDistrict: string;
  VDAddress: string;
}

export interface WardCouncilor {
  Name: string;
  Delimitation: Delimitation;
  PartyDetail?: PartyDetail;
  Municipality?: MunicipalityDetail;
  ProvinceID: number;
  Province: string;
  MunicipalityID: number;
  WardID: number;
  PartyID: number;
  PartyName: string;
  PartyAbbreviation: string;
}

export interface PartyDetail {
  ID: number;
  Name: string;
  Abbreviation: string;
  LogoUrl: string;
  RegStatus: string;
  RegLevel: string;
  ContactDetails?: ContactDetails;
}

export interface MunicipalityDetail {
  ID: number;
  Name: string;
  ContactDetails?: ContactDetails;
}

export interface ContactDetails {
  ContactPerson: string;
  Tel: string;
  Fax: string;
  PostalAddress: string;
  WebsiteUrl: string;
}

export interface SpecialVoter {
  SpecialVotesStatus: string;
  ApplicationStatus: string;
  IsOpen: boolean;
  ApplicationStatusID: number;
  EEID: number;
  EEDescription: string;
  ApplicationTypeID: number;
  ApplicationTypeDescription: string;
}