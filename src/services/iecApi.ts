// IEC API Integration Service
const IEC_BASE_URL = (import.meta as any).env?.VITE_IEC_BASE_URL || 'https://api.elections.org.za/IECGIS';

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

  async getVoterAllDetailsByVoterId(voterId: string): Promise<import('@/types/iec').VoterAllDetails> {
    const endpoint = `/api/Voters/VoterAllDetails/VoterId/${encodeURIComponent(voterId)}`;
    return this.fetchFromIEC(endpoint);
  }
}

export const iecApiService = new IECApiService();