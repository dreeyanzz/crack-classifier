# Crack Classifier

A web application for classifying and documenting pavement cracks in Mandaue City, Philippines. Upload images, classify crack severity, and manage records stored in Firebase.

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Build:** Vite 7
- **Backend:** Firebase (Firestore + Cloud Storage)
- **Image Processing:** exifr (EXIF metadata extraction)
- **Testing:** Vitest, Testing Library

## Features

- Image upload with drag-and-drop and EXIF date/time auto-population
- Four-tier crack classification: Good, Fair, Poor, Bad
- Location tagging across 27 barangays of Mandaue City
- Record listing with image previews and classification badges
- Firebase Cloud Storage for images, Firestore for records

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore and Cloud Storage enabled

### Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with your Firebase config:

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start development server     |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview production build     |
| `npm run lint`    | Run ESLint                   |
| `npm run test`    | Run tests once               |
| `npm run test:watch` | Run tests in watch mode   |

## Project Structure

```
src/
├── components/       # React UI components
│   ├── crack-form/   # Form for submitting crack records
│   ├── crack-list/   # Record listing and cards
│   ├── layout/       # Header, Container
│   └── ui/           # Button, Alert, Spinner, FormField
├── config/           # Firebase initialization
├── constants/        # Barangay list
├── hooks/            # Custom hooks (form, EXIF, records)
├── services/         # Firebase Storage and Firestore operations
├── test/             # Test setup
├── types/            # TypeScript type definitions
└── utils/            # Validation and EXIF utilities
```
