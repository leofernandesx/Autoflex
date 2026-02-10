package com.autoflex.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
class ProductionResourceTest {

    @Test
    void testCalculateProduction() {
        given()
            .when().get("/api/production/calculate")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("items", notNullValue())
            .body("totalValue", notNullValue());
    }

    @Test
    void testCalculateProductionReturnsValidStructure() {
        given()
            .when().get("/api/production/calculate")
            .then()
            .statusCode(200)
            .body("items", any(java.util.List.class))
            .body("totalValue", any(Number.class));
    }
}
