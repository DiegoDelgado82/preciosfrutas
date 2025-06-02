// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProductoCrud from "./components/ProductoCrud";
// (futuros componentes)
import TomarPrecios from "./components/TomarPrecios";
import VerPrecios from "./components/VerPrecios";
import ImportarProductos from "./components/ImportarProductos";
import AgregarProducto from "./components/AgregarProducto";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crud" element={<ProductoCrud />} />
        <Route path="/tomar-precios" element={<TomarPrecios />} />
        <Route path="/ver-precios" element={<VerPrecios />} />
        <Route path="/importar" element={<ImportarProductos />} />
        <Route path="/agregar" element={<AgregarProducto />} />
      </Routes>
    </Router>
  );
}

export default App;
