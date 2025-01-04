import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import axiosInstance from "src/api/axiosInstance";

const ProformaModal = ({ open, handleClose, data, id }) => {
  const [prices, setPrices] = useState(
    data.servicios.reduce((acc, service) => {
      acc[service] = "";
      return acc;
    }, {})
  );

  const [advance, setAdvance] = useState(0);
  const [repuestos, setRepuestos] = useState("");

  const calculateSubtotal = () => {
    return Object.values(prices).reduce((total, price) => total + parseFloat(price || 0), 0);
  };

  const calculateIVA = (subtotal) => {
    return subtotal * 0.15;
  };

  const calculateTotal = (subtotal, iva) => {
    return subtotal + iva;
  };

  const calculateRemaining = (total, advance) => {
    return total - advance;
  };

  const handlePriceChange = (service, value) => {
    if (!isNaN(value) && Number(value) >= 0) {
      setPrices((prev) => ({ ...prev, [service]: value }));
    }
  };

  const handleAdvanceChange = (value) => {
    if (!isNaN(value) && Number(value) >= 0) {
      setAdvance(parseFloat(value));
    }
  };

  const handleRepuestosChange = (e) => {
    setRepuestos(e.target.value);
  };

  const handleSave = async () => {
    const payload = {
      ordenTrabajoId: id, // El ID de la orden como prop
      adelanto: advance,
      estadoId: 1, // Estado fijo como 1
      items: Object.entries(prices).map(([descripcion, precio]) => ({
        descripcion,
        precio: parseFloat(precio) || 0,
      })),
      respuestos: repuestos, // Guardar el valor de los repuestos
    };

    try {
      const response = await axiosInstance.post(
        "https://www.tallercentenos.somee.com/api/Proformas/api/Proformas/Create",
        payload
      );
      console.log("Proforma creada con éxito:", response.data);
      handleClose(); // Cerrar el modal después de guardar
    } catch (error) {
      console.error("Error al crear la proforma:", error);
    }
  };

  const subtotal = calculateSubtotal();
  const iva = calculateIVA(subtotal);
  const total = calculateTotal(subtotal, iva);
  const remaining = calculateRemaining(total, advance);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "100%", sm: 600 },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Nueva Proforma
        </Typography>
        <Box mb={2}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Cliente: {data.cliente}
          </Typography>
          <Typography variant="body1">Marca Motor: {data.marcaMotor}</Typography>
          <Typography variant="body1">Número Motor: {data.numeroMotor}</Typography>
          <Typography variant="body1">
            Fecha: {new Date(data.fechaRegistro).toLocaleDateString()}
          </Typography>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Descripción
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Precio
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.servicios.map((service) => (
                <TableRow key={service}>
                  <TableCell>{service}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        C$
                      </Typography>
                      <TextField
                        variant="outlined"
                        size="small"
                        type="number"
                        value={prices[service]}
                        onChange={(e) => handlePriceChange(service, e.target.value)}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <strong>Subtotal</strong>
                </TableCell>
                <TableCell>C$ {subtotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>IVA (15%)</strong>
                </TableCell>
                <TableCell>C$ {iva.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Total</strong>
                </TableCell>
                <TableCell>
                  <strong>C$ {total.toFixed(2)}</strong>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Adelanto</strong>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      C$
                    </Typography>
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      value={advance}
                      onChange={(e) => handleAdvanceChange(e.target.value)}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Restante</strong>
                </TableCell>
                <TableCell>
                  <strong>C$ {remaining.toFixed(2)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box mb={2}>
          <Typography variant="subtitle1">Repuestos</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={repuestos}
            onChange={handleRepuestosChange}
            placeholder="Ingrese los repuestos"
          />
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProformaModal;
