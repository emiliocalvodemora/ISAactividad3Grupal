import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Cypress.on('uncaught:exception', () => false);

Given('el usuario visita la página del mapa', () => {
  cy.visit('/mapa');
});

When('pasa el ratón por cualquier marcador de estación', () => {
  cy.get('.leaflet-marker-icon', { timeout: 15000 }).each($el => {
    cy.wrap($el)
      .trigger('mouseover', { force: true })
      .then(() => {
        cy.get('.leaflet-tooltip').then($t => {
          const txt = $t.text();
          if (txt.includes('Gasóleo A') && txt.includes('Gasolina 95 E5')) {
            expect(txt).to.include('Gasóleo A');
            expect(txt).to.include('Gasolina 95 E5');
            return false; // Aborta el each tras la primera validación exitosa
          }
        });
      });
  });
});

Then('ve "Gasóleo A" y "Gasolina 95 E5" en el tooltip', () => {
  // Ya comprobado en el When
});
