# Escenario 3: El saldo se reinicia después de un depósito y recarga de página

## Queja del Usuario

Un usuario reporta que, después de realizar un depósito en su cuenta y ver el saldo actualizado, el saldo vuelve a su valor anterior si recarga la página o cierra sesión y vuelve a iniciar. La transacción de depósito puede aparecer en el historial, pero el saldo principal mostrado es incorrecto.

## Pasos para Reproducir

1.  Iniciar sesión en la cuenta del usuario.
2.  Anotar el saldo actual de la cuenta.
3.  Realizar una transacción de depósito a través de la interfaz de la aplicación.
4.  Observar que el saldo se actualiza en el panel o página de resumen de cuenta para reflejar el depósito.
5.  Recargar la página web (F5 o botón de recarga del navegador).
6.  Alternativamente, cerrar sesión y volver a iniciar.
7.  Observar nuevamente el saldo de la cuenta.
8.  **Resultado Esperado:** El saldo debe permanecer actualizado reflejando el depósito.
9.  **Resultado Actual:** El saldo vuelve al monto que tenía *antes* de realizar el depósito.

## Tarea de Investigación Técnica

El equipo técnico necesita investigar por qué la actualización del saldo tras el depósito parece temporal y no se guarda o no se obtiene correctamente al recargar.

### Posibles Áreas de Investigación:

1.  **Lógica de Depósito en el Backend:**
    *   Revisar el controlador y servicio que maneja las transacciones de depósito (probablemente dentro del backend, posiblemente en `transactionController.ts` si existe, o `userController.ts` si el saldo está directamente en el modelo del usuario).
    *   ¿La lógica de depósito actualiza correctamente el saldo del usuario en la base de datos?
    *   ¿La operación de actualización se guarda/commitea en la base de datos?
    *   ¿Ocurre algún error *después* de la actualización en la UI pero *antes* o *durante* el guardado en base de datos?

2.  **Persistencia en la Base de Datos:**
    *   Revisar directamente la base de datos. ¿El campo `balance` (o equivalente) en la tabla `users` (o una tabla separada `accounts`) realmente se actualiza después del depósito?
    *   Si las transacciones se almacenan en una tabla separada, ¿el proceso que actualiza el saldo principal a partir de estas transacciones está funcionando correctamente?

3.  **Manejo de Estado en el Frontend:**
    *   ¿Cómo se muestra el saldo en el frontend? ¿Se obtiene del backend cada vez que se carga la página?
    *   ¿Está el frontend cacheando el saldo incorrectamente y no vuelve a obtenerlo después del depósito?
    *   Revisar el componente responsable de mostrar el saldo (por ejemplo, `DashboardContent.tsx`). ¿De dónde obtiene sus datos? (`useEffect`, Zustand, Redux, etc.)

4.  **Lógica de Obtención de Datos (Backend):**
    *   Revisar el endpoint del backend que proporciona los datos de cuenta del usuario (incluyendo el saldo) al frontend al iniciar sesión o cargar la página.
    *   ¿Este endpoint obtiene el saldo más reciente desde la base de datos?
    *   ¿Podría haber algún tipo de cacheo en el endpoint del backend?

5.  **Atomicidad de Transacciones:**
    *   ¿El proceso de registrar la transacción de depósito y actualizar el saldo del usuario se maneja de forma atómica (por ejemplo, dentro de una transacción en la base de datos)? Si falla la actualización del saldo, ¿aún se registra la transacción?

## Explicación para el Usuario (Según la Causa Potencial)

*   "Hemos identificado un problema donde la actualización del saldo tras un depósito no se guardaba permanentemente en el registro de la cuenta, aunque la transacción sí se registraba. Al recargar la página, el sistema mostraba el último saldo guardado de forma permanente. Estamos trabajando en una solución para garantizar que el saldo se actualice correctamente de forma inmediata después de un depósito."*

## Posibles Soluciones

*   **Asegurar Actualización y Guardado en Base de Datos:** Verificar que el código que realiza el depósito actualice explícitamente el campo de saldo y llame a las funciones necesarias para guardar/commitear en la base de datos.
*   **Corrección en Obtención de Datos:** Asegurarse de que el frontend siempre obtenga el saldo actualizado desde la API del backend al cargar la página o realizar acciones relevantes, en lugar de depender solo del estado inicial o caché del frontend tras acciones.
*   **Corregir el Endpoint del Backend:** Asegurarse de que el endpoint del backend que entrega los datos del usuario/cuenta obtenga el saldo actual directamente desde la base de datos.
*   **Transacciones Atómicas:** Envolver el registro de la transacción y la actualización del saldo dentro de una sola transacción de base de datos para asegurar que ambos procesos se realicen exitosamente o ninguno.

## Criterios de Aceptación para la Solución

*   Después de un depósito exitoso, el saldo actualizado debe persistir tras recargar la página.
*   Después de un depósito exitoso, el saldo actualizado debe persistir tras cerrar sesión e iniciar nuevamente.
*   El saldo del usuario en la base de datos debe reflejar correctamente todas las transacciones de depósito exitosas.
