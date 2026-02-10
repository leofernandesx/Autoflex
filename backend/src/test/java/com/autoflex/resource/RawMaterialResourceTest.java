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
class RawMaterialResourceTest {

    @Test
    void testGetAllRawMaterials() {
        given()
            .when().get("/api/raw-materials")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON);
    }

    @Test
    void testCreateRawMaterial() {
        String code = "RM-TEST-" + System.currentTimeMillis();
        Map<String, Object> rawMaterial = new HashMap<>();
        rawMaterial.put("code", code);
        rawMaterial.put("name", "Test Raw Material");
        rawMaterial.put("stockQuantity", new BigDecimal("100.500"));

        given()
            .contentType(ContentType.JSON)
            .body(rawMaterial)
            .when().post("/api/raw-materials")
            .then()
            .statusCode(201)
            .body("code", equalTo(code))
            .body("name", equalTo("Test Raw Material"))
            .body("stockQuantity", notNullValue())
            .body("id", notNullValue());
    }

    @Test
    void testCreateRawMaterialWithInvalidData() {
        Map<String, Object> rawMaterial = new HashMap<>();
        rawMaterial.put("code", "");
        rawMaterial.put("name", "Test");
        rawMaterial.put("stockQuantity", new BigDecimal("100"));

        given()
            .contentType(ContentType.JSON)
            .body(rawMaterial)
            .when().post("/api/raw-materials")
            .then()
            .statusCode(400);
    }

    @Test
    void testGetRawMaterialByIdNotFound() {
        given()
            .when().get("/api/raw-materials/99999")
            .then()
            .statusCode(404);
    }

    @Test
    void testCreateRawMaterialDuplicateCodeReturnsConflict() {
        String code = "RM-DUP-" + System.currentTimeMillis();
        Map<String, Object> rawMaterial = new HashMap<>();
        rawMaterial.put("code", code);
        rawMaterial.put("name", "First Raw Material");
        rawMaterial.put("stockQuantity", new BigDecimal("50"));

        given()
            .contentType(ContentType.JSON)
            .body(rawMaterial)
            .when().post("/api/raw-materials")
            .then()
            .statusCode(201);

        given()
            .contentType(ContentType.JSON)
            .body(rawMaterial)
            .when().post("/api/raw-materials")
            .then()
            .statusCode(409);
    }
}
