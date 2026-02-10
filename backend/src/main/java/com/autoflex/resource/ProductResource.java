package com.autoflex.resource;

import com.autoflex.dto.ProductDTO;
import com.autoflex.service.ProductService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.List;

@Path("/api/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    private static final Logger LOG = Logger.getLogger(ProductResource.class);

    @Inject
    ProductService productService;

    @GET
    public Response findAll() {
        LOG.debug("GET /api/products - Find all products");
        List<ProductDTO> products = productService.findAll();
        return Response.ok(products).build();
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        validateId(id);
        LOG.debug("GET /api/products/" + id);
        ProductDTO product = productService.findById(id);
        return Response.ok(product).build();
    }

    @GET
    @Path("/code/{code}")
    public Response findByCode(@PathParam("code") String code) {
        LOG.debug("GET /api/products/code/" + code);
        ProductDTO product = productService.findByCode(code);
        return Response.ok(product).build();
    }

    @POST
    public Response create(@Valid ProductDTO dto) {
        LOG.debug("POST /api/products - Create product: " + dto);
        ProductDTO created = productService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid ProductDTO dto) {
        validateId(id);
        LOG.debug("PUT /api/products/" + id + " - Update product");
        ProductDTO updated = productService.update(id, dto);
        return Response.ok(updated).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        validateId(id);
        LOG.debug("DELETE /api/products/" + id);
        productService.delete(id);
        return Response.noContent().build();
    }

    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid id: must be a positive number");
        }
    }
}
