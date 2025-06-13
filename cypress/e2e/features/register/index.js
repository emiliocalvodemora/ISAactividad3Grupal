import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('el usuario navega a la página de registro', () => {
    cy.visit('/registro').wait(1000);
});

Then('ve los campos {string}, {string}, {string}', () => {
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
});

Then('ve el botón {string}', () => {
    cy.contains('button', 'Registrarse').should('exist');
});

When('completa el formulario de registro con datos válidos', () => {
    cy.get('input[name="username"]').clear().type('usuarioTest');
    cy.get('input[name="email"]').clear().type('test@mail.com');
    cy.get('input[name="password"]').clear().type('Password123!');
});

When('hago clic en {string}', () => {
    cy.contains('button', 'Registrarse').click();
});

Then('ve un mensaje de confirmación de registro', () => {
    cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 })
      .should('exist');
});

Then('muestra error si el servidor está caído', () => {
    cy.intercept('POST', 'http://localhost:4000/api/register', {
        forceNetworkError: true,
    }).as('registroFallido');

    cy.get('input[name="username"]').type('usuarioTest');
    cy.get('input[name="email"]').type('test@mail.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.contains('button', 'Registrarse').click();

    cy.contains(/error en el registro|network error/i, { timeout: 5000 })
      .should('exist');
});

Then('muestra error por campos vacíos', () => {
    cy.get('input[name="username"]').clear();
    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').clear();

    cy.contains('button', 'Registrarse').click();
    cy.contains('Todos los campos son obligatorios').should('exist');
});

