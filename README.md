# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## IEC API configuration

Set environment variables in `.env` or via your host:

- `VITE_IEC_BASE_URL` (default: `https://api.elections.org.za/IECGIS`)
- `VITE_IEC_SERVICE_BASE_URL` (default: `https://api.elections.org.za/IECService`)

Used by `src/services/iecApi.ts` for delimitation/elections and voter lookup endpoints respectively.