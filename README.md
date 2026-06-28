# AdminSphere — User Management Dashboard

A modern, high-performance, and visually stunning **User Management Dashboard** built using React.js, Axios, and Vanilla CSS. The interface adopts a premium glassmorphic dark-mode theme designed to provide administrators with an intuitive environment to run complete CRUD (Create, Read, Update, Delete) operations on user data.

---

## 1. Project Overview

AdminSphere is a responsive frontend administration dashboard that interfaces with the **JSONPlaceholder** mock REST API. It handles data mapping assumptions dynamically, validates client-side inputs prior to dispatching network requests, and integrates dynamic pagination, multi-field search queries, and granular filter controls.

### Key Features
* 🌌 **Glassmorphic Dark Mode UI**: Built from scratch using CSS Custom Properties and backdrop blur elements.
* 📊 **Interactive Stats Count**: Real-time counter of total loaded users and unique departments.
* 🔍 **Multi-Field Text Search**: Instantly filters users by matching query strings against First Name, Last Name, and Email.
* 🎛️ **Granular Filter Popup**: Popover panel allowing targeting of cohorts by name, email substring, or department.
* ↕️ **Bidirectional Sorting**: Sort table fields (First Name, Last Name, Email, Department, ID) in ascending or descending lexicographical order.
* 📑 **Responsive Pagination**: State-aware navigation controls with limits of 10, 25, 50, and 100 rows per page.
* ➕ **Form Validation Engine**: Inline error messages and warning glow highlights indicating invalid email or empty names.
* 🗑️ **Safety Confirmation Dialog**: Prevents accidental deletions with a pre-flight confirmation check.
* 🧪 **Automated Testing Suite**: Built-in Unit Tests using **Vitest** for validators and helpers.

---

## 2. Folder Structure Map

The project implements a highly modular structure isolating business rules, utilities, and components:

```
user-management-dashboard/
│
├── public/                     # Static assets (Favicons, Icons)
│
├── src/
│    ├── api/
│    │    └── userService.js    # Dedicated layer for Axios HTTP configurations
│    │
│    ├── components/
│    │    ├── Header.jsx        # Branding and metrics counters
│    │    ├── SearchBar.jsx     # Query text filter and limits dropdown
│    │    ├── FilterPopup.jsx   # Multi-criteria search popup window
│    │    ├── UserTable.jsx     # Table grid layout container
│    │    ├── UserRow.jsx       # Individual user rows and action triggers
│    │    ├── UserForm.jsx      # Dialog form modal for Add & Edit operations
│    │    ├── ConfirmDelete.jsx # Safety dialog confirmation modal
│    │    └── Pagination.jsx    # Numeric page navigation buttons
│    │
│    ├── hooks/
│    │    └── useUsers.js       # Custom state hook for fetching and local list sync
│    │
│    ├── utils/
│    │    ├── constants.js      # Global API URL, departments list, page limits
│    │    ├── helpers.js        # Name splitting and deterministic departments logic
│    │    └── validators.js     # Form field client validations
│    │
│    ├── styles/                # CSS styling directory
│    │    ├── main.css          # Design system variable tokens and typography
│    │    ├── glassmorphism.css # Blur containers, glows, and keyframe animations
│    │    └── components.css    # Interactive buttons, table layout, forms, and mobile media queries
│    │
│    ├── App.jsx                # Layout wrapper coordinating visual states
│    └── main.jsx               # App mounting entry point
│
├── tests/                      # Unit testing files
│    ├── setup.js               # Testing environment setup configurations
│    ├── helpers.test.js        # Unit tests for name-splitters and ID mapping
│    └── validators.test.js     # Unit tests for forms validators
│
├── vitest.config.js            # Vitest testing environment configuration
├── package.json                # Project dependencies and script bindings
└── README.md                   # Project documentation
```

---

## 3. Libraries Used

| Library / Tool | Purpose |
| --- | --- |
| **React (v19)** | UI Rendering and state synchronization |
| **Axios (v1.18)** | Asynchronous REST communication layer |
| **Lucide React (v1.21)** | Premium icon pack |
| **Vitest (v4.1)** | Fast unit test runner |
| **jsdom (v29)** | Browser DOM simulation for testing |
| **Vite (v8)** | Build toolchain and fast HMR server |

---

## 4. Engineering Assumptions & Data Mapping

Because the **JSONPlaceholder** mock API schema provides a single `name` string and lacks a `department` attribute, the following transformations are applied during initial ingestion:
1. **Name Extraction**: The full `name` string is programmatically split at the first whitespace. The substring preceding the space maps to `firstName`, while all subsequent elements map to `lastName`.
   - *Example*: `"Mrs. Dennis Schulist"` maps to `firstName: "Mrs."` and `lastName: "Dennis Schulist"`.
2. **Department Ingestion**: Users are mapped to a department deterministically using their unique numeric ID:
   - `department = DEPARTMENTS[(id - 1) % DEPARTMENTS.length]`
   - This ensures data persistence across page reloads and consistency in sorting/filtering.

---

## 5. Challenges Faced & Solutions

### A. JSONPlaceholder Server Limits
* **Constraint**: `JSONPlaceholder` is a read-only endpoint. `POST`, `PUT`, and `DELETE` events do not actually update the database; they only return standard success statuses. 
* **Constraint**: If we try to edit or delete a newly created user (with an ID > 10), the mock API throws a `404 Not Found` or `500 Internal Server Error` because the database record does not exist on their servers.
* **Solution**: The custom hook `useUsers.js` intercepts operations targeting IDs greater than `10`. If a PUT or DELETE fails due to this restriction, the hook bypasses the server step, updates the client-side list in memory, and triggers a localized success toast.

### B. Table Mobile Responsiveness
* **Constraint**: Horizontal tabular structures break and scroll viewports on narrow screen sizes.
* **Solution**: Implemented a responsive media query grid layout inside `components.css`. On tablet sizes, less critical columns (like Department) are hidden. On mobile sizes, IDs are also hidden, and action buttons stack vertically to fit minimum touch targets ($44 \times 44$ pixels) comfortably.

---

## 6. Setup & Execution Instructions

### Prerequisites
* **Node.js**: Version 18.0.0 or higher
* **npm**: Version 9.0.0 or higher

### Local Development Server
1. Clone the project or navigate to the workspace directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Access the dashboard in your browser at the local URL (usually `http://localhost:5173`).

### Running Automated Unit Tests
To run the Vitest unit tests:
```bash
npm run test
```

### Production Build
To verify production compilation and create optimization bundle artifacts:
```bash
npm run build
```

---

## 7. Future Architectural Improvements
If given more time, the following enhancements would be added:
1. **Zustand or Redux State Manager**: Externalize the state container to support global notifications and cache invalidation.
2. **Toast Overlay Manager**: Refactor notifications to support alert stacks instead of single toast messages.
3. **Skeleton Loading Animations**: Swap the central spinner overlay for beautiful, pulsating grey layout templates matching the column sizes.
4. **Permanent Storage Sync**: Integrate IndexedDB or localStorage to save client-added users across full browser reloads.
