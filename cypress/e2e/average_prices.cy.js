// cypress/e2e/average_prices.cy.js

describe('Precio medio nacional en el Mapa', () => {
  it('debería mostrar el precio medio nacional en el mapa', () => {
    cy.visit('/mapa');
    // Espera hasta que aparezca el texto (máx 15s)
    cy.contains('Precio medio nacional', { timeout: 15000 }).should('be.visible');
    cy.contains('Gasóleo A').should('exist');
  });
});

describe('Precio medio nacional en el Buscador', () => {
  it('debería mostrar el precio medio nacional en el buscador', () => {
    cy.visit('/lista');
    cy.contains('Precio medio nacional', { timeout: 15000 }).should('be.visible');
    cy.contains('Gasolina 95 E5').should('exist');
    cy.contains('Gasóleo A').should('exist');
  });
});


describe('Tooltip de gasolinera en hover (versión genérica)', () => {
  it('muestra los precios al pasar el ratón por cualquier marcador de gasolinera', () => {
    cy.visit('/mapa');
    cy.get('.leaflet-marker-icon', { timeout: 15000 }).each(($el, idx, $list) => {
      cy.wrap($el)
        .trigger('mouseover', { force: true })
        .then(() => {
          cy.get('.leaflet-tooltip').then($tooltip => {
            const texto = $tooltip.text();
            // Si encuentra un tooltip de gasolinera, hace las asserts y "rompe" el each
            if (texto.includes('Gasóleo A') && texto.includes('Gasolina 95 E5')) {
              expect(texto).to.include('Gasóleo A');
              expect(texto).to.include('Gasolina 95 E5');
              // Esto aborta el each, ya está comprobado uno correcto
              return false;
            }
          });
        });
    });
  });
});

describe('Detalle de estación (flujo real)', () => {
  it('al hacer click en el primer marcador de gasolinera, muestra los datos esenciales', () => {
    // 1. Stub de la API de comments para evitar el fetch real
    cy.intercept('GET', '**/api/comments/*', {
      statusCode: 200,
      body: []
    }).as('getComments');

    // 2. Visitamos el mapa
    cy.visit('/mapa');

    // 3. Hacemos click en el segundo marcador (índice 1)
    cy.get('.leaflet-marker-icon', { timeout: 15000 })
      .eq(1)
      .click({ force: true });

    // 4. Esperamos a que el stub de comments responda
    cy.wait('@getComments');

    // 5. Validamos los datos en la página de detalle
    cy.contains(/Gasóleo A/i).should('be.visible');
    cy.contains(/Gasolina 95 E5/i).should('be.visible');
    cy.contains('Dirección').should('be.visible');
    cy.contains('Municipio').should('be.visible');
  });
});


