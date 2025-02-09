import { Container, Stack } from "@mui/material";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { BorradorProformaGrid } from "src/sections/borrador/BorradorProformaGrid";

const Page = () => (
  <>
    <Head>
      <title>Settings | Devias Kit</title>
    </Head>

    <Container maxWidth="xl">
      <Stack spacing={3}>
        <BorradorProformaGrid />
      </Stack>
    </Container>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
