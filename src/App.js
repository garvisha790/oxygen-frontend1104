import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainDashboard from "./pages/MainDashboard";
import PlantDashboard from "./pages/PlantDashboard";
import DeviceDashboard from "./pages/DeviceDashboard";  
import TelemetryDashboard from "./pages/TelemetryDashboard";  // ✅ Import Telemetry Dashboard
import { AuthContext, AuthProvider } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/plant-dashboard"
            element={
              <PrivateRoute>
                <PlantDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/device-dashboard"
            element={
              <PrivateRoute>
                <DeviceDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/telemetry-dashboard"   // ✅ Telemetry Dashboard Route added
            element={
              <PrivateRoute>
                <TelemetryDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;