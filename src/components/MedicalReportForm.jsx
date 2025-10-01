import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";

// Agregar esta constante al inicio del archivo, después de las importaciones
const MEDICOS = [
  {
    nombre: "Campoy, Daniel",
    matricula: "5249",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/Campoy.png`,
    servicio: "Gastroenterología",
  },
  {
    nombre: "Richardi, Ana",
    matricula: "11110",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/Richardi.png`,
    servicio: "Gastroenterología",
  },
  {
    nombre: "Suárez Pellegrino, Andrea",
    matricula: "8588",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/Suarez.png`,
    servicio: "Gastroenterología",
  },
  {
    nombre: "La Salvia, Daniela",
    matricula: "10439",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/Lasalvia.png`,
    servicio: "Gastroenterología",
  },
  {
    nombre: "Martínez, Francisco",
    matricula: "12214",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/Martinez.png`,
    servicio: "Gastroenterología",
  },
  {
    nombre: "Cabrera, Marisol",
    matricula: "10778",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/Cabrera.png`,
    servicio: "Gastroenterología",
  },
  {
    nombre: "Casbarien, Octavio",
    matricula: "13496",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/Casbarien.png`,
    servicio: "Gastroenterología",
  },
  {
    nombre: "Daffra, Pamela",
    matricula: "9834",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/Daffra.png`,
    servicio: "Gastroenterología",
  },
  {
    nombre: "Alcaraz, Patricia",
    matricula: "10097",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/Alcaraz.png`,
    servicio: "Gastroenterología",
  },
  {
    nombre: "Velazco, Gonzalo",
    matricula: "13524",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/Velazco.png`,
    servicio: "Gastroenterología",
  },
  {
    nombre: "Riveros, Damian",
    matricula: "13827",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/Riveros.png`,
    servicio: "Gastroenterología",
  },
  {
    nombre: "Carvajal, Ariel O.",
    matricula: "10934",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/carvajal.png`,
    servicio: "Cirugia",
  },
  {
    nombre: "Soler, Anibal",
    matricula: "5185",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/soler.png`,
    servicio: "Cirugia",
  },
  {
    nombre: "Palmili, Gonzalo",
    matricula: "9808",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/palmili.png`,
    servicio: "Cirugia",
  },
  {
    nombre: "Paz, Tarek",
    matricula: "14218",
    rubrica: `${import.meta.env.BASE_URL}images/rubricas/paz.png`,
    servicio: "Cirugia",
  },
  // Puedes agregar más médicos aquí
];

// Opciones de estudios endoscópicos para autocompletar
const OPCIONES_ESTUDIOS = [
  "VIDEOENDOSCOPIA DIGESTIVA ALTA",
  "VIDEOCOLONOSCOPIA",
  "COLANGIOPANCREATOGRAFIA RETROGRADA ENDOSCOPICA (CPRE)",
  "ECOENDOSCOPIA",
  "CAPSULA ENDOSCOPICA",
  "ENTEROSCOPIA",
  "ESOFAGOGASTRODUODENOSCOPIA",
  "RECTOSIGMOIDOSCOPIA",
  "POLIPECTOMIA ENDOSCOPICA",
  "DILATACION ESOFAGICA",
  "COLOCACION DE PROTESIS",
  "HEMOSTASIA ENDOSCOPICA",
  "MUCOSTOMIA",
  "ESCLEROTERAPIA",
  "LIGADURA DE VARICES",
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
    // medicoSolicitante: "",
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
    estudio2: "",
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
      // Preservar la fecha actual, no usar la guardada en localStorage
      const currentDate = new Date().toISOString().split("T")[0];
      setFormData({
        ...parsedData,
        fecha: currentDate,
      });
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
        const response = await fetch(
          `${import.meta.env.BASE_URL}images/Logo_HC.png`
        );
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

  // Función para formatear fecha de YYYY-MM-DD a DD/MM/YYYY
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";
    const [año, mes, dia] = fechaISO.split("-");
    return `${dia}/${mes}/${año}`;
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
      margin: [2, 8, 2, 8], // [top, left, bottom, right] en mm
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        logging: true,
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      // pagebreak: { mode: "avoid-all" }, // Evita cortes en elementos
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
              src={`${import.meta.env.BASE_URL}images/Logo_HC.png`}
              alt="Hospital_Central"
              className="logo me-4"
              style={{ maxWidth: "100px" }}
            />
            <div>
              <h3 className="mb-2">{formData.paciente}</h3>
              <p className="mb-1">Documento: {formData.documento}</p>
              <p className="mb-1">Fecha: {formatearFecha(formData.fecha)}</p>
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
          {/* Médico Solicitante
          <div className="col-md-6">
            <label className="form-label">Médico Solicitante</label>
            <input
              type="text"
              className="form-control"
              name="medicoSolicitante"
              value={formData.medicoSolicitante}
              onChange={handleInputChange}
            />
          </div> */}

          <div className="col-12">
            <label className="form-label">Motivo del procedimiento: </label>
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
          {/* Estudio y Estudio 2 en la misma fila */}
          <div className="col-md-6">
            <label className="form-label">Procedimiento</label>
            <input
              type="text"
              className="form-control"
              name="estudio"
              value={formData.estudio}
              onChange={handleInputChange}
              list="opciones-estudios"
              placeholder="Seleccione o escriba el estudio"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Procedimiento 2</label>
            <input
              type="text"
              className="form-control"
              name="estudio2"
              value={formData.estudio2}
              onChange={handleInputChange}
              list="opciones-estudios2"
              placeholder="Segundo estudio (opcional)"
            />
          </div>

          {/* Datalist para autocompletar estudios */}
          <datalist id="opciones-estudios">
            {OPCIONES_ESTUDIOS.map((estudio, index) => (
              <option key={index} value={estudio} />
            ))}
          </datalist>

          {/* Segundo datalist para estudio2 */}
          <datalist id="opciones-estudios2">
            {OPCIONES_ESTUDIOS.map((estudio, index) => (
              <option key={index} value={estudio} />
            ))}
          </datalist>

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
      <div id="report-template" className="d-none">
        <div className="report-content p-4 bg-white">
          <div className="report-header">
            <div className="header-grid">
              <div className="header-logo">
                <img
                  src={
                    logoBase64 ||
                    `${import.meta.env.BASE_URL}images/Logo_HC.png`
                  }
                  alt="Hospital_Central"
                  className="logo"
                  style={{ maxWidth: "120px" }}
                />
              </div>
              <div className="header-info text-center">
                <h2 className="mb-0">HOSPITAL CENTRAL</h2>
                <p className="mb-0">L. N. Alem & Salta, Ciudad Mendoza</p>
                <h3
                  className={`mb-0 fw-bold ${
                    MEDICOS.find((m) => m.nombre === formData.medico.nombre)
                      ?.servicio === "Cirugia"
                      ? "servicio-cirugia"
                      : ""
                  }`}
                >
                  Servicio de{" "}
                  {MEDICOS.find((m) => m.nombre === formData.medico.nombre)
                    ?.servicio || "gastroenterologia"}
                </h3>
              </div>
              <div className="header-date text-end">
                <p className="mb-0">Fecha: {formatearFecha(formData.fecha)}</p>
              </div>
            </div>

            <table className="table table-sm mb-4">
              <tbody style={{ lineHeight: "0.8" }}>
                <tr>
                  <td className="fw-bold" style={{ width: "150px" }}>
                    Paciente:
                  </td>
                  <td>
                    {formData.paciente} (Doc: {formData.documento})
                    <span className="ms-4">Edad: {formData.edad} años</span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Obra Social:</td>
                  <td>
                    {formData.obraSocial} - UNICO - {formData.documento}/00
                  </td>
                </tr>
                {/* <tr>
                  <td className="fw-bold">Médico solicitante:</td>
                  <td>{formData.medicoSolicitante}</td>
                </tr> */}
                <tr>
                  <td className="fw-bold">Procedimiento:</td>
                  <td>
                    {formData.estudio}
                    {formData.estudio2 && ` - ${formData.estudio2}`}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="report-body">
              <h4 className="text-uppercase">
                Motivo del procedimiento: {formData.motivo}
              </h4>

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
                      Total: {formData.escalaBoston.total}/9 (C.D:{" "}
                      {formData.escalaBoston.colonDerecho} C.T:{" "}
                      {formData.escalaBoston.colonTransverso} C.I:{" "}
                      {formData.escalaBoston.colonIzquierdo}){" - "}
                      {parseInt(formData.escalaBoston.total) < 5
                        ? "< 5 no satisfactoria"
                        : "≥ 5 satisfactoria"}
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
                <p className="mb-1">
                  Anestesia: {formData.anestesia}
                  {formData.anestesia === "SI" && (
                    <span className="ms-4">
                      Anestesiólogo: {formData.anestesiologo}
                    </span>
                  )}
                </p>
              </div>

              {/* Sección de diagnóstico y firma */}
              <div className="diagnostic-signature-container">
                <div className="diagnostic-section">
                  <h4 className="text-uppercase mb-3 diagnosis-header">
                    IMPRESIÓN DIAGNÓSTICA
                  </h4>
                  <p className="mb-0">{formData.diagnostico}</p>
                </div>

                <div className="signature-section">
                  {rubricaBase64 && (
                    <img
                      src={rubricaBase64}
                      alt="Firma médico"
                      className="signature-image"
                    />
                  )}
                  <div className="signature-line"></div>
                  <p className="mb-0">{formData.medico.nombre}</p>
                  <p>Mat. {formData.medico.matricula}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de imágenes en página separada */}
        {imagenesBase64.some((img) => img !== null) && (
          <div className="images-section" style={{ pageBreakBefore: "always" }}>
            <div className="report-content p-4 bg-white">
              <div className="report-body">
                <h4 className="text-uppercase mb-3">IMÁGENES DEL ESTUDIO</h4>
                <h5 className="mb-4">Paciente: {formData.paciente}</h5>
                <div className="row row-cols-2 g-4">
                  {imagenesBase64.map((imagen, index) => {
                    if (!imagen) return null;
                    return (
                      <div key={index} className="col">
                        <img
                          src={imagen}
                          alt={`Imagen ${index + 1}`}
                          className="img-fluid border rounded"
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "contain",
                            backgroundColor: "#f8f9fa",
                          }}
                        />
                        <p className="text-center mt-2 mb-0 small text-muted">
                          Imagen {index + 1}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalReportForm;
