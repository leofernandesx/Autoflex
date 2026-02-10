package com.autoflex.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.containsString;

@QuarkusTest
class ProductResourceTest {

    @Test
    void testGetAllProducts() {
        given()
            .when().get("/api/products")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON);
    }

    @Test
    void testCreateProduct() {
        Map<String, Object> product = new HashMap<>();
        product.put("code", "P-TEST-001");
        product.put("name", "Test Product");
        product.put("value", new BigDecimal("99.99"));

        given()
            .contentType(ContentType.JSON)
            .body(product)
            .when().post("/api/products")
            .then()
            .statusCode(201)
            .body("code", equalTo("P-TEST-001"))
            .body("name", equalTo("Test Product"))
            .body("id", notNullValue());
    }

    @Test
    void testCreateProductWithInvalidData() {
        Map<String, Object> product = new HashMap<>();
        product.put("code", "");
        product.put("name", "Test Product");
        product.put("value", new BigDecimal("99.99"));

        given()
            .contentType(ContentType.JSON)
            .body(product)
            .when().post("/api/products")
            .then()
            .statusCode(400);
    }

    @Test
    void testGetProductByIdNotFound() {
        given()
            .when().get("/api/products/99999")
            .then()
            .statusCode(404);
    }

    @Test
    void testCreateProductDuplicateCodeReturnsConflict() {
        String code = "P-DUP-" + System.currentTimeMillis();
        Map<String, Object> product = new HashMap<>();
        product.put("code", code);
        product.put("name", "First Product");
        product.put("value", new BigDecimal("10.00"));

        given()
            .contentType(ContentType.JSON)
            .body(product)
            .when().post("/api/products")
            .then()
            .statusCode(201);

        given()
            .contentType(ContentType.JSON)
            .body(product)
            .when().post("/api/products")
            .then()
            .statusCode(409)
            .body("message", equalTo("Conflict"))
            .body("details", containsString("already exists"));
    }
}
