import { Given, When, Then, Before } from "@badeball/cypress-cucumber-preprocessor";

// Forzar XHR en vez de fetch para poder interceptar
Before(() => {
    Cypress.on('window:before:load', (win) => {
        delete win.fetch;
    });

    cy.intercept('GET', 'http://localhost:4000/api/comments/*', {
        statusCode: 200,
        body: [
            {
                username: 'Juan',
                comment: 'Muy buena estación',
                created_at: new Date().toISOString(),
            },
        ],
    }).as('mockGetComments');

    window.localStorage.setItem('token', 'faketoken');
    cy.visit('http://localhost:5173');
    cy.wait('@mockGetComments');
});

Given('que el usuario está logeado con un token válido', () => {
    // Ya se setea en el Before
});

Given('existen comentarios previos para la estación', () => {
    // Ya se interceptan en el Before
});

Given('visito la aplicación', () => {
    // Ya se visita en el Before
});

Then('debería ver el texto {string}', (text) => {
    cy.contains(text).should('exist');
});

Then('debería ver el comentario {string} del usuario {string}', (comment, user) => {
    cy.contains(user).should('exist');
    cy.contains(comment).should('exist');
});

Then('debería ver el formulario de comentarios con un textarea y un botón de enviar', () => {
    cy.get('form.comment-form').should('exist');
    cy.get('textarea').should('exist');
    cy.get('button[type="submit"]').should('exist');
});

When('escribo {string} en el textarea', (text) => {
    cy.get('textarea').clear().type(text);
});

When('hago clic en el botón de enviar comentario', () => {
    cy.intercept('POST', 'http://localhost:4000/api/comments', (req) => {
        const body = req.body;
        if (body.comment.includes('Error simulado')) {
            req.reply({
                statusCode: 400,
                body: { message: 'Comentario no válido' },
            });
        } else {
            req.reply({
                statusCode: 200,
                body: { message: '¡Comentario enviado!' },
            });
        }
    }).as('mockPostComment');

    cy.get('button[type="submit"]').click();
    cy.wait('@mockPostComment');
});

Then('debería ver el mensaje de confirmación {string}', (message) => {
    cy.contains(message).should('exist');
});

Then('debería ver el mensaje de error {string}', (message) => {
    cy.contains(message).should('exist');
});
