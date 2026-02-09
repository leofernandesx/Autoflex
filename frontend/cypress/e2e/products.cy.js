describe('Products Management', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('should display products page', () => {
    cy.contains('Produtos').should('be.visible');
    cy.contains('Novo Produto').should('be.visible');
  });

  it('should open new product dialog', () => {
    cy.contains('Novo Produto').click();
    cy.contains('Novo Produto').should('be.visible');
    cy.get('input[type="text"]').should('be.visible');
  });

  it('should validate required fields', () => {
    cy.contains('Novo Produto').click();
    
    // Try to save without filling fields
    cy.contains('button', 'Salvar').click();
    
    // Should show validation errors
    cy.contains('obrigatório').should('be.visible');
  });

  it('should create a new product', () => {
    cy.contains('Novo Produto').click();
    
    // Fill form
    cy.get('input[type="text"]').first().type('PROD-001');
    cy.get('input[type="text"]').eq(1).type('Test Product');
    cy.get('input[type="number"]').type('99.99');
    
    // Save
    cy.contains('button', 'Salvar').click();
    
    // Should see the new product in the table
    cy.contains('PROD-001').should('be.visible');
    cy.contains('Test Product').should('be.visible');
  });

  it('should navigate to raw materials page', () => {
    cy.contains('Matérias-primas').click();
    cy.url().should('include', '/raw-materials');
  });

  it('should navigate to production calculation page', () => {
    cy.contains('Cálculo de Produção').click();
    cy.url().should('include', '/production');
  });
});
