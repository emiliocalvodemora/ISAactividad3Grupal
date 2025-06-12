describe('Registro de usuario', () => {
  const user = {
    username: `test${Date.now()}`,
    email: `test${Date.now()}@mail.com`,
    password: 'Test1234!',
  };

  beforeEach(() => {
    cy.visit('/registro'); // Asegúrate que /registro carga el Register.jsx
  });

  it('muestra los campos y el botón', () => {
    cy.get('input[placeholder="Usuario"]').should('exist');
    cy.get('input[placeholder="Email"]').should('exist');
    cy.get('input[placeholder="Contraseña"]').should('exist');
    cy.contains('button', 'Registrarse').should('exist');
  });

  it('muestra error si se envía vacío', () => {
    cy.contains('Registrarse').click();
    cy.contains('Todos los campos son obligatorios').should('exist');
  });

  it('realiza registro exitoso', () => {
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.contains('Registrarse').click();

    cy.contains(/usuario registrado correctamente|registro exitoso/i, { timeout: 5000 }).should('exist');
  });

  it('muestra error si el servidor está caído', () => {
    cy.intercept('POST', 'http://localhost:4000/api/register', {
      forceNetworkError: true,
    });

    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.contains('Registrarse').click();

    cy.contains('Error en el registro').should('exist');
  });
});
