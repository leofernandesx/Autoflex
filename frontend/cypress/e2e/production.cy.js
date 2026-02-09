describe('Production Calculation', () => {
  beforeEach(() => {
    cy.visit('/production');
  });

  it('should display production calculation page', () => {
    cy.contains('Cálculo de Produção').should('be.visible');
    cy.contains('Recalcular').should('be.visible');
  });

  it('should display summary cards', () => {
    cy.contains('Total de Produtos').should('be.visible');
    cy.contains('Valor Total').should('be.visible');
  });

  it('should display production table', () => {
    cy.contains('Produtos Sugeridos para Produção').should('be.visible');
  });

  it('should allow recalculation', () => {
    cy.contains('button', 'Recalcular').click();
    
    // Should show loading state or updated results
    cy.contains('Produtos Sugeridos para Produção').should('be.visible');
  });

  it('should show empty state when no production possible', () => {
    // This test assumes no products/materials are configured
    cy.contains('Nenhum produto pode ser produzido', { timeout: 10000 }).should('exist');
  });
});
