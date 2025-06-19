import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import "jquery-ui-dist/jquery-ui";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import ListaPrecios from "./ListaPrecios";

const TomarPrecios = () => {
  const [productos, setProductos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [tipo, setTipo] = useState("Semáforo");

  const navigate = useNavigate();

  const preciosRef = collection(db, "precios_faltantes");
  const productosRef = collection(db, "productos");

  useEffect(() => {
    const cargarProductos = async () => {
      const snapshot = await getDocs(productosRef);
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        nombre: doc.data().descripcion.toUpperCase()
      }));

      setProductos(lista);

      $("#descripcion").autocomplete({
        source: lista.map(p => p.nombre),
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

    if (!descripcion || cantidad < 1) {
      Swal.fire("Error", "Completá la descripción y una cantidad válida", "warning");
      return;
    }

    const producto = productos.find(p => p.descripcion === descripcion.toUpperCase());
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
        ean: producto.ean
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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Precios faltantes</h3>
        <button className="btn btn-outline-dark" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </div>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-5">
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
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value))}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          > 
            <option value="Semáforo">Semáforo</option>
            <option value="A4">A4</option>
            <option value="Imágen">Imágen</option>
            <option value="Peroquet">Peroquet</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">Agregar</button>
        </div>
      </form>
      <ListaPrecios />
    </div>
  );
};

export default TomarPrecios;
