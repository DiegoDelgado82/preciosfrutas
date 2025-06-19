import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const VerPrecios = () => {
  const [precios, setPrecios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "precios_faltantes"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPrecios(data);
  };

  const handleEliminarTodos = async () => {
  const confirm = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Se eliminarán todos los precios cargados.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (!confirm.isConfirmed) return;

  const querySnapshot = await getDocs(collection(db, "precios_faltantes"));
  const batchDeletes = querySnapshot.docs.map((docItem) =>
    deleteDoc(doc(db, "precios_faltantes", docItem.id))
  );

  await Promise.all(batchDeletes);

  Swal.fire({
    title: "Eliminado",
    text: "Todos los precios fueron borrados",
    icon: "success",
    timer: 500,
    showConfirmButton: false
  });

  setPrecios([]);
};


  const handleDescargarExcel = () => {
    const data = precios.map((p) => ({
      EAN: p.ean,
      CANTIDAD: p.cantidad,
      DESCRIPCION: p.descripcion,
      TIPO: p.tipo,
      NUMERO: p.nro,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Precios");

    XLSX.writeFile(workbook, "precios_faltantes.xlsx");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Precios tomados</h3>
        <button className="btn btn-outline-dark" onClick={() => navigate("/")}>
          🏠 Home
        </button>
      </div>

      {precios.length === 0 ? (
        <p className="text-muted">No hay precios cargados.</p>
      ) : (
        <>
          <div className="mb-3 d-flex flex-wrap gap-2">
            <button
              className="btn btn-danger"
              onClick={handleEliminarTodos}
              title="Eliminar todos"
            >
              🗑️ Eliminar todos
            </button>
            <button
              className="btn btn-success"
              onClick={handleDescargarExcel}
              title="Descargar Excel"
            >
              🧾 Descargar Excel
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>PRODUCTO</th>
                  <th>NRO</th>
                  <th>CANT</th>
                  <th>TIPO</th>
                </tr>
              </thead>
              <tbody>
                {precios.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.ean}</strong>
                      <br />
                      <small>{p.descripcion}</small>
                    </td>
                    <td>{p.nro}</td>
                    <td>{p.cantidad}</td>
                    <td>{p.tipo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default VerPrecios;
