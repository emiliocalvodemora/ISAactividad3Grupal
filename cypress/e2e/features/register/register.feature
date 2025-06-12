Feature: Registro de usuario

  Scenario: Registro exitoso
    Given el usuario navega a la página de registro
    Then ve los campos "Usuario", "Email", "Contraseña"
    And ve el botón "Registrarse"
    When completa el formulario de registro con datos válidos
    And envía el formulario de registro
    Then ve un mensaje de confirmación de registro
