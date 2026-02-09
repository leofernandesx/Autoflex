import React, { useEffect } from 'react';
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
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { calculateProduction } from '../store/slices/productionSlice';

function ProductionCalculation() {
  const dispatch = useDispatch();
  const { calculation, loading, error } = useSelector((state) => state.production);

  useEffect(() => {
    handleCalculate();
  }, []);

  const handleCalculate = () => {
    dispatch(calculateProduction());
  };

  if (loading && !calculation) {
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
          Cálculo de Produção
        </Typography>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          onClick={handleCalculate}
          disabled={loading}
        >
          Recalcular
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {calculation && (
        <>
          {/* Summary Card */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalculateIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total de Produtos</Typography>
                  </Box>
                  <Typography variant="h3" color="primary">
                    {calculation.items?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    produtos diferentes podem ser produzidos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Valor Total</Typography>
                  </Box>
                  <Typography variant="h3" color="success.main">
                    R$ {parseFloat(calculation.totalValue || 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    valor total da produção sugerida
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Production Items Table */}
          <Paper>
            <Box p={2} bgcolor="primary.main" color="white">
              <Typography variant="h6">
                Produtos Sugeridos para Produção
              </Typography>
              <Typography variant="body2">
                Ordenados por maior valor (prioridade)
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Prioridade</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">Valor Unitário</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Valor Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calculation.items && calculation.items.length > 0 ? (
                    calculation.items.map((item, index) => (
                      <TableRow 
                        key={item.productId}
                        sx={{
                          bgcolor: index === 0 ? 'success.light' : 'inherit',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <TableCell>
                          <Typography 
                            variant="h6" 
                            color={index === 0 ? 'success.dark' : 'text.primary'}
                          >
                            #{index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {item.productCode}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">
                          R$ {parseFloat(item.unitValue || 0).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" fontWeight="bold">
                            {parseFloat(item.quantity || 0).toFixed(3)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body1" 
                            fontWeight="bold" 
                            color="success.main"
                          >
                            R$ {parseFloat(item.totalValue || 0).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Box py={4}>
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            Nenhum produto pode ser produzido
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Verifique se há matérias-primas em estoque e se os produtos
                            possuem matérias-primas associadas.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Info Box */}
          {calculation.items && calculation.items.length > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Algoritmo de Priorização:</strong> O sistema calcula a quantidade
                máxima de cada produto que pode ser produzida com as matérias-primas
                disponíveis e prioriza os produtos de maior valor. Uma vez que uma
                matéria-prima é alocada para um produto, ela não está mais disponível
                para outros produtos.
              </Typography>
            </Alert>
          )}
        </>
      )}
    </Box>
  );
}

export default ProductionCalculation;
