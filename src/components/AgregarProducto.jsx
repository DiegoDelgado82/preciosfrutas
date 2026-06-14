import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AgregarProducto = () => {
  const [ean, setEan] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nro, setNro] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eanSinEspacios = ean.replace(/\s+/g, "");
    const descripcionMayuscula = descripcion.trim().toUpperCase();

    if (!eanSinEspacios || !descripcionMayuscula || !nro) {
      Swal.fire("Error", "Todos los campos son obligatorios", "warning");
      return;
    }

    try {
      await setDoc(doc(db, "productos", eanSinEspacios), {
        ean: eanSinEspacios,
        descripcion: descripcionMayuscula,
        nro: parseInt(nro),
      });

      Swal.fire("Éxito", "Producto agregado correctamente", "success");
      setEan("");
      setDescripcion("");
      setNro("");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Agregar producto nuevo</h4>
        <button className="btn btn-outline-dark" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">EAN</label>
          <input
            type="text"
            className="form-control"
            value={ean}
            onChange={(e) => setEan(e.target.value.replace(/\s+/g, ""))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <input
            type="text"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nro</label>
          <input
            type="number"
            className="form-control"
            value={nro}
            onChange={(e) => setNro(e.target.value)}
            required
            min={0}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar producto
        </button>
      </form>
    </div>
  );
};

export default AgregarProducto;
