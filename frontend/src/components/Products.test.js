import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Products from './Products';
import productsReducer from '../store/slices/productsSlice';
import rawMaterialsReducer from '../store/slices/rawMaterialsSlice';
import productRawMaterialsReducer from '../store/slices/productRawMaterialsSlice';

// Mock the API
jest.mock('../services/api', () => ({
  productsApi: {
    getAll: jest.fn(() => Promise.resolve({ data: [] })),
    create: jest.fn((data) => Promise.resolve({ data: { id: 1, ...data } })),
    update: jest.fn((id, data) => Promise.resolve({ data: { id, ...data } })),
    delete: jest.fn(() => Promise.resolve()),
  },
}));

const renderWithProviders = (component) => {
  const store = configureStore({
    reducer: {
      products: productsReducer,
      rawMaterials: rawMaterialsReducer,
      productRawMaterials: productRawMaterialsReducer,
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Products Component', () => {
  test('renders products page title', async () => {
    renderWithProviders(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText('Produtos')).toBeInTheDocument();
    });
  });

  test('renders new product button', async () => {
    renderWithProviders(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText('Novo Produto')).toBeInTheDocument();
    });
  });

  test('renders empty state when no products', async () => {
    renderWithProviders(<Products />);
    
    await waitFor(() => {
      expect(screen.getByText('Nenhum produto cadastrado')).toBeInTheDocument();
    });
  });
});
