import React, { useState } from "react";
import { Modal, Box, Typography, Button, SvgIcon } from "@mui/material";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "100%", sm: "50%" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function RepairDetailsModal({ reparacion }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        startIcon={
          <SvgIcon fontSize="small">
            <EyeIcon />
          </SvgIcon>
        }
        variant="contained"
        onClick={handleOpen}
      >
        Ver
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Detalles de Reparación
          </Typography>
          <Typography>
            <strong>Orden:</strong> #{reparacion?.ordenDeTrabajoId}
          </Typography>
          <Typography>
            <strong>Cliente:</strong> {reparacion?.cliente || "N/A"}
          </Typography>
          <Typography>
            <strong>Fecha de Inicio:</strong>{" "}
            {new Date(reparacion?.fechaInicio).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Estado:</strong> {reparacion?.estado}
          </Typography>
          <Typography>
            <strong>Fecha de Retiro Final:</strong>{" "}
            {new Date(reparacion?.fechaRetiroFinal).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Fecha de Entrega Esperada:</strong>{" "}
            {new Date(reparacion?.fechaEstimadaEntrega).toLocaleDateString()}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Repuestos:</strong>
          </Typography>
          <Typography>{reparacion?.respuestos || "Sin información"}</Typography>
          <Button variant="contained" color="primary" onClick={handleClose} sx={{ mt: 3 }}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </>
  );
}
