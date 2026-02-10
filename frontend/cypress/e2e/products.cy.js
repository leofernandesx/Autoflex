describe('Products Management', () => {
  const uniqueId = Date.now();

  beforeEach(() => {
    cy.visit('/products');
  });

  it('should display products page', () => {
    cy.contains('Products').should('be.visible');
    cy.contains('New Product').should('be.visible');
  });

  it('should open new product dialog', () => {
    cy.contains('New Product').click();
    cy.contains('New Product').should('be.visible');
    cy.get('input[type="text"]').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.contains('New Product').click();
    
    // Try to save without filling fields
    cy.contains('button', 'Save').click();
    
    // Should show validation errors
    cy.contains('required').should('be.visible');
  });

  it('should create a new product', () => {
    const productCode = `PROD-${uniqueId}`;
    cy.contains('New Product').click();
    
    // Fill form
    cy.get('input[type="text"]').first().type(productCode);
    cy.get('input[type="text"]').eq(1).type('Test Product');
    cy.get('input[type="number"]').type('99.99');
    
    // Save
    cy.contains('button', 'Save').click();
    
    // Should see the new product in the table
    cy.contains(productCode).should('be.visible');
    cy.contains('Test Product').should('be.visible');
  });

  it('should navigate to raw materials page', () => {
    cy.contains('Raw Materials').click();
    cy.url().should('include', '/raw-materials');
  });

  it('should navigate to production calculation page', () => {
    cy.contains('Production Calculation').click();
    cy.url().should('include', '/production');
  });

  it('should show error when creating product with duplicate code', () => {
    const productCode = `PROD-DUP-${uniqueId}`;
    cy.contains('New Product').click();
    cy.get('input[type="text"]').first().type(productCode);
    cy.get('input[type="text"]').eq(1).type('First Product');
    cy.get('input[type="number"]').type('10');
    cy.contains('button', 'Save').click();
    cy.get('[role="dialog"]').should('not.exist');

    // Try to create another product with same code
    cy.contains('New Product').click();
    cy.get('input[type="text"]').first().type(productCode);
    cy.get('input[type="text"]').eq(1).type('Duplicate Product');
    cy.get('input[type="number"]').type('20');
    cy.contains('button', 'Save').click();

    // Should show error in form (dialog stays open with Alert)
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"]').within(() => {
      cy.contains(/already exists|duplicate|conflict/i, { timeout: 5000 }).should('be.visible');
    });
  });
});
