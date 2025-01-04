import { useState } from "react";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Unstable_Grid2 as Grid,
  Stack,
  SvgIcon,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";
import { Orden } from "src/sections/account/orden";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { useTheme } from "@emotion/react";

const Page = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el buscador

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Actualiza el estado del buscador
  };

  const handleAddOrderClick = () => {
    setShowProfile(!showProfile);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detecta si es mobile

  return (
    <>
      <Head>
        <title>Account | Devias Kit</title>
      </Head>
      <Box component="main">
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <div>
              <Grid container spacing={3}>
                <Grid xs={12} md={12} lg={12} marginTop="2rem">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    
                    <CustomersSearch
                      onChange={handleSearchChange} // Pasar el manejador del buscador
                      value={searchQuery} // Vincular el estado
                    >
                      <Button
                        startIcon={
                          !isMobile && ( // Muestra el ícono solo si no es mobile
                            <SvgIcon fontSize="small">
                              {!showProfile ? <PlusIcon /> : <EyeIcon />}
                            </SvgIcon>
                          )
                        }
                        variant="contained"
                        onClick={handleAddOrderClick}
                        sx={{
                          width: { xs: "200px", sm: "auto" }, // 200px en mobile, auto en pantallas más grandes
                        }}
                      >
                        {!showProfile ? "Nueva Orden" : "Ver ordenes"}
                      </Button>
                    </CustomersSearch>
                  </Box>
                  {showProfile ? <AccountProfileDetails /> : <Orden searchQuery={searchQuery} />}
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
