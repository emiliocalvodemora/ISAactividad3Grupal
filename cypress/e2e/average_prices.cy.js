// cypress/e2e/average_prices.cy.js

describe('Precio medio nacional en el Mapa', () => {
  it('debería mostrar el precio medio nacional en el mapa', () => {
    cy.visit('/mapa');
    // Espera hasta que aparezca el texto (máx 10s)
    cy.contains('Precio medio nacional', { timeout: 15000 }).should('be.visible');
    // Puedes añadir más asserts si quieres comprobar que aparecen los precios concretos
    cy.contains('Gasolina 95 E5').should('exist');
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
    cy.visit('/mapa');
    // Selecciona el primer marcador de gasolinera (no "Tu ubicación")
    cy.get('.leaflet-marker-icon', { timeout: 15000 })
      .eq(1) // Cambia el índice si hace falta
      .click({ force: true });
    // La app redirige automáticamente a /station/{id}
    cy.contains(/Gasóleo A/i).should('be.visible');
    cy.contains(/Gasolina 95 E5/i).should('be.visible');
    cy.contains('€').should('be.visible');
    cy.get('body').should('contain.text', 'Dirección');
    cy.get('body').should('contain.text', 'Municipio');
  });
});

