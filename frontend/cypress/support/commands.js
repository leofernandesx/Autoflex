// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Example custom command
Cypress.Commands.add('login', (username, password) => {
  // Add login logic if authentication is implemented
});

// Command to create a product via UI
Cypress.Commands.add('createProduct', (code, name, value) => {
  cy.visit('/products');
  cy.contains('Novo Produto').click();
  cy.get('input[type="text"]').first().type(code);
  cy.get('input[type="text"]').eq(1).type(name);
  cy.get('input[type="number"]').type(value);
  cy.contains('button', 'Salvar').click();
  cy.wait(500);
});

// Command to create a raw material via UI
Cypress.Commands.add('createRawMaterial', (code, name, quantity) => {
  cy.visit('/raw-materials');
  cy.contains('Nova Matéria-prima').click();
  cy.get('input[type="text"]').first().type(code);
  cy.get('input[type="text"]').eq(1).type(name);
  cy.get('input[type="number"]').type(quantity);
  cy.contains('button', 'Salvar').click();
  cy.wait(500);
});
