import { Routes, Route } from "react-router-dom"
import Home from "./pages/Dashboard/Dashboard"
// import { EmployeeRotaPage, ManagerRotaPage } from "./pages"
import ChildProfileDemo from "./pages/Profiles/Components/Child/childProfileDemo"
import EmployeeRotaPage from "./pages/Rota/Components/Employee/employeeRota"
import ManagerRotaPage from "./pages/Rota/Components/Manager/managerRotaPage"



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rota/employee" element={<EmployeeRotaPage />} />
      <Route path="/rota/manager" element={<ManagerRotaPage />} />
      <Route path="/child/profile" element={<ChildProfileDemo />} />
    </Routes>
  )
}

export default App
