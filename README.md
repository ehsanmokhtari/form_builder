# Form Builder

A dynamic form builder application built with React, TypeScript, and Supabase. Create, customize, and manage forms with a drag-and-drop interface, collect responses, and view submissions.

<p align="left">
  <a href="https://github.com/ehsanmokhtari/form_builder/actions"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/ehsanmokhtari/form_builder/ci.yml?branch=main"></a>
  <a href="https://github.com/ehsanmokhtari/form_builder/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
</p>

## Features

- **Drag-and-Drop Form Builder**: Create custom forms with various field types
- **Form Preview**: Real-time preview of your forms as you build them
- **Response Collection**: Collect and manage form submissions
- **Multilingual Support**: Available in English and Persian
- **User Authentication**: Secure form ownership and response management
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI**: TailwindCSS
- **State Management**: Zustand
- **Drag and Drop**: dnd-kit
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/ehsanmokhtari/form_builder.git
cd form_builder
```

2. Install dependencies

```bash
npm ci
```

3. Set up environment variables

Copy the `.env.example` file to `.env` and fill in your Supabase credentials:

```bash
# Windows (PowerShell)
copy .env.example .env
# macOS/Linux
cp .env.example .env
```

Then edit `.env` with your Supabase URL and anonymous key.

4. Run the development server

```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Database Setup

The application uses Supabase as its backend. To set up the database:

1. Create a new Supabase project
2. Run the migration script located in `supabase/migrations/merged_migration.sql`

## Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Contributing
See [`CONTRIBUTING.md`](CONTRIBUTING.md). Please open an issue before large changes. All contributions must pass CI.

## Security
See [`SECURITY.md`](SECURITY.md). Please do not file public issues for vulnerabilities.

## Code of Conduct
See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## License
Released under the MIT License. See [`LICENSE`](LICENSE) for details.