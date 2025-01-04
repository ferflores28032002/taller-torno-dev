import PropTypes from "prop-types";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { Chart } from "src/components/chart";
import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "src/api/axiosInstance";

const useChartOptions = (labels) => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
    },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
    dataLabels: {
      enabled: false,
    },
    labels,
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      fillSeriesColor: false,
    },
  };
};

export const OverviewTraffic = ({ sx }) => {
  const [chartSeries, setChartSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const estadosResponse = await axiosInstance.get("Reparaciones/Estados");
        const reparacionesResponse = await axiosInstance.get("Reparaciones");

        const estados = estadosResponse.data;
        setLabels(estados.map((estado) => estado.nombre));

        const seriesData = estados.map((estado) => {
          return reparacionesResponse.data.filter(
            (reparacion) => reparacion.estado === estado.nombre
          ).length;
        });

        setChartSeries(seriesData);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = useChartOptions(labels);

  return (
    <Card sx={sx}>
      <CardHeader title="Estado de Reparaciones" />
      <CardContent>
        {isLoading ? (
          <Typography variant="body2" color="text.secondary">
            Cargando...
          </Typography>
        ) : error ? (
          <Typography variant="body2">
            <Alert severity="error" sx={{ width: "100%" }}>
              No hay reparaciones registradas para mostrar.
            </Alert>
          </Typography>
        ) : (
          <>
            <Chart
              height={300}
              options={chartOptions}
              series={chartSeries}
              type="donut"
              width="100%"
            />
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="center"
              spacing={2}
              sx={{ mt: 2 }}
            >
              {chartSeries.map((item, index) => {
                const label = labels[index];
                const color = chartOptions.colors[index] || "#000";

                return (
                  <Box
                    key={label}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <SvgIcon>
                      <circle cx="12" cy="12" r="10" fill={color} />
                    </SvgIcon>
                    <Typography sx={{ my: 1 }} variant="h6">
                      {label}
                    </Typography>
                    <Typography color="text.secondary" variant="subtitle2">
                      {item}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};

OverviewTraffic.propTypes = {
  sx: PropTypes.object,
};
