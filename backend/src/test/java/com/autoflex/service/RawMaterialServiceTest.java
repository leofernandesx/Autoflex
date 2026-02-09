package com.autoflex.service;

import com.autoflex.dto.RawMaterialDTO;
import com.autoflex.entity.RawMaterial;
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
class RawMaterialServiceTest {

    @Inject
    RawMaterialService rawMaterialService;

    @BeforeEach
    @Transactional
    void setUp() {
        RawMaterial.deleteAll();
    }

    @Test
    @Transactional
    void testCreateRawMaterial() {
        RawMaterialDTO dto = new RawMaterialDTO(null, "RM001", "Steel", new BigDecimal("1000.000"));
        RawMaterialDTO created = rawMaterialService.create(dto);

        assertThat(created).isNotNull();
        assertThat(created.id).isNotNull();
        assertThat(created.code).isEqualTo("RM001");
        assertThat(created.name).isEqualTo("Steel");
        assertThat(created.stockQuantity).isEqualByComparingTo(new BigDecimal("1000.000"));
    }

    @Test
    @Transactional
    void testCreateRawMaterialWithDuplicateCodeShouldFail() {
        RawMaterialDTO dto1 = new RawMaterialDTO(null, "RM001", "Steel", new BigDecimal("1000.000"));
        rawMaterialService.create(dto1);

        RawMaterialDTO dto2 = new RawMaterialDTO(null, "RM001", "Iron", new BigDecimal("500.000"));
        
        assertThatThrownBy(() -> rawMaterialService.create(dto2))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("already exists");
    }

    @Test
    @Transactional
    void testFindById() {
        RawMaterialDTO dto = new RawMaterialDTO(null, "RM001", "Steel", new BigDecimal("1000.000"));
        RawMaterialDTO created = rawMaterialService.create(dto);

        RawMaterialDTO found = rawMaterialService.findById(created.id);

        assertThat(found).isNotNull();
        assertThat(found.id).isEqualTo(created.id);
        assertThat(found.code).isEqualTo("RM001");
    }

    @Test
    void testFindByIdNotFoundShouldThrow() {
        assertThatThrownBy(() -> rawMaterialService.findById(999L))
            .isInstanceOf(NotFoundException.class)
            .hasMessageContaining("not found");
    }

    @Test
    @Transactional
    void testFindAll() {
        rawMaterialService.create(new RawMaterialDTO(null, "RM001", "Steel", new BigDecimal("1000.000")));
        rawMaterialService.create(new RawMaterialDTO(null, "RM002", "Plastic", new BigDecimal("500.000")));

        List<RawMaterialDTO> rawMaterials = rawMaterialService.findAll();

        assertThat(rawMaterials).hasSize(2);
    }

    @Test
    @Transactional
    void testUpdateRawMaterial() {
        RawMaterialDTO dto = new RawMaterialDTO(null, "RM001", "Steel", new BigDecimal("1000.000"));
        RawMaterialDTO created = rawMaterialService.create(dto);

        RawMaterialDTO updateDto = new RawMaterialDTO(created.id, "RM001", "Steel Updated", new BigDecimal("1500.000"));
        RawMaterialDTO updated = rawMaterialService.update(created.id, updateDto);

        assertThat(updated.name).isEqualTo("Steel Updated");
        assertThat(updated.stockQuantity).isEqualByComparingTo(new BigDecimal("1500.000"));
    }

    @Test
    @Transactional
    void testDeleteRawMaterial() {
        RawMaterialDTO dto = new RawMaterialDTO(null, "RM001", "Steel", new BigDecimal("1000.000"));
        RawMaterialDTO created = rawMaterialService.create(dto);

        rawMaterialService.delete(created.id);

        assertThatThrownBy(() -> rawMaterialService.findById(created.id))
            .isInstanceOf(NotFoundException.class);
    }
}
