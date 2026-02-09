package com.autoflex.dto;

import com.autoflex.entity.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class ProductDTO {

    public Long id;

    @NotBlank(message = "Code is required")
    public String code;

    @NotBlank(message = "Name is required")
    public String name;

    @NotNull(message = "Value is required")
    @Positive(message = "Value must be positive")
    public BigDecimal value;

    public ProductDTO() {
    }

    public ProductDTO(Long id, String code, String name, BigDecimal value) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.value = value;
    }

    public static ProductDTO fromEntity(Product product) {
        if (product == null) {
            return null;
        }
        return new ProductDTO(product.id, product.code, product.name, product.value);
    }

    public Product toEntity() {
        Product product = new Product();
        product.id = this.id;
        product.code = this.code;
        product.name = this.name;
        product.value = this.value;
        return product;
    }

    @Override
    public String toString() {
        return "ProductDTO{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", value=" + value +
                '}';
    }
}
