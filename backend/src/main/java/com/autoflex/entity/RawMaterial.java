package com.autoflex.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "raw_materials", uniqueConstraints = {
    @UniqueConstraint(columnNames = "code")
})
public class RawMaterial extends PanacheEntity {

    @NotBlank(message = "Code is required")
    @Column(nullable = false, unique = true, length = 50)
    public String code;

    @NotBlank(message = "Name is required")
    @Column(nullable = false, length = 200)
    public String name;

    @NotNull(message = "Stock quantity is required")
    @PositiveOrZero(message = "Stock quantity must be zero or positive")
    @Column(nullable = false, precision = 10, scale = 3)
    public BigDecimal stockQuantity;

    public RawMaterial() {
    }

    public RawMaterial(String code, String name, BigDecimal stockQuantity) {
        this.code = code;
        this.name = name;
        this.stockQuantity = stockQuantity;
    }

    public static RawMaterial findByCode(String code) {
        return find("code", code).firstResult();
    }

    public static List<RawMaterial> findAllOrdered() {
        return list("ORDER BY name ASC");
    }

    @Override
    public String toString() {
        return "RawMaterial{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", stockQuantity=" + stockQuantity +
                '}';
    }
}
