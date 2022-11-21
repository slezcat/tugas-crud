import { forwardRef } from "react";
import { closeAlert } from "../features/alertSlice";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "../app/hooks";

const Alert = forwardRef(function Alert(props:any, ref:any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MyAlert({ option, message }:any) {
  const dispatch = useAppDispatch();
  const { isAlertOpen } = useAppSelector((state) => state.alert);

  const handleClose = (event:any, reason:string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeAlert());
  };

  const options = (option:string) => {
    switch (option) {
      case "success":
        return {
          severity: "success",
          message,
        };
      case "warning":
        return {
          severity: "warning",
          message,
        };
      case "error":
        return {
          severity: "error",
          message,
        };
      default:
        break;
    }
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={isAlertOpen}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
      >
        <Alert
          severity={options(option)?.severity}
          sx={{ width: "100%" ,pr:3}}
        >
          {options(option)?.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
