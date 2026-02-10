describe('Product Raw Materials Association', () => {
  const uniqueId = Date.now();

  beforeEach(() => {
    cy.visit('/products');
  });

  it('should open raw materials dialog when clicking settings icon', () => {
    // Create a product first (unique code to avoid conflicts from previous runs)
    const productCode = `PROD-RM-001-${uniqueId}`;
    cy.contains('New Product').click();
    cy.get('input[type="text"]').first().type(productCode);
    cy.get('input[type="text"]').eq(1).type('Product for Raw Materials Test');
    cy.get('input[type="number"]').type('50');
    cy.contains('button', 'Save').click();

    // Wait for form dialog to close and product to appear
    cy.get('[role="dialog"]').should('not.exist');
    cy.contains(productCode).should('be.visible');
    cy.get('[title="Manage raw materials"]').first().click();

    // Dialog should open
    cy.contains('Product Raw Materials').should('be.visible');
    cy.contains('Associated Raw Materials').should('be.visible');
    cy.contains('Add Raw Material').should('be.visible');
  });

  it('should add raw material to product', () => {
    const productCode = `PROD-RM-002-${uniqueId}`;
    const rawMaterialCode = `RM-ASSOC-001-${uniqueId}`;
    const rawMaterialName = 'Steel for Test';
    // Ensure we have a product and raw material - create if needed
    cy.contains('New Product').click();
    cy.get('input[type="text"]').first().type(productCode);
    cy.get('input[type="text"]').eq(1).type('Product for Association Test');
    cy.get('input[type="number"]').type('75');
    cy.contains('button', 'Save').click();

    // Wait for product form dialog to close
    cy.get('[role="dialog"]').should('not.exist');
    cy.contains('Raw Materials').click();
    cy.contains('New Raw Material').click();
    cy.get('input[type="text"]').first().type(rawMaterialCode);
    cy.get('input[type="text"]').eq(1).type(rawMaterialName);
    cy.get('input[type="number"]').type('100');
    cy.contains('button', 'Save').click();

    // Wait for raw material form dialog to close
    cy.get('[role="dialog"]').should('not.exist');
    cy.contains('Products').click();
    cy.contains(productCode).should('be.visible');
    cy.contains('tr', productCode).find('[title="Manage raw materials"]').click();

    // Wait for dialog and raw materials to load
    cy.contains('Add Raw Material').should('be.visible');
    cy.get('[data-testid="raw-material-select"]').click();
    cy.contains('li', rawMaterialCode).click();
    cy.get('input[type="number"]').last().clear().type('10');
    cy.contains('button', 'Add').click();

    // Should see the association in the table (backend returns rawMaterialName)
    cy.contains(rawMaterialName, { timeout: 5000 }).should('be.visible');
  });

  it('should show confirm dialog when removing association', () => {
    const productCode = `PROD-RM-003-${uniqueId}`;
    const rawMaterialCode = `RM-REMOVE-001-${uniqueId}`;
    // Open any product that has associations, or create the scenario
    cy.contains('New Product').click();
    cy.get('input[type="text"]').first().type(productCode);
    cy.get('input[type="text"]').eq(1).type('Product for Remove Test');
    cy.get('input[type="number"]').type('25');
    cy.contains('button', 'Save').click();

    cy.get('[role="dialog"]').should('not.exist');
    cy.contains('Raw Materials').click();
    cy.contains('New Raw Material').click();
    cy.get('input[type="text"]').first().type(rawMaterialCode);
    cy.get('input[type="text"]').eq(1).type('Material to Remove');
    cy.get('input[type="number"]').type('50');
    cy.contains('button', 'Save').click();

    cy.get('[role="dialog"]').should('not.exist');
    cy.contains('Products').click();
    cy.contains('tr', productCode).find('[title="Manage raw materials"]').click();

    // Add then try to remove
    cy.get('[data-testid="raw-material-select"]').click();
    cy.contains('li', rawMaterialCode).click();
    cy.get('input[type="number"]').last().clear().type('5');
    cy.contains('button', 'Add').click();

    // Click remove - should show confirm dialog
    cy.get('[title="Remove"]').first().click();
    cy.contains('Remove Raw Material').should('be.visible');
    cy.contains('Are you sure you want to remove this raw material from the product?').should('be.visible');
    cy.contains('button', 'Cancel').click();
    cy.contains('Remove Raw Material').should('not.exist');
  });
});
