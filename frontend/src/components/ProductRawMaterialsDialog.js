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
  Save as SaveIcon,
} from '@mui/icons-material';
import {
  fetchProductRawMaterialsByProductId,
  createProductRawMaterial,
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

  useEffect(() => {
    if (open && product) {
      dispatch(fetchProductRawMaterialsByProductId(product.id));
      dispatch(fetchRawMaterials());
    }
  }, [open, product, dispatch]);

  const handleAddAssociation = async () => {
    if (!newAssociation.rawMaterialId || !newAssociation.requiredQuantity) {
      setError('Preencha todos os campos');
      return;
    }

    if (parseFloat(newAssociation.requiredQuantity) <= 0) {
      setError('Quantidade deve ser maior que zero');
      return;
    }

    // Check if association already exists
    const exists = associations.some(
      (a) => a.rawMaterialId === newAssociation.rawMaterialId
    );
    if (exists) {
      setError('Esta matéria-prima já está associada a este produto');
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
      setError(err.message || 'Erro ao adicionar associação');
    }
  };

  const handleDeleteAssociation = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta matéria-prima?')) {
      try {
        await dispatch(deleteProductRawMaterial(id)).unwrap();
      } catch (err) {
        setError(err.message || 'Erro ao remover associação');
      }
    }
  };

  const getAvailableRawMaterials = () => {
    const associatedIds = associations.map((a) => a.rawMaterialId);
    return rawMaterials.filter((rm) => !associatedIds.includes(rm.id));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Matérias-primas do Produto: {product?.name}
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
            Matérias-primas Associadas
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell align="right">Qtd. Necessária</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {associations.map((assoc) => (
                  <TableRow key={assoc.id}>
                    <TableCell>{assoc.rawMaterialName?.split(' - ')[0] || '-'}</TableCell>
                    <TableCell>{assoc.rawMaterialName || '-'}</TableCell>
                    <TableCell align="right">
                      {parseFloat(assoc.requiredQuantity).toFixed(3)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteAssociation(assoc.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {associations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhuma matéria-prima associada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add New Association */}
          <Typography variant="h6" gutterBottom>
            Adicionar Matéria-prima
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" gap={2} alignItems="flex-start">
              <FormControl fullWidth>
                <InputLabel>Matéria-prima</InputLabel>
                <Select
                  value={newAssociation.rawMaterialId}
                  onChange={(e) =>
                    setNewAssociation({
                      ...newAssociation,
                      rawMaterialId: e.target.value,
                    })
                  }
                  label="Matéria-prima"
                >
                  {getAvailableRawMaterials().map((rm) => (
                    <MenuItem key={rm.id} value={rm.id}>
                      {rm.code} - {rm.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Quantidade Necessária"
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
                Adicionar
              </Button>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductRawMaterialsDialog;
