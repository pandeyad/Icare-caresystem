import { Routes, Route, Navigate } from "react-router-dom"
import AppShell from "./app/AppShell"
import Dashboard from "./pages/Dashboard/Dashboard"
import Login from "./pages/Auth/Login"
import SubjectsList from "./pages/Subjects/SubjectsList"
import AuditLog from "./pages/Audit/AuditLog"
import ApprovalsInbox from "./pages/Approvals/ApprovalsInbox"
import TodayShift from "./pages/Professional/TodayShift"
import ChildProfileDemo from "./pages/Profiles/Components/Child/childProfileDemo"
import EmployeeRotaPage from "./pages/Rota/Components/Employee/employeeRota"
import ManagerRotaPage from "./pages/Rota/Components/Manager/managerRotaPage"

/**
 * Route tree:
 *   /login                    — AUTH-001, standalone (no shell)
 *   /                         — MGT-001 Dashboard (inside shell)
 *   /subjects                 — MGT-002 Subjects list
 *   /subjects/:id             — MGT-003 Subject profile (ChildProfileDemo prototype)
 *   /audit                    — MGT-004 Audit log
 *   /approvals                — MGT-006 Approvals inbox
 *   /rota/manager             — Manager rota planner
 *   /rota/me                  — My rota (employee view)
 *   /professional/today       — PRO-001 Today's shift (mobile-first)
 *
 * Everything except /login is wrapped in <AppShell />, which provides the
 * sidebar, topbar, theme, and the content <Outlet>.
 */

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/subjects" element={<SubjectsList />} />
        <Route path="/subjects/:id" element={<ChildProfileDemo />} />
        <Route path="/audit" element={<AuditLog />} />
        <Route path="/approvals" element={<ApprovalsInbox />} />
        <Route path="/rota/manager" element={<ManagerRotaPage />} />
        <Route path="/rota/me" element={<EmployeeRotaPage />} />
        <Route path="/professional/today" element={<TodayShift />} />

        {/* Legacy aliases so old bookmarks still work. */}
        <Route path="/rota/employee" element={<Navigate to="/rota/me" replace />} />
        <Route path="/child/profile" element={<Navigate to="/subjects/demo" replace />} />

        {/* Fallback: anything unknown lands on the dashboard. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
