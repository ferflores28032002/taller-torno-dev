import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  TextField,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import PropTypes from "prop-types";

export const WorkersTable = ({ workers, roles, onEdit, onDelete, onViewDetails }) => {
  const [selectedPosition, setSelectedPosition] = useState("");
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data for demonstration purposes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePositionChange = (event) => {
    setSelectedPosition(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredWorkers = workers.filter((worker) => {
    return (
      (!selectedPosition || worker.cargoNombre === selectedPosition) &&
      (!searchName || worker.nombre.toLowerCase().includes(searchName.toLowerCase()))
    );
  });

  const paginatedWorkers = filteredWorkers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card sx={{ overflow: "hidden", boxShadow: 3, borderRadius: 2, p: 2 }}>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <TextField
              placeholder="Buscar por nombre"
              variant="outlined"
              size="small"
              value={searchName}
              onChange={handleSearchChange}
              sx={{ flex: "1 1 auto", maxWidth: "300px" }}
            />
            <FormControl sx={{ flex: "1 1 auto", maxWidth: "300px" }}>
              <Select
                value={selectedPosition}
                onChange={handlePositionChange}
                displayEmpty
                size="small"
              >
                <MenuItem value="">Todos</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.nombre}>
                    {role.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            {workers.length === 0 ? (
              <Box sx={{ textAlign: "center", padding: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  No hay empleados disponibles.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">Nombre</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Apellidos</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Dirección</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Cargo</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Cédula</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Teléfono</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Acciones</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedWorkers.map((worker) => (
                      <TableRow
                        hover
                        key={worker.id}
                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell>{worker.nombre}</TableCell>
                        <TableCell>{worker.apellidos}</TableCell>
                        <TableCell>{worker.direccion}</TableCell>
                        <TableCell>{worker.cargoNombre}</TableCell>
                        <TableCell>{worker.cedula}</TableCell>
                        <TableCell>{worker.telefono}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} justifyContent="flex-start">
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => onViewDetails(worker)}
                              sx={{
                                width: 40,
                                height: 40,
                                minWidth: 0,
                                borderRadius: "8px",
                                padding: "0",
                                backgroundColor: "#6A5ACD", // Violeta
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "&:hover": {
                                  backgroundColor: "#483D8B", // Más oscuro al hover
                                },
                              }}
                            >
                              <Visibility />
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => onEdit(worker)}
                              sx={{
                                width: 40,
                                height: 40,
                                minWidth: 0,
                                borderRadius: "8px",
                                padding: "0",
                                backgroundColor: "#2196F3", // Azul
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "&:hover": {
                                  backgroundColor: "#1976D2", // Azul más oscuro
                                },
                              }}
                            >
                              <Edit />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <TablePagination
              component="div"
              count={filteredWorkers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 15]}
              labelRowsPerPage="Filas por página"
            />
          </Box>
        </>
      )}
    </Card>
  );
};

WorkersTable.propTypes = {
  workers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      apellidos: PropTypes.string.isRequired,
      direccion: PropTypes.string.isRequired,
      cargoNombre: PropTypes.string.isRequired,
      cedula: PropTypes.string.isRequired,
      telefono: PropTypes.string.isRequired,
    })
  ).isRequired,
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func,
};
