import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useCallback } from "react";
import useAuthStore from "src/store/useAuthStore";

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleSignOut = useCallback(() => {
    onClose?.();

    clearUser();

    // Elimina la clave del localStorage usada por Zustand
    localStorage.removeItem("auth-storage");

    // Redirige al usuario a la página de login
    router.push("/auth/login");

    // Opcional: Recarga la página para asegurar que no queden datos en memoria
    window.location.reload();
  }, [onClose, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Account</Typography>
        <Typography color="text.secondary" variant="body2">
          usuario admin
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleSignOut}>cerrar sesión</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
