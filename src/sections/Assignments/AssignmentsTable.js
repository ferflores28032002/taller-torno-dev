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
  TextField,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import axios from "axios";
import { InfoModal } from "./InfoModal";
import axiosInstance from "src/api/axiosInstance";

export const AssignmentsTable = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axiosInstance.get("Proformas/proformasAprobadas");
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (id) => {
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedId(null);
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.cliente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedAssignments = filteredAssignments.slice(
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
              justifyContent: "space-between",
              marginBottom: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Buscar"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ flex: "1 1 auto", maxWidth: "300px" }}
            />
          </Box>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            {assignments.length === 0 ? (
              <Box sx={{ textAlign: "center", padding: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  No hay asignaciones disponibles.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2">Número Proforma</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Marca Motor</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Cliente</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Fecha Emisión</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">Estado</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2">Acciones</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedAssignments.map((assignment) => (
                      <TableRow key={assignment.id} hover>
                        <TableCell>{assignment.numeroProforma}</TableCell>
                        <TableCell>{assignment.marcaMotor}</TableCell>
                        <TableCell>{assignment.cliente}</TableCell>
                        <TableCell>
                          {new Date(assignment.fechaEmision).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{assignment.estado}</TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleOpenModal(assignment.id)}
                            >
                              Asignar
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
              count={filteredAssignments.length}
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
      <InfoModal id={selectedId} open={modalOpen} onClose={handleCloseModal} />
    </Card>
  );
};
