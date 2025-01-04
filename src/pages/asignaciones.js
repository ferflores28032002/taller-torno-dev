import { Box, Container, Stack } from "@mui/system";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AssignmentsTable } from "src/sections/Assignments/AssignmentsTable";

const Page = () => {
  return (
    <>
      <Head>
        <title>Asignaciones | Taller Centeno</title>
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
              <AssignmentsTable />
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
