import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "src/api/axiosInstance";

const CreateRepairModal = ({ ordenDeTrabajoId, open, onClose, onSave }) => {
  const [estadoId, setEstadoId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaEstimadaEntrega, setFechaEstimadaEntrega] = useState("");
  const [fechaRetiroFinal, setFechaRetiroFinal] = useState("");
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axiosInstance.get("Reparaciones/Estados");
        setEstados(response.data);
      } catch (error) {
        console.error("Error fetching estados:", error);
      }
    };

    fetchEstados();
  }, []);

  const handleSave = async () => {
    const repairData = {
      ordenDeTrabajoId,
      fechaInicio,
      fechaEstimadaEntrega,
      fechaRetiroFinal,
      estadoId: parseInt(estadoId, 10),
      respuestos: "",
    };

    setLoading(true);
    try {
      const response = await axiosInstance.post("Reparaciones", repairData);
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating repair:", error);
      alert(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Crear Reparación</DialogTitle>
      <DialogContent>
        <TextField
          label="Fecha de Inicio"
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha Estimada de Entrega"
          type="date"
          value={fechaEstimadaEntrega}
          onChange={(e) => setFechaEstimadaEntrega(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha de Retiro Final"
          type="date"
          value={fechaRetiroFinal}
          onChange={(e) => setFechaRetiroFinal(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Estado"
          select
          value={estadoId}
          onChange={(e) => setEstadoId(e.target.value)}
          fullWidth
          margin="normal"
        >
          {estados.map((estado) => (
            <MenuItem key={estado.id} value={estado.id}>
              {estado.nombre}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRepairModal;
