package com.autoflex.service;

import com.autoflex.dto.ProductionCalculationDTO;
import com.autoflex.dto.ProductionCalculationDTO.ProductionItemDTO;
import com.autoflex.entity.Product;
import com.autoflex.entity.ProductRawMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import org.jboss.logging.Logger;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@ApplicationScoped
public class ProductionService {

    private static final Logger LOG = Logger.getLogger(ProductionService.class);

    /**
     * Calculate which products can be produced with available raw materials,
     * prioritizing products by highest value.
     * 
     * Algorithm:
     * 1. Get all products ordered by value (descending)
     * 2. For each product, calculate maximum quantity that can be produced
     * 3. Select products greedily by value until stock is exhausted
     * 4. Return production plan with total value
     */
    public ProductionCalculationDTO calculateProduction() {
        LOG.debug("Starting production calculation");

        // Get all products ordered by value (highest first)
        List<Product> products = Product.findAllOrdered();
        LOG.debug("Found " + products.size() + " products");

        // Track remaining stock (mutable copy)
        Map<Long, BigDecimal> availableStock = new HashMap<>();
        
        // Initialize available stock from database
        Product.getEntityManager()
            .createQuery("SELECT rm.id, rm.stockQuantity FROM RawMaterial rm", Object[].class)
            .getResultList()
            .forEach(row -> availableStock.put((Long) row[0], (BigDecimal) row[1]));

        LOG.debug("Available stock initialized with " + availableStock.size() + " raw materials");

        List<ProductionItemDTO> productionItems = new ArrayList<>();
        BigDecimal totalValue = BigDecimal.ZERO;

        // Process each product by priority (highest value first)
        for (Product product : products) {
            BigDecimal maxQuantity = calculateMaxQuantity(product, availableStock);
            
            if (maxQuantity.compareTo(BigDecimal.ZERO) > 0) {
                // Update stock after production
                updateStock(product, maxQuantity, availableStock);
                
                BigDecimal itemTotalValue = product.value.multiply(maxQuantity)
                    .setScale(2, RoundingMode.HALF_UP);
                totalValue = totalValue.add(itemTotalValue);

                ProductionItemDTO item = new ProductionItemDTO(
                    product.id,
                    product.code,
                    product.name,
                    product.value,
                    maxQuantity,
                    itemTotalValue
                );
                productionItems.add(item);

                LOG.debug(String.format("Product %s: quantity=%.2f, value=%.2f", 
                    product.code, maxQuantity, itemTotalValue));
            }
        }

        LOG.info(String.format("Production calculation complete: %d items, total value=%.2f", 
            productionItems.size(), totalValue));

        return new ProductionCalculationDTO(productionItems, totalValue);
    }

    /**
     * Calculate maximum quantity of a product that can be produced
     * given the available stock of raw materials.
     */
    private BigDecimal calculateMaxQuantity(Product product, Map<Long, BigDecimal> availableStock) {
        // Fetch raw materials for this product
        List<ProductRawMaterial> rawMaterials = ProductRawMaterial.findByProductId(product.id);
        
        if (rawMaterials.isEmpty()) {
            LOG.debug("Product " + product.code + " has no raw materials configured");
            return BigDecimal.ZERO;
        }

        BigDecimal maxQuantity = null;

        for (ProductRawMaterial prm : rawMaterials) {
            BigDecimal available = availableStock.getOrDefault(prm.rawMaterial.id, BigDecimal.ZERO);
            BigDecimal required = prm.requiredQuantity;

            if (required.compareTo(BigDecimal.ZERO) == 0) {
                continue; // Skip if no quantity required
            }

            // Calculate how many units can be produced with this raw material
            BigDecimal possibleQuantity = available.divide(required, 3, RoundingMode.DOWN);

            // Take minimum across all raw materials (bottleneck)
            if (maxQuantity == null || possibleQuantity.compareTo(maxQuantity) < 0) {
                maxQuantity = possibleQuantity;
            }
        }

        return maxQuantity != null ? maxQuantity : BigDecimal.ZERO;
    }

    /**
     * Update the available stock after producing a quantity of a product.
     */
    private void updateStock(Product product, BigDecimal quantity, Map<Long, BigDecimal> availableStock) {
        List<ProductRawMaterial> rawMaterials = ProductRawMaterial.findByProductId(product.id);
        
        for (ProductRawMaterial prm : rawMaterials) {
            BigDecimal consumed = prm.requiredQuantity.multiply(quantity);
            BigDecimal current = availableStock.getOrDefault(prm.rawMaterial.id, BigDecimal.ZERO);
            BigDecimal remaining = current.subtract(consumed);
            availableStock.put(prm.rawMaterial.id, remaining);
        }
    }
}
