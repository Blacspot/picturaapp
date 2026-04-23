import { useState } from "react";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import Dashboard from "./components/dashboard/Dashboard";
import { api } from "./api/api";

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  const handleLogin = async (firebaseUser) => {
    try {
      await api.register(
        firebaseUser.idToken,
        firebaseUser.displayName,
        firebaseUser.email
      );
    } catch {}

    setUser(firebaseUser);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

  const handleSessionExpired = () => {
    setUser(null);
    setPage('login');
  };

  return (
    <div className="app-root">
      <div className="grid-bg"/>
      <div className="glow-orb"/>
      <div className="glow-orb-2"/>

      {page === "signup" && (
        <SignupPage 
          onSignup={handleLogin}
          onGoLogin={() => setPage("login")}
        />
      )}

      {page === "login" && (
        <LoginPage
          onLogin={handleLogin}
          onGoSignup={() => setPage("signup")}
        />
      )}

      {page === "dashboard" && user && (
        <Dashboard
         user={user} 
         onLogout={handleLogout}
         onSessionExpired={handleSessionExpired}
         />
      )}
    </div>
  );
}