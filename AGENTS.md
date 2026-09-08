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

### 14. REUSABILITY IS MANDATORY

Before creating any component:
- Search the existing project.
- Find equivalent components.
- Determine whether an existing component can be reused.
- Determine whether an existing component can be extended.
- Only create a new component if necessary.

Never create duplicate components such as:
- `MyButton.tsx`
- `CustomButton.tsx`
- `NewButton.tsx`
- `PropertyButton.tsx`

when an existing `Button` can be reused.

Prefer:
```tsx
<Button variant="secondary" />
```
over creating:
```tsx
<SecondaryButton />
```
when the existing API can support the behavior.

### 15. NO DUPLICATED UI

Do not reproduce the same meaningful UI in multiple places.

Bad:
```tsx
<div className="rounded-lg border p-4">
  ...
</div>
```
repeated across several files.

If the UI represents a reusable concept, extract it.

Example:
```tsx
<PropertyCard property={property} />
```
instead of reproducing the card markup everywhere.

### 16. NO DUPLICATED BUSINESS LOGIC

Do not duplicate:
- formatting logic
- filtering logic
- transformation logic
- validation logic
- API logic
- state logic
- permission logic
- search logic

If logic belongs to one feature:
- `src/features/[feature]/utils/`
- `src/features/[feature]/hooks/`

If logic is genuinely generic:
- `src/lib/`
- `src/hooks/`

Please strictly follow this directory organization when creating or modifying any file.

<!-- END:nextjs-agent-rules -->
