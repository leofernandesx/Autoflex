package com.autoflex.service;

import com.autoflex.dto.ProductDTO;
import com.autoflex.entity.Product;
import com.autoflex.exception.ConflictException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProductService {

    public List<ProductDTO> findAll() {
        return Product.<Product>listAll()
            .stream()
            .map(ProductDTO::fromEntity)
            .collect(Collectors.toList());
    }

    public ProductDTO findById(Long id) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new NotFoundException("Product not found with id: " + id);
        }
        return ProductDTO.fromEntity(product);
    }

    public ProductDTO findByCode(String code) {
        Product product = Product.findByCode(code);
        if (product == null) {
            throw new NotFoundException("Product not found with code: " + code);
        }
        return ProductDTO.fromEntity(product);
    }

    @Transactional
    public ProductDTO create(ProductDTO dto) {
        // Check if code already exists
        Product existing = Product.findByCode(dto.code);
        if (existing != null) {
            throw new ConflictException("Product with code " + dto.code + " already exists");
        }

        Product product = new Product();
        product.code = dto.code;
        product.name = dto.name;
        product.value = dto.value;
        product.persist();
        return ProductDTO.fromEntity(product);
    }

    @Transactional
    public ProductDTO update(Long id, ProductDTO dto) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new NotFoundException("Product not found with id: " + id);
        }

        // Check if new code conflicts with another product
        if (!product.code.equals(dto.code)) {
            Product existing = Product.findByCode(dto.code);
            if (existing != null && !existing.id.equals(id)) {
                throw new ConflictException("Product with code " + dto.code + " already exists");
            }
        }

        product.code = dto.code;
        product.name = dto.name;
        product.value = dto.value;
        product.persist();

        return ProductDTO.fromEntity(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new NotFoundException("Product not found with id: " + id);
        }
        product.delete();
    }
}
