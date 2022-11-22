import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { addDoc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";
import { colRef, docRef } from "../app/ref";
import {Note, NoteList } from "../app/types";

export const getNote = createAsyncThunk(
  "note/getNote",
  async ({ uid }: any, thunkAPI) => {
    try {
      let data: any = [];
      const querySnapshot = await getDocs(colRef(uid));
      querySnapshot.forEach((doc) => {
        data.push({ [doc.id]: doc.data() });
      });
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.toString());
    }
  },
);

export const createNote = createAsyncThunk(
  "note/createNote",
  async ({ formData, uid }: any, thunkAPI) => {
    try {
      const addedDocRef = await addDoc(colRef(uid), {
        ...formData,
      });
      return { [addedDocRef.id]: formData };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const updateNote = createAsyncThunk(
  "note/updateNote",
  async ({ updatedData, uid, id }: any, thunkAPI) => {
    try {
      await updateDoc(docRef(uid, id), {
        ...updatedData,
      });
      return { id, updatedData };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const deleteNote = createAsyncThunk(
  "note/deleteNote",
  async ({ uid, id }: any, thunkAPI) => {
    try {
      await deleteDoc(docRef(uid, id));
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.toString());
    }
  },
);

const initialState: NoteList = {
  noteList: [{}],
  status: "",
  message: "",
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    reset: (state) => {
      state.noteList = [{}];
      state.status = "";
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // createNote
      .addCase(createNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.status = "idle";
        state.noteList = [...state.noteList, action.payload];
        state.message = "note successfully added";
      })
      .addCase(createNote.rejected, (state, action) => {
        state.message = action.payload;
        state.status = "failed";
      })

      // getNote
      .addCase(getNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNote.fulfilled, (state, action) => {
        state.status = "idle";
        state.noteList = action.payload;
        state.message = "";
      })
      .addCase(getNote.rejected, (state, action) => {
        state.message = action.payload;
        state.status = "failed";
      })

      // editNote
      .addCase(updateNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.status = "idle";
        const foundIndex = current(state.noteList).findIndex(
          (note: Note) =>
            Object.keys(note).toString() === action.payload.id,
        );
        state.message = "note successfully updated";
        state.noteList[foundIndex][action.payload.id] =
          action.payload.updatedData;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.message = action.payload;
        state.status = "failed";
      })

      // deleteNote
      .addCase(deleteNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.status = "idle";
        state.noteList = current(state.noteList).filter(
          (note: Note) =>
            Object.keys(note).toString() !== action.payload,
        );
        state.message = "note successfully deleted";
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.message = action.payload;
        state.status = "failed";
      });
  },
});

export const { reset } = noteSlice.actions;

export default noteSlice.reducer;
