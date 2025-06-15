Feature: Comentarios de los usuarios

  Background:
    Given que el usuario está logueado con un token válido
    And existen comentarios previos para la estación
    And visito la aplicación

  Scenario: Se muestra el título de la sección de comentarios
    Then debería ver el texto "Comentarios de los usuarios"

  Scenario: Se muestran los comentarios existentes
    Then debería ver el comentario "Muy buena estación" del usuario "Juan"

  Scenario: Se muestra el formulario de comentarios al estar logueado
    Then debería ver el formulario de comentarios con un textarea y un botón de enviar

  Scenario: El usuario envía un nuevo comentario exitosamente
    When escribo "Este es un comentario de prueba" en el textarea
    And hago clic en el botón de enviar comentario
    Then debería ver el mensaje de confirmación "¡Comentario enviado!"

  Scenario: El envío de un comentario falla por error de validación
    When escribo "Error simulado" en el textarea
    And hago clic en el botón de enviar comentario
    Then debería ver el mensaje de error "Comentario no válido"
