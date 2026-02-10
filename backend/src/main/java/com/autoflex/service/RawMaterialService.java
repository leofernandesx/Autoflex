package com.autoflex.service;

import com.autoflex.dto.RawMaterialDTO;
import com.autoflex.entity.RawMaterial;
import com.autoflex.exception.ConflictException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class RawMaterialService {

    public List<RawMaterialDTO> findAll() {
        return RawMaterial.<RawMaterial>listAll()
            .stream()
            .map(RawMaterialDTO::fromEntity)
            .collect(Collectors.toList());
    }

    public RawMaterialDTO findById(Long id) {
        RawMaterial rawMaterial = RawMaterial.findById(id);
        if (rawMaterial == null) {
            throw new NotFoundException("Raw material not found with id: " + id);
        }
        return RawMaterialDTO.fromEntity(rawMaterial);
    }

    public RawMaterialDTO findByCode(String code) {
        RawMaterial rawMaterial = RawMaterial.findByCode(code);
        if (rawMaterial == null) {
            throw new NotFoundException("Raw material not found with code: " + code);
        }
        return RawMaterialDTO.fromEntity(rawMaterial);
    }

    @Transactional
    public RawMaterialDTO create(RawMaterialDTO dto) {
        // Check if code already exists
        RawMaterial existing = RawMaterial.findByCode(dto.code);
        if (existing != null) {
            throw new ConflictException("Raw material with code " + dto.code + " already exists");
        }

        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.code = dto.code;
        rawMaterial.name = dto.name;
        rawMaterial.stockQuantity = dto.stockQuantity;
        rawMaterial.persist();
        return RawMaterialDTO.fromEntity(rawMaterial);
    }

    @Transactional
    public RawMaterialDTO update(Long id, RawMaterialDTO dto) {
        RawMaterial rawMaterial = RawMaterial.findById(id);
        if (rawMaterial == null) {
            throw new NotFoundException("Raw material not found with id: " + id);
        }

        // Check if new code conflicts with another raw material
        if (!rawMaterial.code.equals(dto.code)) {
            RawMaterial existing = RawMaterial.findByCode(dto.code);
            if (existing != null && !existing.id.equals(id)) {
                throw new ConflictException("Raw material with code " + dto.code + " already exists");
            }
        }

        rawMaterial.code = dto.code;
        rawMaterial.name = dto.name;
        rawMaterial.stockQuantity = dto.stockQuantity;
        rawMaterial.persist();

        return RawMaterialDTO.fromEntity(rawMaterial);
    }

    @Transactional
    public void delete(Long id) {
        RawMaterial rawMaterial = RawMaterial.findById(id);
        if (rawMaterial == null) {
            throw new NotFoundException("Raw material not found with id: " + id);
        }
        rawMaterial.delete();
    }
}
