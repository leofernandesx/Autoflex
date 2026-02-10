package com.autoflex.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
class ProductRawMaterialResourceTest {

    @Test
    void testGetAllAssociations() {
        given()
            .when().get("/api/product-raw-materials")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON);
    }

    @Test
    void testGetAssociationsByProductId() {
        given()
            .when().get("/api/product-raw-materials/product/1")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON);
    }

    @Test
    void testCreateAssociation() {
        // Create product
        String productCode = "P-PRM-" + System.currentTimeMillis();
        Map<String, Object> product = new HashMap<>();
        product.put("code", productCode);
        product.put("name", "Product for Association");
        product.put("value", new BigDecimal("50.00"));

        Long productId = ((Number) given()
            .contentType(ContentType.JSON)
            .body(product)
            .when().post("/api/products")
            .then()
            .statusCode(201)
            .extract().path("id")).longValue();

        // Create raw material
        String rmCode = "RM-PRM-" + System.currentTimeMillis();
        Map<String, Object> rawMaterial = new HashMap<>();
        rawMaterial.put("code", rmCode);
        rawMaterial.put("name", "Raw Material for Association");
        rawMaterial.put("stockQuantity", new BigDecimal("200"));

        Long rawMaterialId = ((Number) given()
            .contentType(ContentType.JSON)
            .body(rawMaterial)
            .when().post("/api/raw-materials")
            .then()
            .statusCode(201)
            .extract().path("id")).longValue();

        // Create association
        Map<String, Object> association = new HashMap<>();
        association.put("productId", productId);
        association.put("rawMaterialId", rawMaterialId);
        association.put("requiredQuantity", new BigDecimal("2.500"));

        given()
            .contentType(ContentType.JSON)
            .body(association)
            .when().post("/api/product-raw-materials")
            .then()
            .statusCode(201)
            .body("productId", equalTo(productId.intValue()))
            .body("rawMaterialId", equalTo(rawMaterialId.intValue()))
            .body("requiredQuantity", notNullValue())
            .body("id", notNullValue());
    }

    @Test
    void testGetAssociationByIdNotFound() {
        given()
            .when().get("/api/product-raw-materials/99999")
            .then()
            .statusCode(404);
    }
}
