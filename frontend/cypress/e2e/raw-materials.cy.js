describe('Raw Materials Management', () => {
  beforeEach(() => {
    cy.visit('/raw-materials');
  });

  it('should display raw materials page', () => {
    cy.contains('Matérias-primas').should('be.visible');
    cy.contains('Nova Matéria-prima').should('be.visible');
  });

  it('should open new raw material dialog', () => {
    cy.contains('Nova Matéria-prima').click();
    cy.contains('Nova Matéria-prima').should('be.visible');
    cy.get('input[type="text"]').should('be.visible');
  });

  it('should create a new raw material', () => {
    cy.contains('Nova Matéria-prima').click();
    
    // Fill form
    cy.get('input[type="text"]').first().type('RM-001');
    cy.get('input[type="text"]').eq(1).type('Steel');
    cy.get('input[type="number"]').type('1000');
    
    // Save
    cy.contains('button', 'Salvar').click();
    
    // Should see the new raw material in the table
    cy.contains('RM-001').should('be.visible');
    cy.contains('Steel').should('be.visible');
  });

  it('should validate stock quantity is non-negative', () => {
    cy.contains('Nova Matéria-prima').click();
    
    cy.get('input[type="text"]').first().type('RM-002');
    cy.get('input[type="text"]').eq(1).type('Plastic');
    cy.get('input[type="number"]').type('-10');
    
    cy.contains('button', 'Salvar').click();
    
    // Should show validation error
    cy.contains('zero ou positiva').should('be.visible');
  });
});
