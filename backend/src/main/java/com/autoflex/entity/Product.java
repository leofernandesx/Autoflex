package com.autoflex.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", uniqueConstraints = {
    @UniqueConstraint(columnNames = "code")
})
public class Product extends PanacheEntity {

    @NotBlank(message = "Code is required")
    @Column(nullable = false, unique = true, length = 50)
    public String code;

    @NotBlank(message = "Name is required")
    @Column(nullable = false, length = 200)
    public String name;

    @NotNull(message = "Value is required")
    @Positive(message = "Value must be positive")
    @Column(name = "product_value", nullable = false, precision = 10, scale = 2)
    public BigDecimal value;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    public List<ProductRawMaterial> rawMaterials = new ArrayList<>();

    public Product() {
    }

    public Product(String code, String name, BigDecimal value) {
        this.code = code;
        this.name = name;
        this.value = value;
    }

    public static Product findByCode(String code) {
        return find("code", code).firstResult();
    }

    public static List<Product> findAllOrdered() {
        return list("ORDER BY value DESC, name ASC");
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", value=" + value +
                '}';
    }
}
