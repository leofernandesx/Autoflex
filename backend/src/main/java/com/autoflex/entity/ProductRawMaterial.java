package com.autoflex.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "product_raw_materials")
public class ProductRawMaterial extends PanacheEntity {

    @NotNull(message = "Product is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    public Product product;

    @NotNull(message = "Raw material is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_id", nullable = false)
    public RawMaterial rawMaterial;

    @NotNull(message = "Required quantity is required")
    @Positive(message = "Required quantity must be positive")
    @Column(nullable = false, precision = 10, scale = 3)
    public BigDecimal requiredQuantity;

    public ProductRawMaterial() {
    }

    public ProductRawMaterial(Product product, RawMaterial rawMaterial, BigDecimal requiredQuantity) {
        this.product = product;
        this.rawMaterial = rawMaterial;
        this.requiredQuantity = requiredQuantity;
    }

    public static List<ProductRawMaterial> findByProductId(Long productId) {
        return list("product.id", productId);
    }

    public static List<ProductRawMaterial> findByRawMaterialId(Long rawMaterialId) {
        return list("rawMaterial.id", rawMaterialId);
    }

    @Override
    public String toString() {
        return "ProductRawMaterial{" +
                "id=" + id +
                ", productId=" + (product != null ? product.id : null) +
                ", rawMaterialId=" + (rawMaterial != null ? rawMaterial.id : null) +
                ", requiredQuantity=" + requiredQuantity +
                '}';
    }
}
