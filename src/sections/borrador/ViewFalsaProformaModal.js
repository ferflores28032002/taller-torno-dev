import React from "react";
import { Box, Button, Typography, Modal, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const ViewFalsaProformaModal = ({ open, handleClose, data }) => {
  if (!data) return null;

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
          <Typography variant="h6">Detalles de la Proforma</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <Typography variant="body1">
          <strong>Cliente:</strong> {data.cliente || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Marca Motor:</strong> {data.marcaMotor || "N/A"}
        </Typography>
        <Typography variant="body1">
          <strong>Número Motor:</strong> {data.numeroMotor || "N/A"}
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Servicios Solicitados
        </Typography>
        {data.items && data.items.length > 0 ? (
          data.items.map((item, index) => (
            <Box key={index} mb={1}>
              <Typography variant="body2">
                • {item.descripcion || "Sin descripción"} - {item.precio || "0.00"}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No hay ítems.</Typography>
        )}

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Repuestos
        </Typography>
        <Typography variant="body2">{data.respuestos || "No especificado"}</Typography>

        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ViewFalsaProformaModal;
