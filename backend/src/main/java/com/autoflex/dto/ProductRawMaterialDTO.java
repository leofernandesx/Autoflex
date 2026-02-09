package com.autoflex.dto;

import com.autoflex.entity.Product;
import com.autoflex.entity.ProductRawMaterial;
import com.autoflex.entity.RawMaterial;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class ProductRawMaterialDTO {

    public Long id;

    @NotNull(message = "Product ID is required")
    public Long productId;

    @NotNull(message = "Raw material ID is required")
    public Long rawMaterialId;

    @NotNull(message = "Required quantity is required")
    @Positive(message = "Required quantity must be positive")
    public BigDecimal requiredQuantity;

    // Additional info for display
    public String productName;
    public String rawMaterialName;

    public ProductRawMaterialDTO() {
    }

    public ProductRawMaterialDTO(Long id, Long productId, Long rawMaterialId, 
                                  BigDecimal requiredQuantity) {
        this.id = id;
        this.productId = productId;
        this.rawMaterialId = rawMaterialId;
        this.requiredQuantity = requiredQuantity;
    }

    public static ProductRawMaterialDTO fromEntity(ProductRawMaterial prm) {
        if (prm == null) {
            return null;
        }
        ProductRawMaterialDTO dto = new ProductRawMaterialDTO(
            prm.id,
            prm.product != null ? prm.product.id : null,
            prm.rawMaterial != null ? prm.rawMaterial.id : null,
            prm.requiredQuantity
        );
        
        if (prm.product != null) {
            dto.productName = prm.product.name;
        }
        if (prm.rawMaterial != null) {
            dto.rawMaterialName = prm.rawMaterial.name;
        }
        
        return dto;
    }

    public ProductRawMaterial toEntity(Product product, RawMaterial rawMaterial) {
        ProductRawMaterial prm = new ProductRawMaterial();
        prm.id = this.id;
        prm.product = product;
        prm.rawMaterial = rawMaterial;
        prm.requiredQuantity = this.requiredQuantity;
        return prm;
    }

    @Override
    public String toString() {
        return "ProductRawMaterialDTO{" +
                "id=" + id +
                ", productId=" + productId +
                ", rawMaterialId=" + rawMaterialId +
                ", requiredQuantity=" + requiredQuantity +
                ", productName='" + productName + '\'' +
                ", rawMaterialName='" + rawMaterialName + '\'' +
                '}';
    }
}
