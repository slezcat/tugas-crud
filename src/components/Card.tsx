import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardHeader, Divider, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useAppDispatch } from "../app/hooks";
import { openForm } from "../features/formSlice";
import { deleteNote } from "../features/noteSlice";

export default function MyCard({ data, id, uid }: any) {
  const { fruit, date, title } = data;

  const dispatch = useAppDispatch();

  return (
    <Card sx={{ justifySelf: "center" }}>
      <CardHeader
        action={
          <IconButton
            aria-label="delete"
            onClick={() => dispatch(deleteNote({ uid, id }))}
          >
            <ClearIcon />
          </IconButton>
        }
        title={<Typography variant="h5">{title}</Typography>}
        subheader={
          <Typography variant="body1" color="text.secondary">
            {date}
          </Typography>
        }
      />
      {/* <Divider variant="middle" /> */}
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ wordWrap: "break-word" }}
        >
          {fruit}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => dispatch(openForm({ data, id }))}>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}
