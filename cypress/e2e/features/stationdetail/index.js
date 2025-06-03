import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor"


Given("el usuario navega a la home", function () {
    cy.visit("/");
});

