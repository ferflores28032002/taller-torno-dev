import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axiosInstance from "src/api/axiosInstance";

const EditRepairModal = ({ open, onClose, repairData, onUpdate }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [statuses, setStatuses] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fechaEstimadaEntrega: "",
      fechaRetiroFinal: "",
      estadoId: "",
    },
  });

  useEffect(() => {
    if (repairData) {
      reset({
        fechaEstimadaEntrega: repairData.fechaEstimadaEntrega?.slice(0, 10),
        fechaRetiroFinal: repairData.fechaRetiroFinal?.slice(0, 10),
        estadoId: repairData.estadoId || "",
      });
    }
  }, [repairData, reset]);

  useEffect(() => {
    // Fetch statuses from API
    const fetchStatuses = async () => {
      try {
        const response = await axiosInstance.get("Reparaciones/Estados");

        setStatuses(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    fetchStatuses();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.put(`Reparaciones/${repairData.ordenDeTrabajoId}`, data);
      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        alert(
          "La fecha de estimación de entrega no puede ser posterior a la fecha de retiro final."
        );
      }
    } catch (error) {
      console.error("Error updating repair:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isSmallScreen} fullWidth maxWidth="sm">
      <DialogTitle>Editar Reparación</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate>
          <TextField
            label="Orden de Trabajo ID"
            value={repairData?.ordenDeTrabajoId || ""}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Cliente"
            value={repairData?.cliente || ""}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Marca del Motor"
            value={repairData?.marcaMotor || ""}
            fullWidth
            margin="normal"
            disabled
          />
          <Controller
            name="fechaEstimadaEntrega"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fecha Estimada de Entrega"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="fechaRetiroFinal"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Fecha de Retiro Final"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="estadoId"
            control={control}
            rules={{ required: "Estado es requerido" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Estado"
                select
                fullWidth
                margin="normal"
                defaultValue={repairData?.estadoId || ""}
                error={!!errors.estadoId}
                helperText={errors.estadoId?.message}
              >
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.nombre}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditRepairModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  repairData: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditRepairModal;
