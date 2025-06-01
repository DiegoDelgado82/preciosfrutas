// src/components/ListaPrecios.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Swal from "sweetalert2";

const ListaPrecios = () => {
  const [precios, setPrecios] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "precios_faltantes"), (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPrecios(lista);
    });

    return () => unsubscribe();
  }, []);

  const handleEditar = async (id, index) => {
    const cantidad = parseInt(document.getElementById(`cantidad-${index}`).value);
    const tipo = document.getElementById(`tipo-${index}`).value;

    if (cantidad < 1) {
      Swal.fire("Error", "La cantidad debe ser mayor a 0", "error");
      return;
    }

    const docRef = doc(db, "precios_faltantes", id);
    await updateDoc(docRef, { cantidad, tipo });
    Swal.fire("Actualizado", "Registro modificado correctamente", "success");
  };

  const handleEliminar = async (id) => {
    const confirmar1 = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Este registro será eliminado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar"
    });

    if (!confirmar1.isConfirmed) return;

    const confirmar2 = await Swal.fire({
      title: "¿Eliminar definitivamente?",
      text: "Esta acción no se puede deshacer",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Eliminar"
    });

    if (confirmar2.isConfirmed) {
      await deleteDoc(doc(db, "precios_faltantes", id));
      Swal.fire("Eliminado", "Registro borrado", "success");
    }
  };

  return (
    <div className="mt-5">
      <h4 className="mb-3">🔎 Precios cargados</h4>

      {precios.length === 0 ? (
        <p className="text-muted">No hay precios cargados aún.</p>
      ) : (
        <div className="table-responsive">
  <table className="table table-bordered align-middle">
    <thead className="table-light">
      <tr>
        <th>PRODUCTO</th>
        <th>NRO</th>
        <th>CANT</th>
        <th>TIPO</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {precios.map((p, index) => (
        <tr key={p.id}>
          <td>
            <strong>{p.ean}</strong><br />
            <small>{p.descripcion}</small>
          </td>
          <td>{p.nro}</td>
          <td>
            <input
              type="number"
              id={`cantidad-${index}`}
              className="form-control"
              defaultValue={p.cantidad}
              min="1"
            />
          </td>
          <td>
            <select
              id={`tipo-${index}`}
              className="form-select"
              defaultValue={p.tipo}
            >
              <option value="A4">A4</option>
              <option value="Semáforo">Semáforo</option>
              <option value="Imágen">Imágen</option>
              <option value="Peroquet">Peroquet</option>
            </select>
          </td>
          <td>
            <button
              className="btn btn-sm btn-success me-2"
              onClick={() => handleEditar(p.id, index)}
              title="Editar"
            >
              ✏️
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleEliminar(p.id)}
              title="Eliminar"
            >
              🗑️
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      )}
    </div>
  );
};

export default ListaPrecios;
