// src/components/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">Gestión de Precios Frescos</h2>
      <div className="d-grid gap-3 col-6 mx-auto">
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/tomar-precios")}>
          Tomar precios faltantes
        </button>
        <button className="btn btn-secondary btn-lg" onClick={() => navigate("/ver-precios")}>
          Ver precios faltantes
        </button>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/importar")}>
          Cargar Archivo JSON
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
