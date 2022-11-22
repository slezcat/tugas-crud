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
  createTheme,
  Fab,
  Grid,
  LinearProgress,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import MyForm from "./components/Form";
import MyCard from "./components/Card";
import { getNote, reset } from "./features/noteSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { openForm } from "./features/formSlice";
import { Note } from "./app/types";
import MyAppBar from "./components/AppBar";
import MyAlert from "./components/Alert";
import { openAlert } from "./features/alertSlice";
import AddIcon from "@mui/icons-material/Add";

const theme = createTheme({
  // palette: {
  //   primary: {
  //     main: "#699BF7",
  //     contrastText: "#fbfbfb",
  //   },
  // },
});

function App() {
  const { noteList, status, message } = useAppSelector(
    (store) => store.note,
  );
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

          dispatch(getNote({ uid }));
        })()
      : dispatch(reset());

    status === "failed" && dispatch(openAlert({ option: "error", message }));
  }, [user, dispatch]);

  return (
    <>
      <ThemeProvider theme={theme}>
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
            // mx: { md: "10vw" },
            // mt: { md: "6vh", xs: "-10px" },
            mt: "-10px",
            backgroundColor: "#e7ebf0",
            minHeight: "100vh",
          }}
        >
          <MyAppBar user={user} />

          {/* content */}
          <Grid
            sx={{
              justifyContent: "center",
              p: {
                md: `${!user || noteList.length === 0 ? "150px" : "20px"}`,
                xs: "20px",
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
            {noteList.length !== 0 ? (
              noteList.map((item: Note, index: number) => {
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
          <Fab
            color="primary"
            onClick={() => dispatch(openForm(null))}
            sx={{
              position: "absolute",
              bottom: (theme) => theme.spacing(2),
              right: (theme) => theme.spacing(2),
            }}
          >
            <AddIcon />
          </Fab>
        )}

        {/* form by default is hidden */}
        <MyAlert />
        <MyForm uid={uid}></MyForm>
      </ThemeProvider>
    </>
  );
}

export default App;
