import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";

const ProformaModal = ({ open, onClose, proformaData }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflowY: "auto",
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="proforma-modal">
      <Box sx={style}>
        {proformaData ? (
          <>
            <Typography variant="h5" gutterBottom>
              Detalles de la Proforma
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1">
              <strong>Número de Proforma:</strong> {proformaData.numeroProforma || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Fecha:</strong> {proformaData.fechaProforma || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Cliente:</strong> {proformaData.clienteNombre || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Marca del Motor:</strong> {proformaData.marcaMotor || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Número del Motor:</strong> {proformaData.numeroMotor || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Total Ganado:</strong> {proformaData.totalGanado || "N/A"}
            </Typography>

            <Typography variant="h6" gutterBottom mt={2}>
              Secciones
            </Typography>

            {proformaData.items && proformaData.items.length > 0 ? (
              proformaData.items.map((item, index) => (
                <Box key={index} mb={3}>
                  <Typography variant="body1">
                    <strong>Descripción:</strong> {item.descripcion || "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Precio:</strong> {item.precio || "N/A"}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No se encontraron ítems en esta proforma.
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body1" color="error">
            No hay datos disponibles.
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{ mt: 2, float: "right" }}
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );
};

export default ProformaModal;
