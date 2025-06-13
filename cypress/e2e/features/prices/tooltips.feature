Feature: Tooltip de precios en el mapa

  Scenario: El usuario ve los precios en el tooltip al pasar el ratón sobre un marcador de estación
    Given el usuario visita la página del mapa
    When pasa el ratón por cualquier marcador de estación
    Then ve "Gasóleo A" y "Gasolina 95 E5" en el tooltip
