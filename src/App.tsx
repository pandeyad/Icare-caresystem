import { Routes, Route, Navigate, useParams } from "react-router-dom"
import AppShell from "./app/AppShell"
import Login from "./pages/Auth/Login"
import MyDashboard from "./pages/Me/MyDashboard"
import CalendarView from "./pages/Calendar/CalendarView"
import TeamOverview from "./pages/Team/TeamOverview"
import HomesList from "./pages/Homes/HomesList"
import ClientsList from "./pages/Clients/ClientsList"
import ClientDetail from "./pages/Clients/ClientDetail"
import ManageHub from "./pages/Manage/ManageHub"
import AuditLog from "./pages/Audit/AuditLog"
import MetricsView from "./pages/Metrics/MetricsView"
import RotaView from "./pages/Rota/RotaView"
import SettingsPage from "./pages/Settings/SettingsPage"

/**
 * Route tree — v2 IA (7 workspaces, flat).
 *
 *   /login                 — AUTH-001, standalone (no shell)
 *
 *   /me                    — ME-001   My Dashboard
 *   /calendar              — CAL-001  Calendar (month / day)
 *   /team                  — TEAM-001 Team overview
 *   /homes                 — HOME-001 Homes list + detail
 *   /clients               — CLIENT-001 Clients list + detail
 *   /manage                — MANAGE-001 Overrides / Approvals / Permissions hub
 *   /audit                 — AUDIT-001 Audit feed
 *
 * Every page is accessible to every authenticated user. What changes is
 * the *content* — pages scope data and features internally through
 * `useAuth().can(perm)`. No RequirePermission wrappers on routes.
 */

/** Preserves :id when redirecting /subjects/:id → /clients/:id */
const SubjectRedirect = () => {
  const { id } = useParams<{ id: string }>()
  return <Navigate to={`/clients/${id}`} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/me" replace />} />

        <Route path="/me" element={<MyDashboard />} />
        <Route path="/metrics" element={<MetricsView />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/team" element={<TeamOverview />} />
        <Route path="/homes" element={<HomesList />} />
        <Route path="/clients" element={<ClientsList />} />
        <Route path="/clients/:id" element={<ClientDetail />} />
        <Route path="/manage" element={<ManageHub />} />
        <Route path="/audit" element={<AuditLog />} />
        <Route path="/rota" element={<RotaView />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Legacy aliases — old foundation-v1 paths redirect to v2 paths. */}
        <Route path="/rota/me" element={<Navigate to="/me" replace />} />
        <Route path="/rota/employee" element={<Navigate to="/me" replace />} />
        <Route path="/rota/manager" element={<Navigate to="/team" replace />} />
        <Route path="/professional/today" element={<Navigate to="/me" replace />} />
        <Route path="/approvals" element={<Navigate to="/manage" replace />} />
        <Route path="/subjects" element={<Navigate to="/clients" replace />} />
        <Route path="/subjects/:id" element={<SubjectRedirect />} />
        <Route path="/child/profile" element={<Navigate to="/clients" replace />} />

        <Route path="*" element={<Navigate to="/me" replace />} />
      </Route>
    </Routes>
  )
}

export default App
