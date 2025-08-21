// IEC API Integration Service
const IEC_BASE_URL = (import.meta as any).env?.VITE_IEC_BASE_URL || 'https://api.elections.org.za/IECGIS';
const IEC_SERVICE_BASE_URL = (import.meta as any).env?.VITE_IEC_SERVICE_BASE_URL || 'https://api.elections.org.za/IECService';

export interface VotingDistrict {
  id: string;
  name: string;
  wardId: string;
  geometry?: any;
  address?: string;
  municipality?: string;
  province?: string;
}

export interface Ward {
  id: string;
  name: string;
  municipality: string;
  province: string;
}

export interface ElectionInfo {
  id: string;
  name: string;
  date: string;
  type: string;
  status: string;
}

// Voter details (GetVoterAllDetailsExt) response types
export interface IECTypedContactDetails {
  ContactPerson?: string;
  Tel?: string;
  Fax?: string;
  PostalAddress?: string;
  WebsiteUrl?: string;
}

export interface IECTypedDelimitation {
  ProvinceID?: number;
  Province?: string;
  MunicipalityID?: number;
  Municipality?: string;
  WardID?: number;
  VDNumber?: number;
}

export interface IECTypedLocation extends IECTypedDelimitation {
  Town?: string;
  Suburb?: string;
  Street?: string;
  Latitude?: number;
  Longitude?: number;
  VotingDistrict?: string;
  VDAddress?: string;
}

export interface IECTypedVotingStation {
  Name?: string;
  Delimitation?: IECTypedDelimitation;
  Location?: IECTypedLocation;
}

export interface IECTypedVoter {
  Id?: string;
  VoterStatus?: string;
  VoterStatusID?: number;
  bRegistered?: boolean;
  VotingStation?: IECTypedVotingStation;
  bVDPortionLost?: boolean;
  bSendAddressMsg?: boolean;
}

export interface IECTypedPartyDetail {
  ID?: number;
  Name?: string;
  Abbreviation?: string;
  LogoUrl?: string;
  RegStatus?: string;
  RegLevel?: string;
  ContactDetails?: IECTypedContactDetails;
}

export interface IECTypedMunicipalityDetail {
  ID?: number;
  Name?: string;
  ContactDetails?: IECTypedContactDetails;
}

export interface IECTypedWardCouncilor {
  Name?: string;
  Delimitation?: IECTypedDelimitation;
  PartyDetail?: IECTypedPartyDetail;
  Municipality?: IECTypedMunicipalityDetail;
  ProvinceID?: number;
  Province?: string;
  MunicipalityID?: number;
  WardID?: number;
  PartyID?: number;
  PartyName?: string;
  PartyAbbreviation?: string;
}

export interface IECTypedSpecialVoter {
  SpecialVotesStatus?: string;
  ApplicationStatus?: string;
  IsOpen?: boolean;
  ApplicationStatusID?: number;
  EEID?: number;
  EEDescription?: string;
  ApplicationTypeID?: number;
  ApplicationTypeDescription?: string;
}

export interface VoterAllDetailsExt {
  Voter?: IECTypedVoter;
  WardCouncilor?: IECTypedWardCouncilor;
  SpecialVoter?: IECTypedSpecialVoter;
}

class IECApiService {
  private async fetchFromIEC(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${IEC_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`IEC API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('IEC API fetch error:', error);
      throw error;
    }
  }

  private async fetchFromIECService(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${IEC_SERVICE_BASE_URL}${endpoint}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`IEC Service API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('IEC Service fetch error:', error);
      throw error;
    }
  }

  async getVotingDistrictsByWard(wardId: string, returnGeom: boolean = false): Promise<VotingDistrict[]> {
    const endpoint = `/api/VotingDistrictByWard?WardID=${wardId}&returnGeom=${returnGeom}`;
    return this.fetchFromIEC(endpoint);
  }

  async getProvinces(): Promise<any[]> {
    return this.fetchFromIEC('/api/Provinces');
  }

  async getMunicipalities(provinceId?: string): Promise<any[]> {
    const endpoint = provinceId ? `/api/Municipalities?ProvinceID=${provinceId}` : '/api/Municipalities';
    return this.fetchFromIEC(endpoint);
  }

  async getWards(municipalityId?: string): Promise<Ward[]> {
    const endpoint = municipalityId ? `/api/Wards?MunicipalityID=${municipalityId}` : '/api/Wards';
    return this.fetchFromIEC(endpoint);
  }

  async getElectionInfo(): Promise<ElectionInfo[]> {
    return this.fetchFromIEC('/api/Elections');
  }

  // Get extended voter registration details by ID
  async getVoterAllDetailsExt(idNumber: string): Promise<VoterAllDetailsExt> {
    const safeId = encodeURIComponent(idNumber);
    const endpoint = `/api/v1/Voters/GetVoterAllDetailsExt?ID=${safeId}`;
    return this.fetchFromIECService(endpoint);
  }
}

export const iecApiService = new IECApiService();