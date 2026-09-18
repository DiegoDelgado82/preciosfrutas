import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <main className="dashboard-page container text-center">
      <div className="dashboard-logo">
        <img
          src="/logo.png"
          alt="Logo"
        />
      </div>

      <h2>Precios Frutas 3.0</h2>

      <div className="dashboard-actions d-grid mx-auto">
        <button className="btn btn-primary" onClick={() => navigate("/tomar-precios")}>
          Tomar precios faltantes
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/agregar")}>
          Agregar producto nuevo
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/editar")}>
          Editar Producto
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/consultar-producto")}>
          Consultar producto
        </button>
      </div>
    </main>
  );
};

export default Dashboard;
