// src/components/MedicalReportForm.jsx
import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";

const MedicalReportForm = () => {
  const initialState = {
    fecha: new Date().toISOString().split("T")[0],
    paciente: "",
    documento: "",
    edad: "",
    obraSocial: "",
    obraSocialNumero: "",
    estudio: "VIDEOCOLONOSCOPIA BAJO ANESTESIA",
    medicoSolicitante: "",
    motivo: "DOLOR ABDOMINAL EN ESTUDIO",
    inspeccionAnal: "Sin lesiones.",
    tactoRectal: {
      esfinter: "",
      ampolla: "",
      dedoGuante: "",
    },
    videocolonoscopia: "",
    escalaBoston: {
      total: "",
      colonDerecho: "",
      colonTransverso: "",
      colonIzquierdo: "",
    },
    biopsias: "NO",
    anestesia: "SI",
    anestesiologo: "",
    diagnostico: "ESTUDIO A CIEGO SIN LESIONES MUCOSAS",
    medico: {
      nombre: "",
      matricula: "",
    },
  };

  const [formData, setFormData] = useState(initialState);
  const [showResetButton, setShowResetButton] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [logoBase64, setLogoBase64] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("medicalReportForm");
    if (savedData) {
      setFormData(JSON.parse(savedData));
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      localStorage.setItem("medicalReportForm", JSON.stringify(newData));
      return newData;
    });
  };

  const handleNestedInputChange = (category, field, value) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value,
        },
      };
      localStorage.setItem("medicalReportForm", JSON.stringify(newData));
      return newData;
    });
  };

  const generatePDF = async () => {
    if (!formData.paciente || !formData.documento) {
      alert(
        "Por favor complete al menos el nombre del paciente y el documento"
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
              style={{ maxWidth: "120px" }}
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
            <label className="form-label">Boston Total</label>
            <input
              type="text"
              className="form-control"
              value={formData.escalaBoston.total}
              onChange={(e) =>
                handleNestedInputChange("escalaBoston", "total", e.target.value)
              }
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Colon Derecho</label>
            <input
              type="text"
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
              type="text"
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
              type="text"
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

          <div className="col-md-6">
            <label className="form-label">Médico</label>
            <input
              type="text"
              className="form-control"
              value={formData.medico.nombre}
              onChange={(e) =>
                handleNestedInputChange("medico", "nombre", e.target.value)
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Matrícula</label>
            <input
              type="text"
              className="form-control"
              value={formData.medico.matricula}
              onChange={(e) =>
                handleNestedInputChange("medico", "matricula", e.target.value)
              }
            />
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
            <div className="d-flex align-items-center mb-4">
              <img
                src="/Logo_HC.png"
                alt="Hospital_Central"
                className="logo"
                style={{ maxWidth: "150px" }}
              />
              <div className="company-info ms-3">
                <p className="mb-0">HOSPITAL CENTRAL</p>
                <p className="mb-0">L. N. Alem & Salta, Ciudad Mendoza</p>
                <p className="mb-0">Servicio de Gastroenterologia</p>
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
                  <td className="fw-bold">Estudio:</td>
                  <td>{formData.estudio}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Médico solicitante:</td>
                  <td>{formData.medicoSolicitante}</td>
                </tr>
              </tbody>
            </table>

            <div className="report-body">
              <h4 className="text-uppercase">{formData.motivo}</h4>

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
                <h4 className="text-uppercase">
                  VIDEOCOLONOSCOPIA BAJO ANESTESIA:
                </h4>
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

              <div className="additional-info mb-4">
                <p className="mb-1">Biopsias: {formData.biopsias}</p>
                <p className="mb-1">Anestesia: {formData.anestesia}</p>
                <p className="mb-0">Anestesiólogo: {formData.anestesiologo}</p>
              </div>

              <div className="diagnosis mb-4">
                <h4 className="text-uppercase mb-3">IMPRESIÓN DIAGNÓSTICA</h4>
                <p className="mb-0">{formData.diagnostico}</p>
              </div>

              <div className="signature mt-5 text-center">
                <div className="signature-line"></div>
                <p className="mb-0">{formData.medico.nombre}</p>
                <p>Mat. {formData.medico.matricula}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReportForm;
