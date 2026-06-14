import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";

const obtenerPlu = (ean) => {
  if ((ean.startsWith("23") || ean.startsWith("25")) && ean.length >= 7) {
    return ean.slice(2, 7);
  }

  return "";
};

const normalizarProducto = (docSnap) => {
  const data = docSnap.data();

  return {
    id: docSnap.id,
    ...data,
    ean: String(data.ean || docSnap.id || "").replace(/\s+/g, ""),
    descripcion: String(data.descripcion || "").trim().toUpperCase()
  };
};

const ConsultarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarProductos = async () => {
      const snapshot = await getDocs(collection(db, "productos"));
      setProductos(snapshot.docs.map(normalizarProducto));
    };

    cargarProductos();
  }, []);

  const sugerencias = useMemo(() => {
    const busqueda = descripcion.trim().toLowerCase();
    if (!busqueda || productoSeleccionado) return [];

    return productos
      .filter((producto) => producto.descripcion.toLowerCase().includes(busqueda))
      .slice(0, 8);
  }, [descripcion, productoSeleccionado, productos]);

  const plu = useMemo(
    () => (productoSeleccionado ? obtenerPlu(productoSeleccionado.ean) : ""),
    [productoSeleccionado]
  );

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setDescripcion(producto.descripcion);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Consultar producto</h4>
        <button className="btn btn-outline-dark" onClick={() => navigate("/")}>
          Home
        </button>
      </div>

      <div className="mb-3 position-relative">
        <label className="form-label">Descripcion</label>
        <input
          type="text"
          className="form-control"
          value={descripcion}
          onChange={(e) => {
            setDescripcion(e.target.value.toUpperCase());
            setProductoSeleccionado(null);
          }}
          autoFocus
          autoComplete="off"
        />

        {sugerencias.length > 0 && (
          <ul className="list-group position-absolute w-100" style={{ zIndex: 10 }}>
            {sugerencias.map((producto) => (
              <li
                key={producto.id}
                className="list-group-item list-group-item-action"
                onClick={() => seleccionarProducto(producto)}
                style={{ cursor: "pointer" }}
              >
                {producto.descripcion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {productoSeleccionado && (
        <div className="alert alert-info">
          <div>
            <strong>EAN:</strong> {productoSeleccionado.ean}
          </div>
          {plu && (
            <div>
              <strong>PLU:</strong> {plu}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultarProducto;
