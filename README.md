\# GA7-220501096-AA5-EV01 - Diseño y desarrollo de servicios web



\## Aprendiz



Jorge Andres Benitez Vallejo



\## Descripción del proyecto



Este proyecto corresponde a la evidencia GA7-220501096-AA5-EV01, denominada "Diseño y desarrollo de servicios web - caso".



El objetivo principal es diseñar y codificar una API REST para realizar el registro de usuarios y el inicio de sesión. La API recibe los datos del usuario, valida la información contra una base de datos MySQL y devuelve respuestas en formato JSON.



\## Tecnologías utilizadas



\- Node.js

\- Express

\- MySQL

\- Docker Desktop

\- DBeaver

\- Git

\- GitHub

\- bcryptjs

\- dotenv

\- cors

\- mysql2

\- nodemon



\## Arquitectura del proyecto



El proyecto se desarrolló aplicando una estructura modular tipo MVC:



```text

src/

├── config/

│   └── db.js

├── controllers/

│   ├── authController.js

│   └── userController.js

├── models/

│   └── userModel.js

├── routes/

│   ├── authRoutes.js

│   └── userRoutes.js

└── app.js

