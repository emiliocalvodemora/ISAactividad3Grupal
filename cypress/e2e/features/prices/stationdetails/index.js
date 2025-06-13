import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('the user visits the map page', () => {
  // Interceptamos sólo la llamada a comentarios y devolvemos []
  cy.intercept('GET', '**/api/comments/*', {
    statusCode: 200,
    body: []
  }).as('getComments');

  cy.visit('/mapa');
});

When('they click on any station marker', () => {
  cy.get('.leaflet-marker-icon', { timeout: 15000 })
    .eq(1)               // saltamos "Tu ubicación"
    .click({ force: true });
  // Esperamos la llamada a comentarios (aunque devuelva [])
  cy.wait('@getComments');
});

Then(
  'they are redirected to the station detail page and see "Gasóleo A" and "Gasolina 95 E5"',
  () => {
    cy.contains(/Gasóleo A/i).should('be.visible');
    cy.contains(/Gasolina 95 E5/i).should('be.visible');
  }
);

Then('they see the fields "Dirección" and "Municipio"', () => {
  cy.contains('Dirección').should('be.visible');
  cy.contains('Municipio').should('be.visible');
});
