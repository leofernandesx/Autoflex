describe('Raw Materials Management', () => {
  const uniqueId = Date.now();

  beforeEach(() => {
    cy.visit('/raw-materials');
  });

  it('should display raw materials page', () => {
    cy.contains('Raw Materials').should('be.visible');
    cy.contains('New Raw Material').should('be.visible');
  });

  it('should open new raw material dialog', () => {
    cy.contains('New Raw Material').click();
    cy.contains('New Raw Material').should('be.visible');
    cy.get('input[type="text"]').should('be.visible');
  });

  it('should create a new raw material', () => {
    const rawMaterialCode = `RM-${uniqueId}`;
    cy.contains('New Raw Material').click();
    
    // Fill form
    cy.get('input[type="text"]').first().type(rawMaterialCode);
    cy.get('input[type="text"]').eq(1).type('Steel');
    cy.get('input[type="number"]').type('1000');
    
    // Save
    cy.contains('button', 'Save').click();
    
    // Should see the new raw material in the table
    cy.contains(rawMaterialCode).should('be.visible');
    cy.contains('Steel').should('be.visible');
  });

  it('should validate stock quantity is non-negative', () => {
    const rawMaterialCode = `RM-NEG-${uniqueId}`;
    cy.contains('New Raw Material').click();
    
    cy.get('input[type="text"]').first().type(rawMaterialCode);
    cy.get('input[type="text"]').eq(1).type('Plastic');
    cy.get('input[type="number"]').type('-10');
    
    cy.contains('button', 'Save').click();
    
    // Should show validation error
    cy.contains('zero or positive').should('be.visible');
  });

  it('should show error when creating raw material with duplicate code', () => {
    const rawMaterialCode = `RM-DUP-${uniqueId}`;
    cy.contains('New Raw Material').click();
    cy.get('input[type="text"]').first().type(rawMaterialCode);
    cy.get('input[type="text"]').eq(1).type('First Material');
    cy.get('input[type="number"]').type('100');
    cy.contains('button', 'Save').click();
    cy.get('[role="dialog"]').should('not.exist');

    // Try to create another raw material with same code
    cy.contains('New Raw Material').click();
    cy.get('input[type="text"]').first().type(rawMaterialCode);
    cy.get('input[type="text"]').eq(1).type('Duplicate Material');
    cy.get('input[type="number"]').type('200');
    cy.contains('button', 'Save').click();

    // Should show error in form (dialog stays open with Alert)
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"]').within(() => {
      cy.contains(/already exists|duplicate|conflict/i, { timeout: 5000 }).should('be.visible');
    });
  });
});
