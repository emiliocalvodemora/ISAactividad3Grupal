import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Generador de usuario único con prefijo configurable
const generateRandomUser = (prefix = 'testuser') => ({
  username: `${prefix}${Cypress._.random(1e6)}`,
  email: `${prefix}${Cypress._.random(1e6)}@test.com`,
  password: `Test${Cypress._.random(1e4)}!`,
});

let testUser = null;

Given("el usuario navega a la página de registro", () => {
  testUser = generateRandomUser();
  cy.visit("/registro");
  cy.get('[data-testid="register-form"]').should('exist');
});

Then("ve los campos {string}, {string}, {string}", (campo1, campo2, campo3) => {
  const fields = [campo1, campo2, campo3];
  fields.forEach((field) => {
    cy.get(`input[placeholder="${field}"]`).should('be.visible');
  });
});

Then("ve el botón {string}", (textoBoton) => {
  cy.get('[data-testid="submit-button"]')
    .should('contain', textoBoton)
    .and('be.visible');
});

When("escribo {string} en el campo {string}", (valor, campo) => {
  const testIdMap = {
    'Usuario': 'username-input',
    'Email': 'email-input',
    'Contraseña': 'password-input'
  };
  
  cy.get(`[data-testid="${testIdMap[campo]}"]`)
    .clear()
    .type(valor)
    .should('have.value', valor);
});

When("completa el formulario de registro con datos válidos", () => {
  cy.get('[data-testid="username-input"]').clear().type(testUser.username);
  cy.get('[data-testid="email-input"]').clear().type(testUser.email);
  cy.get('[data-testid="password-input"]').clear().type(testUser.password);
});

When("completa el formulario con un email inválido", () => {
  cy.get('[data-testid="username-input"]').clear().type(testUser.username);
  cy.get('[data-testid="email-input"]').clear().type('emailinvalido');
  cy.get('[data-testid="password-input"]').clear().type(testUser.password);
});

When("completa el formulario con una contraseña corta", () => {
  cy.get('[data-testid="username-input"]').clear().type(testUser.username);
  cy.get('[data-testid="email-input"]').clear().type(testUser.email);
  cy.get('[data-testid="password-input"]').clear().type('123');
});

When("envía el formulario de registro", () => {
  cy.get('[data-testid="submit-button"]').click();
});

When("hago clic en {string}", (textoBoton) => {
  cy.contains("button", textoBoton).click();
});

Then("debería ver el mensaje {string}", (mensaje) => {
  cy.get('[data-testid="message"]')
    .should('be.visible')
    .and('contain', mensaje);
});

Then("el botón de registro debe estar deshabilitado", () => {
  cy.get('[data-testid="submit-button"]')
    .should('be.disabled');
});

Then("ve un mensaje de confirmación de registro", () => {
  cy.get('[data-testid="message"]')
    .should('be.visible')
    .and('have.class', 'success')
    .and('not.be.empty');
});

Then("ve un mensaje de error de registro", () => {
  cy.get('[data-testid="message"]')
    .should('be.visible')
    .and('have.class', 'error')
    .and('not.be.empty');
});

// Escenario para usuario ya existente
Given("existe un usuario registrado con el mismo nombre o email", () => {
  // Primero registramos un usuario
  const existingUser = generateRandomUser('existing');
  cy.request({
    method: 'POST',
    url: 'http://localhost:4000/api/register',
    body: existingUser,
    failOnStatusCode: false
  });
  testUser = { ...existingUser }; // Usamos las mismas credenciales
});

When("intenta registrarse con credenciales existentes", () => {
  cy.get('[data-testid="username-input"]').clear().type(testUser.username);
  cy.get('[data-testid="email-input"]').clear().type(testUser.email);
  cy.get('[data-testid="password-input"]').clear().type(testUser.password);
  cy.get('[data-testid="submit-button"]').click();
});