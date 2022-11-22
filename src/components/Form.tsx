import {
  Dialog,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { closeForm } from "../features/formSlice";
import { createNote, updateNote } from "../features/noteSlice";
import { openAlert } from "../features/alertSlice";

const MyForm = ({ uid }: any) => {
  const { message, status } = useAppSelector((store: any) => store.note);
  const { content, isOpen, id } = useAppSelector((store: any) => store.form);
  const dispatch = useAppDispatch();

  const initialState = {
    title: "",
    fruit: "",
    date: "",
  };

  const [formData, setFormData] = useState<any>(initialState);
  const { title, fruit, date } = formData;

  useEffect(() => {
    status === "idle" &&
      message !== "" &&
      dispatch(
        openAlert({
          option: "success",
          alertMessage: message,
        }),
      );
  }, [status]);

  const onChange = (e: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => {
          setFormData(initialState);
          dispatch(closeForm());
        }}
      >
        <DialogContent>
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid item xs={12} lg={6}>
              <TextField
                label="Title"
                variant="outlined"
                type="text"
                autoComplete={""}
                name="title"
                required
                sx={{ width: "100%" }}
                onChange={onChange}
                defaultValue={content?.title}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                label="date"
                type="date"
                name="date"
                autoComplete={""}
                sx={{ width: "100%" }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={onChange}
                defaultValue={content?.date}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete={""}
                label="Note"
                variant="outlined"
                type="text"
                fullWidth
                multiline
                rows={4}
                name="fruit"
                onChange={onChange}
                defaultValue={content?.fruit}
              />
            </Grid>
            <Grid item xs={12}>
              {!content ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    if (title) {
                      dispatch(createNote({ formData, uid }));
                      setFormData(initialState);
                      dispatch(closeForm());
                    } else {
                      dispatch(
                        openAlert({
                          option: "warning",
                          alertMessage: "Please fill the required fields",
                        }),
                      );
                    }
                  }}
                >
                  Add
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => {
                    const updatedData = {
                      date: date || content.date,
                      title: title || content.title,
                      fruit: fruit || content.fruit,
                    };
                    dispatch(updateNote({ updatedData, uid, id }));
                    setFormData(initialState);
                    dispatch(closeForm());
                  }}
                >
                  Update
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyForm;
