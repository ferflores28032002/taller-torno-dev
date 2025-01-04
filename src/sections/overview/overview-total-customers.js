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

export const OverviewTotalCustomers = ({ sx }) => {
  const [proformas, setProformas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProformas = async () => {
      try {
        const response = await axiosInstance.get("Proformas");
        setProformas(response.data);
      } catch (err) {
        setError("Error fetching proformas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProformas();
  }, []);

  const totalProformas = proformas.length;
  const issuedProformas = proformas.filter((proforma) => proforma.estado === "Emitida").length;
  const difference = totalProformas > 0 ? ((issuedProformas / totalProformas) * 100).toFixed(2) : 0;
  const positive = difference >= 50;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Proformas
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4">{totalProformas || 0}</Typography>
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
              Total de proformas emitidas
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

OverviewTotalCustomers.propTypes = {
  sx: PropTypes.object,
};
