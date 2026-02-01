# Crack Classifier

A web-based crack documentation and assessment system for recording, classifying, and managing crack conditions in infrastructure. Upload photos of cracks, fill in measurements and details, and keep a searchable cloud-based record of all assessments.

Built with React, TypeScript, Firebase, and Tailwind CSS. Deployed on Vercel.

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
  - [Submitting a Crack Record](#submitting-a-crack-record)
  - [Viewing Records](#viewing-records)
  - [Editing a Record](#editing-a-record)
  - [Deleting a Record](#deleting-a-record)
  - [Managing Locations](#managing-locations)
- [Crack Classifications](#crack-classifications)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)
- [Firebase Setup](#firebase-setup)
  - [Firestore Collections](#firestore-collections)
  - [Cloud Storage](#cloud-storage)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- **Photo Upload** — Drag-and-drop or click-to-upload with instant image preview.
- **Automatic EXIF Extraction** — Automatically reads the date and time from photo metadata when available.
- **Crack Classification** — Categorize cracks into four severity levels: Good, Fair, Poor, or Bad.
- **Dimension Tracking** — Record crack length, width, and depth in centimeters.
- **Location Selection** — Choose from 27 predefined barangays in Mandaue City, or add custom locations.
- **Form Validation** — Real-time inline error messages to ensure all required fields are filled correctly.
- **Record Management** — Full CRUD: create, view, edit, and delete crack records.
- **Cloud Storage** — All images and data are stored in Firebase (Firestore + Cloud Storage).
- **Pagination** — Records load 20 at a time with a "Load More" button.
- **Responsive Design** — Works on phones, tablets, and desktops.
- **Toast Notifications** — Visual feedback for successful actions and errors.

---

## How It Works

### Submitting a Crack Record

1. Navigate to the **Submit** tab.
2. Upload a photo of the crack (drag-and-drop or click to browse).
3. The app will attempt to extract the date/time from the photo's EXIF data. If found, the date field is auto-filled.
4. Fill in the required fields:
   - **Image Name** — Auto-populated from the file name; editable.
   - **Label** — A short name for the crack (max 100 characters).
   - **Classification** — Select a severity: Good, Fair, Poor, or Bad.
   - **Location** — Select a barangay or add a new one.
   - **Date & Time** — When the crack was observed.
5. Optionally fill in:
   - **Description** — Additional notes about the crack.
   - **Length, Width, Depth** — Dimensions in centimeters.
6. Click **Submit**. The image uploads to Firebase Storage, and the record saves to Firestore.

### Viewing Records

1. Navigate to the **Records** tab.
2. Browse the card grid showing all submitted cracks (newest first).
3. Each card displays the image, label, classification badge, and location.
4. Click any card to open the **detail modal** with all fields and a full-size image.
5. Click **Load More** at the bottom to fetch additional records.

### Editing a Record

1. Open a record's detail modal by clicking on its card.
2. Click the **Edit** button.
3. Modify any fields (label, description, classification, location, dimensions, date/time).
4. Click **Save**. Changes are synced to Firestore immediately.

### Deleting a Record

1. Open a record's detail modal.
2. Click the **Delete** button.
3. Confirm the deletion when prompted.
4. The record and its associated image are removed from Firestore and Cloud Storage.

### Managing Locations

- The location dropdown includes 27 predefined barangays.
- To **add a custom location**, type a new name in the search box and click the add button.
- To **remove a custom location**, click the remove icon next to it in the dropdown.
- Default barangays cannot be removed.

---

## Crack Classifications

| Classification | Severity | Color | Description |
|----------------|----------|-------|-------------|
| **Good** | Low | Green | Minimal or no visible damage. |
| **Fair** | Moderate | Yellow | Moderate damage; monitoring recommended. |
| **Poor** | High | Orange | Significant damage; action recommended. |
| **Bad** | Critical | Red | Severe damage; urgent action required. |

Each classification is displayed as a color-coded badge throughout the app for quick visual identification.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | [React](https://react.dev/) 19 with [TypeScript](https://www.typescriptlang.org/) 5.9 |
| Build Tool | [Vite](https://vite.dev/) 7 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 4 |
| Database | [Firebase Firestore](https://firebase.google.com/docs/firestore) |
| File Storage | [Firebase Cloud Storage](https://firebase.google.com/docs/storage) |
| EXIF Parsing | [exifr](https://github.com/nicraboy/exifr) 7 |
| Testing | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) |
| Linting | [ESLint](https://eslint.org/) 9 |
| Deployment | [Vercel](https://vercel.com/) |

---

## Project Structure

```
crack-classifier/
├── src/
│   ├── components/
│   │   ├── crack-form/             # Form-related components
│   │   │   ├── CrackForm.tsx         # Main form container
│   │   │   ├── ClassificationSelect  # Severity dropdown
│   │   │   ├── LocationSelect        # Barangay dropdown with search
│   │   │   ├── ImageUpload           # Drag-and-drop image uploader
│   │   │   ├── ImageNameField        # Image name text input
│   │   │   ├── ExifInfo              # EXIF metadata display
│   │   │   └── FormField             # Reusable field wrapper
│   │   ├── crack-list/             # Record viewing components
│   │   │   ├── CrackList.tsx         # Record grid container
│   │   │   ├── CrackCard.tsx         # Individual record card
│   │   │   ├── CrackDetailModal.tsx  # Full detail/edit modal
│   │   │   └── EmptyState.tsx        # No-records placeholder
│   │   ├── layout/                 # App layout
│   │   │   ├── Header.tsx            # Navigation header
│   │   │   └── Container.tsx         # Max-width wrapper
│   │   └── ui/                     # Reusable UI primitives
│   │       ├── Button.tsx
│   │       ├── Toast.tsx
│   │       ├── Alert.tsx
│   │       ├── Skeleton.tsx
│   │       └── Spinner.tsx
│   ├── hooks/                      # Custom React hooks
│   │   ├── useCrackForm.ts          # Form state & submission logic
│   │   ├── useCrackRecords.ts       # Record fetching & pagination
│   │   ├── useExifExtraction.ts     # EXIF parsing state
│   │   ├── useBarangays.ts          # Location CRUD
│   │   └── useToast.ts              # Toast notification queue
│   ├── services/                   # Firebase service layer
│   │   ├── firestoreService.ts       # Firestore CRUD operations
│   │   └── storageService.ts         # Cloud Storage upload/delete
│   ├── utils/                      # Utility functions
│   │   ├── validation.ts             # Form validation logic
│   │   ├── validation.test.ts        # Validation tests
│   │   ├── exif.ts                   # EXIF extraction helpers
│   │   └── exif.test.ts              # EXIF tests
│   ├── constants/
│   │   └── barangays.ts              # 27 predefined barangay names
│   ├── types/
│   │   └── crack.ts                  # TypeScript interfaces
│   ├── config/
│   │   └── firebase.ts               # Firebase initialization
│   ├── test/
│   │   └── setup.ts                  # Test environment setup
│   ├── App.tsx                       # Root app component
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Global styles
├── public/                           # Static assets
├── index.html                        # HTML entry
├── package.json
├── vite.config.ts                    # Vite + Vitest config
├── tsconfig.json                     # TypeScript config
└── eslint.config.js                  # ESLint config
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Firebase](https://firebase.google.com/) project with Firestore and Cloud Storage enabled

### Installation

```bash
git clone https://github.com/your-username/crack-classifier.git
cd crack-classifier
npm install
```

### Environment Variables

Create a `.env` file in the project root with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

> **Note:** All variables are prefixed with `VITE_` so Vite exposes them to the client-side code. Never commit this file to version control — it is already in `.gitignore`.

You can find these values in the [Firebase Console](https://console.firebase.google.com/) under **Project Settings > General > Your Apps > Web App**.

### Running Locally

```bash
npm run dev
```

The app will start on `http://localhost:5173` and is accessible on your local network (the `--host` flag is enabled by default).

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check with TypeScript and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |

---

## Firebase Setup

### Firestore Collections

The app uses two Firestore collections:

#### `crack_records`

Stores all crack assessment records.

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Short name for the crack |
| `description` | string | Additional notes |
| `classification` | string | Severity: `Good`, `Fair`, `Poor`, or `Bad` |
| `location` | string | Barangay name |
| `datetime` | string | Observation date/time (ISO format) |
| `length` | string | Crack length in cm |
| `width` | string | Crack width in cm |
| `depth` | string | Crack depth in cm |
| `imageName` | string | Display name of the image |
| `imageUrl` | string | Firebase Cloud Storage download URL |
| `imagePath` | string | Firebase Cloud Storage file path |
| `createdAt` | Timestamp | Server-generated creation time |
| `updatedAt` | Timestamp | Server-generated update time (on edits) |

Records are ordered by `createdAt` descending (newest first).

#### `custom_barangays`

Stores user-created locations that supplement the 27 default barangays.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Barangay name |
| `createdAt` | Timestamp | Server-generated creation time |

### Cloud Storage

Images are stored under the `Images/` directory with the following naming pattern:

```
Images/{sanitized-image-name}_{timestamp}{extension}
```

For example: `Images/wall_crack_1707123456789.jpg`

Special characters in filenames are automatically replaced with underscores.

---

## Deployment

This project is configured for deployment on **Vercel**.

1. Push your code to a GitHub repository.
2. Import the repository in [Vercel](https://vercel.com/).
3. Add all `VITE_FIREBASE_*` environment variables in the Vercel project settings.
4. Vercel will automatically build and deploy on every push to `main`.

The build command is `tsc -b && vite build`, which runs TypeScript type-checking before building for production.

---

## Predefined Barangays

The app ships with 27 barangays from Mandaue City:

Alang-Alang, Bakilid, Banilad, Basak, Cabancalan, Cambaro, Canduman, Casili, Casuntingan, Centro, Cubacub, Guizo, Ibabao-Estancia, Jagobiao, Labogon, Lo-oc, Maguikay, Mantuyong, Opao, Pagsabungan, Paknaan, Subangdaku, Tabok, Tawason, Tingub, Tipolo, Umapad.

Users can add custom locations through the app's location dropdown.

---

## License

This project is private and not licensed for public use.
