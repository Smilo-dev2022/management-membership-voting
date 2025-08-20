// IEC API Integration Service
const IEC_BASE_URL = 'https://api.elections.org.za/IECGIS';

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
    try {
      const endpoint = `/api/VotingDistrictByWard?WardID=${wardId}&returnGeom=${returnGeom}`;
      return this.fetchFromIEC(endpoint);
    } catch (error) {
      // Fallback voting districts data
      return [
        {
          id: `${wardId}_001`,
          name: `Voting District 1 - Ward ${wardId}`,
          wardId: wardId,
          address: 'Community Hall',
          municipality: 'Local Municipality',
          province: 'Province'
        }
      ];
    }
  }

  async getProvinces(): Promise<any[]> {
    try {
      return this.fetchFromIEC('/api/Provinces');
    } catch (error) {
      // Fallback data if API fails
      return [
        { id: 'EC', name: 'Eastern Cape' },
        { id: 'FS', name: 'Free State' },
        { id: 'GP', name: 'Gauteng' },
        { id: 'KZN', name: 'KwaZulu-Natal' },
        { id: 'LP', name: 'Limpopo' },
        { id: 'MP', name: 'Mpumalanga' },
        { id: 'NC', name: 'Northern Cape' },
        { id: 'NW', name: 'North West' },
        { id: 'WC', name: 'Western Cape' }
      ];
    }
  }

  async getMunicipalities(provinceId?: string): Promise<any[]> {
    try {
      const endpoint = provinceId ? `/api/Municipalities?ProvinceID=${provinceId}` : '/api/Municipalities';
      return this.fetchFromIEC(endpoint);
    } catch (error) {
      // Fallback municipalities data
      return [
        { id: 'CPT', name: 'City of Cape Town', province: 'WC' },
        { id: 'JHB', name: 'City of Johannesburg', province: 'GP' },
        { id: 'EKU', name: 'eThekwini', province: 'KZN' }
      ];
    }
  }

  async getWards(municipalityId?: string): Promise<Ward[]> {
    try {
      const endpoint = municipalityId ? `/api/Wards?MunicipalityID=${municipalityId}` : '/api/Wards';
      return this.fetchFromIEC(endpoint);
    } catch (error) {
      // Fallback wards data
      return [
        { id: '19100001', name: 'Ward 1', municipality: 'CPT', province: 'WC' },
        { id: '79700001', name: 'Ward 1', municipality: 'JHB', province: 'GP' },
        { id: '59900001', name: 'Ward 1', municipality: 'EKU', province: 'KZN' }
      ];
    }
  }

  async getElectionInfo(): Promise<ElectionInfo[]> {
    try {
      return this.fetchFromIEC('/api/Elections');
    } catch (error) {
      // Fallback election data
      return [
        {
          id: '2024-national',
          name: '2024 National and Provincial Elections',
          date: '2024-05-29',
          type: 'National & Provincial',
          status: 'Completed'
        },
        {
          id: '2026-municipal',
          name: '2026 Local Government Elections',
          date: '2026-10-27',
          type: 'Municipal',
          status: 'Scheduled'
        }
      ];
    }
  }
}

export const iecApiService = new IECApiService();