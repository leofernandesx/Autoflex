package com.autoflex.resource;

import com.autoflex.dto.RawMaterialDTO;
import com.autoflex.service.RawMaterialService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.List;

@Path("/api/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    private static final Logger LOG = Logger.getLogger(RawMaterialResource.class);

    @Inject
    RawMaterialService rawMaterialService;

    @GET
    public Response findAll() {
        LOG.debug("GET /api/raw-materials - Find all raw materials");
        List<RawMaterialDTO> rawMaterials = rawMaterialService.findAll();
        return Response.ok(rawMaterials).build();
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") Long id) {
        validateId(id);
        LOG.debug("GET /api/raw-materials/" + id);
        RawMaterialDTO rawMaterial = rawMaterialService.findById(id);
        return Response.ok(rawMaterial).build();
    }

    @GET
    @Path("/code/{code}")
    public Response findByCode(@PathParam("code") String code) {
        LOG.debug("GET /api/raw-materials/code/" + code);
        RawMaterialDTO rawMaterial = rawMaterialService.findByCode(code);
        return Response.ok(rawMaterial).build();
    }

    @POST
    public Response create(@Valid RawMaterialDTO dto) {
        LOG.debug("POST /api/raw-materials - Create raw material: " + dto);
        RawMaterialDTO created = rawMaterialService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Long id, @Valid RawMaterialDTO dto) {
        validateId(id);
        LOG.debug("PUT /api/raw-materials/" + id + " - Update raw material");
        RawMaterialDTO updated = rawMaterialService.update(id, dto);
        return Response.ok(updated).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Long id) {
        validateId(id);
        LOG.debug("DELETE /api/raw-materials/" + id);
        rawMaterialService.delete(id);
        return Response.noContent().build();
    }

    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid id: must be a positive number");
        }
    }
}
