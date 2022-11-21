import { Card, Grid, Modal, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { closeForm } from "../features/formSlice";
import { createGrocery, updateGrocery } from "../features/grocerySlice";
import { Form } from "../app/types";
import { openAlert } from "../features/alertSlice";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const MyForm = ({ uid }: any) => {
  const { message, status } = useAppSelector((store: any) => store.grocery);
  const { content, isOpen, id } = useAppSelector((store: any) => store.form);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<any>({
    title: "",
    fruit: "",
    date: "",
  });
  const { title, fruit, date } = formData;

  useEffect(() => {
    status === "idle" &&
      message !== "" &&
      dispatch(
        openAlert({
          option: "success",
          message: message,
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
      <Modal open={isOpen} onClose={() => dispatch(closeForm())}>
        <Card sx={style}>
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid item xs={6}>
              <TextField
                label="Title"
                variant="outlined"
                type="text"
                name="title"
                sx={{ width: "100%" }}
                onChange={onChange}
                defaultValue={content?.title}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="date"
                type="date"
                name="date"
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
                label="Fruit"
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
                    dispatch(createGrocery({ formData, uid }));
                    dispatch(closeForm());
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
                      fruit: fruit || content.date,
                    };
                    dispatch(updateGrocery({ updatedData, uid, id }));
                    dispatch(closeForm());
                  }}
                >
                  Update
                </Button>
              )}
            </Grid>
          </Grid>
        </Card>
      </Modal>
    </>
  );
};

export default MyForm;
