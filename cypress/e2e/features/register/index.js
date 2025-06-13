import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const generateRandomUser = (prefix = 'testuser') => ({
  username: `${prefix}${Cypress._.random(1e6)}`,
  email: `${prefix}${Cypress._.random(1e6)}@test.com`,
  password: `Test${Cypress._.random(1e4)}!`,
});

let testUser = null;

// Escenario normal
Given("el usuario navega a la página de registro", () => {
  testUser = generateRandomUser();
  cy.visit("/registro");
  cy.get('[data-testid="register-form"]', { timeout: 10000 }).should('exist');
});

// Escenario con servidor caído
Given("el usuario navega a la página de registro estando el servidor caído", () => {
  cy.intercept('POST', 'http://localhost:4000/api/register', {
    statusCode: 503,
    body: { message: 'Servicio no disponible' },
    delay: 1000
  }).as('serverDown');
  
  testUser = generateRandomUser();
  cy.visit("/registro");
  cy.get('[data-testid="register-form"]', { timeout: 10000 }).should('exist');
});

Then("ve los campos {string}, {string}, {string}", (campo1, campo2, campo3) => {
  const testIds = {
    'Usuario': 'username-input',
    'Email': 'email-input',
    'Contraseña': 'password-input'
  };
  
  [campo1, campo2, campo3].forEach((campo) => {
    cy.get(`[data-testid="${testIds[campo]}"]`).should('be.visible');
  });
});

Then("ve el botón {string}", (textoBoton) => {
  cy.get('[data-testid="submit-button"]')
    .should('contain', textoBoton)
    .and('be.visible');
});

When("escribo {string} en el campo {string}", (valor, campo) => {
  const testIds = {
    'Usuario': 'username-input',
    'Email': 'email-input',
    'Contraseña': 'password-input'
  };
  
  cy.get(`[data-testid="${testIds[campo]}"]`)
    .clear()
    .type(valor)
    .should('have.value', valor);
});

When("completa el formulario de registro con datos válidos", () => {
  cy.get('[data-testid="username-input"]').clear().type(testUser.username);
  cy.get('[data-testid="email-input"]').clear().type(testUser.email);
  cy.get('[data-testid="password-input"]').clear().type(testUser.password);
});

When("envía el formulario de registro", () => {
  cy.get('[data-testid="submit-button"]').click();
});

Then("debería ver el mensaje {string}", (mensaje) => {
  cy.get('[data-testid="message"]')
    .should('be.visible')
    .and('contain', mensaje);
});

// Para el escenario de servidor caído
Then("debería ver un mensaje de error del servidor", () => {
  cy.get('[data-testid="message"]')
    .should('be.visible')
    .and('have.class', 'error')
    .and('contain', 'Servicio no disponible');
});