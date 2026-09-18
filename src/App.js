// src/App.js
import React from "react";
import { HashRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProductoCrud from "./components/ProductoCrud";
// (futuros componentes)
import TomarPrecios from "./components/TomarPrecios";
import AgregarProducto from "./components/AgregarProducto";
import EditarProducto from "./components/EditarProducto";
import ConsultarProducto from "./components/ConsultarProducto";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crud" element={<ProductoCrud />} />
        <Route path="/tomar-precios" element={<TomarPrecios />} />
        <Route path="/agregar" element={<AgregarProducto />} />
        <Route path="/editar" element={<EditarProducto />} />
        <Route path="/consultar-producto" element={<ConsultarProducto />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
