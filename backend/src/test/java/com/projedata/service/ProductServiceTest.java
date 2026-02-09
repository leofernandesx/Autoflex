package com.projedata.service;

import com.projedata.dto.ProductDTO;
import com.projedata.entity.Product;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@QuarkusTest
class ProductServiceTest {

    @Inject
    ProductService productService;

    @BeforeEach
    @Transactional
    void setUp() {
        Product.deleteAll();
    }

    @Test
    @Transactional
    void testCreateProduct() {
        ProductDTO dto = new ProductDTO(null, "P001", "Product 1", new BigDecimal("100.00"));
        ProductDTO created = productService.create(dto);

        assertThat(created).isNotNull();
        assertThat(created.id).isNotNull();
        assertThat(created.code).isEqualTo("P001");
        assertThat(created.name).isEqualTo("Product 1");
        assertThat(created.value).isEqualByComparingTo(new BigDecimal("100.00"));
    }

    @Test
    @Transactional
    void testCreateProductWithDuplicateCodeShouldFail() {
        ProductDTO dto1 = new ProductDTO(null, "P001", "Product 1", new BigDecimal("100.00"));
        productService.create(dto1);

        ProductDTO dto2 = new ProductDTO(null, "P001", "Product 2", new BigDecimal("200.00"));
        
        assertThatThrownBy(() -> productService.create(dto2))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("already exists");
    }

    @Test
    @Transactional
    void testFindById() {
        ProductDTO dto = new ProductDTO(null, "P001", "Product 1", new BigDecimal("100.00"));
        ProductDTO created = productService.create(dto);

        ProductDTO found = productService.findById(created.id);

        assertThat(found).isNotNull();
        assertThat(found.id).isEqualTo(created.id);
        assertThat(found.code).isEqualTo("P001");
    }

    @Test
    void testFindByIdNotFoundShouldThrow() {
        assertThatThrownBy(() -> productService.findById(999L))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("not found");
    }

    @Test
    @Transactional
    void testFindByCode() {
        ProductDTO dto = new ProductDTO(null, "P001", "Product 1", new BigDecimal("100.00"));
        productService.create(dto);

        ProductDTO found = productService.findByCode("P001");

        assertThat(found).isNotNull();
        assertThat(found.code).isEqualTo("P001");
    }

    @Test
    @Transactional
    void testFindAll() {
        productService.create(new ProductDTO(null, "P001", "Product 1", new BigDecimal("100.00")));
        productService.create(new ProductDTO(null, "P002", "Product 2", new BigDecimal("200.00")));

        List<ProductDTO> products = productService.findAll();

        assertThat(products).hasSize(2);
    }

    @Test
    @Transactional
    void testUpdateProduct() {
        ProductDTO dto = new ProductDTO(null, "P001", "Product 1", new BigDecimal("100.00"));
        ProductDTO created = productService.create(dto);

        ProductDTO updateDto = new ProductDTO(created.id, "P001", "Updated Product", new BigDecimal("150.00"));
        ProductDTO updated = productService.update(created.id, updateDto);

        assertThat(updated.name).isEqualTo("Updated Product");
        assertThat(updated.value).isEqualByComparingTo(new BigDecimal("150.00"));
    }

    @Test
    @Transactional
    void testDeleteProduct() {
        ProductDTO dto = new ProductDTO(null, "P001", "Product 1", new BigDecimal("100.00"));
        ProductDTO created = productService.create(dto);

        productService.delete(created.id);

        assertThatThrownBy(() -> productService.findById(created.id))
            .isInstanceOf(NotFoundException.class);
    }
}
