import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rawMaterialsApi } from '../../services/api';

export const fetchRawMaterials = createAsyncThunk(
  'rawMaterials/fetchAll',
  async () => {
    const response = await rawMaterialsApi.getAll();
    return response.data;
  }
);

export const createRawMaterial = createAsyncThunk(
  'rawMaterials/create',
  async (rawMaterial) => {
    const response = await rawMaterialsApi.create(rawMaterial);
    return response.data;
  }
);

export const updateRawMaterial = createAsyncThunk(
  'rawMaterials/update',
  async ({ id, data }) => {
    const response = await rawMaterialsApi.update(id, data);
    return response.data;
  }
);

export const deleteRawMaterial = createAsyncThunk(
  'rawMaterials/delete',
  async (id) => {
    await rawMaterialsApi.delete(id);
    return id;
  }
);

const rawMaterialsSlice = createSlice({
  name: 'rawMaterials',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch raw materials
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create raw material
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update raw material
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        const index = state.items.findIndex(rm => rm.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete raw material
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter(rm => rm.id !== action.payload);
      });
  },
});

export default rawMaterialsSlice.reducer;
