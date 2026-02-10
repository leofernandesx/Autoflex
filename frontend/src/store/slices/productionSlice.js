import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productionApi } from '../../services/api';

export const calculateProduction = createAsyncThunk(
  'production/calculate',
  async () => {
    const response = await productionApi.calculate();
    return response.data;
  }
);

const productionSlice = createSlice({
  name: 'production',
  initialState: {
    calculation: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(calculateProduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateProduction.fulfilled, (state, action) => {
        state.loading = false;
        state.calculation = action.payload;
      })
      .addCase(calculateProduction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.userMessage || action.error?.message;
      });
  },
});

export default productionSlice.reducer;
