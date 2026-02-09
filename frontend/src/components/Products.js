import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../store/slices/productsSlice';
import ProductRawMaterialsDialog from './ProductRawMaterialsDialog';

function Products() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRawMaterialsDialog, setOpenRawMaterialsDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', value: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenDialog = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        code: product.code,
        name: product.name,
        value: product.value.toString(),
      });
    } else {
      setSelectedProduct(null);
      setFormData({ code: '', name: '', value: '' });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({ code: '', name: '', value: '' });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = 'Código é obrigatório';
    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.value || parseFloat(formData.value) <= 0) {
      errors.value = 'Valor deve ser maior que zero';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const productData = {
      code: formData.code,
      name: formData.name,
      value: parseFloat(formData.value),
    };

    try {
      if (selectedProduct) {
        await dispatch(updateProduct({ id: selectedProduct.id, data: productData })).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      handleCloseDialog();
    } catch (err) {
      setFormErrors({ submit: err.message || 'Erro ao salvar produto' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
      } catch (err) {
        alert('Erro ao excluir produto: ' + err.message);
      }
    }
  };

  const handleOpenRawMaterials = (product) => {
    setSelectedProduct(product);
    setOpenRawMaterialsDialog(true);
  };

  const handleCloseRawMaterials = () => {
    setOpenRawMaterialsDialog(false);
    setSelectedProduct(null);
  };

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Produtos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Produto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell align="right">Valor</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Chip label={product.code} size="small" />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">
                  R$ {parseFloat(product.value).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="info"
                    onClick={() => handleOpenRawMaterials(product)}
                    title="Gerenciar matérias-primas"
                  >
                    <SettingsIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(product.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhum produto cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Editar Produto' : 'Novo Produto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Código"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              error={!!formErrors.code}
              helperText={formErrors.code}
              fullWidth
              required
            />
            <TextField
              label="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!formErrors.name}
              helperText={formErrors.name}
              fullWidth
              required
            />
            <TextField
              label="Valor"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              error={!!formErrors.value}
              helperText={formErrors.value}
              fullWidth
              required
              InputProps={{
                startAdornment: 'R$',
              }}
            />
            {formErrors.submit && (
              <Alert severity="error">{formErrors.submit}</Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Raw Materials Dialog */}
      {selectedProduct && (
        <ProductRawMaterialsDialog
          open={openRawMaterialsDialog}
          onClose={handleCloseRawMaterials}
          product={selectedProduct}
        />
      )}
    </Box>
  );
}

export default Products;
