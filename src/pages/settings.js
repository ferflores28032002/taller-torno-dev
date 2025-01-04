import { Container, Stack } from "@mui/material";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ProformaGrid } from "src/sections/settings/settings-notifications";

const Page = () => (
  <>
    <Head>
      <title>Settings | Devias Kit</title>
    </Head>

    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* <Orden /> */}
        <ProformaGrid />
      </Stack>
    </Container>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
