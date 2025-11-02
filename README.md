Residencial Los Robles - Plataforma de Gestión Comunitaria 🏡

Versión: vPRO1.0 (Sprint 4 Completado)

Este es un prototipo funcional completo de una plataforma de gestión comunitaria (SPA - Single Page Application) desarrollada como parte del curso Proyecto II de la Licenciatura en Desarrollo de Sistemas Web.

La aplicación simula un entorno multiusuario real, distinguiendo entre roles de Administrador (Mesa Directiva) y Residente. La persistencia de los datos se gestiona a través del localStorage del navegador para simular una base de datos.

Arquitectura de Estado (vPRO1.0): El estado global se maneja aplicando el principio de Separación de Responsabilidades:

    React Context (AppContext.jsx) se utiliza exclusivamente para la gestión de autenticación (el currentUser).

    Un Custom Hook (useDatabase.js) centraliza toda la lógica de datos y las operaciones CRUD (manejo de incidencias, pagos, usuarios, etc.), proveyendo una API limpia al resto de la aplicación.

✨ Características Principales

Para Administradores (Mesa Directiva)

    Panel de Administrador (Dashboard): Página de inicio con tarjetas de estadísticas que muestran datos clave en tiempo real (Incidencias Nuevas, Pagos Vencidos, Votaciones Activas, Total de Residentes).

    Gestión de Documentos (CRUD): Módulo completamente nuevo para subir, editar y eliminar documentos importantes (PDFs como reglamentos, actas, etc.).

    Gestión de Pagos (Mejorada): Funcionalidad CRUD completa para crear, editar y eliminar cuotas de pago. Incluye filtros por estado (pendientes, vencidos) y búsqueda por casa.

    Gestión de Usuarios (Mejorada): Ver la lista de todos los residentes, editar su información, eliminar sus cuentas y buscar usuarios por nombre, email o casa.

    Gestión de Incidencias: Visualizar todas las incidencias, cambiar su estado (Nueva, En progreso, Cerrada) y responder comentarios.

    Comunicación: Publicar avisos importantes para toda la comunidad.

    Democracia: Crear nuevas votaciones con múltiples opciones.

Para Residentes

    Dashboard "Mi Resumen": Página de inicio dinámica con alertas de pagos vencidos, el último aviso de la administración y un resumen de las incidencias abiertas del usuario.

    Notificaciones en Tiempo Real: Sistema de notificaciones "toast" para feedback inmediato (ej. "Incidencia creada"). Incluye una campana (🔔) con un menú de notificaciones no leídas (ej. "El admin ha comentado tu incidencia").

    Reporte de Incidencias (Mejorado): Crear reportes de incidencias, y ahora adjuntar imágenes (con preview y validación de tamaño) para dar más contexto.

    Comentarios Mejorados: Añadir comentarios en las incidencias, con la capacidad de adjuntar imágenes y usar un selector de emojis.

    Simulación de Pago Realista: Al pagar una cuota, se abre un modal de pasarela de pago que simula el ingreso de una tarjeta de crédito, con estado de "procesando" y spinner.

    Descarga de Documentos: Nueva sección para ver y descargar todos los documentos oficiales publicados por la administración.

    Autenticación y Perfil: Sistema de registro y login. Perfil personal para actualizar información (nombre, email, contraseña).

    Interacción Comunitaria: Participar en votaciones (sistema anti-votos duplicados) y ver resultados.

🚀 Tecnologías Utilizadas

    React 18 (con Vite)

    React Router Dom para enrutamiento.

    React Context para gestión de autenticación.

    React Hooks (especialmente un useDatabase.js personalizado para toda la lógica de estado y CRUD).

    react-hot-toast para notificaciones "toast" no intrusivas.

    emoji-picker-react para el selector de emojis en comentarios.

    date-fns para el formateo de fechas amigables.

    CSS Moderno (variables, grid, flexbox) para un diseño responsivo.

🔧 Instalación y Puesta en Marcha

Para ejecutar este proyecto en tu máquina local, sigue estos pasos:

    Clona el repositorio:
    Bash

git clone https://github.com/Fatimiau/losrobleswebv2.git

Navega a la carpeta del proyecto:
Bash

cd losrobleswebv2

Instala las dependencias:
Bash

npm install

Inicia el servidor de desarrollo:
Bash

    npm run dev

🔑 Uso y Credenciales de Prueba

La aplicación cuenta con dos roles predefinidos para la demostración. También puedes registrar nuevos usuarios residentes desde la pantalla de login.

    Cuenta de Administrador (Mesa Directiva):

        Email: admin@robles.com

        Contraseña: admin123

    Cuenta de Residente (Ejemplo):

        Email: residente@test.com

        Contraseña: res123