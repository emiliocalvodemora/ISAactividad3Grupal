Feature: Registro y Login de usuario

  Scenario Outline: Registro exitoso de un nuevo usuario
    Given el usuario navega a la página de registro
    When completa el formulario de registro con usuario "<usuario>" , contraseña "<password>" y correo "<correo>"
    And envía el formulario de registro
    Then ve un mensaje de confirmación de registro

    Examples:
      | usuario  | password  | correo            |
      | user1    | Pass1234! | user1@mail.com    |
      | user2    | Pass5678! | user2@mail.com    |
      | testuser | Test1234! | testuser@mail.com |

  Scenario: Login exitoso de un usuario registrado
    Given el usuario navega a la página de login
    When completa el formulario de login con credenciales válidas
    And envía el formulario de login
    Then ve un mensaje de bienvenida

  Scenario: Login fallido de un usuario registrado
    Given el usuario navega a la página de login
    When completa el formulario de login con credenciales inválidas
    And envía el formulario de login
    Then ve un mensaje de error