import PropTypes from "prop-types";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  SvgIcon,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "src/components/chart";
import axiosInstance from "src/api/axiosInstance";

const useChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "40px",
      },
    },
    stroke: {
      colors: ["transparent"],
      show: true,
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      categories: [
        "ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value}K` : `${value}`),
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
};

export const OverviewSales = ({ sx }) => {
  const [reparaciones, setReparaciones] = useState([]);
  const [chartSeries, setChartSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartOptions = useChartOptions();

  useEffect(() => {
    const fetchReparaciones = async () => {
      try {
        const response = await axiosInstance.get("Reparaciones");
        setReparaciones(response.data);
        const monthlyData = Array(12).fill(0);
        response.data.forEach((reparacion) => {
          const month = new Date(reparacion.fechaInicio).getMonth();
          monthlyData[month] += 1;
        });
        setChartSeries([{ name: "Reparaciones", data: monthlyData }]);
      } catch (err) {
        setError("Error fetching reparaciones");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReparaciones();
  }, []);

  return (
    <CardContent>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
          <span style={{ marginLeft: "10px" }}>Cargando datos...</span>
        </div>
      ) : error ? (
        <Alert severity="error" sx={{ width: "100%" }}>
          No hay reparaciones registradas para mostrar.
        </Alert>
      ) : reparaciones.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "#666", fontSize: "16px" }}>
            No hay reparaciones registradas para mostrar.
          </p>
        </div>
      ) : (
        <Chart height={350} options={chartOptions} series={chartSeries} type="bar" width="100%" />
      )}
    </CardContent>
  );
};

OverviewSales.propTypes = {
  sx: PropTypes.object,
};
