import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    const response = await productsApi.getAll();
    return response.data;
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (product, { rejectWithValue }) => {
    try {
      const response = await productsApi.create(product);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.userMessage || err.message || 'Error creating product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await productsApi.update(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.userMessage || err.message || 'Error updating product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id) => {
    await productsApi.delete(id);
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.userMessage || action.error?.message;
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
