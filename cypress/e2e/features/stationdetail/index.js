import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"

Given("el usuario navega a la home", function () {
    cy.visit("/");
});

Then("debería ver el logo de la aplicación", () => {
    cy.get('img[alt="Logo"]').should('be.visible');
});

Then('debería ver el enlace {string}', (linkText) => {
    cy.contains('a', linkText).should('be.visible');
});

