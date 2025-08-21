# App

## Setup

1) Copy env example and fill values:

```bash
cp .env.example .env
```

Set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

2) Install and run:

```bash
npm i
npm run dev
```

## Notes

- Do not expose Supabase service_role keys in the client. Use anon/publishable keys only.
