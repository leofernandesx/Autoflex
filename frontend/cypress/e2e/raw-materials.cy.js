describe('Raw Materials Management', () => {
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
    cy.contains('New Raw Material').click();
    
    // Fill form
    cy.get('input[type="text"]').first().type('RM-001');
    cy.get('input[type="text"]').eq(1).type('Steel');
    cy.get('input[type="number"]').type('1000');
    
    // Save
    cy.contains('button', 'Save').click();
    
    // Should see the new raw material in the table
    cy.contains('RM-001').should('be.visible');
    cy.contains('Steel').should('be.visible');
  });

  it('should validate stock quantity is non-negative', () => {
    cy.contains('New Raw Material').click();
    
    cy.get('input[type="text"]').first().type('RM-002');
    cy.get('input[type="text"]').eq(1).type('Plastic');
    cy.get('input[type="number"]').type('-10');
    
    cy.contains('button', 'Save').click();
    
    // Should show validation error
    cy.contains('zero or positive').should('be.visible');
  });
});
