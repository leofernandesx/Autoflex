package com.autoflex.service;

import com.autoflex.dto.ProductRawMaterialDTO;
import com.autoflex.entity.Product;
import com.autoflex.entity.ProductRawMaterial;
import com.autoflex.entity.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductRawMaterialService {

    public List<ProductRawMaterialDTO> findAll() {
        return ProductRawMaterial.<ProductRawMaterial>listAll()
            .stream()
            .map(ProductRawMaterialDTO::fromEntity)
            .collect(Collectors.toList());
    }

    public ProductRawMaterialDTO findById(Long id) {
        ProductRawMaterial prm = ProductRawMaterial.findById(id);
        if (prm == null) {
            throw new NotFoundException("Product-RawMaterial association not found with id: " + id);
        }
        return ProductRawMaterialDTO.fromEntity(prm);
    }

    public List<ProductRawMaterialDTO> findByProductId(Long productId) {
        return ProductRawMaterial.findByProductId(productId)
            .stream()
            .map(ProductRawMaterialDTO::fromEntity)
            .collect(Collectors.toList());
    }

    public List<ProductRawMaterialDTO> findByRawMaterialId(Long rawMaterialId) {
        return ProductRawMaterial.findByRawMaterialId(rawMaterialId)
            .stream()
            .map(ProductRawMaterialDTO::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public ProductRawMaterialDTO create(ProductRawMaterialDTO dto) {
        Product product = Product.findById(dto.productId);
        if (product == null) {
            throw new NotFoundException("Product not found with id: " + dto.productId);
        }

        RawMaterial rawMaterial = RawMaterial.findById(dto.rawMaterialId);
        if (rawMaterial == null) {
            throw new NotFoundException("Raw material not found with id: " + dto.rawMaterialId);
        }

        ProductRawMaterial prm = new ProductRawMaterial();
        prm.product = product;
        prm.rawMaterial = rawMaterial;
        prm.requiredQuantity = dto.requiredQuantity;
        prm.persist();
        return ProductRawMaterialDTO.fromEntity(prm);
    }

    @Transactional
    public ProductRawMaterialDTO update(Long id, ProductRawMaterialDTO dto) {
        ProductRawMaterial prm = ProductRawMaterial.findById(id);
        if (prm == null) {
            throw new NotFoundException("Product-RawMaterial association not found with id: " + id);
        }

        // If product or raw material changed, validate they exist
        if (!prm.product.id.equals(dto.productId)) {
            Product product = Product.findById(dto.productId);
            if (product == null) {
                throw new NotFoundException("Product not found with id: " + dto.productId);
            }
            prm.product = product;
        }

        if (!prm.rawMaterial.id.equals(dto.rawMaterialId)) {
            RawMaterial rawMaterial = RawMaterial.findById(dto.rawMaterialId);
            if (rawMaterial == null) {
                throw new NotFoundException("Raw material not found with id: " + dto.rawMaterialId);
            }
            prm.rawMaterial = rawMaterial;
        }

        prm.requiredQuantity = dto.requiredQuantity;
        prm.persist();

        return ProductRawMaterialDTO.fromEntity(prm);
    }

    @Transactional
    public void delete(Long id) {
        ProductRawMaterial prm = ProductRawMaterial.findById(id);
        if (prm == null) {
            throw new NotFoundException("Product-RawMaterial association not found with id: " + id);
        }
        prm.delete();
    }
}
