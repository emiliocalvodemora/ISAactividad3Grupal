import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const randomUser = () => ({
  username: `testuser${Date.now()}`,
  email: `test${Date.now()}@mail.com`,
  password: 'Test1234!'
});

let user = randomUser();

Given('el usuario navega a la página de registro', () => {
  cy.visit('/registro').wait(1000);
});

Given('el servidor está caído', () => {
  cy.intercept('POST', 'http://localhost:4000/api/register', {
    forceNetworkError: true,
  }).as('registroFallido');
});

Then('ve los campos {string}, {string}, {string}', (campo1, campo2, campo3) => {
  cy.get('input[name="username"]').should('exist');
  cy.get('input[name="email"]').should('exist');
  cy.get('input[name="password"]').should('exist');
});

Then('ve el botón {string}', (textoBoton) => {
  cy.get('button').contains(textoBoton).should('exist');
});

When('completa el formulario de registro con datos válidos', () => {
  cy.get('input[name="username"]').clear().type(user.username);
  cy.get('input[name="email"]').clear().type(user.email);
  cy.get('input[name="password"]').clear().type(user.password);
});

When('hago clic en {string}', (textoBoton) => {
  cy.get('button').contains(textoBoton).click();
});

Then('ve un mensaje de confirmación de registro', () => {
  cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 }).should('be.visible');
});

Then('debería ver un mensaje de error', () => {
  cy.contains(/error|no se pudo registrar/i, { timeout: 5000 }).should('be.visible');
});

Then('ve un mensaje de campos obligatorios', () => {
  cy.contains(/todos los campos son obligatorios/i).should('be.visible');
});

