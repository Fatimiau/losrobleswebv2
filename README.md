Residencial Los Robles - Plataforma de Gestión Comunitaria 🏡

Este es un prototipo funcional completo de una plataforma de gestión comunitaria (SPA - Single Page Application) desarrollada como parte del curso Proyecto II de la Licenciatura en Desarrollo de Sistemas Web.

La aplicación simula un entorno multiusuario real, distinguiendo entre roles de Administrador (Mesa Directiva) y Residente. La persistencia de los datos se gestiona a través del localStorage del navegador para simular una base de datos, y el estado global de la aplicación se maneja de forma centralizada con React Context.

✨ Características Principales

Para Administradores (Mesa Directiva)

    Gestión de Usuarios: Ver la lista de todos los residentes, editar su información (nombre, email, casa) y eliminar sus cuentas.

    Gestión de Pagos: Crear nuevas cuotas de mantenimiento mensuales y asignarlas a una casa específica.

    Gestión de Incidencias: Visualizar todas las incidencias reportadas por los residentes y cambiar su estado (Nueva, En progreso, Cerrada).

    Comunicación: Publicar avisos importantes para toda la comunidad.

    Democracia: Crear nuevas votaciones con múltiples opciones para que los residentes participen.

Para Residentes

    Autenticación Segura: Sistema de registro y login. Los nuevos usuarios deben proporcionar su número de casa.

    Perfil Personal: Ver y actualizar su propia información de perfil (nombre, email, contraseña).

    Estado de Cuenta Personalizado: Visualizar únicamente el historial de pagos y las cuotas pendientes de su propia casa, con la opción de "pagar" las cuotas pendientes.

    Reporte de Incidencias: Crear nuevos reportes de incidencias, detallando el problema y su categoría.

    Interacción Comunitaria: Participar en las votaciones activas (el sistema evita votos duplicados) y ver los resultados después de votar.

    Comunicación: Añadir comentarios en los reportes de incidencias para comunicarse con la mesa directiva.

🚀 Tecnologías Utilizadas

    React 18 (con Vite)

    React Router Dom para el enrutamiento del lado del cliente.

    React Context para la gestión del estado global.

    date-fns para el formateo de fechas amigables.

    CSS Moderno con variables para un diseño consistente y responsivo.

🔧 Instalación y Puesta en Marcha

Para ejecutar este proyecto en tu máquina local, sigue estos pasos:

    Clona el repositorio:
    Bash

git clone https://github.com/tu-usuario/tu-repositorio.git

Navega a la carpeta del proyecto:
Bash

cd tu-repositorio

Instala las dependencias: Este comando descargará todas las librerías necesarias para que el proyecto funcione.
Bash

npm install

Inicia el servidor de desarrollo: Esto levantará un servidor local (generalmente en http://localhost:5173) y abrirá la aplicación en tu navegador.
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