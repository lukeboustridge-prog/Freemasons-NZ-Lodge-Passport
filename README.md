# Freemasons Passport — UI Fixes (Oct 2025)

This package includes drop-in replacements for:
- `Dashboard` screen (separate sections for Memberships, Current Lodge offices, Current Grand Lodge offices)
- `Milestones` screen (responsive grid — no overlapping fields)
- `Visits` screen (fields no longer overlap + quick Add Visit modal; you do **not** need to enter edit to add a visit)
- `FMNZLogo` component referencing the correct image URL with a local fallback

## Install

Copy `src/` into your project. Ensure Tailwind is enabled and your page container uses a mobile-friendly width like:

```jsx
<div className="max-w-3xl mx-auto p-4 sm:p-6">...</div>
```

## Usage

```tsx
import Dashboard, { LodgeMembership, Office } from "./src/screens/Dashboard";
import { MilestonesScreen, Milestone } from "./src/screens/Milestones";
import { VisitsScreen, Visit } from "./src/screens/Visits";
import FMNZLogo from "./src/components/Logo";
```

Wire your data into the props shown in each component file.
