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
  Skeleton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
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
import {
  fetchRawMaterials,
} from '../store/slices/rawMaterialsSlice';
import {
  createProductRawMaterial,
} from '../store/slices/productRawMaterialsSlice';
import { showSnackbar } from '../store/slices/snackbarSlice';
import ProductRawMaterialsDialog from './ProductRawMaterialsDialog';
import ConfirmDialog from './ConfirmDialog';

function Products() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { items: rawMaterials } = useSelector((state) => state.rawMaterials);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRawMaterialsDialog, setOpenRawMaterialsDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', value: '' });
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [pendingRawMaterials, setPendingRawMaterials] = useState([]);
  const [newRawMaterial, setNewRawMaterial] = useState({ rawMaterialId: '', requiredQuantity: '' });

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
      setPendingRawMaterials([]);
    } else {
      setSelectedProduct(null);
      setFormData({ code: '', name: '', value: '' });
      setPendingRawMaterials([]);
      setNewRawMaterial({ rawMaterialId: '', requiredQuantity: '' });
      dispatch(fetchRawMaterials());
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({ code: '', name: '', value: '' });
    setFormErrors({});
    setPendingRawMaterials([]);
  };

  const handleAddPendingRawMaterial = () => {
    if (!newRawMaterial.rawMaterialId || !newRawMaterial.requiredQuantity) return;
    const qty = parseFloat(newRawMaterial.requiredQuantity);
    if (isNaN(qty) || qty <= 0) return;
    const rm = rawMaterials.find((r) => r.id === Number(newRawMaterial.rawMaterialId));
    if (!rm) return;
    if (pendingRawMaterials.some((p) => p.rawMaterialId === rm.id)) return;
    setPendingRawMaterials([
      ...pendingRawMaterials,
      { rawMaterialId: rm.id, rawMaterialName: `${rm.code} - ${rm.name}`, requiredQuantity: qty },
    ]);
    setNewRawMaterial({ rawMaterialId: '', requiredQuantity: '' });
  };

  const handleRemovePendingRawMaterial = (rawMaterialId) => {
    setPendingRawMaterials(pendingRawMaterials.filter((p) => p.rawMaterialId !== rawMaterialId));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = 'Code is required';
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.value || parseFloat(formData.value) <= 0) {
      errors.value = 'Value must be greater than zero';
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
        dispatch(showSnackbar({ message: 'Product updated successfully', severity: 'success' }));
      } else {
        const created = await dispatch(createProduct(productData)).unwrap();
        for (const prm of pendingRawMaterials) {
          await dispatch(
            createProductRawMaterial({
              productId: created.id,
              rawMaterialId: prm.rawMaterialId,
              requiredQuantity: prm.requiredQuantity,
            })
          ).unwrap();
        }
        const msg =
          pendingRawMaterials.length > 0
            ? `Product created with ${pendingRawMaterials.length} raw material(s)`
            : 'Product created successfully';
        dispatch(showSnackbar({ message: msg, severity: 'success' }));
      }
      handleCloseDialog();
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err?.userMessage || err?.message || 'Error saving product');
      setFormErrors({ submit: msg });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;
    try {
      await dispatch(deleteProduct(deleteConfirm.id)).unwrap();
      dispatch(showSnackbar({ message: 'Product deleted successfully', severity: 'success' }));
      setDeleteConfirm({ open: false, id: null });
    } catch (err) {
      dispatch(showSnackbar({ message: err.userMessage || err.message || 'Error deleting product', severity: 'error' }));
      setDeleteConfirm({ open: false, id: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, id: null });
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
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Product
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
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="center">Actions</TableCell>
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
                  $ {parseFloat(product.value).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="info"
                    onClick={() => handleOpenRawMaterials(product)}
                    title="Manage raw materials"
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
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Box py={4}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No products registered
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Add your first product to get started
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                    >
                      Add your first product
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProduct ? 'Edit Product' : 'New Product'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              error={!!formErrors.code}
              helperText={formErrors.code}
              fullWidth
              required
            />
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!formErrors.name}
              helperText={formErrors.name}
              fullWidth
              required
            />
            <TextField
              label="Value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              error={!!formErrors.value}
              helperText={formErrors.value}
              fullWidth
              required
              InputProps={{
                startAdornment: '$',
              }}
            />

            {!selectedProduct && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Required raw materials (optional)
                </Typography>
                <Box display="flex" gap={1} alignItems="flex-start" flexWrap="wrap">
                  <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel>Raw material</InputLabel>
                    <Select
                      value={newRawMaterial.rawMaterialId}
                      onChange={(e) =>
                        setNewRawMaterial({ ...newRawMaterial, rawMaterialId: e.target.value })
                      }
                      label="Raw material"
                    >
                      {rawMaterials
                        .filter(
                          (rm) => !pendingRawMaterials.some((p) => p.rawMaterialId === rm.id)
                        )
                        .map((rm) => (
                          <MenuItem key={rm.id} value={rm.id}>
                            {rm.code} - {rm.name}
                          </MenuItem>
                        ))}
                      {rawMaterials.filter(
                        (rm) => !pendingRawMaterials.some((p) => p.rawMaterialId === rm.id)
                      ).length === 0 && (
                        <MenuItem disabled>None available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Required quantity"
                    type="number"
                    size="small"
                    value={newRawMaterial.requiredQuantity}
                    onChange={(e) =>
                      setNewRawMaterial({ ...newRawMaterial, requiredQuantity: e.target.value })
                    }
                    inputProps={{ step: '0.001', min: '0' }}
                    sx={{ width: 130 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddPendingRawMaterial}
                    disabled={
                      !newRawMaterial.rawMaterialId ||
                      !newRawMaterial.requiredQuantity ||
                      parseFloat(newRawMaterial.requiredQuantity) <= 0
                    }
                  >
                    Add
                  </Button>
                </Box>
                {pendingRawMaterials.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {pendingRawMaterials.map((prm) => (
                      <Chip
                        key={prm.rawMaterialId}
                        label={`${prm.rawMaterialName}: ${parseFloat(prm.requiredQuantity).toFixed(3)}`}
                        onDelete={() => handleRemovePendingRawMaterial(prm.rawMaterialId)}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}

            {formErrors.submit && (
              <Alert severity="error">{formErrors.submit}</Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
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

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default Products;
