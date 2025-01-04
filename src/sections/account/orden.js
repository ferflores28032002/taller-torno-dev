import {
  Box,
  Button,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import { Build, Description, Edit, PictureAsPdf, Print, Visibility } from "@mui/icons-material"; // Material Icons
import axios from "axios";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect, useState } from "react";
import { Scrollbar } from "src/components/scrollbar";
import ProformaModal from "./ProformaModal";
import CreateRepairModal from "./CreateRepairModal";
import OrderDetailsModal from "./OrderDetailsModal";
import EditOrden from "./EditOrden";
import axiosInstance from "src/api/axiosInstance";

export const Orden = ({ searchQuery }) => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpenOrder, setModalOpenOrder] = useState(false);

  const [createRepair, setCreateRepair] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("OrdenTrabajo");
        setOrdenes(response.data.reverse() || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [edit]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadPDF = async (id) => {
    try {
      const response = await axiosInstance.get(`OrdenTrabajo/${id}`);
      const data = response.data;

      const doc = new jsPDF();

      // Encabezado
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("De Taller Centeno", 14, 15);
      doc.text("Iglesia Santa Ana 1c. al Sur y ½ c. arriba", 14, 20);
      doc.text("Teléfonos: 2266-7121", 14, 25);
      doc.text("Managua, Nicaragua.", 14, 30);

      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("ORDEN DE TRABAJO", 105, 40, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.text(
        `Fecha de Registro: ${
          data.fechaRegistro ? format(new Date(data.fechaRegistro), "dd/MM/yyyy") : "No disponible"
        }`,
        150,
        15,
        { align: "right" }
      );

      // Información del cliente
      doc.autoTable({
        startY: 50,
        body: [
          ["Cliente:", data.cliente],
          ["Marca de Motor:", data.marcaMotor],
          ["Número de Motor:", data.numeroMotor],
        ],
        columnStyles: {
          0: { cellWidth: 50, fontStyle: "bold" },
          1: { cellWidth: 140 },
        },
        styles: { fontSize: 10 },
      });

      let currentY = doc.lastAutoTable.finalY + 10;

      // Tabla de servicios realizados
      doc.autoTable({
        startY: currentY,
        head: [["Servicios"]],
        body:
          data.servicios.length > 0
            ? data.servicios.map((servicio) => [servicio.nombre])
            : [["No hay servicios registrados"]],
        styles: {
          fontSize: 9,
          fillColor: [240, 240, 240],
        },
        headStyles: {
          fillColor: [40, 116, 166],
          textColor: [255, 255, 255],
        },
      });

      currentY = doc.lastAutoTable.finalY + 10;

      // Tabla de repuestos
      doc.autoTable({
        startY: currentY,
        head: [["Repuestos"]],
        body: data.respuesto ? [[data.respuesto]] : [["No hay repuestos registrados"]],
        styles: {
          fontSize: 9,
          fillColor: [255, 255, 255],
        },
        headStyles: {
          fillColor: [40, 116, 166],
          textColor: [255, 255, 255],
        },
      });

      currentY = doc.lastAutoTable.finalY + 10;

      // Tabla de notas
      const notas = [
        { title: "Biela", content: data.notasBiela || "No hay notas" },
        { title: "Block", content: data.notasBlock || "No hay notas" },
        { title: "Cigüeñal", content: data.notasCigueñal || "No hay notas" },
        { title: "Culatas", content: data.notasCulatas || "No hay notas" },
      ];

      doc.autoTable({
        startY: currentY,
        head: [["Notas", "Detalle"]],
        body: notas.map((nota) => [nota.title, nota.content]),
        styles: {
          fontSize: 9,
          fillColor: [255, 255, 255],
        },
        headStyles: {
          fillColor: [40, 116, 166],
          textColor: [255, 255, 255],
        },
      });

      currentY = doc.lastAutoTable.finalY + 10;

      // Pie de página
      if (currentY + 30 > doc.internal.pageSize.height) {
        doc.addPage();
        currentY = 10;
      }

      doc.setFontSize(10);
      doc.setTextColor(255, 0, 0);
      doc.text("SU TRABAJO SERÁ ENTREGADO", 14, currentY);
      doc.text("SOLAMENTE CON LA PRESENTACIÓN", 14, currentY + 5);
      doc.text("DE ESTE RECIBO", 14, currentY + 10);

      doc.text(
        "NO SOMOS RESPONSABLES DE CUALQUIER TRABAJO RECIBIDO MÁS DE 30 DÍAS",
        14,
        currentY + 20
      );

      // Guardar PDF
      doc.save(`Orden_${id}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handlePrint = async (id) => {
    try {
      const response = await axiosInstance.get(`OrdenTrabajo/${id}`);
      const data = response.data;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Orden</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              .header { position: fixed; top: 0; left: 0; width: 100%; background-color: white; text-align: center; }
              .content { margin-top: 150px; }
              .footer { position: fixed; bottom: 0; left: 0; width: 100%; text-align: center; font-size: 12px; }
            }
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header h2 { font-size: 16px; color: #333; margin: 0; }
            .header p { margin: 0; font-size: 12px; }
            .header .title { font-size: 18px; font-weight: bold; color: red; margin-top: 5px; }
            .content h2 { font-size: 14px; margin: 10px 0; }
            .content p { font-size: 12px; margin: 5px 0; }
            .content ul { padding-left: 20px; }
            .content ul li { margin-bottom: 5px; font-size: 12px; }
            .no-data { color: gray; font-style: italic; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>De Taller Centeno</h2>
            <p><strong>TODA CLASE DE TRABAJOS DE TORNO, FRESA Y SOLDADURA</strong></p>
            <p>Iglesia Santa Ana 1c. al Sur y ½ c. arriba. Teléfonos: 2266-7121</p>
            <p>Managua, Nicaragua.</p>
            <div class="title">ORDEN DE TRABAJO N° ${id}</div>
            <p>Fecha de Registro: ${
              data.fechaRegistro
                ? format(new Date(data.fechaRegistro), "dd/MM/yyyy")
                : "No disponible"
            }</p>
          </div>

          <div class="content">
            <p><strong>Cliente:</strong> ${data.cliente}</p>
            <p><strong>Marca de Motor:</strong> ${data.marcaMotor}</p>
            <p><strong>Número de Motor:</strong> ${data.numeroMotor}</p>

            <h2>Servicios Realizados</h2>
            <ul>
              ${
                data.servicios.length > 0
                  ? data.servicios.map((servicio) => `<li>${servicio.nombre}</li>`).join("")
                  : '<li class="no-data">No hay servicios registrados</li>'
              }
            </ul>

            <h2>Repuestos</h2>
            <p>${data.respuesto || '<span class="no-data">No hay repuestos registrados</span>'}</p>

            <h2>Notas</h2>
            <p><strong>Biela:</strong> ${
              data.notasBiela || '<span class="no-data">No hay notas</span>'
            }</p>
            <p><strong>Block:</strong> ${
              data.notasBlock || '<span class="no-data">No hay notas</span>'
            }</p>
            <p><strong>Cigüeñal:</strong> ${
              data.notasCigueñal || '<span class="no-data">No hay notas</span>'
            }</p>
            <p><strong>Culatas:</strong> ${
              data.notasCulatas || '<span class="no-data">No hay notas</span>'
            }</p>

            <h2 style="color: red;">SU TRABAJO SERÁ ENTREGADO</h2>
            <p style="color: red;">SOLAMENTE CON LA PRESENTACIÓN DE ESTE RECIBO</p>
            <p style="color: red;">NO SOMOS RESPONSABLES DE CUALQUIER TRABAJO RECIBIDO MÁS DE 30 DÍAS</p>
          </div>
        </body>
      </html>
    `);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Error printing order:", error);
    }
  };

  const handleCreateProforma = async (id) => {
    try {
      setButtonLoading(id);
      const response = await axiosInstance.get(`OrdenTrabajo/${id}`);
      setSelectedData(response.data);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching order data:", error);
    } finally {
      setButtonLoading(null);
    }
  };

  const filteredOrdenes = ordenes
    .filter((orden) => orden.cliente.toLowerCase().includes(searchQuery.toLowerCase()))
    .reverse();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress size={30} />
      </Box>
    );
  }

  const handleSave = (repairData) => {
    console.log("Repair data saved:", repairData);
    // Actualiza el estado o la UI según sea necesario.
  };

  return (
    <>
      {edit && <EditOrden setEdit={setEdit} id={selectedId} />}

      {!edit && (
        <Card>
          {selectedData && (
            <ProformaModal
              open={open}
              handleClose={() => setOpen(false)}
              data={selectedData}
              id={selectedId}
            />
          )}

          <OrderDetailsModal
            orderId={selectedId}
            open={modalOpenOrder}
            onClose={() => setModalOpenOrder(false)}
          />
          <CreateRepairModal
            ordenDeTrabajoId={selectedId}
            open={createRepair}
            onClose={() => setCreateRepair(false)}
            onSave={handleSave}
          />
          <Scrollbar>
            <Box sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Marca de Motor</TableCell>
                    <TableCell>Número de Motor</TableCell>
                    <TableCell>Fecha de Registro</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrdenes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((orden) => (
                      <TableRow hover key={orden.id}>
                        <TableCell>{orden.cliente}</TableCell>
                        <TableCell>{orden.marcaMotor}</TableCell>
                        <TableCell>{orden.numeroMotor}</TableCell>
                        <TableCell>
                          {orden.fechaCreacion
                            ? format(new Date(orden.fechaCreacion), "dd/MM/yyyy")
                            : "No disponible"}
                        </TableCell>
                        <TableCell sx={{ display: "flex", gap: `5px` }}>
                          {/* Botón Imprimir */}
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handlePrint(orden.id)}
                            sx={{ marginRight: 1 }}
                          >
                            <Print />
                          </Button>

                          {/* Botón Descargar PDF */}
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDownloadPDF(orden.id)}
                          >
                            <PictureAsPdf />
                          </Button>

                          {/* Botón Crear Proforma */}
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setSelectedId(orden.id);
                              handleCreateProforma(orden.id);
                            }}
                            disabled={buttonLoading === orden.id}
                            isLoading={buttonLoading === orden.id}
                            sx={{ marginRight: 1, position: "relative" }}
                          >
                            <Description />
                          </Button>

                          {/* Botón Editar Detalles */}
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              setSelectedId(orden.id);
                              setModalOpenOrder(true);
                            }}
                            sx={{ marginRight: 1 }}
                          >
                            <Visibility />
                          </Button>

                          {/* Botón Crear Reparación */}
                          <Button
                            variant="contained"
                            color="warning"
                            onClick={() => {
                              setSelectedId(orden.id);
                              setCreateRepair(true);
                            }}
                          >
                            <Build />
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setSelectedId(orden.id);
                              setEdit(true);
                            }}
                          >
                            <Edit />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Scrollbar>
          <TablePagination
            component="div"
            count={ordenes.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      )}
    </>
  );
};
