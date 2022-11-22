import { forwardRef } from "react";
import { closeAlert } from "../features/alertSlice";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "../app/hooks";

const Alert = forwardRef(function Alert(props:any, ref:any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MyAlert() {
  const dispatch = useAppDispatch();
  const { isAlertOpen,option, alertMessage,duration } = useAppSelector((state) => state.alert);

  const handleClose = (event:any, reason:string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeAlert());
  };

  return (
   
      <Snackbar
        open={isAlertOpen}
        autoHideDuration={duration}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        sx={{ bottom: { xs: 90, sm: 10 } }}
      >
        <Alert
          severity={option}
          sx={{ width: "100%" ,pr:3}}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
   
  );
}
