Feature: Registro de usuario

  Scenario: Registro exitoso
    Given el usuario navega a la página de registro
    Then ve los campos "Usuario", "Email", "Contraseña"
    And ve el botón "Registrarse"
    When completa el formulario de registro con datos válidos
    And envía el formulario de registro
    Then ve un mensaje de confirmación de registro

  Scenario: Campos vacíos
    Given el usuario navega a la página de registro
    When hago clic en "Registrarse"
    Then ve un mensaje de error "Todos los campos son obligatorios."

  Scenario: Servidor caído
    Given el usuario navega a la página de registro
    And el servidor está caído
    When completa el formulario de registro con datos válidos
    And envía el formulario de registro
    Then ve un mensaje de error "Error al registrarse"
