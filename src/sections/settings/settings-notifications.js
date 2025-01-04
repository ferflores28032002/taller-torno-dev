import { Box } from "@mui/material";
import { ProformasTable } from "./proformas-table";

export const ProformaGrid = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center"></Box>

      <ProformasTable />
    </Box>
  );
};
