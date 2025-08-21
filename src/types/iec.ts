// IEC-specific types for voter details and related structures

export interface VoterAllDetails {
  Voter: Voter | null;
  WardCouncilor: WardCouncilor | null;
  SpecialVoter: SpecialVoter | null;
}

export interface Voter {
  Id: string;
  VoterStatus: string;
  VoterStatusID: number;
  bRegistered: boolean;
  VotingStation: VotingStation | null;
  VoterId: number;
}

export interface VotingStation {
  Name: string;
  Delimitation: Delimitation | null;
  Location: Location | null;
}

export interface Delimitation {
  ProvinceID: number;
  Province: string;
  MunicipalityID: number;
  Municipality: string;
  WardID: number;
  VDNumber: number;
}

export interface Location {
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
  Delimitation: Delimitation | null;
  PartyDetail: PartyDetail | null;
  Municipality: Municipality | null;
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
  ContactDetails: ContactDetails | null;
}

export interface Municipality {
  ID: number;
  Name: string;
  ContactDetails: ContactDetails | null;
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

