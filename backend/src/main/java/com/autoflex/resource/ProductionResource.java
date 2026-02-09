package com.autoflex.resource;

import com.autoflex.dto.ProductionCalculationDTO;
import com.autoflex.service.ProductionService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

@Path("/api/production")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionResource {

    private static final Logger LOG = Logger.getLogger(ProductionResource.class);

    @Inject
    ProductionService productionService;

    @GET
    @Path("/calculate")
    public Response calculateProduction() {
        LOG.debug("GET /api/production/calculate - Calculate production");
        ProductionCalculationDTO result = productionService.calculateProduction();
        return Response.ok(result).build();
    }
}
