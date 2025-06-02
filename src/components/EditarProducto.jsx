import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const EditarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const navigate = useNavigate();

  // Traer todos los productos una vez
  useEffect(() => {
    const obtenerProductos = async () => {
      const snapshot = await getDocs(collection(db, "productos"));
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(lista);
    };

    obtenerProductos();
  }, []);

  // Filtrar sugerencias en base a la búsqueda
  useEffect(() => {
    if (buscar.trim() === "") {
      setSugerencias([]);
    } else {
      const filtro = productos.filter(p =>
        p.descripcion.toLowerCase().includes(buscar.toLowerCase())
      );
      setSugerencias(filtro.slice(0, 5));
    }
  }, [buscar, productos]);

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setBuscar(producto.descripcion);
    setSugerencias([]);
  };

  const guardarCambios = async () => {
    if (!productoSeleccionado) return;

    try {
      await updateDoc(doc(db, "productos", productoSeleccionado.id), {
        descripcion: productoSeleccionado.descripcion,
        nro: parseInt(productoSeleccionado.nro)
      });

      Swal.fire({
  icon: "success",
  title: "Guardado",
  text: "Producto actualizado correctamente",
  timer: 1000,
  showConfirmButton: false
});
      setBuscar("");
      setProductoSeleccionado(null);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>✏️ Editar producto</h4>
        <button className="btn btn-outline-dark" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </div>

      <div className="mb-3 position-relative">
        <label className="form-label">Buscar producto</label>
        <input
          type="text"
          className="form-control"
          value={buscar}
          onChange={(e) => {
            setBuscar(e.target.value);
            setProductoSeleccionado(null);
          }}
          autoComplete="off"
        />
        {sugerencias.length > 0 && (
          <ul className="list-group position-absolute w-100 z-index-3" style={{ zIndex: 10 }}>
            {sugerencias.map((p) => (
              <li
                key={p.id}
                className="list-group-item list-group-item-action"
                onClick={() => seleccionarProducto(p)}
                style={{ cursor: "pointer" }}
              >
                <strong>{p.ean}</strong> - {p.descripcion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {productoSeleccionado && (
        <div className="mt-4">
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              value={productoSeleccionado.descripcion}
              onChange={(e) =>
                setProductoSeleccionado({ ...productoSeleccionado, descripcion: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nro</label>
            <input
              type="number"
              className="form-control"
              value={productoSeleccionado.nro}
              onChange={(e) =>
                setProductoSeleccionado({ ...productoSeleccionado, nro: e.target.value })
              }
            />
          </div>

          <button className="btn btn-success" onClick={guardarCambios}>
            💾 Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default EditarProducto;
