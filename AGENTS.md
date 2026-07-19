<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

You are an expert Next.js developer. Please follow this exact folder structure and architecture for all new files, features, and refactoring:

### Architecture & Tech Stack:
- Next.js App Router (TypeScript) with next-intl for localization.
- Tailwind CSS & Shadcn/ui atomic primitives.
- Redux Toolkit for global state management.
- Zod & React Hook Form for form validation.
- Axios for API service layer.

### Folder Structure Rules:
1. Routing (`src/app/`):
   - Keep page files (`page.tsx`) extremely thin. Page components should only parse params/searchParams and render components from `src/features/`.
   - Organize routes using route groups like `(public)` and `(protected)`.

2. Feature Modules (`src/features/[feature-name]/`):
   - Place all domain-specific code inside its respective feature directory:
     - `/components/` -> UI specific to this feature.
     - `/hooks/` -> Feature-specific hooks.
     - `/schemas/` -> Zod schemas for forms.
     - `/types/` -> Feature-specific TypeScript interfaces/types.
     - `/utils/` -> Feature-specific helper logic.

3. Services & API Layer (`src/services/[domain]/`):
   - Keep API request calls isolated from UI components in `src/services/`.
   - Export async functions returning typed responses.

4. Global State (`src/store/`):
   - Manage global state slices inside `src/store/[slice-name]/`.

5. Shared & UI Components (`src/components/`):
   - `/ui/` -> Low-level generic UI components (Button, Modal, Input, Badge).
   - `/layout/` -> Structural components (Navbar, Footer, Sidebar).
   - `/shared/` -> Multi-feature reusable components (PropertyCard, SearchBar, Map).

6. Helpers & Utilities (`src/lib/` & `src/hooks/`):
   - Place generic utilities in `src/lib/` and generic React hooks in `src/hooks/`.

7. Internationalization (`messages/`):
   - Store translation key-value JSONs in `messages/` organized by locale (`en.json`, `ar.json`, `fr.json`).

Please strictly follow this directory organization when creating or modifying any file.

<!-- END:nextjs-agent-rules -->
