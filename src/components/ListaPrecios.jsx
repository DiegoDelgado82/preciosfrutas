import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Swal from "sweetalert2";

const ListaPrecios = () => {
  const [precios, setPrecios] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "precios_faltantes"), (snapshot) => {
      const lista = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setPrecios(lista);
    });

    return () => unsubscribe();
  }, []);

  const handleEditar = async (id, index) => {
    const cantidad = parseInt(document.getElementById(`cantidad-${index}`).value, 10);
    const tipo = document.getElementById(`tipo-${index}`).value;

    if (cantidad < 1) {
      Swal.fire("Error", "La cantidad debe ser mayor a 0", "error");
      return;
    }

    const docRef = doc(db, "precios_faltantes", id);
    await updateDoc(docRef, { cantidad, tipo });
    Swal.fire({
      title: "Actualizado",
      text: "Registro modificado correctamente",
      icon: "success",
      timer: 500,
      showConfirmButton: false
    });
  };

  const handleEliminar = async (id) => {
    try {
      await deleteDoc(doc(db, "precios_faltantes", id));
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Precio eliminado",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar el registro", "error");
    }
  };

  return (
    <div className="mt-5">
      <h4 className="mb-3">Precios cargados</h4>

      {precios.length === 0 ? (
        <p className="text-muted">No hay precios cargados aun.</p>
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
                    <strong>{p.ean}</strong>
                    <br />
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
                    <select id={`tipo-${index}`} className="form-select" defaultValue={p.tipo}>
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
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminar(p.id)}
                      title="Eliminar"
                    >
                      Eliminar
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
