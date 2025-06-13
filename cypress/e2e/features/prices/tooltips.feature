Feature: Fuel prices tooltip on map

  Scenario: User sees fuel prices in tooltip when hovering a station marker
    Given the user visits the map page
    When they hover over any station marker
    Then they see "Gasóleo A" and "Gasolina 95 E5" in the tooltip
