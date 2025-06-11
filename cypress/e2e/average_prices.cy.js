describe('Precio medio nacional en el Mapa', () => {
  it('debería mostrar el precio medio nacional en el mapa', () => {
    cy.visit('/mapa');
    cy.contains('Cargando...').should('not.exist'); // Espera a que termine la carga
    cy.contains('Precio medio nacional').should('exist');
    cy.contains('Gasolina 95 E5:');
    cy.contains('Gasóleo A:');
  });
});
