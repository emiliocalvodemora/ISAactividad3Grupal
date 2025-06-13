describe('Comments Component - Tests with Mocks', () => {
  beforeEach(() => {
    // Forzar uso de XHR en lugar de fetch para que Cypress pueda interceptar
    Cypress.on('window:before:load', (win) => {
      delete win.fetch;
    });

    // Simular respuesta de comentarios existentes
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

    // Simular token (como si el usuario estuviera logueado)
    window.localStorage.setItem('token', 'faketoken');

    // Visita la app (ajusta si usas rutas específicas)
    cy.visit('http://localhost:5173');
    cy.wait('@mockGetComments');
  });

  it('muestra el título de la sección', () => {
    cy.contains('Comentarios de los usuarios').should('exist');
  });

  it('muestra los comentarios existentes', () => {
    cy.contains('Juan').should('exist');
    cy.contains('Muy buena estación').should('exist');
  });

  it('muestra el formulario si el usuario está logueado', () => {
    cy.get('form.comment-form').should('exist');
    cy.get('textarea').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('envía un nuevo comentario exitosamente', () => {
    const testComment = 'Este es un comentario de prueba';

    cy.intercept('POST', 'http://localhost:4000/api/comments', {
      statusCode: 200,
      body: { message: '¡Comentario enviado!' },
    }).as('mockPostComment');

    cy.get('textarea').clear().type(testComment);
    cy.get('button[type="submit"]').click();

    cy.wait('@mockPostComment');
    cy.contains('¡Comentario enviado!').should('exist');
  });

  it('muestra un error si el comentario falla', () => {
    cy.intercept('POST', 'http://localhost:4000/api/comments', {
      statusCode: 400,
      body: { message: 'Comentario no válido' },
    }).as('mockFailPost');

    cy.get('textarea').clear().type('Error simulado');
    cy.get('button[type="submit"]').click();

    cy.wait('@mockFailPost');
    cy.contains('Comentario no válido').should('exist');
  });
});
