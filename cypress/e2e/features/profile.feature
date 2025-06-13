Feature: Página de perfil de usuario

  Scenario: El usuario visualiza su información de perfil después del login
    Given el usuario se registra con un nuevo usuario aleatorio
    When el usuario inicia sesión con ese mismo usuario
    When el usuario navega a la página de perfil
    Then ve su nombre de usuario en la página de perfil
