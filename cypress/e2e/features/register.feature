Feature: Registro de usuario

  Scenario: Renderiza los campos y el botón de registro
    Given el usuario navega a la página de registro
    Then ve los campos "Usuario", "Email", "Contraseña"
    Then ve el botón "Registrarse"

  Scenario: Registro exitoso de un nuevo usuario
    Given el usuario navega a la página de registro
    When completa el formulario de registro con usuario "<usuario>" , contraseña "<password>" y correo "<correo>"
    And envía el formulario de registro
    Then ve un mensaje de confirmación de registro

  Scenario: Mensaje de error si falla el fetch
    Given el usuario navega a la página de registro estando el servidor caído
    When completa el formulario de registro con usuario "<usuario>" , contraseña "<password>" y correo "<correo>"
    And envía el formulario de registro
    Then ve un mensaje de confirmación de "Error de conexión con el servidor"
