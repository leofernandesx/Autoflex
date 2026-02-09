import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Layout from './components/Layout';
import Products from './components/Products';
import RawMaterials from './components/RawMaterials';
import ProductionCalculation from './components/ProductionCalculation';

function App() {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/raw-materials" element={<RawMaterials />} />
          <Route path="/production" element={<ProductionCalculation />} />
        </Routes>
      </Container>
    </Layout>
  );
}

export default App;
