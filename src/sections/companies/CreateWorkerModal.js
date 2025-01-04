import { Box, Modal, Stack, TextField, Button, Select, MenuItem, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

export const CreateWorkerModal = ({ open, roles, onClose, onSave }) => {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    direccion: "",
    cargoId: "",
    cedula: "",
    telefono: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="create-worker-modal-title">
      <Box
        sx={{
          p: 4,
          backgroundColor: "background.paper",
          borderRadius: 4,
          width: "100%",
          maxWidth: 500,
          boxShadow: 3,
          margin: "auto",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          "@media (max-width: 600px)": {
            width: "98%",
            maxWidth: "100%",
            borderRadius: 0,
            margin: "auto",
          },
        }}
      >
        <Typography id="create-worker-modal-title" variant="h6" mb={2}>
          Crear Trabajador
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            placeholder="Apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            placeholder="Dirección"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            variant="outlined"
          />
          <Select
            fullWidth
            name="cargoId"
            value={form.cargoId}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Seleccionar cargo
            </MenuItem>
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.nombre}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            placeholder="Cédula"
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            placeholder="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            variant="outlined"
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose} color="secondary">
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSubmit} color="primary">
              Crear
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

CreateWorkerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
