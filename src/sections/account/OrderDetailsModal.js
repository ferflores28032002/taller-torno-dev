import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import axiosInstance from "src/api/axiosInstance";

const OrderDetailsModal = ({ orderId, open, onClose }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return;

      setLoading(true);
      try {
        const response = await axiosInstance.get(`OrdenTrabajo/${orderId}`);
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (!orderData) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Detalles de la Orden de Trabajo</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography variant="body1">Cargando...</Typography>
        ) : (
          <>
            <Typography variant="h6">Cliente: {orderData.cliente}</Typography>
            <Typography variant="body1">Marca del Motor: {orderData.marcaMotor}</Typography>
            <Typography variant="body1">Número de Motor: {orderData.numeroMotor}</Typography>

            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Servicios:
            </Typography>
            <List>
              {orderData.servicios.map((servicio, index) => (
                <ListItem key={index}>
                  <ListItemText primary={servicio.nombre} />
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Repuestos:
            </Typography>
            <Typography variant="body1">{orderData.respuesto}</Typography>

            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Notas:
            </Typography>
            <Typography variant="body1">Bielas: {orderData.notasBiela}</Typography>
            <Typography variant="body1">Bloque: {orderData.notasBlock}</Typography>
            <Typography variant="body1">Cigüeñal: {orderData.notasCigueñal}</Typography>
            <Typography variant="body1">Culatas: {orderData.notasCulatas}</Typography>

            <Typography variant="body2" sx={{ marginTop: 2, fontStyle: "italic" }}>
              Fecha de Registro: {new Date(orderData.fechaRegistro).toLocaleDateString()}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;
