import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Scrollbar } from "src/components/scrollbar";
import RepairDetailsModal from "./RepairDetailsModal";
import EditRepairModal from "./EditRepairModal";
import axiosInstance from "src/api/axiosInstance";

export const ReparacionesTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    isEditModalOpen,
    setEditModalOpen,
  } = props;

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);

  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          "Reparaciones/Estados"
        );
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const filteredItems = items.filter((reparacion) => {
    const matchesSearch =
      reparacion.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reparacion.marcaMotor.toLowerCase().includes(searchTerm.toLowerCase());

    const withinDateRange =
      (!startDate || new Date(reparacion.fechaInicio) >= new Date(startDate)) &&
      (!endDate || new Date(reparacion.fechaInicio) <= new Date(endDate));

    const matchesState = !selectedState || reparacion.estado === selectedState;

    return matchesSearch && withinDateRange && matchesState;
  });

  const handleEditClick = (reparacion) => {
    setSelectedRepair(reparacion);
    setEditModalOpen(true);
  };
  const handleUpdate = () => {
    setEditModalOpen(false);
  };

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        {loading ? (
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            sx={{
              width: "100%",
              "& > *": { width: { xs: "100%", sm: "auto" } },
            }}
          >
            <TextField
              placeholder="Buscar por Cliente o Marca"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
            <TextField
              label="Fecha Inicio Desde"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
            />
            <TextField
              label="Fecha Inicio Hasta"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
            />
            <Select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="">
                <em>Todos los Estados</em>
              </MenuItem>
              {states.map((state) => (
                <MenuItem key={state.id} value={state.nombre}>
                  {state.nombre}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              onClick={() => {
                setSearchTerm("");
                setStartDate("");
                setEndDate("");
                setSelectedState("");
              }}
            >
              Limpiar Filtros
            </Button>
          </Stack>
        )}
      </Box>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Marca del Motor</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha de Inicio</TableCell>
                <TableCell>Fecha de Retiro Final</TableCell>
                <TableCell>Fecha Estimada de Entrega</TableCell>
                <TableCell>Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((reparacion) => (
                <TableRow hover key={reparacion.id}>
                  <TableCell>{reparacion.cliente || "N/A"}</TableCell>
                  <TableCell>{reparacion.marcaMotor || "N/A"}</TableCell>
                  <TableCell>{reparacion.estado}</TableCell>
                  <TableCell>{format(new Date(reparacion.fechaInicio), "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    {format(new Date(reparacion.fechaRetiroFinal), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell sx={{ color: reparacion.fechaEstimadaEntregaColor }}>
                    {format(new Date(reparacion.fechaEstimadaEntrega), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <RepairDetailsModal
                        open={isDetailsModalOpen}
                        onClose={() => setDetailsModalOpen(false)}
                        reparacion={reparacion}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleEditClick(reparacion)}
                      >
                        Editar
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={filteredItems.length}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {selectedRepair && (
        <EditRepairModal
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          repairData={selectedRepair}
          onUpdate={handleUpdate}
        />
      )}
    </Card>
  );
};

ReparacionesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
