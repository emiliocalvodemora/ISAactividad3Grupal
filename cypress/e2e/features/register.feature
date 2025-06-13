Feature: Registro de usuario

  Scenario: Registro exitoso
    Given el usuario navega a la página de registro
    Then ve los campos "Usuario", "Email", "Contraseña"
    Then ve el botón "Registrarse"
    When completa el formulario de registro con datos válidos
    And hago clic en "Registrarse"
    Then ve un mensaje de confirmación de registro

  Scenario: Campos vacíos
    Given el usuario navega a la página de registro
    When hago clic en "Registrarse"
    Then ve un mensaje de campos obligatorios

  Scenario: Servidor caído
    Given el usuario navega a la página de registro
    And el servidor está caído
    When completa el formulario de registro con datos válidos
    And hago clic en "Registrarse"
    Then debería ver un mensaje de error

