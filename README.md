# Star Wars Character Holocron (Jakala Coding Challenge)

This project is a modern web application built with Next.js and TypeScript, designed as a technical assessment for Jakala. It serves as a digital Holocron, allowing users to browse characters from the Star Wars universe by fetching data from the [SWAPI (The Star Wars API)](https://swapi.py4e.com/).

The application showcases a clean, responsive interface with client-side data fetching, caching, and a polished user experience, including hover animations and atmospheric background music.

## Features

- **Character Directory**: Displays a paginated list of Star Wars characters.
- **Adaptive Layout**: A fully responsive layout that adjusts the number of character cards based on screen size, using modern CSS Flexbox for perfect alignment.
- **Character Details Page**: Clicking on a character's "Details" button navigates to a dedicated page with more information about them.
- **Client-Side Caching**: Utilizes TanStack Query (`@tanstack/react-query`) to efficiently fetch, cache, and manage server state.
- **Smooth Pagination**: `keepPreviousData` is enabled for a seamless user experience while navigating between pages, preventing UI flickering.
- **Interactive UI**: Cards feature subtle hover animations (lift and shadow) to provide clear visual feedback.
- **Atmospheric Audio (Bonus)**: An optional toggle in the top-right corner allows users to play and pause the iconic Star Wars theme music for a more immersive experience.

## Tech Stack

This project is built on a modern, robust, and scalable tech stack:

- **Framework**: [Next.js](https://nextjs.org/) 16 (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - A set of beautifully designed, accessible, and reusable components.
- **Data Fetching & State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: Turbopack

## Project Structure

The project follows the standard Next.js App Router structure, with a clear separation of concerns.
```
├── public/ # Static assets
│ └── favicon.ico # Application favicon
├── src/ # Main source code directory
│ ├── app/ # Next.js App Router directory
│ │ ├── people/ # Dynamic route for individual characters
│ │ │ └── [id]/
│ │ │ │ ├── page.tsx # Server Component wrapper for the dynamic page
│ │ │ │ └── person-details.tsx# Client Component to display character details
│ │ ├── globals.css # Global styles for the application
│ │ ├── layout.tsx # Root layout for the entire app
│ │ └── page.tsx # Homepage component (character list)
│ ├── components/ # Reusable React components
│ │ ├── ui/ # Unstyled components from shadcn/ui
│ │ │ ├── button.tsx # Button component
│ │ │ └── card.tsx # Card component
│ │ ├── ambient-music.tsx # Component for the audio toggle feature
│ │ └── providers.tsx # Client-side providers (e.g., React Query)
│ ├── lib/ # Utility functions
│ │ └── utils.ts # General utility functions
│ ├── services/ # API interaction layer
│ │ └── swapi.ts # Functions for fetching data from SWAPI
│ └── types.ts # TypeScript type definitions for the project
```

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Node.js (v18.17 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```
    git clone https://github.com/Foxeleon/star-wars-app-challenge.git
    cd star-wars-app-challenge
    ```

2.  **Install dependencies:**
    ```
    npm install
    ```

3.  **Run the development server:**
    ```
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Architectural Decisions & Learnings

- **Server vs. Client Components**: The application leverages the Next.js App Router paradigm by using Server Components for routing (`/people/[id]/page.tsx`) and Client Components for interactivity and data fetching hooks (`HomePage`, `PersonDetails`).
- **API Limitations**: During development, it was discovered that the public SWAPI has a fixed page size of 10 and does not support a `limit` parameter. The architecture was adapted to work efficiently within this constraint, favoring a standard server-side pagination model over a "fetch-all" approach to ensure scalability and a fast initial load.
- **State Management**: TanStack Query was chosen for its powerful caching capabilities, which significantly improve the user experience by reducing unnecessary network requests and providing features like `keepPreviousData`.

