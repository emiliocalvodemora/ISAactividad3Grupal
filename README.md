# React + Vite

Ejecutar la aplicación

`npm run dev`

Pruebas, abrir cypress

`npx cypress open`

Para que funcionen las pruebas con usuarios hay que tener ejecutando el servidor que se encuentra en la carpeta `server-usuarios-main`.

Creación de la tabla de usuarios en mySQL (para despliegue)(en la terminal dentro de la carpeta `server-usuarios-main`):

```bash

```sql
CREATE DATABASE IF NOT EXISTS gasolineras;
USE gasolineras;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Para instalar las dependencias:

```
npm install
```

Para lanzar el servidor de desarrollo:

```
npm run dev
```

o

```
node index_dev.js
```

Recursos útiles
===============

Documentación de vite: https://vite.dev/guide/ 
Documentación de cypress: https://www.cypress.io/ 
cypress-cucumber-preprocessor: https://github.com/badeball/cypress-cucumber-preprocessor?tab=readme-ov-file 

Otros: 

Tutorial Cypress + React: https://www.youtube.com/watch?v=6BkcHAEWeTU
Explica cómo instalar cypress en una aplicación react y escribir un test para probar una aplicación sencilla 

Tutorial cypress + cucumber --> react https://www.youtube.com/playlist?list=PLyWVU-yS4Fb7UcKP8ElLsZklMO86vLdHQ 

Mocking en cypress https://kailash-pathak.medium.com/mocking-api-response-in-cypress-a73dea514cfd 

