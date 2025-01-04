import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axiosInstance from "src/api/axiosInstance";

const Tab2Content = () => {
  const [startDate, setStartDate] = useState("2024-12-23");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchReportData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(reportData);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredData(
        reportData.filter((employee) =>
          employee.empleadoNombre.toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [searchTerm, reportData]);

  const fetchReportData = async () => {
    if (!startDate || !endDate) {
      console.error("Las fechas de inicio y fin son obligatorias");
      return;
    }

    try {
      const response = await axiosInstance.get(
        `Proformas/Reporte?startDate=${startDate}&endDate=${endDate}`
      );
      setReportData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching Tab 2 data:", error);
    }
  };

  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
  };

  return (
    <Box>
      {/* Inputs de filtros */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <TextField
          label="Fecha Inicio"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="Fecha Fin"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" onClick={fetchReportData}>
          Generar
        </Button>
      </Stack>

      {/* Buscador */}
      <TextField
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Escribe el nombre del empleado..."
      />

      {filteredData.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No hay datos que mostrar para las fechas seleccionadas o búsqueda.
        </Typography>
      ) : (
        <>
          {/* Tabla */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Empleado</TableCell>
                  <TableCell>Sección</TableCell>
                  <TableCell>Total Ganado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((empleado) => (
                  <TableRow key={empleado.empleadoNombre}>
                    <TableCell>{empleado.empleadoNombre}</TableCell>
                    <TableCell sx={{ cursor: "pointer", color: "red" }}>
                      {empleado.seccionNombre}
                    </TableCell>
                    <TableCell>${empleado.totalGanado.toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <Button variant="contained" onClick={() => handleOpenModal(empleado)}>
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Modal */}
          {selectedEmployee && (
            <Dialog
              open={openModal}
              onClose={handleCloseModal}
              maxWidth="md"
              fullWidth
              fullScreen={isFullScreen} // Condicional para pantallas pequeñas
            >
              <DialogTitle>Detalles de {selectedEmployee.empleadoNombre}</DialogTitle>
              <DialogContent>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Sección: {selectedEmployee.seccionNombre}
                </Typography>

                {/* Tabla de Detalles */}
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Precio</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedEmployee.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.descripcion}</TableCell>
                        <TableCell>${item.precio.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} variant="contained">
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </>
      )}
    </Box>
  );
};

export default Tab2Content;
