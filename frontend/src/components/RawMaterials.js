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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
} from '../store/slices/rawMaterialsSlice';
import { showSnackbar } from '../store/slices/snackbarSlice';
import ConfirmDialog from './ConfirmDialog';

function RawMaterials() {
  const dispatch = useDispatch();
  const { items: rawMaterials, loading, error } = useSelector((state) => state.rawMaterials);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', stockQuantity: '' });
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleOpenDialog = (rawMaterial = null) => {
    if (rawMaterial) {
      setSelectedRawMaterial(rawMaterial);
      setFormData({
        code: rawMaterial.code,
        name: rawMaterial.name,
        stockQuantity: rawMaterial.stockQuantity.toString(),
      });
    } else {
      setSelectedRawMaterial(null);
      setFormData({ code: '', name: '', stockQuantity: '' });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRawMaterial(null);
    setFormData({ code: '', name: '', stockQuantity: '' });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = 'Code is required';
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (formData.stockQuantity === '' || parseFloat(formData.stockQuantity) < 0) {
      errors.stockQuantity = 'Quantity must be zero or positive';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const rawMaterialData = {
      code: formData.code,
      name: formData.name,
      stockQuantity: parseFloat(formData.stockQuantity),
    };

    try {
      if (selectedRawMaterial) {
        await dispatch(updateRawMaterial({ 
          id: selectedRawMaterial.id, 
          data: rawMaterialData 
        })).unwrap();
        dispatch(showSnackbar({ message: 'Raw material updated successfully', severity: 'success' }));
      } else {
        await dispatch(createRawMaterial(rawMaterialData)).unwrap();
        dispatch(showSnackbar({ message: 'Raw material created successfully', severity: 'success' }));
      }
      handleCloseDialog();
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err?.userMessage || err?.message || 'Error saving raw material');
      setFormErrors({ submit: msg });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;
    try {
      await dispatch(deleteRawMaterial(deleteConfirm.id)).unwrap();
      dispatch(showSnackbar({ message: 'Raw material deleted successfully', severity: 'success' }));
      setDeleteConfirm({ open: false, id: null });
    } catch (err) {
      dispatch(showSnackbar({ message: err.userMessage || err.message || 'Error deleting raw material', severity: 'error' }));
      setDeleteConfirm({ open: false, id: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, id: null });
  };

  if (loading && rawMaterials.length === 0) {
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={180} height={40} />
        </Box>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Stock Quantity</TableCell>
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
          Raw Materials
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Raw Material
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
              <TableCell align="right">Stock Quantity</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rawMaterials.map((rawMaterial) => (
              <TableRow key={rawMaterial.id}>
                <TableCell>
                  <Chip label={rawMaterial.code} size="small" color="primary" />
                </TableCell>
                <TableCell>{rawMaterial.name}</TableCell>
                <TableCell align="right">
                  {parseFloat(rawMaterial.stockQuantity).toFixed(3)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenDialog(rawMaterial)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(rawMaterial.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rawMaterials.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Box py={4}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No raw materials registered
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Add your first raw material to get started
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                    >
                      Add your first raw material
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRawMaterial ? 'Edit Raw Material' : 'New Raw Material'}
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
              label="Stock Quantity"
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              error={!!formErrors.stockQuantity}
              helperText={formErrors.stockQuantity}
              fullWidth
              required
              inputProps={{ step: '0.001', min: '0' }}
            />
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

      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Raw Material"
        message="Are you sure you want to delete this raw material? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default RawMaterials;
