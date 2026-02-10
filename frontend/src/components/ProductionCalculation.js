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
  Skeleton,
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
    dispatch(calculateProduction());
  }, [dispatch]);

  const handleCalculate = () => {
    dispatch(calculateProduction());
  };

  if (loading && !calculation) {
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">Production Calculation</Typography>
        </Box>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card><CardContent><Box sx={{ mb: 1 }}><Typography variant="h6">Total Products</Typography></Box><Typography variant="h3"><Skeleton width={80} /></Typography></CardContent></Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card><CardContent><Box sx={{ mb: 1 }}><Typography variant="h6">Total Value</Typography></Box><Typography variant="h3"><Skeleton width={120} /></Typography></CardContent></Card>
          </Grid>
        </Grid>
        <Paper><Box p={2}><Skeleton variant="text" width="60%" /><Skeleton variant="text" width="40%" /></Box><TableContainer><Table><TableHead><TableRow><TableCell>Priority</TableCell><TableCell>Code</TableCell><TableCell>Product</TableCell><TableCell>Unit Value</TableCell><TableCell>Quantity</TableCell><TableCell>Total Value</TableCell></TableRow></TableHead><TableBody>{[1,2,3,4,5].map(i=><TableRow key={i}><TableCell><Skeleton /></TableCell><TableCell><Skeleton /></TableCell><TableCell><Skeleton /></TableCell><TableCell><Skeleton /></TableCell><TableCell><Skeleton /></TableCell><TableCell><Skeleton /></TableCell></TableRow>)}</TableBody></Table></TableContainer></Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Production Calculation
        </Typography>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          onClick={handleCalculate}
          disabled={loading}
        >
          Recalculate
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
                    <Typography variant="h6">Total Products</Typography>
                  </Box>
                  <Typography variant="h3" color="primary">
                    {calculation.items?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    different products can be produced
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Value</Typography>
                  </Box>
                  <Typography variant="h3" color="success.main">
                    $ {parseFloat(calculation.totalValue || 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    total value of suggested production
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Production Items Table */}
          <Paper>
            <Box p={2} bgcolor="primary.main" color="white">
              <Typography variant="h6">
                Suggested Products for Production
              </Typography>
              <Typography variant="body2">
                Sorted by highest value (priority)
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Priority</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Unit Value</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total Value</TableCell>
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
                          $ {parseFloat(item.unitValue || 0).toFixed(2)}
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
                            $ {parseFloat(item.totalValue || 0).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Box py={4}>
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No products can be produced
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Check if there are raw materials in stock and if products
                            have raw materials associated.
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
                <strong>Prioritization Algorithm:</strong> The system calculates the
                maximum quantity of each product that can be produced with available
                raw materials and prioritizes the highest value products. Once a raw
                material is allocated to a product, it is no longer available for
                other products.
              </Typography>
            </Alert>
          )}
        </>
      )}
    </Box>
  );
}

export default ProductionCalculation;
