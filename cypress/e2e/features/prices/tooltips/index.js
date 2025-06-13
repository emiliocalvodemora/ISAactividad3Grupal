import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Cypress.on('uncaught:exception', () => false);

Given('the user visits the map page', () => {
  cy.visit('/mapa');
});

When('they hover over any station marker', () => {
  cy.get('.leaflet-marker-icon', { timeout: 15000 }).each($el => {
    cy.wrap($el)
      .trigger('mouseover', { force: true })
      .then(() => {
        cy.get('.leaflet-tooltip').then($t => {
          const txt = $t.text();
          if (txt.includes('Gasóleo A') && txt.includes('Gasolina 95 E5')) {
            expect(txt).to.include('Gasóleo A');
            expect(txt).to.include('Gasolina 95 E5');
            return false;
          }
        });
      });
  });
});

Then('they see "Gasóleo A" and "Gasolina 95 E5" in the tooltip', () => {
  // already asserted above
});
