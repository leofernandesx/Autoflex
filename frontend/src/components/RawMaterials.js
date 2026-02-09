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
} from '@mui/icons-material';
import {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
} from '../store/slices/rawMaterialsSlice';

function RawMaterials() {
  const dispatch = useDispatch();
  const { items: rawMaterials, loading, error } = useSelector((state) => state.rawMaterials);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRawMaterial, setSelectedRawMaterial] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', stockQuantity: '' });
  const [formErrors, setFormErrors] = useState({});

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
    if (!formData.code.trim()) errors.code = 'Código é obrigatório';
    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (formData.stockQuantity === '' || parseFloat(formData.stockQuantity) < 0) {
      errors.stockQuantity = 'Quantidade deve ser zero ou positiva';
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
      } else {
        await dispatch(createRawMaterial(rawMaterialData)).unwrap();
      }
      handleCloseDialog();
    } catch (err) {
      setFormErrors({ submit: err.message || 'Erro ao salvar matéria-prima' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta matéria-prima?')) {
      try {
        await dispatch(deleteRawMaterial(id)).unwrap();
      } catch (err) {
        alert('Erro ao excluir matéria-prima: ' + err.message);
      }
    }
  };

  if (loading && rawMaterials.length === 0) {
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
          Matérias-primas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Matéria-prima
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
              <TableCell align="right">Quantidade em Estoque</TableCell>
              <TableCell align="center">Ações</TableCell>
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
                    onClick={() => handleDelete(rawMaterial.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rawMaterials.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhuma matéria-prima cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRawMaterial ? 'Editar Matéria-prima' : 'Nova Matéria-prima'}
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
              label="Quantidade em Estoque"
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
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RawMaterials;
