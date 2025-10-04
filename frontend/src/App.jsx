import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from './pages/RegisterPage'
import AdminLayout from "./pages/AdminLayout";
import RegisterCandidate from "./pages/RegisterCandidateStep";
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import Menu from "./pages/Menu";
import Role from "./pages/Role";
import RoleSelection from "./pages/RoleSelection";
import RolePermission from "./pages/RolePermission";
import CareFacility from "./pages/CareFacility";
import ClientNeeds from "./pages/ClientNeeds";  
import JobTitle from "./pages/JobTitle";
import Skills from "./pages/Skills";
import CandidateInfo from "./pages/CandidateInfo";
import ClientReg from "./pages/ClientReg";
function App() {
  return (
    <Router>
    {/* <AnimatePresence mode="wait"> */}
    <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/candidate" element={<RegisterPage />} />
          <Route path="/candidate/candidate_registration" element={<RegisterCandidate />} />
          <Route path="/" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="menu" element={<Menu />} />
              <Route path="roles" element={<Role />} />
              <Route path="roleselection" element={<RoleSelection />} />
              <Route path="permissions" element={<RolePermission />} />
              <Route path="Job_Master/care_facility" element={<CareFacility />} />
              <Route path="Job_Master/client_needs" element={<ClientNeeds />} />
              <Route path="Job_Master/job_title" element={<JobTitle />} />
              <Route path="Job_Master/skills" element={<Skills />} />
              <Route path="Admin/candidateList" element={<CandidateInfo />} />
          </Route>
              <Route path="Client" element={<ClientReg />} />
      </Routes>
    </Router>
  )
}

export default App
