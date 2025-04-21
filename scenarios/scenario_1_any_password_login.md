# Escenario 1: Inicio de sesión con cualquier contraseña

## Reclamo del Usuario

Un usuario reporta que puede iniciar sesión exitosamente en su cuenta usando su nombre de usuario o correo electrónico correcto, pero con *cualquier* contraseña que ingrese. Descubrió esto por accidente y está preocupado por las implicaciones de seguridad.

## Pasos para Reproducir

1.  Navegar a la página de inicio de sesión.
2.  Ingresar un nombre de usuario o correo electrónico válido y registrado.
3.  Ingresar una contraseña completamente incorrecta o aleatoria (ej.: "password123", "asdfghjkl").
4.  Hacer clic en el botón "Iniciar sesión".
5.  **Resultado Esperado:** Un mensaje de error indicando credenciales incorrectas.
6.  **Resultado Real:** El usuario inicia sesión exitosamente en su cuenta y es redirigido al panel de control.

## Tarea de Investigación Técnica

El equipo técnico debe investigar el flujo de autenticación para entender por qué se está omitiendo la validación de la contraseña o por qué no está funcionando correctamente.

### Áreas Potenciales para Investigar:

1.  **Lógica de Autenticación en el Backend:**
    *   Revisar el código en `fintech-support-challenge/backend/src/controllers/userController.ts`, específicamente el manejador de inicio de sesión (`loginUser`).
    *   Examinar cómo se está comparando la contraseña proporcionada con el hash de contraseña almacenado.
    *   Verificar el uso de la librería de hashing de contraseñas (`bcrypt` o similar). ¿Se está usando correctamente la función de comparación (ej.: `bcrypt.compare`)?
    *   ¿Existe alguna lógica condicional que podría estar omitiendo accidentalmente la verificación de la contraseña?
2.  **Middleware:**
    *   Revisar cualquier middleware de autenticación (`fintech-support-challenge/backend/src/middleware/authMiddleware.ts`). ¿Está aplicado correctamente a la ruta de inicio de sesión? ¿Está interfiriendo con el proceso de inicio de sesión (normalmente protege *después* del login)?
3.  **Modelo/Consulta de Base de Datos:**
    *   Verificar el modelo `User` (`fintech-support-challenge/backend/src/models/user.ts`). ¿Está definido correctamente el campo de contraseña?
    *   Examinar la consulta a la base de datos usada para obtener al usuario durante el inicio de sesión. ¿Está recuperando correctamente el hash de contraseña almacenado?
4.  **Variables de Entorno:**
    *   ¿Están correctamente configuradas y cargadas las variables de entorno relacionadas con la autenticación (ej.: rondas de sal de bcrypt, secretos JWT)?

## Posibles Soluciones

*   **Corrección en la Comparación de Contraseña:** Asegurar que la función `bcrypt.compare()` (o equivalente) se utilice correctamente, comparando la contraseña en texto plano proporcionada por el usuario contra el hash almacenado.
*   **Eliminar Código de Prueba o Puentes Temporales:** Revisar si existe algún código temporal o banderas agregadas con fines de prueba que estén omitiendo la verificación de contraseña.
*   **Corregir Lógica Condicional:** Corregir cualquier instrucción `if`/`else` defectuosa que esté permitiendo saltar la verificación de contraseña.
*   **Verificar Recuperación Correcta de Datos:** Asegurarse de que la búsqueda del usuario obtenga correctamente el hash de la contraseña desde la base de datos antes de realizar la comparación.

## Criterios de Aceptación para la Solución

*   Intentar iniciar sesión con un nombre de usuario/correo válido y una contraseña incorrecta *debe* resultar en un mensaje de error de autenticación.
*   Intentar iniciar sesión con un nombre de usuario/correo válido y la contraseña correcta *debe* resultar en una autenticación exitosa.
