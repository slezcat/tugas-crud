import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { addDoc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";
import { colRef, docRef } from "../app/ref";
import { Grocery, GroceryList } from "../app/types";

export const getGrocery = createAsyncThunk(
  "grocery/getGrocery",
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

export const createGrocery = createAsyncThunk(
  "grocery/createGrocery",
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

export const updateGrocery = createAsyncThunk(
  "grocery/updateGrocery",
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

export const deleteGrocery = createAsyncThunk(
  "grocery/deleteGrocery",
  async ({ uid, id }: any, thunkAPI) => {
    try {
      await deleteDoc(docRef(uid, id));
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.toString());
    }
  },
);

const initialState: GroceryList = {
  groceryList: [{}],
  status: "",
  message: "",
};

export const grocerySlice = createSlice({
  name: "grocery",
  initialState,
  reducers: {
    reset: (state) => {
      state.groceryList = [{}];
      state.status = "";
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // createGrocery
      .addCase(createGrocery.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createGrocery.fulfilled, (state, action) => {
        state.status = "idle";
        state.groceryList = [...state.groceryList, action.payload];
        state.message = "Note successfully added";
      })
      .addCase(createGrocery.rejected, (state, action) => {
        state.message = action.payload;
        state.status = "failed";
      })

      // getGrocery
      .addCase(getGrocery.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getGrocery.fulfilled, (state, action) => {
        state.status = "idle";
        state.groceryList = action.payload;
        state.message = "";
      })
      .addCase(getGrocery.rejected, (state, action) => {
        state.message = action.payload;
        state.status = "failed";
      })

      // editGrocery
      .addCase(updateGrocery.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateGrocery.fulfilled, (state, action) => {
        state.status = "idle";
        const foundIndex = current(state.groceryList).findIndex(
          (grocery: Grocery) =>
            Object.keys(grocery).toString() === action.payload.id,
        );
        state.message = "Note successfully updated";
        state.groceryList[foundIndex][action.payload.id] =
          action.payload.updatedData;
      })
      .addCase(updateGrocery.rejected, (state, action) => {
        state.message = action.payload;
        state.status = "failed";
      })

      // deleteGrocery
      .addCase(deleteGrocery.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteGrocery.fulfilled, (state, action) => {
        state.status = "idle";
        state.groceryList = current(state.groceryList).filter(
          (grocery: Grocery) =>
            Object.keys(grocery).toString() !== action.payload,
        );
        state.message = "Note successfully deleted";
      })
      .addCase(deleteGrocery.rejected, (state, action) => {
        state.message = action.payload;
        state.status = "failed";
      });
  },
});

export const { reset } = grocerySlice.actions;

export default grocerySlice.reducer;
