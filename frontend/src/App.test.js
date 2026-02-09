import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import productsReducer from './store/slices/productsSlice';
import rawMaterialsReducer from './store/slices/rawMaterialsSlice';
import productRawMaterialsReducer from './store/slices/productRawMaterialsSlice';
import productionReducer from './store/slices/productionSlice';

const mockStore = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    productRawMaterials: productRawMaterialsReducer,
    production: productionReducer,
  },
});

test('renders without crashing', () => {
  render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  
  // Check if the app title is rendered
  const titleElement = screen.getByText(/Sistema de Controle/i);
  expect(titleElement).toBeInTheDocument();
});
