import { Box } from "@mui/material";
import { BorradorProformasTable } from "./BorradorProformasTable";

export const BorradorProformaGrid = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center"></Box>

      <BorradorProformasTable />
    </Box>
  );
};
