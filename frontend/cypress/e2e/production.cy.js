describe('Production Calculation', () => {
  beforeEach(() => {
    cy.visit('/production');
  });

  it('should display production calculation page', () => {
    cy.contains('Production Calculation').should('be.visible');
    cy.contains('Recalculate').should('be.visible');
  });

  it('should display summary cards', () => {
    cy.contains('Total Products').should('be.visible');
    cy.contains('Total Value').should('be.visible');
  });

  it('should display production table', () => {
    cy.contains('Suggested Products for Production').should('be.visible');
  });

  it('should allow recalculation', () => {
    cy.contains('button', 'Recalculate').click();
    
    // Should show loading state or updated results
    cy.contains('Suggested Products for Production').should('be.visible');
  });

  it('should show empty state when no production possible', () => {
    // This test assumes no products/materials are configured
    cy.contains('No products can be produced', { timeout: 10000 }).should('exist');
  });
});
