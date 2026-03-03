# APS- Frontend UI Assesment

A React-based frontend which is built as a part of an assesment.

## Tech Stack

- React
- React-icons
- React-router
- Css

## Features/Screens

- **SignUp** with form validation and social login buttons
- **Dashboard** showing organization-level stats, severity overview cards, and a searchable scan table
- **ScanPage** page with a live progress ring, phase stepper, streaming activity log, and finding log — all driven by a simulated 30-second scan timer
- **Toast Notification** system alerts for validation/messages (success, warning, error)
- **Responsive** sidebar converts to a slide-out drawer on mobile

## Data(Mock Data)

All data is in 'src/assets/mock-data'. The dashboard reads from `scans.json`, and the scan detail page reads from `live-scan.json`. A helper in `src/data/mockData.js` transforms the JSON into the shapes the components expect. No backend or API calls needed.

## How to start

- npm install
- npm run dev

open (https://localhost:5173)

## Project Structure

src/
    assets/
        mock-data/
    components/
        Dashboard/
        ScanDetail/
        Sidebar/
        Signuppage/
        /Toast
    context/
        ThemeContext.jsx
    data/
        mockData.js