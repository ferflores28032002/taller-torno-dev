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
  TablePagination,
} from "@mui/material";
import axiosInstance from "src/api/axiosInstance";

const Tab2Content = () => {
  const [startDate, setStartDate] = useState("2024-12-23");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportData, setReportData] = useState([]); // Datos originales para la primera tabla
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados para la primera tabla
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda para la primera tabla

  const [totalesPorEmpleado, setTotalesPorEmpleado] = useState([]); // Datos originales para la segunda tabla
  const [filteredTotals, setFilteredTotals] = useState([]); // Datos filtrados para la segunda tabla
  const [searchTotalTerm, setSearchTotalTerm] = useState(""); // Término de búsqueda para la segunda tabla

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalsPage, setTotalsPage] = useState(0);
  const [totalsRowsPerPage, setTotalsRowsPerPage] = useState(10);

  const [noDataMessage, setNoDataMessage] = useState(""); // Mensaje de error

  // Fetch inicial de datos
  useEffect(() => {
    fetchReportData();
  }, []);

  // Filtrar datos para la primera tabla
  useEffect(() => {
    applyFilter();
  }, [searchTerm, reportData]);

  // Filtrar datos para la segunda tabla
  useEffect(() => {
    applyTotalsFilter();
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
      setFilteredData(reporteDetallado);
      setTotalesPorEmpleado(totales);
      setFilteredTotals(totales);

      setNoDataMessage("");

      
    } catch (error) {
      setNoDataMessage('No se encontraron proformas aprobadas en el rango de fechas proporcionado.')
      console.error("Error fetching Tab 2 data:", error);
    }
  };

  const applyFilter = () => {
    if (!searchTerm.trim()) {
      setFilteredData(reportData); // Mostrar todos los datos si no hay búsqueda
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const newFilteredData = reportData.filter((employee) =>
      employee.empleadoNombre?.toLowerCase().includes(lowercasedSearch)
    );

    setFilteredData(newFilteredData);
  };

  const applyTotalsFilter = () => {
    if (!searchTotalTerm.trim()) {
      setFilteredTotals(totalesPorEmpleado); // Mostrar todos los datos si no hay búsqueda
      return;
    }

    const lowercasedSearch = searchTotalTerm.toLowerCase();
    const newFilteredTotals = totalesPorEmpleado.filter((total) =>
      total.empleadoNombre?.toLowerCase().includes(lowercasedSearch)
    );

    setFilteredTotals(newFilteredTotals);
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

      {noDataMessage ? (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {noDataMessage}
        </Typography>
      ) : (
        <>
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((empleado, index) => (
                        <TableRow key={index}>
                          <TableCell>{empleado.empleadoNombre}</TableCell>
                          <TableCell>{empleado.seccionNombre}</TableCell>
                          <TableCell>{empleado.clienteNombre}</TableCell>
                          <TableCell>{empleado.numeroProforma}</TableCell>
                          <TableCell style={{ color: empleado.totalGanado > 0 ? "blue" : "red" }}>
                            C${empleado.totalGanado.toLocaleString()}
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
            </>
          )}

          {/* Buscador para la tabla de totales */}
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
                  .map((total, index) => (
                    <TableRow key={index}>
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
        </>
      )}
    </Box>
  );
};

export default Tab2Content;
