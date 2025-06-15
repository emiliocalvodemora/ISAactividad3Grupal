import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"

const randomUser = () => ({
  username: `testuser${Date.now()}`,
  email: `test${Date.now()}@mail.com`,
  password: 'Test1234!'
});

let user = null;

Given('el usuario navega a la página de registro', () => {
  user = randomUser();
  cy.visit('/registro').wait(5000);
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
  cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 }).should('exist');
});

Given('el usuario navega a la página de login', () => {
  cy.visit('/login');
});

When('completa el formulario de login con credenciales válidas', () => {
  cy.get('input[name="email"]').type(user.email);
  cy.get('input[name="password"]').type(user.password);
});

When('envía el formulario de login', () => {
  cy.get('form').submit();
});

Then('ve un mensaje de bienvenida', () => {
  cy.contains(/bienvenido|login correcto/i, { timeout: 5000 }).should('exist');
});


When('completa el formulario de login con credenciales inválidas', () => {
  cy.get('input[name="email"]').type('email@erroneo');
  cy.get('input[name="password"]').type('passworderroneo');
});


Then('ve un mensaje de error', () => {
  cy.contains(/Credenciales incorrectas|error de login|usuario o contraseña incorrectos/i, { timeout: 5000 }).should('exist');
});