import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Autocomplete,
  TextField,
  Divider,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import axiosInstance from "src/api/axiosInstance";

export const InfoModal = ({ id, open, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get("https://www.tallercenteno.somee.com/api/Empleados");
        const workersData = response.data.map((worker) => ({
          id: worker.id,
          name: `${worker.nombre} ${worker.apellidos}`,
        }));
        setWorkers(workersData);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`Proformas/Listo-proforma-modulo-exclusivo/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAssignmentChange = (sectionId, value) => {
    setAssignments({ ...assignments, [sectionId]: value });
  };

  const handleSaveAssignments = async () => {
    try {
      const payload = Object.entries(assignments).map(([sectionId, worker]) => ({
        seccionId: parseInt(sectionId, 10),
        empleadoId: worker?.id || null,
      }));

      if (payload.some((item) => !item.empleadoId)) {
        alert("Por favor, asigna un trabajador a todas las secciones.");
        return;
      }

      await axiosInstance.post(
        `Proformas/asignar-trabajador-a-secciones?proformaId=${id}`,
        payload
      );
      alert("Asignaciones guardadas exitosamente.");
      onClose();
    } catch (error) {
      console.error("Error saving assignments:", error);
      alert("Error al guardar las asignaciones. Por favor, intenta de nuevo.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={useMediaQuery((theme) => theme.breakpoints.down("sm"))}
      sx={{
        "& .MuiPaper-root": {
          height: "90vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle>Detalles de la Proforma</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}
          >
            <CircularProgress />
          </Box>
        ) : (
          data && (
            <Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 2,
                }}
              >
                <Typography variant="subtitle1">
                  <strong>Cliente:</strong> {data.cliente}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Marca Motor:</strong> {data.marcaMotor}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Número Motor:</strong> {data.numeroMotor}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Estado:</strong> {data.estado}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Total:</strong> {data.total}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Adelanto:</strong> {data.adelanto}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Saldo Pendiente:</strong> {data.saldoPendiente}
                </Typography>
              </Box>

              <Divider sx={{ my: 2, borderColor: "#ccc" }} />

              {data.secciones.map((section) => (
                <Box
                  key={section.seccion.id}
                  sx={{
                    mb: 4,
                    padding: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: "#333", fontWeight: "bold" }}>
                    {section.seccion.nombre}
                  </Typography>

                  {section.items.map((item, index) => (
                    <Typography key={index} sx={{ ml: 2, color: "#555" }}>
                      - {item.descripcion}: {item.precio}
                    </Typography>
                  ))}

                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ mt: 2, fontWeight: "bold", color: "#444" }}
                  >
                    Total de la Sección: {section.totalSeccion}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ fontWeight: "bold", color: "#444" }}
                    >
                      Asignar Trabajo
                    </Typography>
                    <Autocomplete
                      options={workers}
                      getOptionLabel={(option) => option.name || ""}
                      renderInput={(params) => (
                        <TextField {...params} label="Seleccionar trabajador" />
                      )}
                      onChange={(event, value) => handleAssignmentChange(section.seccion.id, value)}
                      noOptionsText="No hay trabajadores disponibles"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSaveAssignments} color="primary" variant="contained">
          Guardar
        </Button>
        <Button onClick={onClose} color="secondary" variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
