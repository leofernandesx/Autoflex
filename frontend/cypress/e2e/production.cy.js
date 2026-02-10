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

  it('should show either empty state or production results', () => {
    // Page shows either: empty state (no products/materials) or production table (has data)
    cy.get('body', { timeout: 10000 }).should(($body) => {
      const hasEmptyState = $body.text().includes('No products can be produced');
      const hasResults = $body.text().includes('Suggested Products for Production');
      expect(hasEmptyState || hasResults).to.be.true;
    });
  });
});
