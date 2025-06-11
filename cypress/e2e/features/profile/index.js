import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const randomUser = () => ({
    username: `usuariodeprueba${Date.now()}`,
    email: `prueba${Date.now()}@mail.com`,
    password: 'Test1234!'
});

let user;

Given('el usuario se registra con un nuevo usuario aleatorio', () => {
    user = randomUser();
    cy.visit('/registro');
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('form').submit();
    cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 }).should('exist');

    // Esperamos a que aparezca un mensaje de éxito o que el usuario ya exista
    cy.get('body').then($body => {
        const text = $body.text();
        if (text.includes('Usuario o email ya existe')) {
            cy.log('El usuario ya existe, se omite el registro.');
        } else {
            cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 }).should('exist');
        }
    });
});

When('el usuario inicia sesión con ese mismo usuario', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('form').submit();
    cy.contains(new RegExp(`bienvenido,?\\s*${user.username}`, 'i'), { timeout: 5000 }).should('exist');
});

When('el usuario navega a la página de perfil', () => {
    cy.get('a[href="/profile"]').click();
});

Then('ve su nombre de usuario en la página de perfil', () => {
    cy.contains(`Datos del perfil de ${user.username}`).should('exist');
});