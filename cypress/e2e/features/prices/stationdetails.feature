Feature: Station detail page

  Scenario: User clicks a station marker and sees its detail
    Given the user visits the map page
    When they click on any station marker
    Then they are redirected to the station detail page and see "Gasóleo A" and "Gasolina 95 E5"
    And they see the fields "Dirección" and "Municipio"
