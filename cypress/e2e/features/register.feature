Feature: Registro de usuario

  Scenario: Renderiza los campos y el botón de registro
    Given el usuario navega a la página de registro
    Then ve los campos "Usuario", "Email", "Contraseña"
    Then ve el botón "Registrarse"

  Scenario: Registro exitoso
    Given el usuario navega a la página de registro
    Then ve los campos "Usuario", "Email", "Contraseña"
    Then ve el botón "Registrarse"
    When completa el formulario de registro con usuario "<usuario>" , contraseña "<password>" y correo "<correo>"
    And envía el formulario de registro
    Then ve un mensaje de confirmación de registro