package com.autoflex.resource;

import com.autoflex.dto.ProductRawMaterialDTO;
import com.autoflex.service.ProductRawMaterialService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.List;

@Path("/api/product-raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductRawMaterialResource {

    private static final Logger LOG = Logger.getLogger(ProductRawMaterialResource.class);

    @Inject
    ProductRawMaterialService productRawMaterialService;

    @GET
    public Response findAll() {
        LOG.debug("GET /api/product-raw-materials - Find all associations");
        List<ProductRawMaterialDTO> associations = productRawMaterialService.findAll();
        return Response.ok(associations).build();
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        validateId(id);
        LOG.debug("GET /api/product-raw-materials/" + id);
        ProductRawMaterialDTO association = productRawMaterialService.findById(id);
        return Response.ok(association).build();
    }

    @GET
    @Path("/product/{productId}")
    public Response findByProductId(@PathParam("productId") Long productId) {
        validateId(productId);
        LOG.debug("GET /api/product-raw-materials/product/" + productId);
        List<ProductRawMaterialDTO> associations = productRawMaterialService.findByProductId(productId);
        return Response.ok(associations).build();
    }

    @GET
    @Path("/raw-material/{rawMaterialId}")
    public Response findByRawMaterialId(@PathParam("rawMaterialId") Long rawMaterialId) {
        validateId(rawMaterialId);
        LOG.debug("GET /api/product-raw-materials/raw-material/" + rawMaterialId);
        List<ProductRawMaterialDTO> associations = productRawMaterialService.findByRawMaterialId(rawMaterialId);
        return Response.ok(associations).build();
    }

    @POST
    public Response create(@Valid ProductRawMaterialDTO dto) {
        LOG.debug("POST /api/product-raw-materials - Create association: " + dto);
        ProductRawMaterialDTO created = productRawMaterialService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid ProductRawMaterialDTO dto) {
        validateId(id);
        LOG.debug("PUT /api/product-raw-materials/" + id + " - Update association");
        ProductRawMaterialDTO updated = productRawMaterialService.update(id, dto);
        return Response.ok(updated).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        validateId(id);
        LOG.debug("DELETE /api/product-raw-materials/" + id);
        productRawMaterialService.delete(id);
        return Response.noContent().build();
    }

    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid id: must be a positive number");
        }
    }
}
