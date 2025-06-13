import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const randomUser = () => ({
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@mail.com`,
    password: 'Test1234!'
});

let user = null;

Given('el usuario navega a la página de registro', () => {
    user = randomUser();
    cy.visit('/registro').wait(1000);
});

Given('el servidor está caído', () => {
  cy.intercept('POST', 'http://localhost:4000/api/register', {
    forceNetworkError: true
  }).as('serverDown');
});

Then('ve los campos {string}, {string}, {string}', (campo1, campo2, campo3) => {
    [campo1, campo2, campo3].forEach((campo) => {
        cy.get(`input[placeholder="${campo}"]`).should('exist');
    });
});

Then('ve el botón {string}', (textoBoton) => {
    cy.contains('button', textoBoton).should('exist');
});

When('escribo {string} en el campo {string}', (valor, campo) => {
    cy.get(`input[placeholder="${campo}"]`).type(valor);
});

When('hago clic en {string}', (textoBoton) => {
    cy.contains("button", textoBoton).click();
});

Then('debería ver el mensaje {string}', (mensaje) => {
    cy.contains(mensaje).should("be.visible");
});

When('completa el formulario de registro con usuario {string}, contraseña {string} y correo {string}', () => {
    cy.get('input[name="username"]').clear().type(user.username);
    cy.get('input[name="email"]').clear().type(user.email);
    cy.get('input[name="password"]').clear().type(user.password);
});

When('envía el formulario de registro', () => {
    cy.get('form').submit();

    cy.get('body').then(($body) => {
        if ($body.text().includes('Usuario o email ya existe')) {
            cy.wait(500);
            user = randomUser();
            cy.visit('/registro');
            cy.get('input[name="username"]').clear().type(user.username);
            cy.get('input[name="email"]').clear().type(user.email);
            cy.get('input[name="password"]').clear().type(user.password);
            cy.get('form').submit();
        }
    });
});

Then('ve un mensaje de confirmación de registro', () => {
    cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 }).should('exist');
});

Then('muestra error si el servidor está caído', () => {
    cy.wait('@registroFallido');
    cy.contains('Error en el registro').should('be.visible');
});
