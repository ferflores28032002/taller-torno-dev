import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
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

export const OverviewBudget = ({ sx }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("OrdenTrabajo");
        setOrders(response.data);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const positive = totalOrders >= 10; // Define a threshold dynamically

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Ordenes
            </Typography>
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4">{totalOrders || 0}</Typography>
            )}
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
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
              Total de ordenes
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

OverviewBudget.propTypes = {
  sx: PropTypes.object,
};
