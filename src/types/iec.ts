export interface VoterExtDelimitation {
  ProvinceID: number;
  Province: string;
  MunicipalityID: number;
  Municipality: string;
  WardID: number;
  VDNumber: number;
}

export interface VoterExtLocation {
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

export interface VoterExtVotingStation {
  Name: string;
  Delimitation: VoterExtDelimitation;
  Location: VoterExtLocation;
}

export interface VoterExt {
  Id: string;
  VoterStatus: string;
  VoterStatusID: number;
  bRegistered: boolean;
  VotingStation: VoterExtVotingStation;
  bVDPortionLost: boolean;
  bSendAddressMsg: boolean;
}

