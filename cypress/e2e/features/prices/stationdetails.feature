Feature: Página de detalle de estación

  Scenario: El usuario hace clic en un marcador de estación y ve sus detalles
    Given el usuario visita la página del mapa
    When hace clic en cualquier marcador de estación
    Then es redirigido a la página de detalle de la estación y ve "Gasóleo A" y "Gasolina 95 E5"
    And ve los campos "Dirección" y "Municipio"
