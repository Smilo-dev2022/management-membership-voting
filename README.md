# React + TypeScript + Vite

## IEC API configuration

Set the following environment variables to enable IEC endpoints:

```
VITE_IEC_BASE_URL=https://api.elections.org.za/IECGIS
# Optional separate base for voter services (if different from GIS)
VITE_IEC_SERVICE_BASE_URL=https://api.elections.org.za/IECServices
```

The IEC data viewer includes:
- Provinces, municipalities, wards, and voting districts
- Election information
- Voter registration lookup by ID number (`GET /api/Voters/VoterAllDetails/IDNumber/{ID}`)
