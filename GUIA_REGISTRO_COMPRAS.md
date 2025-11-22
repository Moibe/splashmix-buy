# Guía de Registro de Compras en Firestore

## Cambios Realizados

### 1. **Nuevo Sistema de Registro de Compras**
Se ha actualizado el sistema para registrar las compras en la subcollección `movimientos` del usuario, usando el nuevo formato de ID composite (`timestamp-uid-correo`).

### 2. **Funciones Disponibles en `firestore_db.js`**

#### `obtenerDocumentoUsuarioPorUID(uidFirebase)`
- **Propósito**: Busca el documento del usuario en la colección `usuarios` por su UID
- **Parámetro**: `uidFirebase` (string) - UID de Firebase Auth
- **Retorna**: ID del documento (formato: `timestamp-uid-correo`)
- **Uso**:
```javascript
const docId = await obtenerDocumentoUsuarioPorUID('WP1GpNG0WwOx6KsiHytUigtZsdf1');
console.log(docId); // "1700000000000-WP1GpNG0WwOx6KsiHytUigtZsdf1-moi.estrello@gmail.com"
```

#### `registrarCompra(userId, priceId, imagenes, monto)`
- **Propósito**: Registra una compra en la subcollección `movimientos` del usuario
- **Parámetros**:
  - `userId` (string) - UID de Firebase Auth
  - `priceId` (string) - ID del precio de Stripe
  - `imagenes` (number) - Cantidad de imágenes compradas
  - `monto` (number) - Monto pagado
- **Retorna**: ID del documento de movimiento (timestamp en milisegundos)
- **Uso**:
```javascript
import { registrarCompra } from './firestore_db.js';

try {
    const movimientoId = await registrarCompra(
        'WP1GpNG0WwOx6KsiHytUigtZsdf1',
        'price_1S1GF3ROVpWRmEfB6hRtG5Cy',
        10,
        190
    );
    console.log('Compra registrada:', movimientoId);
} catch (error) {
    console.error('Error al registrar compra:', error);
}
```

### 3. **Estructura de Datos Guardados**

Cuando se registra una compra, se crea un documento en:
```
usuarios/{documentId}/movimientos/{timestamp}
```

Con la siguiente estructura:
```json
{
    "fecha": "2025-11-22T15:30:45.123Z",
    "movimiento": "compra de imágenes",
    "priceId": "price_1S1GF3ROVpWRmEfB6hRtG5Cy",
    "imagenes": 10,
    "monto": 190,
    "timestamp": 1732283445123
}
```

### 4. **Flujo de Compra Completo**

1. **Frontend** (`main.js`):
   - Usuario hace clic en "Comprar"
   - Se obtiene el UID del usuario
   - Se crea sesión de Stripe y redirige

2. **Backend** (después de procesar pago):
   - Verifica que el pago sea válido
   - Llama a `registrarCompra()` con los datos
   - Retorna confirmación

3. **Firestore**:
   - Documento creado en `usuarios/{docId}/movimientos/{timestamp}`
   - Contiene datos de la compra

### 5. **Ventajas del Nuevo Sistema**

✅ **Documentos únicos por usuario**: Usa el ID composite en lugar de UID
✅ **Historial completo**: Todas las transacciones (visitas + compras) en una subcollección
✅ **Búsqueda eficiente**: Query por UID field garantiza encontrar el documento correcto
✅ **Deduplicación**: No hay documentos duplicados con IDs antiguos
✅ **Auditoría**: Timestamps y datos completos de cada transacción

### 6. **Migración de Datos (Si es necesario)

Si tienes compras registradas en documentos con UID antiguo, necesitarás:
1. Copiar los datos a la subcollección correcta
2. Usar el nuevo ID composite
3. Eliminar los documentos antiguos

Contacta al administrador para asistencia.

### 7. **Debugging

Todos los registros tienen logs en consola con prefijos:
- `💳 [firestore_db.js]` - Mensajes de compra
- `✅` - Operación exitosa
- `❌` - Operación fallida
- `📝` - Información de proceso

