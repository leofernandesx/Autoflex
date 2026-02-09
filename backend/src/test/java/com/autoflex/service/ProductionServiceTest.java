package com.autoflex.service;

import com.autoflex.dto.ProductDTO;
import com.autoflex.dto.ProductRawMaterialDTO;
import com.autoflex.dto.ProductionCalculationDTO;
import com.autoflex.dto.RawMaterialDTO;
import com.autoflex.entity.Product;
import com.autoflex.entity.ProductRawMaterial;
import com.autoflex.entity.RawMaterial;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.*;

@QuarkusTest
class ProductionServiceTest {

    @Inject
    ProductionService productionService;

    @Inject
    ProductService productService;

    @Inject
    RawMaterialService rawMaterialService;

    @Inject
    ProductRawMaterialService productRawMaterialService;

    @BeforeEach
    @Transactional
    void setUp() {
        ProductRawMaterial.deleteAll();
        Product.deleteAll();
        RawMaterial.deleteAll();
    }

    @Test
    @Transactional
    void testCalculateProductionWithSimpleScenario() {
        // Create raw materials
        RawMaterialDTO steel = rawMaterialService.create(
            new RawMaterialDTO(null, "RM001", "Steel", new BigDecimal("100.000"))
        );
        RawMaterialDTO plastic = rawMaterialService.create(
            new RawMaterialDTO(null, "RM002", "Plastic", new BigDecimal("50.000"))
        );

        // Create products
        ProductDTO product1 = productService.create(
            new ProductDTO(null, "P001", "Product 1", new BigDecimal("100.00"))
        );

        // Product 1 requires: 10 steel, 5 plastic
        productRawMaterialService.create(
            new ProductRawMaterialDTO(null, product1.id, steel.id, new BigDecimal("10.000"))
        );
        productRawMaterialService.create(
            new ProductRawMaterialDTO(null, product1.id, plastic.id, new BigDecimal("5.000"))
        );

        // Calculate production
        ProductionCalculationDTO result = productionService.calculateProduction();

        // Can produce 10 units (limited by steel: 100/10 = 10, plastic: 50/5 = 10)
        assertThat(result.items).hasSize(1);
        assertThat(result.items.get(0).quantity).isEqualByComparingTo(new BigDecimal("10.000"));
        assertThat(result.items.get(0).totalValue).isEqualByComparingTo(new BigDecimal("1000.00"));
        assertThat(result.totalValue).isEqualByComparingTo(new BigDecimal("1000.00"));
    }

    @Test
    @Transactional
    void testCalculateProductionPrioritizesByValue() {
        // Create raw materials
        RawMaterialDTO steel = rawMaterialService.create(
            new RawMaterialDTO(null, "RM001", "Steel", new BigDecimal("100.000"))
        );

        // Create two products with different values
        ProductDTO expensiveProduct = productService.create(
            new ProductDTO(null, "P001", "Expensive Product", new BigDecimal("500.00"))
        );
        ProductDTO cheapProduct = productService.create(
            new ProductDTO(null, "P002", "Cheap Product", new BigDecimal("50.00"))
        );

        // Both need 10 steel
        productRawMaterialService.create(
            new ProductRawMaterialDTO(null, expensiveProduct.id, steel.id, new BigDecimal("10.000"))
        );
        productRawMaterialService.create(
            new ProductRawMaterialDTO(null, cheapProduct.id, steel.id, new BigDecimal("10.000"))
        );

        // Calculate production
        ProductionCalculationDTO result = productionService.calculateProduction();

        // Should produce only expensive product (10 units max with 100 steel)
        assertThat(result.items).hasSize(1);
        assertThat(result.items.get(0).productCode).isEqualTo("P001");
        assertThat(result.items.get(0).quantity).isEqualByComparingTo(new BigDecimal("10.000"));
        assertThat(result.totalValue).isEqualByComparingTo(new BigDecimal("5000.00"));
    }

    @Test
    @Transactional
    void testCalculateProductionWithMultipleProducts() {
        // Create raw materials
        RawMaterialDTO steel = rawMaterialService.create(
            new RawMaterialDTO(null, "RM001", "Steel", new BigDecimal("150.000"))
        );
        RawMaterialDTO plastic = rawMaterialService.create(
            new RawMaterialDTO(null, "RM002", "Plastic", new BigDecimal("100.000"))
        );

        // Create products
        ProductDTO product1 = productService.create(
            new ProductDTO(null, "P001", "Product 1", new BigDecimal("200.00"))
        );
        ProductDTO product2 = productService.create(
            new ProductDTO(null, "P002", "Product 2", new BigDecimal("100.00"))
        );

        // Product 1: 10 steel, 0 plastic
        productRawMaterialService.create(
            new ProductRawMaterialDTO(null, product1.id, steel.id, new BigDecimal("10.000"))
        );

        // Product 2: 0 steel, 10 plastic
        productRawMaterialService.create(
            new ProductRawMaterialDTO(null, product2.id, plastic.id, new BigDecimal("10.000"))
        );

        // Calculate production
        ProductionCalculationDTO result = productionService.calculateProduction();

        // Should produce both products since they don't compete for resources
        assertThat(result.items).hasSize(2);
        
        // Product 1 should be first (higher value)
        assertThat(result.items.get(0).productCode).isEqualTo("P001");
        assertThat(result.items.get(0).quantity).isEqualByComparingTo(new BigDecimal("15.000")); // 150/10
        
        // Product 2 should be second
        assertThat(result.items.get(1).productCode).isEqualTo("P002");
        assertThat(result.items.get(1).quantity).isEqualByComparingTo(new BigDecimal("10.000")); // 100/10

        // Total value: (15 * 200) + (10 * 100) = 3000 + 1000 = 4000
        assertThat(result.totalValue).isEqualByComparingTo(new BigDecimal("4000.00"));
    }

    @Test
    @Transactional
    void testCalculateProductionWithNoStock() {
        // Create raw material with zero stock
        RawMaterialDTO steel = rawMaterialService.create(
            new RawMaterialDTO(null, "RM001", "Steel", new BigDecimal("0.000"))
        );

        // Create product
        ProductDTO product = productService.create(
            new ProductDTO(null, "P001", "Product 1", new BigDecimal("100.00"))
        );

        productRawMaterialService.create(
            new ProductRawMaterialDTO(null, product.id, steel.id, new BigDecimal("10.000"))
        );

        // Calculate production
        ProductionCalculationDTO result = productionService.calculateProduction();

        // Should produce nothing
        assertThat(result.items).isEmpty();
        assertThat(result.totalValue).isEqualByComparingTo(BigDecimal.ZERO);
    }
}
