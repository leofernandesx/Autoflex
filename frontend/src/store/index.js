import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import rawMaterialsReducer from './slices/rawMaterialsSlice';
import productRawMaterialsReducer from './slices/productRawMaterialsSlice';
import productionReducer from './slices/productionSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    productRawMaterials: productRawMaterialsReducer,
    production: productionReducer,
  },
});

export default store;
