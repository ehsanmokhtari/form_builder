# Form Builder

A dynamic form builder application built with React, TypeScript, and Supabase. Create, customize, and manage forms with a drag-and-drop interface, collect responses, and view submissions.

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

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd form-builder
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Copy the `.env.example` file to `.env` and fill in your Supabase credentials:

```bash
copy .env.example .env
```

Edit the `.env` file with your Supabase URL and anonymous key.

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Database Setup

The application uses Supabase as its backend. To set up the database:

1. Create a new Supabase project
2. Run the migration script located in `supabase/migrations/merged_migration.sql`

## Features
### Form Builder
- Create forms with customizable fields
- Drag and drop to reorder fields
- Set field properties (required, width, etc.)
- Preview forms in real-time
### Form Fields
- Text fields
- Questions with multiple choice, single choice, or descriptive answers
- Customizable field width and layout
### Form Responses
- Collect and view form submissions
- Secure access to responses
### Internationalization
- Support for English and Persian languages
- Easy language switching
## Scripts
- npm run dev : Start development server
- npm run build : Build for production
- npm run preview : Preview production build
- npm run lint : Run ESLint
- npm run format : Format code with Prettier
- npm run db:migrate : Run database migrations
- npm run db:reset : Reset database (use with caution)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.