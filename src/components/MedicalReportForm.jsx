import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";

// Agregar esta constante al inicio del archivo, después de las importaciones
const MEDICOS = [
  {
    nombre: "Campoy, Daniel",
    matricula: "5249",
    rubrica: "/rubricas/campoy.png",
  },
  {
    nombre: "La Salvia, Daniela",
    matricula: "10439",
    rubrica: "/rubricas/lasalvia.png",
  },
  {
    nombre: "Carvajal, Ariel",
    matricula: "10933",
    rubrica: "/rubricas/carvajal.png",
  },
  // Puedes agregar más médicos aquí
];

const MedicalReportForm = () => {
  const initialState = {
    fecha: new Date().toISOString().split("T")[0],
    paciente: "",
    documento: "",
    edad: "",
    obraSocial: "",
    obraSocialNumero: "",
    tipoEstudio: "alta", // Agregamos el nuevo campo con valor por defecto
    // Campos para endoscopia alta
    esofago:
      "Sin lesiones mucosas. Calibre conservado. Cambio mucoso a 36 cm de ADS, impronta hiatal a 38 cm de ADS. Conformando hernia hiatal por deslizamiento de 2cm.",
    estomago:
      "Lago mucoso claro. Cardias complaciente.\nTecho, cuerpo y antro sin lesiones mucosas.\nPíloro céntrico y permeable.",
    duodeno: "Bulbo y segunda porción sin lesiones mucosas.",

    estudio: "VIDEOCOLONOSCOPIA",
    medicoSolicitante: "",
    motivo: "",
    inspeccionAnal: "Sin lesiones.",
    tactoRectal: {
      esfinter: "normotónico, paredes lisas",
      ampolla: "vacía",
      dedoGuante: "dedo de guante limpio",
    },
    videocolonoscopia:
      "Se avanza hasta ciego, reconociendo estructuras, con intubación cecal. En todo el trayecto recorrido no se visualizan lesiones sobreelevadas ni estenosantes de la luz. Patrón mucoso y vascular conservado.",
    escalaBoston: {
      total: "",
      colonDerecho: "",
      colonTransverso: "",
      colonIzquierdo: "",
    },
    biopsias: "NO",
    anestesia: "NO",
    anestesiologo: "",
    diagnostico: "",
    medico: {
      nombre: "",
      matricula: "",
    },
    imagenes: [null, null, null, null, null, null], // Array con 6 posiciones inicializadas como null
  };

  const [formData, setFormData] = useState(initialState);
  const [showResetButton, setShowResetButton] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [logoBase64, setLogoBase64] = useState("");
  // Agregar estado para las imágenes en base64
  const [imagenesBase64, setImagenesBase64] = useState(Array(6).fill(null));

  // En el useEffect inicial, carga las imágenes guardadas
  useEffect(() => {
    const savedData = localStorage.getItem("medicalReportForm");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      if (parsedData.imagenes) {
        setImagenesBase64(parsedData.imagenes);
      }
      // Cargar la rúbrica si hay un médico seleccionado
      if (parsedData.medico && parsedData.medico.nombre) {
        const medicoSeleccionado = MEDICOS.find(
          (medico) => medico.nombre === parsedData.medico.nombre
        );
        if (medicoSeleccionado) {
          cargarRubrica(medicoSeleccionado.rubrica);
        }
      }
      setShowResetButton(true);
      setShowHeader(true);
    }
  }, []);

  //Logo

  useEffect(() => {
    // Cargar y convertir el logo a base64 cuando el componente se monta
    const loadLogo = async () => {
      try {
        const response = await fetch("/Logo_HC.png");
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoBase64(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error loading logo:", error);
      }
    };

    loadLogo();
  }, []);

  // Modificar el useEffect para actualizar el campo estudio según el tipo
  useEffect(() => {
    if (formData.tipoEstudio === "alta") {
      setFormData((prev) => ({
        ...prev,
        estudio: "VIDEOENDOSCOPIA DIGESTIVA ALTA",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        estudio: "VIDEOCOLONOSCOPIA",
      }));
    }
  }, [formData.tipoEstudio]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };

      // Limpiar anestesiólogo si anestesia es NO
      if (name === "anestesia" && value === "NO") {
        newData.anestesiologo = "";
      }
      localStorage.setItem("medicalReportForm", JSON.stringify(newData));
      return newData;
    });
  };

  // Agregar esta función de utilidad
  const cargarRubrica = async (rubricaPath) => {
    try {
      const response = await fetch(rubricaPath);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setRubricaBase64(reader.result);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error cargando la rúbrica:", error);
    }
  };
  // Para la selección del médico
  // Agregar este estado junto a los otros estados del componente
  const [rubricaBase64, setRubricaBase64] = useState("");

  // Modificar handleMedicoChange para usar la nueva función
  const handleMedicoChange = async (e) => {
    const medicoSeleccionado = MEDICOS.find(
      (medico) => medico.nombre === e.target.value
    );
    if (medicoSeleccionado) {
      cargarRubrica(medicoSeleccionado.rubrica);
      setFormData((prev) => {
        const newData = {
          ...prev,
          medico: {
            nombre: medicoSeleccionado.nombre,
            matricula: medicoSeleccionado.matricula,
            rubrica: medicoSeleccionado.rubrica,
          },
        };
        localStorage.setItem("medicalReportForm", JSON.stringify(newData));
        return newData;
      });
    }
  };

  // Función para manejar la carga de imágenes
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenesBase64((prev) => {
          const newImages = [...prev];
          newImages[index] = reader.result;
          return newImages;
        });

        // Guardar en el estado del formulario
        setFormData((prev) => {
          const newImagenes = [...(prev.imagenes || Array(6).fill(null))]; // Aseguramos que existe el array
          newImagenes[index] = reader.result;
          return {
            ...prev,
            imagenes: newImagenes,
          };
        });

        // Actualizar localStorage
        const updatedFormData = {
          ...formData,
          imagenes: formData.imagenes.map((img, i) =>
            i === index ? reader.result : img
          ),
        };
        localStorage.setItem(
          "medicalReportForm",
          JSON.stringify(updatedFormData)
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para eliminar una imagen
  const handleRemoveImage = (index) => {
    setImagenesBase64((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });

    setFormData((prev) => {
      const newImagenes = [...prev.imagenes];
      newImagenes[index] = null;
      const newData = {
        ...prev,
        imagenes: newImagenes,
      };
      localStorage.setItem("medicalReportForm", JSON.stringify(newData));
      return newData;
    });
  };

  const handleNestedInputChange = (category, field, value) => {
    // Si el campo es parte de la escala Boston, asegurar que sea numérico y entre 0-3
    if (category === "escalaBoston" && field !== "total") {
      // Validar que el valor sea un número entre 0 y 3
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 3) {
        return; // No permitir valores inválidos
      }
    }
    setFormData((prev) => {
      const newData = {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value,
        },
      };
      // Si el cambio es en algún campo de la escala Boston, calcular el total
      if (category === "escalaBoston" && field !== "total") {
        // Obtener los valores actualizados
        const values = {
          colonDerecho:
            field === "colonDerecho"
              ? parseInt(value)
              : parseInt(prev.escalaBoston.colonDerecho) || 0,
          colonTransverso:
            field === "colonTransverso"
              ? parseInt(value)
              : parseInt(prev.escalaBoston.colonTransverso) || 0,
          colonIzquierdo:
            field === "colonIzquierdo"
              ? parseInt(value)
              : parseInt(prev.escalaBoston.colonIzquierdo) || 0,
        };

        // Calcular el total
        const total =
          values.colonDerecho + values.colonTransverso + values.colonIzquierdo;

        // Actualizar el total en el estado
        newData.escalaBoston.total = total.toString();
      }
      localStorage.setItem("medicalReportForm", JSON.stringify(newData));
      return newData;
    });
  };

  const generatePDF = async () => {
    if (
      !formData.paciente ||
      !formData.documento ||
      !formData.medico.matricula
    ) {
      alert(
        "Por favor complete al menos el nombre del paciente documento y médico interviniente"
      );
      return;
    }

    const element = document.getElementById("report-template");
    element.classList.remove("d-none");

    const filename = `${formData.paciente}_${formData.documento}.pdf`;

    const opt = {
      margin: 1,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        logging: true,
        useCORS: true,
      },
      jsPDF: {
        unit: "cm",
        format: "a4",
        orientation: "portrait",
      },
    };

    try {
      await html2pdf().set(opt).from(element).save();
      setShowResetButton(true);
      setShowHeader(true);
      // Scroll al inicio de la página
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error generando PDF:", error);
    } finally {
      element.classList.add("d-none");
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setRubricaBase64(""); // Limpiar la rúbrica
    setImagenesBase64(Array(6).fill(null)); // Limpiar las imágenes
    localStorage.removeItem("medicalReportForm");
    setShowResetButton(false);
    setShowHeader(false);
  };

  return (
    <div className="container">
      {showHeader && (
        <div className="pdf-header mb-4 p-4 bg-light border rounded">
          <div className="d-flex align-items-center">
            <img
              src="/Logo_HC.png"
              alt="Hospital_Central"
              className="logo me-4"
              style={{ maxWidth: "100px" }}
            />
            <div>
              <h3 className="mb-2">{formData.paciente}</h3>
              <p className="mb-1">Documento: {formData.documento}</p>
              <p className="mb-1">Fecha: {formData.fecha}</p>
              <p className="mb-0">Obra Social: {formData.obraSocial}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Informe Endoscópico</h2>
          {showResetButton && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={resetForm}
            >
              Limpiar formulario
            </button>
          )}
        </div>

        <form className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-8">
            <label className="form-label">Paciente</label>
            <input
              type="text"
              className="form-control"
              name="paciente"
              value={formData.paciente}
              onChange={handleInputChange}
              placeholder="Apellido, Nombre"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Documento</label>
            <input
              type="text"
              className="form-control"
              name="documento"
              value={formData.documento}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Edad</label>
            <input
              type="number"
              className="form-control"
              name="edad"
              value={formData.edad}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Obra Social</label>
            <input
              type="text"
              className="form-control"
              name="obraSocial"
              value={formData.obraSocial}
              onChange={handleInputChange}
            />
          </div>
          {/* Número de Obra Social */}
          <div className="col-md-4">
            <label className="form-label">Número de Obra Social</label>
            <input
              type="text"
              className="form-control"
              name="obraSocialNumero"
              value={formData.obraSocialNumero}
              onChange={handleInputChange}
            />
          </div>
          {/* Médico Solicitante */}
          <div className="col-md-6">
            <label className="form-label">Médico Solicitante</label>
            <input
              type="text"
              className="form-control"
              name="medicoSolicitante"
              value={formData.medicoSolicitante}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Motivo</label>
            <input
              type="text"
              className="form-control"
              name="motivo"
              value={formData.motivo}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label d-block">Tipo de Estudio</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="tipoEstudio"
                id="endoscopiaAlta"
                value="alta"
                checked={formData.tipoEstudio === "alta"}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="endoscopiaAlta">
                Endoscopia alta
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="tipoEstudio"
                id="endoscopiaBaja"
                value="baja"
                checked={formData.tipoEstudio === "baja"}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="endoscopiaBaja">
                Endoscopia baja
              </label>
            </div>
          </div>
          {/* Estudio */}
          <div className="col-md-8">
            <label className="form-label">Estudio</label>
            <input
              type="text"
              className="form-control"
              name="estudio"
              value={formData.estudio}
              onChange={handleInputChange}
            />
          </div>
          {/* Después del campo de motivo y tipo de estudio */}

          {formData.tipoEstudio === "baja" ? (
            // Campos para endoscopia baja
            <>
              <div className="col-12">
                <label className="form-label">Inspección Anal</label>
                <textarea
                  className="form-control"
                  name="inspeccionAnal"
                  value={formData.inspeccionAnal}
                  onChange={handleInputChange}
                  rows="2"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Esfínter</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.tactoRectal.esfinter}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "tactoRectal",
                      "esfinter",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Ampolla Rectal</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.tactoRectal.ampolla}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "tactoRectal",
                      "ampolla",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Dedo de Guante</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.tactoRectal.dedoGuante}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "tactoRectal",
                      "dedoGuante",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-12">
                <label className="form-label">Videocolonoscopia</label>
                <textarea
                  className="form-control"
                  name="videocolonoscopia"
                  value={formData.videocolonoscopia}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Colon Derecho</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  className="form-control"
                  value={formData.escalaBoston.colonDerecho}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "escalaBoston",
                      "colonDerecho",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Colon Transverso</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  className="form-control"
                  value={formData.escalaBoston.colonTransverso}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "escalaBoston",
                      "colonTransverso",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Colon Izquierdo</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  className="form-control"
                  value={formData.escalaBoston.colonIzquierdo}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "escalaBoston",
                      "colonIzquierdo",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Boston Total</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.escalaBoston.total}
                  readOnly
                  disabled
                />
              </div>
            </>
          ) : (
            // Campos para endoscopia alta
            <>
              <div className="col-12">
                <label className="form-label">Esófago</label>
                <textarea
                  className="form-control"
                  name="esofago"
                  value={formData.esofago}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Estómago</label>
                <textarea
                  className="form-control"
                  name="estomago"
                  value={formData.estomago}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Duodeno</label>
                <textarea
                  className="form-control"
                  name="duodeno"
                  value={formData.duodeno}
                  onChange={handleInputChange}
                  rows="2"
                />
              </div>
            </>
          )}
          {/* Antes de la sección del anestesiólogo, agregar: */}
          <div className="col-md-3">
            <label className="form-label">Biopsias</label>
            <select
              className="form-select"
              name="biopsias"
              value={formData.biopsias}
              onChange={handleInputChange}
            >
              <option value="NO">NO</option>
              <option value="SI">SI</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Anestesia</label>
            <select
              className="form-select"
              name="anestesia"
              value={formData.anestesia}
              onChange={handleInputChange}
            >
              <option value="NO">NO</option>
              <option value="SI">SI</option>
            </select>
          </div>
          {formData.anestesia === "SI" && (
            <div className="col-md-6">
              <label className="form-label">Anestesiólogo</label>
              <input
                type="text"
                className="form-control"
                name="anestesiologo"
                value={formData.anestesiologo}
                onChange={handleInputChange}
              />
            </div>
          )}
          {/* Reemplazar los campos de médico y matrícula por: */}
          <div className="col-md-6">
            <label className="form-label">Médico interviniente</label>
            <select
              className="form-select"
              value={formData.medico.nombre}
              onChange={handleMedicoChange}
            >
              <option value="">Seleccione un médico</option>
              {MEDICOS.map((medico) => (
                <option key={medico.matricula} value={medico.nombre}>
                  {medico.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Matrícula</label>
            <input
              type="text"
              className="form-control"
              value={formData.medico.matricula}
              readOnly
              disabled
            />
          </div>
          <div className="col-12">
            <label className="form-label">Diagnóstico</label>
            <textarea
              className="form-control"
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleInputChange}
              rows="3"
              placeholder="Ingrese el diagnóstico"
            />
          </div>
          {/* Agregar antes del botón de generar PDF */}
          <div className="col-12 mt-4">
            <h4 className="mb-3">Imágenes del estudio</h4>
            <div className="row g-3">
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="col-md-4">
                    <div className="image-upload-container border rounded p-2">
                      {imagenesBase64[index] ? (
                        <div className="position-relative">
                          <img
                            src={imagenesBase64[index]}
                            alt={`Imagen ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                            onClick={() => handleRemoveImage(index)}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <label className="btn btn-outline-primary mb-0">
                            <input
                              type="file"
                              accept="image/*"
                              className="d-none"
                              onChange={(e) => handleImageUpload(e, index)}
                            />
                            Imagen {index + 1}
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="col-12 mt-4 text-center">
            <button
              type="button"
              className="btn btn-primary btn-lg px-5"
              onClick={generatePDF}
            >
              Generar PDF
            </button>
          </div>
        </form>
      </div>

      {/* Template para PDF */}
      {/* Template para PDF */}
      <div id="report-template" className="d-none">
        <div className="report-content p-4 bg-white">
          <div className="report-header">
            <div className="d-flex align-items-center mb-2">
              <img
                src={logoBase64 || "/Logo_HC.png"}
                alt="Hospital_Central"
                className="logo"
                style={{ maxWidth: "120px" }}
              />
              <div className="company-info ms-3">
                <h2 className="mb-0">HOSPITAL CENTRAL</h2>
                <p className="mb-0">L. N. Alem & Salta, Ciudad Mendoza</p>
                <h3 className="mb-0 fw-bold">Servicio de Gastroenterologia</h3>
              </div>
            </div>

            <table className="table table-sm mb-4">
              <tbody>
                <tr>
                  <td className="fw-bold" style={{ width: "150px" }}>
                    Fecha:
                  </td>
                  <td>{formData.fecha}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Paciente:</td>
                  <td>
                    {formData.paciente} (Doc: {formData.documento})
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Edad:</td>
                  <td>{formData.edad} años</td>
                </tr>
                <tr>
                  <td className="fw-bold">Obra Social:</td>
                  <td>
                    {formData.obraSocial} - UNICO - {formData.documento}/00
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Médico solicitante:</td>
                  <td>{formData.medicoSolicitante}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Estudio:</td>
                  <td>{formData.estudio}</td>
                </tr>
              </tbody>
            </table>

            <div className="report-body">
              <h4 className="text-uppercase">{formData.motivo}</h4>

              {formData.tipoEstudio === "baja" ? (
                // Template para endoscopia baja
                <>
                  <div className="section mb-3">
                    <h4 className="text-uppercase">INSPECCION ANAL:</h4>
                    <p>{formData.inspeccionAnal}</p>
                  </div>

                  <div className="section mb-3">
                    <h4 className="text-uppercase">TACTO RECTAL:</h4>
                    <p>
                      Esfínter {formData.tactoRectal.esfinter}. Ampolla rectal{" "}
                      {formData.tactoRectal.ampolla}. Dedo de guante{" "}
                      {formData.tactoRectal.dedoGuante}.
                    </p>
                  </div>

                  <div className="section mb-3">
                    <h4 className="text-uppercase">HALLAZGOS ENDOSCOPICOS:</h4>
                    <p>{formData.videocolonoscopia}</p>
                  </div>

                  <div className="section mb-3">
                    <h4 className="text-uppercase">
                      ESCALA DE PREPARACION DE BOSTON (LIMPIEZA DE COLON):
                    </h4>
                    <p>
                      &lt; 5 no satisfactoria. = o &gt; 5 satisfactoria.
                      <br />
                      Total: {formData.escalaBoston.total}/9 (C.D:{" "}
                      {formData.escalaBoston.colonDerecho} C.T:{" "}
                      {formData.escalaBoston.colonTransverso} C.I:{" "}
                      {formData.escalaBoston.colonIzquierdo})
                    </p>
                  </div>
                </>
              ) : (
                // Template para endoscopia alta
                <>
                  <div className="section mb-3">
                    <h4 className="text-uppercase">ESÓFAGO:</h4>
                    <p>{formData.esofago}</p>
                  </div>

                  <div className="section mb-3">
                    <h4 className="text-uppercase">ESTÓMAGO:</h4>
                    <p>{formData.estomago}</p>
                  </div>

                  <div className="section mb-3">
                    <h4 className="text-uppercase">DUODENO:</h4>
                    <p>{formData.duodeno}</p>
                  </div>
                </>
              )}

              <div className="additional-info mb-4">
                <p className="mb-1">
                  Biopsias:{" "}
                  {formData.biopsias === "SI"
                    ? "Retirar informe de biopsias en anatomía patológica (subsuelo, ala este del hospital) en 45 días"
                    : formData.biopsias}
                </p>
                <p className="mb-1">Anestesia: {formData.anestesia}</p>
                {formData.anestesia === "SI" && (
                  <p className="mb-0">
                    Anestesiólogo: {formData.anestesiologo}
                  </p>
                )}
              </div>

              <div className="diagnosis mb-4">
                <h4 className="text-uppercase mb-3 diagnosis-header">
                  IMPRESIÓN DIAGNÓSTICA
                </h4>
                <p className="mb-0">{formData.diagnostico}</p>
              </div>

              <div className="signature mt-5 text-center">
                {rubricaBase64 && (
                  <img
                    src={rubricaBase64}
                    alt="Firma médico"
                    style={{
                      maxWidth: "200px",
                      height: "auto",
                      marginBottom: "10px",
                    }}
                  />
                )}
                <div className="signature-line"></div>
                <p className="mb-0">{formData.medico.nombre}</p>
                <p>Mat. {formData.medico.matricula}</p>
              </div>
              {/* Agregar después de la firma y antes del cierre del report-body */}
              {imagenesBase64.some((img) => img !== null) && (
                <div className="images-section mt-5">
                  <h4 className="text-uppercase mb-3">IMÁGENES DEL ESTUDIO</h4>
                  <div className="row row-cols-3 g-3">
                    {imagenesBase64.map((imagen, index) => {
                      if (!imagen) return null;
                      return (
                        <div key={index} className="col">
                          <img
                            src={imagen}
                            alt={`Imagen ${index + 1}`}
                            className="img-fluid border"
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "contain",
                              backgroundColor: "#f8f9fa",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReportForm;
