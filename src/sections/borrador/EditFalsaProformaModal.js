import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Modal, TextField, IconButton } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline, Close } from "@mui/icons-material";
import axiosInstance from "src/api/axiosInstance";
import Swal from "sweetalert2";

const EditFalsaProformaModal = ({ open, handleClose, fetchProformas, data }) => {
  const [formData, setFormData] = useState({
    cliente: "",
    marcaMotor: "",
    numeroMotor: "",
    repuestos: "",
    items: [{ descripcion: "", precio: "" }],
  });

  useEffect(() => {
    if (data) {
      setFormData({
        cliente: data.cliente || "",
        marcaMotor: data.marcaMotor || "",
        numeroMotor: data.numeroMotor || "",
        repuestos: data.respuestos || "",
        items:
          data.items.length > 0
            ? data.items.map((item) => ({ ...item, precio: item.precio.replace(/[^0-9.]/g, "") }))
            : [{ descripcion: "", precio: "" }],
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { descripcion: "", precio: "" }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        cliente: formData.cliente,
        marcaMotor: formData.marcaMotor,
        numeroMotor: formData.numeroMotor,
        respuestos: formData.repuestos,
        items: formData.items.filter((item) => item.descripcion || item.precio),
      };

      await axiosInstance.put(`FalsaProforma/${data.id}`, payload);

      Swal.fire({
        icon: "success",
        title: "Falsa Proforma Actualizada",
        text: "La falsa proforma ha sido actualizada exitosamente",
      });

      fetchProformas();
      handleClose();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar la falsa proforma",
        text: error.response?.data.message || error.message,
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "100%", sm: 500 },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Editar Falsa Proforma</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          margin="normal"
          label="Cliente"
          value={formData.cliente}
          onChange={(e) => handleChange("cliente", e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Marca Motor"
          value={formData.marcaMotor}
          onChange={(e) => handleChange("marcaMotor", e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Número Motor"
          value={formData.numeroMotor}
          onChange={(e) => handleChange("numeroMotor", e.target.value)}
        />

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Servicios
        </Typography>
        {formData.items.map((item, index) => (
          <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
            <TextField
              fullWidth
              label="Descripción"
              value={item.descripcion}
              onChange={(e) => handleItemChange(index, "descripcion", e.target.value)}
            />

            <span>C$</span>
            <TextField
              type="number"
              label="Precio"
              value={item.precio}
              onChange={(e) => handleItemChange(index, "precio", e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
            />
            {formData.items.length > 1 && (
              <IconButton color="error" onClick={() => removeItem(index)}>
                <RemoveCircleOutline />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          startIcon={<AddCircleOutline />}
          onClick={addItem}
          sx={{ mt: 1 }}
          variant="contained"
        >
          Agregar Servicio
        </Button>

        <TextField
          fullWidth
          multiline
          rows={3}
          margin="normal"
          label="Repuestos"
          value={formData.repuestos}
          onChange={(e) => handleChange("repuestos", e.target.value)}
        />

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Actualizar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditFalsaProformaModal;
