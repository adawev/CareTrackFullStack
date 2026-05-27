import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import DoctorsPage from "@/pages/DoctorsPage";
import PatientsPage from "@/pages/PatientsPage";
import DiseasesPage from "@/pages/DiseasesPage";
import PatientProfilePage from "@/pages/PatientProfilePage";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ children, roles }) {
  const { user } = useAuth();
  if (roles.includes(user?.role)) return children;
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl mb-4">🚫</div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-sm text-gray-500">You do not have permission to view this page.</p>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/patients" element={<PatientsPage />} />
                <Route path="/diseases" element={<RoleRoute roles={["admin","clinician"]}><DiseasesPage /></RoleRoute>} />
                <Route path="/patients/:id" element={<RoleRoute roles={["admin","clinician"]}><PatientProfilePage /></RoleRoute>} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}
