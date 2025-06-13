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

Then('ve los campos {string}, {string}, {string}', (campo1, campo2, campo3) => {
    [campo1, campo2, campo3].forEach((campo) => {
        cy.get(`input[placeholder="${campo}"]`).should('exist');
    });
});

Then('ve el botón {string}', () => {
    cy.contains('button', 'Registrarse').should('exist');
});

When('completa el formulario de registro con usuario {string} , contraseña {string} y correo {string}', () => {
    cy.get('input[name="username"]').clear().type(user.username);
    cy.get('input[name="email"]').clear().type(user.email);
    cy.get('input[name="password"]').clear().type(user.password);

});


When('envía el formulario de registro', () => {
    cy.get('form').submit();

    // Si el usuario ya existe, generar uno nuevo y reintentar
    cy.get('body').then(($body) => {
        if ($body.text().includes('Usuario o email ya existe')) {
            // Esperamos brevemente para evitar colisiones por tiempo similar
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
    cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 })
      .should('exist');
});