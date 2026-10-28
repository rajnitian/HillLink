# HillLink

**A demo-ready emergency donor coordination prototype for hilly and hard-to-reach regions.**

HillLink demonstrates a workflow for verified emergency requests, donor matching, staged outreach, and transport coordination. This repository is an MVP using **synthetic demo data**. It is not a medical service and does not send real SMS/voice calls or verify real hospitals/donors.

## Features
- Hospital/operator dashboard with sample requests
- Create an emergency blood request
- Donor directory with blood group and availability
- Explainable matching by blood group, availability, and estimated travel time
- Demo notification queue (simulated; no messages are sent)
- Admin overview
- Responsive UI

## Requirements
- Node.js 20 or newer
- npm

## Run locally
From the root `hilllink` directory:

```bash
npm run install:all
npm run dev
```

Open the Vite URL printed in the terminal (usually http://localhost:5173). The API runs on http://localhost:4000.

## Build
```bash
npm run build
```

## Important safety notes
- All bundled people, facilities, requests, and travel-time values are fictional demo records.
- The matching output is a prototype ranking, not medical advice or a guarantee of donor eligibility.
- The notification system is simulated and does not contact anyone.
- Do not use this prototype for real emergencies. Contact local emergency services and licensed healthcare providers.
- Before any real deployment, add authentication/authorization, privacy and consent controls, audit logs, validated eligibility rules, secure database storage, rate limits, and tested SMS/voice integrations.

## Project layout
```text
hilllink/
├── client/   # React + TypeScript + Vite UI
└── server/   # Express + TypeScript demo API
```
