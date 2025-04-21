# Escenario 2: No se puede acceder a la cuenta después del registro

## Reclamo del Usuario

Un usuario recién registrado se queja de que, inmediatamente después de completar el formulario de registro y recibir un mensaje de éxito, no puede iniciar sesión. Cuando intenta ingresar con las credenciales que acaba de crear, recibe un error de "Credenciales inválidas" o "Usuario no encontrado".

## Pasos para Reproducir

1.  Navegar a la página de registro.
2.  Completar el formulario con datos únicos y válidos (nombre de usuario, correo electrónico, contraseña).
3.  Enviar el formulario de registro.
4.  Observar un mensaje de éxito indicando que el registro fue exitoso.
5.  Navegar a la página de inicio de sesión.
6.  Ingresar exactamente el mismo nombre de usuario/correo y contraseña usados en el registro.
7.  Hacer clic en el botón "Iniciar sesión".
8.  **Resultado Esperado:** El usuario inicia sesión exitosamente.
9.  **Resultado Real:** El usuario recibe un mensaje de error (ej.: "Credenciales inválidas", "Usuario no encontrado", "Fallo de autenticación").

## Tarea de Investigación Técnica

El equipo técnico debe rastrear el proceso de registro y el intento de inicio de sesión posterior para identificar por qué no se puede acceder a la cuenta recién creada.

### Áreas Potenciales para Investigar:

1.  **Lógica de Registro en el Backend:**
    *   Revisar el código en `fintech-support-challenge/backend/src/controllers/userController.ts` (específicamente el manejador de registro, probablemente `registerUser` o similar).
    *   ¿Se están guardando realmente los datos del usuario en la base de datos después de la validación?
    *   ¿Se está realizando el hash de la contraseña correctamente *antes* de guardar al usuario? Si se guarda la contraseña en texto plano, fallará la comparación durante el login.
    *   ¿Hay errores que ocurren en silencio durante la operación de guardado (ej.: violaciones de restricciones, problemas de conexión)? Verificar los logs del backend.
    *   ¿Hay alguna operación asíncrona al guardar el usuario que no se está esperando adecuadamente, lo que podría causar que se envíe la respuesta de éxito antes de completar el guardado?
2.  **Base de Datos:**
    *   Conectarse a la base de datos (PostgreSQL) usada por el backend.
    *   Verificar manualmente si el registro del usuario existe en la tabla `users` después del registro exitoso.
    *   Confirmar que el campo `password` del nuevo registro contiene un hash válido, no la contraseña en texto plano.
3.  **Lógica de Inicio de Sesión:**
    *   Revalidar el manejador de inicio de sesión (`loginUser`) en `userController.ts`. ¿Está buscando correctamente al usuario (ej.: por correo o nombre de usuario)?
    *   ¿El campo de comparación es sensible a mayúsculas/minúsculas (ej.: buscando por `email`, pero el usuario escribió `Email`)?
4.  **Transmisión de Datos desde el Frontend:**
    *   Usar las herramientas de desarrollo del navegador para inspeccionar la solicitud de red durante el inicio de sesión. ¿Se están enviando el correo/usuario y contraseña tal como fueron ingresados?
5.  **Problemas de Transacciones:**
    *   Si el proceso de registro involucra múltiples operaciones en la base de datos, ¿está envuelto en una transacción? ¿Podría estar fallando y revirtiendo la creación del usuario sin mostrar un mensaje claro de error al frontend?

## Posibles Soluciones (Enfoque de Hotfix)

*   **Asegurar Guardado en la Base de Datos:** Agregar manejo explícito de errores y logging alrededor de la operación de guardado (`user.save()` o `UserRepository.create()`) en el controlador de registro. Asegurarse de que se complete exitosamente antes de enviar la respuesta de éxito.
*   **Esperar Operaciones Asíncronas:** Verificar que cualquier promesa devuelta por operaciones de base de datos o funciones de hashing esté correctamente `await`eada.
*   **Verificar Hashing:** Confirmar que se llama a `bcrypt.hash()` (o equivalente) *antes* de guardar los datos del usuario y que se almacene el hash resultante, no la contraseña original.
*   **Conexión/Pool de Base de Datos:** Verificar posibles problemas con conexiones de base de datos agotadas o caídas, aunque esto es menos probable en un solo registro.

## Criterios de Aceptación para la Solución

*   Un usuario que completa exitosamente el proceso de registro puede iniciar sesión inmediatamente usando las credenciales que creó.
*   El registro del usuario existe en la base de datos con una contraseña correctamente hasheada después del registro.
