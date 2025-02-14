// src/App.jsx
import React from "react";
import MedicalReportForm from "./components/MedicalReportForm";
import "./styles/report.css";

function App() {
  return (
    <div className="container-fluid py-4">
      <header className="text-center mb-4">
        <img
          src={`${import.meta.env.BASE_URL}images/Logo_HC.png`}
          alt="Hospital_Central"
          className="logo d-print-none"
          style={{ maxWidth: "200px" }}
        />
        <h1 className="h3 mt-3">Sistema de Informes Médicos</h1>
      </header>

      <MedicalReportForm />

      <footer className="text-center mt-4 py-3 d-print-none">
        <p className="text-muted">
          © 2025 Hospital Central - Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}

export default App;
