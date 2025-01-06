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
  TablePagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axiosInstance from "src/api/axiosInstance";

const Tab2Content = () => {
  const [startDate, setStartDate] = useState("2024-12-23");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportData, setReportData] = useState([]);
  const [totalesPorEmpleado, setTotalesPorEmpleado] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredTotals, setFilteredTotals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTotalTerm, setSearchTotalTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalsPage, setTotalsPage] = useState(0);
  const [totalsRowsPerPage, setTotalsRowsPerPage] = useState(10);

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

  useEffect(() => {
    if (searchTotalTerm.trim() === "") {
      setFilteredTotals(totalesPorEmpleado);
    } else {
      const lowercasedSearch = searchTotalTerm.toLowerCase();
      setFilteredTotals(
        totalesPorEmpleado.filter((total) =>
          total.empleadoNombre.toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [searchTotalTerm, totalesPorEmpleado]);

  const fetchReportData = async () => {
    if (!startDate || !endDate) {
      console.error("Las fechas de inicio y fin son obligatorias");
      return;
    }

    try {
      const response = await axiosInstance.get(
        `Proformas/Reporte?startDate=${startDate}&endDate=${endDate}`
      );

      const reporteDetallado = response.data.reporteDetallado || [];
      const totales = response.data.totalesPorEmpleado || [];

      setReportData(reporteDetallado);
      setTotalesPorEmpleado(totales);
      setFilteredData(reporteDetallado);
      setFilteredTotals(totales);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTotalsChangePage = (event, newPage) => {
    setTotalsPage(newPage);
  };

  const handleTotalsChangeRowsPerPage = (event) => {
    setTotalsRowsPerPage(parseInt(event.target.value, 10));
    setTotalsPage(0);
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

      {/* Buscador principal */}
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
          {/* Tabla principal */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Empleado</TableCell>
                  <TableCell>Sección</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Proforma</TableCell>
                  <TableCell>Total Ganado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((empleado) => (
                    <TableRow key={empleado.numeroProforma}>
                      <TableCell>{empleado.empleadoNombre}</TableCell>
                      <TableCell>{empleado.seccionNombre}</TableCell>
                      <TableCell>{empleado.clienteNombre}</TableCell>
                      <TableCell>{empleado.numeroProforma}</TableCell>
                      <TableCell style={{ color: empleado.totalGanado > 0 ? "blue" : "red" }}>
                        C${empleado.totalGanado.toLocaleString()}
                      </TableCell>
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
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* Filtro y tabla de totales */}
          <TextField
            variant="outlined"
            fullWidth
            sx={{ mb: 3 }}
            value={searchTotalTerm}
            onChange={(e) => setSearchTotalTerm(e.target.value)}
            placeholder="Filtrar totales por nombre del empleado..."
          />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Totales por Empleado
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Empleado</TableCell>
                  <TableCell>Sección</TableCell>
                  <TableCell>Total Acumulado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTotals
                  .slice(
                    totalsPage * totalsRowsPerPage,
                    totalsPage * totalsRowsPerPage + totalsRowsPerPage
                  )
                  .map((total) => (
                    <TableRow key={`${total.empleadoNombre}-${total.seccionNombre}`}>
                      <TableCell>{total.empleadoNombre}</TableCell>
                      <TableCell>{total.seccionNombre}</TableCell>
                      <TableCell style={{ color: total.totalAcumulado > 0 ? "green" : "red" }}>
                        C${total.totalAcumulado.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredTotals.length}
            page={totalsPage}
            onPageChange={handleTotalsChangePage}
            rowsPerPage={totalsRowsPerPage}
            onRowsPerPageChange={handleTotalsChangeRowsPerPage}
          />

          {/* Modal */}
          {selectedEmployee && (
            <Dialog
              open={openModal}
              onClose={handleCloseModal}
              maxWidth="md"
              fullWidth
              fullScreen={isFullScreen}
            >
              <DialogTitle>Detalles de {selectedEmployee.empleadoNombre}</DialogTitle>
              <DialogContent>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Cliente: {selectedEmployee.clienteNombre}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Marca Motor: {selectedEmployee.marcaMotor}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Número Motor: {selectedEmployee.numeroMotor}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Fecha Proforma: {new Date(selectedEmployee.fechaProforma).toLocaleString()}
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
                        <TableCell style={{ color: item.precio > 0 ? "blue" : "red" }}>
                          C${item.precio.toLocaleString()}
                        </TableCell>
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
