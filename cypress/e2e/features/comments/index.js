import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const randomUser = () => ({
    username: `usuario${Date.now()}`,
    email: `test${Date.now()}@mail.com`,
    password: 'Test1234!'
});

let user;

Given('el usuario se registra y inicia sesión', () => {
    user = randomUser();

    cy.visit('/registro');
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('form').submit();
    cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 }).should('exist');
    cy.visit('/login');
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.get('form').submit();
    cy.contains(new RegExp(`bienvenido,?\\s*${user.username}`, 'i'), { timeout: 5000 }).should('exist');
    cy.window().then(win => {
        expect(win.localStorage.getItem('token')).to.not.be.null;
    });
});

When('el usuario visita el buscador de estaciones y selecciona la primera estación', () => {
    cy.contains('Buscador').click();
    cy.get('table').should('exist');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);

    // Clicamos el primer enlace "Ver detalle" de la primera fila
    cy.get('table tbody tr').first().within(() => {
        cy.contains('Ver detalle').click();
    });
});

Then('ve la sección de comentarios con el formulario para enviar un comentario', () => {
    cy.url().should('include', '/station/');
    cy.get('.comments-section').should('exist');
    cy.get('form.comment-form').should('exist');
    cy.get('textarea').should('exist');
    cy.get('button[type="submit"]').should('exist');
});

When('escribe un comentario y lo envía', () => {
    const texto = `Comentario Cypress ${Date.now()}`;
    cy.wrap(texto).as('comentarioTexto');
    cy.get('textarea').clear().type(texto);
    cy.get('button[type="submit"]').click();
});

Then('el comentario aparece en la lista', function () {
    cy.contains(this.comentarioTexto).should('exist');
});

Then('ve un mensaje de éxito', () => {
    cy.contains('¡Comentario enviado!').should('exist');
});

Then('los comentarios existentes se muestran', () => {
    cy.get('.comments-list li').should('have.length.at.least', 1);
});
