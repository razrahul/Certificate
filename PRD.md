# Product Requirements Document (PRD) - BSMEB Certificate & Marksheet Portal

This document provides a comprehensive product overview, technical requirements, feature specifications, architecture maps, and user flows for the Bihar State Madarsa Education Board (BSMEB) Certificate and Marksheet Verification Portal.

---

## 1. Objectives & Project Goal

The primary goal of this application is to provide a secure, role-based digital dashboard for verifying, search querying, printing, and managing student certificates and marksheets (for Fauquania & Moulvi classes). 

It ensures strict accountability through detailed audit logging of all certificate modifications and printing actions executed by operators.

---

## 2. Technical Stack & Directories

### 2.1. Frontend Architecture
- **Framework**: React.js (Vite compiler)
- **Lazy Loading**: Code splitting via `React.lazy()` for all route entries and `<Suspense>` wrapper utilizing a customized spinner loader (`Loader.jsx`).
- **State Management**: Redux Toolkit (Slices, Thunks, unified Store)
- **Styling**: Vanilla SCSS (Strictly component-scoped/isolated stylesheets, avoiding global clashing and side-effects on official print marksheets).
- **Client**: Axios instance with centralized token/error interceptors (`apiClient.js`)

**Key Directory Map**:
- `FRONTEND/src/components/common/UserMenu/`: Dropdown navigation menu for Profile, Security, and Logout.
- `FRONTEND/src/components/common/Loader/`: Center spinner page loader.
- `FRONTEND/src/components/Header/`: Primary website header.
- `FRONTEND/src/pages/Dashboard/`: Sidebar, Statistics, Logs, and User Management tab wrappers.
- `FRONTEND/src/pages/Dashboard/components/`: Modular component split files (`DashboardSidebar.jsx`, `DashboardOverview.jsx`, `AuditLogsPanel.jsx`, `UserManagementPanel.jsx`, `ProfileSettingsPanel.jsx`, `AddUserModal.jsx`, `ResetPasswordModal.jsx`, `ToggleStatusModal.jsx`).
- `FRONTEND/src/pages/Certificate/`: Search query interface for certificates.
- `FRONTEND/src/pages/StudentMarksheet/` & `FRONTEND/src/pages/Moulvi/`: Dynamic marksheets for Fauquania and Moulvi streams (Science, Arts, Islamiat, Commerce).
- `FRONTEND/src/redux/`: Redux slices (`userSlice`, `logSlice`, `certificateSlice`), actions, and root store config.
- `FRONTEND/src/services/`: Direct API handlers (`userService.js`, `logService.js`, `certificateService.js`, `apiClient.js`).

---

### 2.2. Backend Architecture
- **Platform**: Node.js & Express
- **Database ORM**: Sequelize (MySQL backend)
- **Authentication**: JSON Web Tokens (JWT) stored in HTTP-Only cookies with support for "Remember Me" (7-day longevity)
- **Validation**: Schema validation middleware via Joi / helper validators

**Key Directory Map**:
- `BACKEND/src/model/`: Database schemas (`user.js`, `log.js`, `student.js`, `tablesync.js`).
- `BACKEND/src/controller/`: Route controllers (`userController.js`, `logController.js`, `certificateController.js`).
- `BACKEND/src/middleware/`: Security middleware (`auth.js`), validation schema checking (`validation.js`).
- `BACKEND/src/router/`: API endpoints configuration (`userRouter.js`, `logRouter.js`, `certificateRouter.js`).

---

## 3. Role-Based Access Control (RBAC)

The application enforces four user roles with distinct permissions:

| Role | Permissions | Dashboard Access | Header Main Nav | User Management Tab | Logs Tab | Search/Print |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **SUPERADMIN** | Full system control; manage all user accounts; reset passwords; view all logs & statistics. | Yes | Yes (Filtered) | Yes (Add/Toggle/Reset) | Yes | Yes |
| **ADMIN** | System administration; view stats and all audit logs. No user modifications. | Yes | Yes (Filtered) | No | Yes | Yes |
| **OPERATOR** | Data desk operator; query student database, update certificates, print records. View own stats/logs. | Yes | Yes (Filtered) | No | No | Yes |
| **USER** | Restricted regular user. No access to search, prints, logs, or system statistics. | No | No | No | No | No |

---

## 4. API Endpoints Specification (Backend)

### 4.1. User Endpoints (`/api/v1/user`)
All endpoints except login are protected by JWT `verifyToken` middleware.

- **`POST /login`**: Logs in a user.
  - *Payload*: `{ email/username, password, rememberMe }`
  - *Behavior*: Validates password and checking `isActive === true`. Sets JWT cookie (maxAge 7 days if `rememberMe === true`, else session-based).
- **`POST /logout`**: Logs out the authenticated user and invalidates the session cookie.
- **`GET /profile`**: Returns profile info of the currently logged-in user.
- **`PUT /profile`**: Updates details of the current logged-in user.
  - *Payload*: `{ name, phone, department, office }`
  - *Validation*: `updateUserProfileSchema` (Zod validation checking name min length, optional phone/department, and office enum).
- **`POST /change-password`**: Changes logged-in user's own password.
  - *Payload*: `{ oldPassword, newPassword }`
- **`GET /list`** *(SUPERADMIN only)*: Returns a JSON array of all registered users (excluding password hashes).
- **`PUT /toggle-active`** *(SUPERADMIN only)*: Toggles `isActive` of the target user. If deactivated, increments `tokenVersion` to immediately invalidate all their login sessions.
  - *Payload*: `{ email }`
  - *Validation*: `toggleUserActiveSchema` (Zod validation verifying that target email is a valid email string).
- **`POST /admin-reset-password`** *(SUPERADMIN only)*: Resets target user's password.
  - *Payload*: `{ email, newPassword }`
- **`POST /register`** *(SUPERADMIN only)*: Creates a new operator/admin user.
  - *Payload*: `{ name, username, email, password, role, office, department, phone }`

---

### 4.2. Log Endpoints (`/api/v1/log`)
- **`GET /stats`**: Returns statistics counts for dashboard metrics cards (Today/Weekly print & update counters). Operators only see their own logs; SUPERADMIN/ADMIN see total system logs.
- **`GET /updates`** *(SUPERADMIN, ADMIN, OPERATOR)*: Returns update audit trail.
- **`GET /prints`** *(SUPERADMIN, ADMIN, OPERATOR)*: Returns printed certificates audit trail.

---

## 5. State Management & Actions (Frontend Redux)

### 5.1. User Slice (`userSlice.js`)
- **State Structure**:
  - `data`: Current logged-in user payload `{ id, name, username, email, role, token, ... }` (synced to `localStorage` as `certificateDeskUser`).
  - `usersList`: Array of all users (for SuperAdmin table).
  - `activeDashboardTab`: Stores active sub-section identifier (e.g. `'dashboard'`, `'logs'`, `'users'`, `'profileSettings_personalInfo'`, `'profileSettings_accountSecurity'`).
- **Thunks**:
  - `loginUserAction(credentials)`
  - `logoutUserAction()`
  - `fetchUserProfileAction()`
  - `updateUserProfileAction(profileForm)`
  - `fetchUsersListAction()`
  - `toggleUserActiveAction(email)`
  - `adminResetUserPasswordAction({ email, newPassword })`
  - `registerUserAction(newUserForm)`

---

### 5.2. Log Slice (`logSlice.js`)
- **State Structure**:
  - `stats`: Metric stats counts `{ updates: { daily, weekly }, prints: { daily, weekly } }`.
  - `updateLogs`: Array of update audit log objects.
  - `printLogs`: Array of print audit log objects.
- **Thunks**:
  - `fetchDashboardStatsAction()`
  - `fetchUpdateLogsAction({ page, limit })`
  - `fetchPrintLogsAction({ page, limit })`

---

## 6. Detailed User Interface Flows & Routing (React Router DOM)

The application utilizes **React Router DOM** (`react-router-dom`) for declarative client-side routing, nested views rendering, and security access guards.

### 6.1. Router Configuration Map
- **`/home`** (Public): Primary landing page.
- **`/about`** (Public): Informational static content.
- **`/login`** (Public): Authentication screen. If an unauthenticated user hits a protected path, they are routed here with location state tracking (`location.state.from`).
- **`/certificate`** (Protected): Lookup search screen.
- **`/student`** (Protected): Core search result fields.
- **`/studentmarksheet`** (Protected): Renders Fauquania or Moulvi marksheets based on active student metadata.
- **`/studentscertificate`** (Protected): Renders Fauquania or Moulvi certificates based on active student metadata.
- **`/dashboard`** (Protected, Role-Restricted: `SUPERADMIN`, `ADMIN`, `OPERATOR`): Renders stats overview.
- **`/dashboard/logs`** (Protected, Role-Restricted: `SUPERADMIN`, `ADMIN`): Renders update & print audit logs tables.
- **`/dashboard/users`** (Protected, Role-Restricted: `SUPERADMIN`): Renders system users lists, status toggle confirmations, and registration panels.
- **`/profile`** (Protected): Renders operator profile information.
- **`/profile/security`** (Protected): Renders password modifications pane.

---

### 6.2. Navigation & UserMenu (Header Dropdown)
- Navigation is handled declaratively using semantic `<Link>` and `<NavLink>` tags instead of JS click callbacks, producing native HTML anchor (`<a>`) elements.
- The primary navigation links list (Home, About, Certificate) is defined statically inside `Header.jsx`, keeping the navigation component self-contained and removing redundant configuration dependencies.
- This ensures full accessibility, search engine crawlers compatibility (SEO), and support for native browser shortcuts (e.g., Ctrl+Click / Open in new tab).
- Clicking **Profile** utilizes `<Link to="/profile">` to render the user settings pane.
- Clicking **Security** utilizes `<Link to="/profile/security">` to render password modifications.
- Clicking **Dashboard** utilizes `<Link to="/dashboard">` to display metric overview panels.
- Clicking **Logout** uses an interactive `<button>` that dispatches `logoutUserAction()` and navigates the user back to `/home`.

---

### 6.3. Scoped Dashboard Pages & Modular Data Fetching
- Managed inside a sidebar-split layout (`DashboardPage.jsx` acts as a layout container housing `<Outlet />` and the sidebar).
- Each dashboard sub-panel fetches its own data independently on mount rather than querying all logs/stats at the parent page mount:
  - **`DashboardOverview`** fetches dashboard stats.
  - **`AuditLogsPanel`** fetches update & print log queries with the following optimizations:
    - **Pagination**: Implements log pagination with a limit of 10 items per page and interactive Next/Previous button controls.
    - **S.No Column**: Displays calculated offset serial numbers (`(page - 1) * limit + index + 1`) instead of raw database primary key IDs.
    - **Changes formatting**: Parses updates from JSON and renders a visual comparison (`old_value ➔ new_value` with red/green strikethrough labels) instead of unformatted code block strings.
    - **Date & Time Formatting**: Timestamps are parsed to show both the formatted calendar date (`DD-MM-YYYY`) and localized clock time.
  - **`UserManagementPanel`** queries registered operator lists and encapsulates its own registration, reset password, and status toggle confirmation modals.

---

### 6.4. Protected Routes & Dynamic Redirection
- **`ProtectedRoute`**: Blocks access to path templates if `authUser` is missing. Stores `location.pathname` inside state redirects and routes the user to `/login`.
- **`RoleRoute`**: Asserts role clearances on paths (e.g., checks if logged-in user is `SUPERADMIN` before letting them visit `/dashboard/users`, else redirects).
- **Post-Login redirection**: Upon successful login inside `LoginPage.jsx`, the user is redirected to `location.state.from` (target path before redirect) if available, otherwise it falls back to `/home` (regular user) or `/certificate` (board operator/admin).

---

## 7. System Design Principles
- **SCSS Class Isolation**: Styling layout changes must be strictly isolated under a component's top-level container (e.g., `.dashboard-page-container {}` in SCSS) to avoid styling spills into certificate marksheets.
- **Component-Level Styling**: Each sub-component owns its style stylesheet (e.g. `DashboardSidebar.scss`, `Modal.scss`) and imports it directly inside its `.jsx` file, utilizing unique wrapper containers to guarantee zero CSS class name overrides.
- **State Integrity**: React hook set-state-in-effect issues are avoided by deriving current active tab state directly from Redux `activeDashboardTab` instead of mirroring them in redundant local `useEffect` syncs. Component local states (such as form values) are managed strictly within their respective sub-components rather than the parent page.
- **Layout Shift Prevention**: Viewport gutter layouts are managed by declaring `scrollbar-gutter: stable` on the `html` layer, maintaining aligned elements across screens regardless of content height differences.
