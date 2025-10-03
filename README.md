Residencial Los Robles - Plataforma de Gestión Comunitaria

Este repositorio contiene el código fuente de la plataforma de gestión para Residencial Los Robles, un proyecto desarrollado como parte del curso Proyecto II. La aplicación está construida con tecnologías web modernas y sigue la metodología ágil Scrum para su desarrollo.


🚀 Sprint 1 Completado

El estado actual del proyecto refleja la finalización del Sprint 1, el cual estableció las bases funcionales de la plataforma. Las funcionalidades implementadas incluyen:

    #001 - Gestión de Usuarios: Sistema de Registro e Inicio de Sesión para residentes.

    #002 - Gestión de Incidencias: Formulario para registrar incidencias (fugas, fallas, etc.) y un tablero para visualizarlas y cambiar su estado. Los datos se persisten localmente usando localStorage.

    #003 - Reportes para Mesa Directiva: Una sección dedicada que muestra un resumen de todas las incidencias registradas, permitiendo un seguimiento claro.

    Flujo de Autenticación: La aplicación protege las rutas, mostrando únicamente la página de login/registro a los usuarios no autenticados.

🛠️ Tecnologías Utilizadas

    Vite: Herramienta de frontend de última generación para un desarrollo rápido y eficiente.

    React.js: Librería principal para la construcción de la interfaz de usuario.

    React Router Dom: Para la gestión de rutas y navegación entre las diferentes páginas de la aplicación.

    CSS Moderno: Estilos personalizados con un diseño oscuro y profesional, utilizando variables de CSS para un fácil mantenimiento.

⚙️ Instalación y Ejecución Local

Para ejecutar este proyecto en tu máquina local, sigue estos sencillos pasos:

    Clona el repositorio:

    git clone [https://github.com/Fatimiau/losrobleswebv2.git](https://github.com/Fatimiau/losrobleswebv2.git)

    Navega a la carpeta del proyecto:

    cd residencial-los-robles-v2

    Instala las dependencias:

    npm install

    Inicia el servidor de desarrollo:

    npm run dev

    Abre tu navegador y visita http://localhost:5173.

📂 Estructura del Proyecto
El código fuente está organizado de la siguiente manera para facilitar su mantenimiento:

src/
├── App.jsx            # Componente principal y gestión de rutas
├── index.css          # Estilos globales
├── main.jsx           # Punto de entrada de la aplicación
└── pages/             # Carpeta para los componentes de cada página
    ├── Home.jsx
    ├── Incidencias.jsx
    ├── Login.jsx
    └── Reportes.jsx

Proyecto desarrollado por Fatima Bautista Cruz.