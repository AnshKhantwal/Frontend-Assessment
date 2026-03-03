# APS- Frontend UI Assesment

A React-based frontend which is built as a part of an assesment.

## Tech Stack

- React
- React-icons
- React-router
- Css

## Features/Screens

- **SignUp**
- **Dashboard**
- **ScanPage**
- **Toast Notification**
- **Responsive**

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