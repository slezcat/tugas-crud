import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  Box,
  Grid,
  LinearProgress,
  Paper,
  SpeedDial,
  SpeedDialIcon,
  Typography,
} from "@mui/material";
import MyForm from "./components/Form";
import MyCard from "./components/Card";
import { getGrocery, reset } from "./features/grocerySlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { openForm } from "./features/formSlice";
import { Grocery } from "./app/types";
import MyAppBar from "./components/AppBar";
import MyAlert from "./components/Alert";
import { openAlert } from "./features/alertSlice";

function App() {
  const { groceryList, status, message } = useAppSelector(
    (store) => store.grocery,
  );
  const { option, alertMessage } = useAppSelector((store) => store.alert);
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<any>("no user");
  const { displayName, uid, email } = user;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => (user ? setUser(user) : setUser("")));

    user
      ? (async () => {
          await setDoc(doc(db, "users", uid), {
            displayName,
            uid,
            email,
          });
          
          dispatch(getGrocery({ uid }));
        })()
      : dispatch(reset());

    status === "failed" && dispatch(openAlert({ option: "error", message }));
  }, [user, dispatch]);

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: "0",
          bottom: "100vh",
          height: "10px",
          zIndex: "50",
        }}
      >
        {status == "loading" && <LinearProgress />}
      </Box>

      <Paper
        sx={{
          mx: { md: "10vw" },
          mt: { md: "6vh", xs: "-10px" },
          backgroundColor: "#e7ebf0",
        }}
      >
        <MyAppBar user={user} />

        {/* content */}
        <Grid
          sx={{
            justifyContent: "center",
            p: {
              md: `${!user || groceryList.length === 0 ? "150px" : "20px"}`,
              xs:"20px"
            },
          }}
          container
          spacing={2}
        >
          {!user && (
            <Typography
              variant="h5"
              sx={{ mt: "2vh", py: "20px" }}
              color="text.secondary"
            >
              Please Login to Continue
            </Typography>
          )}
          {groceryList.length !== 0 ? (
            groceryList.map((item: Grocery, index: number) => {
              return Object.keys(item).map((id, index) => {
                return (
                  <Grid
                    item
                    xs={8}
                    md={6}
                    lg={4}
                    sx={{ justifySelf: "center", pt: "20px" }}
                  >
                    <MyCard
                      key={index}
                      uid={uid}
                      data={item[id]}
                      id={id}
                    ></MyCard>
                  </Grid>
                );
              });
            })
          ) : (
            <Typography
              variant="h5"
              sx={{ mt: "2vh", py: "20px" }}
              color="text.secondary"
            >
              Add new note
            </Typography>
          )}
        </Grid>
      </Paper>

      {/* add button if user logged in */}
      {user && (
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClick={() => dispatch(openForm(null))}
        />
      )}

      {/* form by default is hidden */}
      <MyForm uid={uid}></MyForm>
      <MyAlert option={option} message={message} />
    </>
  );
}

export default App;
