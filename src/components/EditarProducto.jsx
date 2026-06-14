import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const EditarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProductos = async () => {
      const snapshot = await getDocs(collection(db, "productos"));
      const lista = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setProductos(lista);
    };

    obtenerProductos();
  }, []);

  useEffect(() => {
    if (buscar.trim() === "") {
      setSugerencias([]);
      return;
    }

    const busqueda = buscar.toLowerCase();
    const filtro = productos.filter((p) => {
      const descripcion = (p.descripcion || "").toLowerCase();
      const ean = (p.ean || p.id || "").toLowerCase();
      const nro = String(p.nro || "").toLowerCase();
      return descripcion.includes(busqueda) || ean.includes(busqueda) || nro.includes(busqueda);
    });
    setSugerencias(filtro.slice(0, 5));
  }, [buscar, productos]);

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado({
      ...producto,
      ean: producto.ean || producto.id,
      eanOriginal: producto.id
    });
    setBuscar(producto.descripcion || "");
    setSugerencias([]);
  };

  const actualizarCampo = (campo, valor) => {
    const valorActualizado =
      campo === "descripcion" ? valor.toUpperCase() : campo === "ean" ? valor.replace(/\s+/g, "") : valor;

    setProductoSeleccionado((producto) => ({
      ...producto,
      [campo]: valorActualizado
    }));
  };

  const guardarCambios = async () => {
    if (!productoSeleccionado) return;

    const ean = String(productoSeleccionado.ean || "").replace(/\s+/g, "");
    const descripcion = String(productoSeleccionado.descripcion || "").trim().toUpperCase();
    const nro = parseInt(productoSeleccionado.nro, 10);
    const eanOriginal = productoSeleccionado.eanOriginal || productoSeleccionado.id;

    if (!ean || !descripcion || Number.isNaN(nro)) {
      Swal.fire("Error", "EAN, descripcion y nro son obligatorios", "warning");
      return;
    }

    if (ean !== eanOriginal && productos.some((p) => p.id === ean || p.ean === ean)) {
      Swal.fire("Error", "Ya existe un producto con ese EAN", "warning");
      return;
    }

    const datosActualizados = {
      ean,
      descripcion,
      nro
    };

    try {
      if (ean === eanOriginal) {
        await updateDoc(doc(db, "productos", eanOriginal), datosActualizados);
      } else {
        await setDoc(doc(db, "productos", ean), datosActualizados);
        await deleteDoc(doc(db, "productos", eanOriginal));
      }

      setProductos((prev) =>
        prev
          .filter((p) => p.id !== eanOriginal)
          .concat({ id: ean, ...datosActualizados })
      );

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
        <h4>Editar producto</h4>
        <button className="btn btn-outline-dark" onClick={() => navigate("/")}>
          Home
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
                <strong>{p.ean || p.id}</strong> - {p.descripcion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {productoSeleccionado && (
        <div className="mt-4">
          <div className="mb-3">
            <label className="form-label">EAN</label>
            <input
              type="text"
              className="form-control"
              value={productoSeleccionado.ean}
              onChange={(e) => actualizarCampo("ean", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descripcion</label>
            <input
              type="text"
              className="form-control"
              value={productoSeleccionado.descripcion}
              onChange={(e) => actualizarCampo("descripcion", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nro</label>
            <input
              type="number"
              className="form-control"
              value={productoSeleccionado.nro}
              onChange={(e) => actualizarCampo("nro", e.target.value)}
            />
          </div>

          <button className="btn btn-success" onClick={guardarCambios}>
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default EditarProducto;
