import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, setDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";

const ImportarProductos = () => {
  const [archivo, setArchivo] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState([]);

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArchivo(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const contenido = JSON.parse(event.target.result);
        if (!Array.isArray(contenido)) throw new Error("El JSON no contiene un array de productos.");

        setVistaPrevia(contenido.slice(0, 5)); // Mostrar los primeros 5 para vista previa
      } catch (error) {
        Swal.fire("Error", "El archivo no es un JSON válido o tiene formato incorrecto.", "error");
        setArchivo(null);
        setVistaPrevia([]);
      }
    };

    reader.readAsText(file);
  };

  const handleSubir = async () => {
    if (!archivo) return Swal.fire("Error", "No se ha seleccionado ningún archivo", "warning");

    const confirm = await Swal.fire({
      title: "¿Cargar productos?",
      text: "Se sobrescribirán los productos existentes con el mismo EAN.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cargar"
    });

    if (!confirm.isConfirmed) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const contenido = JSON.parse(event.target.result);

        const promises = contenido.map((prod) =>
          setDoc(doc(db, "productos", prod.ean), {
            ean: prod.ean,
            descripcion: prod.descripcion,
            nro: prod.nro
          })
        );

        await Promise.all(promises);
        Swal.fire("¡Cargado!", "Los productos fueron subidos exitosamente.", "success");
        setArchivo(null);
        setVistaPrevia([]);
      } catch (error) {
        Swal.fire("Error", "No se pudo completar la carga.", "error");
      }
    };

    reader.readAsText(archivo);
  };

  return (
    <div className="container mt-4">
      <h4>📦 Importar productos desde archivo JSON</h4>

      <div className="mb-3">
        <input type="file" accept=".json" className="form-control" onChange={handleArchivo} />
      </div>

      {vistaPrevia.length > 0 && (
        <div className="alert alert-info">
          <strong>Vista previa:</strong>
          <ul className="mb-0">
            {vistaPrevia.map((prod, i) => (
              <li key={i}>
                <strong>{prod.ean}</strong> - {prod.descripcion} (NRO: {prod.nro})
              </li>
            ))}
          </ul>
        </div>
      )}

      {archivo && (
        <button className="btn btn-primary" onClick={handleSubir}>
          🚀 Cargar productos en Firebase
        </button>
      )}
    </div>
  );
};

export default ImportarProductos;
