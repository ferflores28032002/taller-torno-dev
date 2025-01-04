import { Box, Container, Stack, Tab, Tabs, Typography, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import axiosInstance from "src/api/axiosInstance";
import Tab2Content from "src/sections/reportes/Tab2Content";

const Reportes = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [startDate, setStartDate] = useState("2024-12-23");
  const [endDate, setEndDate] = useState("2025-01-04");
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const fetchReportData = async () => {
    if (!startDate || !endDate) {
      console.error("Las fechas de inicio y fin son obligatorias");
      return;
    }

    try {
      const response = await axiosInstance.get(
        `Proformas/GetTotalsByApprovedProformasBySection?startDate=${startDate}&endDate=${endDate}`
      );

      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Reportes | Taller Centeno</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="report-tabs"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Totales por Sección Aprobada" />
              <Tab label="Reporte Detallado de Proformas" />
            </Tabs>

            {activeTab === 0 && (
              <Box>
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

                {reportData.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    No hay datos que mostrar para las fechas seleccionadas.
                  </Typography>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={reportData}>
                        <XAxis dataKey="sectionName" stroke="#8884d8" />
                        <YAxis stroke="#8884d8" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#8884d8" barSize={50} />
                      </BarChart>
                    </ResponsiveContainer>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6">Resultados Totales</Typography>
                      <ul>
                        {reportData.map((item) => (
                          <li key={item.sectionName}>
                            {item.sectionName}: ${item.total.toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </Box>
                  </>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Tab2Content />
              </Box>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Reportes.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Reportes;
