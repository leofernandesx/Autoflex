import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productRawMaterialsApi } from '../../services/api';

export const fetchProductRawMaterials = createAsyncThunk(
  'productRawMaterials/fetchAll',
  async () => {
    const response = await productRawMaterialsApi.getAll();
    return response.data;
  }
);

export const fetchProductRawMaterialsByProductId = createAsyncThunk(
  'productRawMaterials/fetchByProductId',
  async (productId) => {
    const response = await productRawMaterialsApi.getByProductId(productId);
    return response.data;
  }
);

export const createProductRawMaterial = createAsyncThunk(
  'productRawMaterials/create',
  async (data) => {
    const response = await productRawMaterialsApi.create(data);
    return response.data;
  }
);

export const updateProductRawMaterial = createAsyncThunk(
  'productRawMaterials/update',
  async ({ id, data }) => {
    const response = await productRawMaterialsApi.update(id, data);
    return response.data;
  }
);

export const deleteProductRawMaterial = createAsyncThunk(
  'productRawMaterials/delete',
  async (id) => {
    await productRawMaterialsApi.delete(id);
    return id;
  }
);

const productRawMaterialsSlice = createSlice({
  name: 'productRawMaterials',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProductRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.userMessage || action.error?.message;
      })
      // Fetch by product ID
      .addCase(fetchProductRawMaterialsByProductId.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Create
      .addCase(createProductRawMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateProductRawMaterial.fulfilled, (state, action) => {
        const index = state.items.findIndex(prm => prm.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteProductRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter(prm => prm.id !== action.payload);
      });
  },
});

export default productRawMaterialsSlice.reducer;
