import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      {/* Logo */}
      <div className="mb-3">
        <img
          src="/logo.png" // Reemplazá con tu ruta real
          alt="Logo"
          style={{ maxWidth: "150px", height: "auto" }}
        />
      </div>

      <h2 className="mb-4">Precios Frutas 3.0</h2>

      <div className="d-grid gap-3 col-6 mx-auto">
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/tomar-precios")}>
          Tomar precios faltantes
        </button>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/ver-precios")}>
          Ver precios faltantes
        </button>
        <button className="btn btn-secondary btn-lg" onClick={() => navigate("/agregar")}>
          Agregar producto nuevo
        </button>
        <button className="btn btn-secondary btn-lg" onClick={() => navigate("/importar")}>
          Cargar Archivo JSON
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
