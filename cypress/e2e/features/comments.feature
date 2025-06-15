Feature: Comentarios en la página de estación

  Scenario: El usuario ve el formulario de comentarios
    Given el usuario se registra y inicia sesión
    When el usuario visita el buscador de estaciones y selecciona la primera estación
    Then ve la sección de comentarios con el formulario para enviar un comentario

  Scenario: El usuario publica un nuevo comentario
    Given el usuario se registra y inicia sesión
    When el usuario visita el buscador de estaciones y selecciona la primera estación
    When escribe un comentario y lo envía
    Then el comentario aparece en la lista
    Then ve un mensaje de éxito

  Scenario: El usuario ve comentarios previos
    Given el usuario se registra y inicia sesión
    When el usuario visita el buscador de estaciones y selecciona la primera estación
    Then los comentarios existentes se muestran