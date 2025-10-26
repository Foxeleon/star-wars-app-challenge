# Star Wars Holocron App

This project is a modern web application built with Next.js and TypeScript. It serves as a digital Holocron, allowing users to browse various resources from the Star Wars universe (including People, Planets, Films, and more) by fetching data from the [SWAPI (The Star Wars API)](https://swapi.py4e.com/).

The application showcases a clean, responsive interface with client-side data fetching, caching, and a polished user experience, including hover animations and atmospheric background music.

## Features

- **Universal Resource Browser**: Displays a paginated list of various Star Wars resources. Users can switch between People, Planets, Films, Species, Vehicles, and Starships using an intuitive tab-based navigation.
- **Adaptive Layout**: A fully responsive layout that uses modern CSS Flexbox for perfect alignment of resource cards on any screen size.
- **Dynamic Details Page**: Clicking on an item's "Details" button navigates to a universal, dynamically-generated page that displays all relevant information for that specific resource.
- **Client-Side Caching**: Utilizes TanStack Query (`@tanstack/react-query`) to efficiently fetch, cache, and manage server state.
- **Smooth Pagination**: `keepPreviousData` is enabled for a seamless user experience while navigating between pages, preventing UI flickering.
- **Interactive UI**: Cards feature subtle hover animations (lift and shadow) to provide clear visual feedback.
- **Atmospheric Audio (Bonus)**: An optional toggle in the top-right corner allows users to play and pause the iconic Star Wars theme music for a more immersive experience.

## Tech Stack

This project is built on a modern, robust, and scalable tech stack:

- **Framework**: [Next.js](https://nextjs.org/) 14+ (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - A set of beautifully designed, accessible, and reusable components.
- **Data Fetching & State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: Turbopack

## Project Structure

The project follows the standard Next.js App Router structure, leveraging catch-all segments for maximum code reuse and scalability.
```
├── public/
│ └── favicon.ico
├── src/
│ ├── app/
│ │ ├── [resource]/
│ │ │ └── [id]/
│ │ │ ├── details-client.tsx # Client Component for displaying resource details
│ │ │ └── page.tsx # Universal Server Component for all detail pages
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ └── page.tsx # Homepage component (resource browser)
│ ├── components/
│ │ ├── ui/
│ │ │ ├── button.tsx
│ │ │ ├── card.tsx
│ │ │ └── tabs.tsx
│ │ ├── ambient-music.tsx
│ │ ├── providers.tsx
│ │ └── resource-card.tsx # Reusable component for displaying any resource
│ ├── lib/
│ │ └── utils.ts
│ ├── services/
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

- **Catch-all Dynamic Routes**: The application uses a `[resource]/[id]` route structure to handle all detail pages with a single set of components. This is a powerful Next.js pattern that maximizes code reuse and simplifies the project structure.
- **Server and Client Component Synergy**: The detail page (`page.tsx`) is a Server Component that extracts URL parameters, which are then passed to a Client Component (`details-client.tsx`) that handles data fetching and state management with `useQuery`.
- **API Limitations**: During development, it was discovered that the public SWAPI has a fixed page size of 10 and does not support a `limit` parameter. The architecture was adapted to work efficiently within this constraint, favoring a standard server-side pagination model.
- **State Management**: TanStack Query was chosen for its powerful caching capabilities, which significantly improve the user experience by reducing unnecessary network requests and providing features like `keepPreviousData`.
