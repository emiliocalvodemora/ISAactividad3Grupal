import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('el usuario visita la página del mapa', () => {
  // Interceptamos sólo la llamada a comentarios y devolvemos []
  cy.intercept('GET', '**/api/comments/*', {
    statusCode: 200,
    body: []
  }).as('getComments');

  cy.visit('/mapa');
});

When('hace clic en cualquier marcador de estación', () => {
  cy.get('.leaflet-marker-icon', { timeout: 15000 })
    .eq(1)               // saltamos el marcador de "Tu ubicación"
    .click({ force: true });
  // Esperamos la llamada a comentarios (aunque devuelva [])
  cy.wait('@getComments');
});

Then(
  'es redirigido a la página de detalle de la estación y ve "Gasóleo A" y "Gasolina 95 E5"',
  () => {
    cy.contains(/Gasóleo A/i).should('be.visible');
    cy.contains(/Gasolina 95 E5/i).should('be.visible');
  }
);

Then('ve los campos "Dirección" y "Municipio"', () => {
  cy.contains('Dirección').should('be.visible');
  cy.contains('Municipio').should('be.visible');
});
