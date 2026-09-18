import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import "jquery-ui-dist/jquery-ui";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import ListaPrecios from "./ListaPrecios";

const SUCURSAL_NRO = 16;

const TomarPrecios = () => {
  const [productos, setProductos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [tipo, setTipo] = useState("Peroquet");
  const navigate = useNavigate();

  const preciosRef = collection(db, "precios_faltantes");

  useEffect(() => {
    const cargarProductos = async () => {
      const productosRef = collection(db, "productos");
      const snapshot = await getDocs(productosRef);

      if (snapshot.empty) {
        setProductos([]);
        $("#descripcion").autocomplete({ source: [] });
        Swal.fire("Sin resultados", "No se encontraron productos cargados", "info");
        return;
      }

      const lista = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const descripcionMayuscula = String(data.descripcion || "").trim().toUpperCase();

        return {
          id: docSnap.id,
          ...data,
          ean: String(data.ean || docSnap.id || "").replace(/\s+/g, ""),
          descripcion: descripcionMayuscula,
          nombre: descripcionMayuscula
        };
      });

      setProductos(lista);

      $("#descripcion").autocomplete({
        source: lista.map((p) => p.nombre),
        select: function (event, ui) {
          setDescripcion(ui.item.value);
          return false;
        }
      });
    };

    cargarProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const descripcionMayuscula = descripcion.trim().toUpperCase();

    if (!descripcionMayuscula || cantidad < 1) {
      Swal.fire("Error", "Completa la descripcion y una cantidad valida", "warning");
      return;
    }

    const producto = productos.find((p) => p.descripcion === descripcionMayuscula);

    if (!producto) {
      Swal.fire("Error", "El producto no existe en la base", "error");
      return;
    }

    try {
      await addDoc(preciosRef, {
        descripcion: producto.descripcion,
        cantidad,
        tipo,
        nro: producto.nro,
        ean: String(producto.ean || "").replace(/\s+/g, ""),
        sucursal: SUCURSAL_NRO
      });

      setDescripcion("");
      setCantidad(1);
      setTipo("Semáforo");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  return (
    <main className="price-entry-page container">
      <header className="price-entry-header d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Precios faltantes</h3>

        <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => navigate("/")}>
          Home
        </button>
      </header>

      <form onSubmit={handleSubmit} className="price-entry-form">
        <div>
          <label className="visually-hidden" htmlFor="descripcion">Descripción</label>
          <input
            id="descripcion"
            type="text"
            className="form-control"
            placeholder="Descripción del producto"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value.toUpperCase())}
            autoComplete="off"
          />
        </div>

        <div className="price-entry-details">
          <div>
            <label className="form-label" htmlFor="cantidad">Cantidad</label>
            <input
              id="cantidad"
              type="number"
              className="form-control"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value || "1", 10))}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="tipo">Tipo</label>
            <select id="tipo" className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Semáforo">Semáforo</option>
              <option value="A4">A4</option>
              <option value="Imágen">Imágen</option>
              <option value="Peroquet">Peroquet</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Agregar
        </button>
      </form>

      <ListaPrecios sucursal={SUCURSAL_NRO} />
    </main>
  );
};

export default TomarPrecios;
