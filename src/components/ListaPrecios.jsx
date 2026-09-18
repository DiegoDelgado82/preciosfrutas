import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const EditIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" focusable="false">
    <path d="M12.15.85a1.2 1.2 0 0 1 1.7 0l1.3 1.3a1.2 1.2 0 0 1 0 1.7L6.5 12.5 3 13l.5-3.5L12.15.85Zm-1.3 2.7 1.6 1.6.95-.95-1.6-1.6-.95.95ZM5 10.15l-.18 1.03 1.03-.18 5.54-5.54-1.6-1.6L5 10.15Z" />
    <path d="M2 3h5V1.5H2A1.5 1.5 0 0 0 .5 3v11A1.5 1.5 0 0 0 2 15h11a1.5 1.5 0 0 0 1.5-1.5v-5H13v5H2V3Z" />
  </svg>
);

const DeleteIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" focusable="false">
    <path d="M5.5 1A1.5 1.5 0 0 0 4 2.5V3H1.5v1.5h1l.7 9A1.5 1.5 0 0 0 4.7 15h6.6a1.5 1.5 0 0 0 1.5-1.5l.7-9h1V3H12v-.5A1.5 1.5 0 0 0 10.5 1h-5ZM5.5 2.5h5V3h-5v-.5ZM4 4.5h8l-.7 9H4.7l-.7-9ZM6 6v5.5h1.5V6H6Zm2.5 0v5.5H10V6H8.5Z" />
  </svg>
);

const DownloadIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" focusable="false">
    <path d="M7.25 1h1.5v7.2l2.4-2.4 1.05 1.05L8 11.05l-4.2-4.2L4.85 5.8l2.4 2.4V1Z" />
    <path d="M2 10.5h1.5v3h9v-3H14V15H2v-4.5Z" />
  </svg>
);

const ListaPrecios = () => {
  const [precios, setPrecios] = useState([]);
  const [eliminandoTodos, setEliminandoTodos] = useState(false);

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

  const handleDescargarExcel = () => {
    const data = precios.map((p) => ({
      EAN: p.ean,
      CANTIDAD: p.cantidad,
      DESCRIPCION: p.descripcion,
      TIPO: p.tipo,
      NUMERO: p.nro
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Precios");
    XLSX.writeFile(workbook, "precios_faltantes.xlsx");
  };

  const handleEliminarTodos = async () => {
    const primeraConfirmacion = await Swal.fire({
      title: "¿Eliminar todos los precios?",
      text: "Esta acción borrará todos los precios cargados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545"
    });

    if (!primeraConfirmacion.isConfirmed) return;

    const segundaConfirmacion = await Swal.fire({
      title: "Confirmación final",
      text: `Se eliminarán ${precios.length} registros y no se podrán recuperar.`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar todos",
      cancelButtonText: "No, conservarlos",
      confirmButtonColor: "#dc3545",
      reverseButtons: true
    });

    if (!segundaConfirmacion.isConfirmed) return;

    setEliminandoTodos(true);

    try {
      const snapshot = await getDocs(collection(db, "precios_faltantes"));
      await Promise.all(
        snapshot.docs.map((docItem) =>
          deleteDoc(doc(db, "precios_faltantes", docItem.id))
        )
      );

      Swal.fire({
        title: "Eliminados",
        text: "Todos los precios fueron borrados.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron eliminar todos los precios", "error");
    } finally {
      setEliminandoTodos(false);
    }
  };

  return (
    <section className="price-list">
      <div className="price-list-heading">
        <h4>Precios cargados</h4>

        <div className="price-list-tools">
          <button
            type="button"
            className="btn btn-sm btn-success"
            onClick={handleDescargarExcel}
            disabled={precios.length === 0}
            title="Descargar Excel"
          >
            <DownloadIcon />
            <span>Excel</span>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={handleEliminarTodos}
            disabled={precios.length === 0 || eliminandoTodos}
            title="Eliminar todos"
          >
            <DeleteIcon />
            <span>{eliminandoTodos ? "Eliminando..." : "Eliminar todos"}</span>
          </button>
        </div>
      </div>

      {precios.length === 0 ? (
        <p className="text-muted">No hay precios cargados aun.</p>
      ) : (
        <div className="price-table-scroll table-responsive">
          <table className="prices-table table table-bordered align-middle">
            <colgroup>
              <col className="product-column" />
              <col className="quantity-column" />
              <col className="type-column" />
              <col className="actions-column" />
            </colgroup>
            <thead className="table-light">
              <tr>
                <th>PRODUCTO</th>
                <th>CANT</th>
                <th>TIPO</th>
                <th><span className="visually-hidden">Acciones</span></th>
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
                  <td className="price-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-success icon-button"
                      onClick={() => handleEditar(p.id, index)}
                      title="Guardar cambios"
                      aria-label={`Guardar cambios de ${p.descripcion}`}
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger icon-button"
                      onClick={() => handleEliminar(p.id)}
                      title="Eliminar"
                      aria-label={`Eliminar ${p.descripcion}`}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ListaPrecios;
