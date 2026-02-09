package com.autoflex.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductionCalculationDTO {

    public List<ProductionItemDTO> items = new ArrayList<>();
    public BigDecimal totalValue = BigDecimal.ZERO;

    public ProductionCalculationDTO() {
    }

    public ProductionCalculationDTO(List<ProductionItemDTO> items, BigDecimal totalValue) {
        this.items = items;
        this.totalValue = totalValue;
    }

    public static class ProductionItemDTO {
        public Long productId;
        public String productCode;
        public String productName;
        public BigDecimal unitValue;
        public BigDecimal quantity;
        public BigDecimal totalValue;

        public ProductionItemDTO() {
        }

        public ProductionItemDTO(Long productId, String productCode, String productName,
                                 BigDecimal unitValue, BigDecimal quantity, BigDecimal totalValue) {
            this.productId = productId;
            this.productCode = productCode;
            this.productName = productName;
            this.unitValue = unitValue;
            this.quantity = quantity;
            this.totalValue = totalValue;
        }

        @Override
        public String toString() {
            return "ProductionItemDTO{" +
                    "productId=" + productId +
                    ", productCode='" + productCode + '\'' +
                    ", productName='" + productName + '\'' +
                    ", unitValue=" + unitValue +
                    ", quantity=" + quantity +
                    ", totalValue=" + totalValue +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "ProductionCalculationDTO{" +
                "items=" + items +
                ", totalValue=" + totalValue +
                '}';
    }
}
