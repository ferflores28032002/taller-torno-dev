import { Box, Container, Stack } from "@mui/system";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { EditWorkerModal } from "src/sections/companies/EditWorkerModal";
import { WorkerDetailsModal } from "src/sections/companies/WorkerDetailsModal";
import { WorkersTable } from "src/sections/companies/WorkersTable";
import axios from "axios";
import { CreateWorkerModal } from "src/sections/companies/CreateWorkerModal";
import { Button } from "@mui/material";

const API_BASE_URL = "https://www.tallercenteno.somee.com/api/Empleados";

const fetchWorkers = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

const fetchRoles = async () => {
  const response = await axios.get(`${API_BASE_URL}/Cargos`);
  return response.data;
};

const createWorker = async (worker) => {
  const response = await axios.post(API_BASE_URL, worker);
  return response.data;
};

const Page = () => {
  const [workers, setWorkers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [workersData, rolesData] = await Promise.all([fetchWorkers(), fetchRoles()]);
        setWorkers(workersData);
        setRoles(rolesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const handleEdit = (worker) => {
    setSelectedWorker(worker);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedWorker) => {
    try {
      await axios.put(`${API_BASE_URL}/${updatedWorker.id}`, updatedWorker);
      const updatedWorkers = await fetchWorkers();
      setWorkers(updatedWorkers);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setWorkers((prev) => prev.filter((worker) => worker.id !== id));
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  const handleViewDetails = (worker) => {
    setSelectedWorker(worker);
    setDetailsModalOpen(true);
  };

  const handleCreateWorker = async (newWorker) => {
    try {
      await createWorker(newWorker);

      const updatedWorkers = await fetchWorkers();
      setWorkers(updatedWorkers);
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating worker:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Reparaciones | Taller Centeno</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <div>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
                  Crear Trabajador
                </Button>
              </Box>
              <WorkersTable
                workers={workers}
                roles={roles}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
              />
              <CreateWorkerModal
                open={isCreateModalOpen}
                roles={roles}
                onClose={() => setCreateModalOpen(false)}
                onSave={handleCreateWorker}
              />
              <EditWorkerModal
                open={isEditModalOpen}
                worker={selectedWorker}
                roles={roles}
                onClose={() => setEditModalOpen(false)}
                onSave={handleSaveEdit}
              />
              <WorkerDetailsModal
                open={isDetailsModalOpen}
                worker={selectedWorker}
                onClose={() => setDetailsModalOpen(false)}
              />
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
