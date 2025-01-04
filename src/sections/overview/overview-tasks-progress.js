import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import DocumentIcon from "@heroicons/react/24/solid/DocumentIcon";
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "src/api/axiosInstance";

export const OverviewTasksProgress = ({ sx }) => {
  const [reparaciones, setReparaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReparaciones = async () => {
      try {
        const response = await axiosInstance.get("Reparaciones");
        setReparaciones(response.data);
      } catch (err) {
        setError("Error fetching reparaciones");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReparaciones();
  }, []);

  const totalReparaciones = reparaciones.length;
  const finalizadas = reparaciones.filter(
    (reparacion) => reparacion.estado === "Finalizado"
  ).length;
  const difference =
    totalReparaciones > 0 ? ((finalizadas / totalReparaciones) * 100).toFixed(2) : 0;
  const positive = difference >= 50;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Reparaciones
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4">{totalReparaciones || 0}</Typography>
            )}
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "primary.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <DocumentIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        {!isLoading && !error && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon color={positive ? "success" : "error"} fontSize="small">
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              Total de reparaciones
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

OverviewTasksProgress.propTypes = {
  sx: PropTypes.object,
};
