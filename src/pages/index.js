import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import {
  Box,
  Container,
  CircularProgress,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewBudget } from "src/sections/overview/overview-budget";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import useAuthStore from "src/store/useAuthStore"; // Zustand store

const Page = () => {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!role) {
      router.push("/auth/login");
    } else {
      setIsCheckingAuth(false); // Authentication check completed
    }
  }, [role, router]);

  if (isCheckingAuth) {
    // Render a styled loader while checking authentication
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress size={64} />
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            color: "text.secondary",
          }}
        >
          Cargando ...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Overview | Devias Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewBudget difference={12} positive sx={{ height: "100%" }} value="$24k" />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalCustomers
                difference={16}
                positive={false}
                sx={{ height: "100%" }}
                value="1.6k"
              />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTasksProgress sx={{ height: "100%" }} value={75.5} />
            </Grid>
            <Grid xs={12} lg={8}>
              <OverviewSales
                chartSeries={[
                  {
                    name: "This year",
                    data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
                  },
                  {
                    name: "Last year",
                    data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OverviewTraffic
                chartSeries={[63, 15, 22]}
                labels={["Desktop", "Tablet", "Phone"]}
                sx={{ height: "100%" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
