// IEC API Integration Service
const IEC_BASE_URL = (import.meta as any).env?.VITE_IEC_BASE_URL || 'https://api.elections.org.za/IECGIS';
// Separate base URL for voter services if different from GIS endpoints
const IEC_SERVICE_BASE_URL = (import.meta as any).env?.VITE_IEC_SERVICE_BASE_URL || IEC_BASE_URL;

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

// VoterAllDetails types based on provided sample JSON
export interface VoterAllDetails {
  Voter: {
    Id: string;
    VoterStatus: string;
    VoterStatusID: number;
    bRegistered: boolean;
    VotingStation: {
      Name: string;
      Delimitation: {
        ProvinceID: number;
        Province: string;
        MunicipalityID: number;
        Municipality: string;
        WardID: number;
        VDNumber: number;
      };
      Location: {
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
      };
    };
    VoterId: number;
  };
  WardCouncilor: {
    Name: string;
    Delimitation: {
      ProvinceID: number;
      Province: string;
      MunicipalityID: number;
      Municipality: string;
      WardID: number;
      VDNumber: number;
    };
    PartyDetail: {
      ID: number;
      Name: string;
      Abbreviation: string;
      LogoUrl: string;
      RegStatus: string;
      RegLevel: string;
      ContactDetails: {
        ContactPerson: string;
        Tel: string;
        Fax: string;
        PostalAddress: string;
        WebsiteUrl: string;
      };
    };
    Municipality: {
      ID: number;
      Name: string;
      ContactDetails: {
        ContactPerson: string;
        Tel: string;
        Fax: string;
        PostalAddress: string;
        WebsiteUrl: string;
      };
    };
    ProvinceID: number;
    Province: string;
    MunicipalityID: number;
    WardID: number;
    PartyID: number;
    PartyName: string;
    PartyAbbreviation: string;
  };
  SpecialVoter: {
    SpecialVotesStatus: string;
    ApplicationStatus: string;
    IsOpen: boolean;
    ApplicationStatusID: number;
    EEID: number;
    EEDescription: string;
    ApplicationTypeID: number;
    ApplicationTypeDescription: string;
  };
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
        headers: {
          Accept: 'application/json'
        }
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

  async getVoterAllDetailsByIdNumber(idNumber: string): Promise<VoterAllDetails> {
    const safeId = encodeURIComponent(idNumber);
    const endpoint = `/api/Voters/VoterAllDetails/IDNumber/${safeId}`;
    return this.fetchFromIECService(endpoint);
  }
}

export const iecApiService = new IECApiService();