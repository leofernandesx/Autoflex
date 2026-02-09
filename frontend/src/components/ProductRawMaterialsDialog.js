import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  fetchProductRawMaterialsByProductId,
  createProductRawMaterial,
  updateProductRawMaterial,
  deleteProductRawMaterial,
} from '../store/slices/productRawMaterialsSlice';
import { fetchRawMaterials } from '../store/slices/rawMaterialsSlice';

function ProductRawMaterialsDialog({ open, onClose, product }) {
  const dispatch = useDispatch();
  const { items: associations } = useSelector((state) => state.productRawMaterials);
  const { items: rawMaterials } = useSelector((state) => state.rawMaterials);
  const [newAssociation, setNewAssociation] = useState({
    rawMaterialId: '',
    requiredQuantity: '',
  });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');

  useEffect(() => {
    if (open && product) {
      dispatch(fetchProductRawMaterialsByProductId(product.id));
      dispatch(fetchRawMaterials());
      setEditingId(null);
      setEditQuantity('');
    }
  }, [open, product, dispatch]);

  const handleAddAssociation = async () => {
    if (!newAssociation.rawMaterialId || !newAssociation.requiredQuantity) {
      setError('Fill in all fields');
      return;
    }

    if (parseFloat(newAssociation.requiredQuantity) <= 0) {
      setError('Quantity must be greater than zero');
      return;
    }

    // Check if association already exists
    const exists = associations.some(
      (a) => a.rawMaterialId === newAssociation.rawMaterialId
    );
    if (exists) {
      setError('This raw material is already associated with this product');
      return;
    }

    try {
      await dispatch(
        createProductRawMaterial({
          productId: product.id,
          rawMaterialId: newAssociation.rawMaterialId,
          requiredQuantity: parseFloat(newAssociation.requiredQuantity),
        })
      ).unwrap();
      setNewAssociation({ rawMaterialId: '', requiredQuantity: '' });
      setError('');
    } catch (err) {
      setError(err.message || 'Error adding association');
    }
  };

  const handleDeleteAssociation = async (id) => {
    if (window.confirm('Are you sure you want to remove this raw material?')) {
      try {
        await dispatch(deleteProductRawMaterial(id)).unwrap();
      } catch (err) {
        setError(err.message || 'Error removing association');
      }
    }
  };

  const handleStartEdit = (assoc) => {
    setEditingId(assoc.id);
    setEditQuantity(assoc.requiredQuantity?.toString() || '');
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuantity('');
  };

  const handleSaveEdit = async () => {
    const quantity = parseFloat(editQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      setError('Quantity must be greater than zero');
      return;
    }

    try {
      await dispatch(
        updateProductRawMaterial({
          id: editingId,
          data: {
            productId: product.id,
            rawMaterialId: associations.find((a) => a.id === editingId)?.rawMaterialId,
            requiredQuantity: quantity,
          },
        })
      ).unwrap();
      handleCancelEdit();
      setError('');
    } catch (err) {
      setError(err.message || 'Error updating association');
    }
  };

  const getAvailableRawMaterials = () => {
    const associatedIds = associations.map((a) => a.rawMaterialId);
    return rawMaterials.filter((rm) => !associatedIds.includes(rm.id));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Product Raw Materials: {product?.name}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Existing Associations */}
          <Typography variant="h6" gutterBottom>
            Associated Raw Materials
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Required Qty</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {associations.map((assoc) => {
                  const isEditing = editingId === assoc.id;
                  return (
                    <TableRow key={assoc.id}>
                      <TableCell>{assoc.rawMaterialName?.split(' - ')[0] || '-'}</TableCell>
                      <TableCell>{assoc.rawMaterialName || '-'}</TableCell>
                      <TableCell align="right">
                        {isEditing ? (
                          <TextField
                            size="small"
                            type="number"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                            inputProps={{ step: '0.001', min: '0' }}
                            sx={{ width: 120 }}
                            autoFocus
                          />
                        ) : (
                          parseFloat(assoc.requiredQuantity).toFixed(3)
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {isEditing ? (
                          <>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={handleSaveEdit}
                              title="Save"
                            >
                              <SaveIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={handleCancelEdit}
                              title="Cancel"
                            >
                              <CloseIcon />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleStartEdit(assoc)}
                              title="Edit quantity"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteAssociation(assoc.id)}
                              title="Remove"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {associations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No raw materials associated
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add New Association */}
          <Typography variant="h6" gutterBottom>
            Add Raw Material
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" gap={2} alignItems="flex-start">
              <FormControl fullWidth>
                <InputLabel>Raw Material</InputLabel>
                <Select
                  value={newAssociation.rawMaterialId}
                  onChange={(e) =>
                    setNewAssociation({
                      ...newAssociation,
                      rawMaterialId: e.target.value,
                    })
                  }
                  label="Raw Material"
                >
                  {getAvailableRawMaterials().map((rm) => (
                    <MenuItem key={rm.id} value={rm.id}>
                      {rm.code} - {rm.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Required Quantity"
                type="number"
                value={newAssociation.requiredQuantity}
                onChange={(e) =>
                  setNewAssociation({
                    ...newAssociation,
                    requiredQuantity: e.target.value,
                  })
                }
                inputProps={{ step: '0.001', min: '0' }}
                sx={{ minWidth: 200 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAssociation}
                disabled={!newAssociation.rawMaterialId || !newAssociation.requiredQuantity}
              >
                Add
              </Button>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductRawMaterialsDialog;
