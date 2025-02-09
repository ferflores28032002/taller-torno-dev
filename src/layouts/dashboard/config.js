import BarChartIcon from "@mui/icons-material/BarChart";
import BuildIcon from "@mui/icons-material/Build";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Overview",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <BarChartIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Reportes",
    path: "/reportes",
    icon: (
      <SvgIcon fontSize="small">
        <BarChartIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Reparaciones",
    path: "/customers",
    icon: (
      <SvgIcon fontSize="small">
        <BuildIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Trabajadores",
    path: "/companies",
    icon: (
      <SvgIcon fontSize="small">
        <PeopleIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Asignaciones",
    path: "/asignaciones",
    icon: (
      <SvgIcon fontSize="small">
        <AssignmentIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Borrador",
    path: "/borrador",
    icon: (
      <SvgIcon fontSize="small">
        <DescriptionIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Ordenes de Trabajo",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <WorkOutlineIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Proformas",
    path: "/settings",
    icon: (
      <SvgIcon fontSize="small">
        <DescriptionIcon />
      </SvgIcon>
    ),
  },
];
