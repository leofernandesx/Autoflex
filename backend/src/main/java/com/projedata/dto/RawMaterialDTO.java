package com.autoflex.dto;

import com.autoflex.entity.RawMaterial;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class RawMaterialDTO {

    public Long id;

    @NotBlank(message = "Code is required")
    public String code;

    @NotBlank(message = "Name is required")
    public String name;

    @NotNull(message = "Stock quantity is required")
    @PositiveOrZero(message = "Stock quantity must be zero or positive")
    public BigDecimal stockQuantity;

    public RawMaterialDTO() {
    }

    public RawMaterialDTO(Long id, String code, String name, BigDecimal stockQuantity) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.stockQuantity = stockQuantity;
    }

    public static RawMaterialDTO fromEntity(RawMaterial rawMaterial) {
        if (rawMaterial == null) {
            return null;
        }
        return new RawMaterialDTO(
            rawMaterial.id,
            rawMaterial.code,
            rawMaterial.name,
            rawMaterial.stockQuantity
        );
    }

    public RawMaterial toEntity() {
        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.id = this.id;
        rawMaterial.code = this.code;
        rawMaterial.name = this.name;
        rawMaterial.stockQuantity = this.stockQuantity;
        return rawMaterial;
    }

    @Override
    public String toString() {
        return "RawMaterialDTO{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", stockQuantity=" + stockQuantity +
                '}';
    }
}
