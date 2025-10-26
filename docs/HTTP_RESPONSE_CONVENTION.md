# 📋 Convención de Respuestas HTTP

Este proyecto utiliza una convención estandarizada para todas las respuestas HTTP.

## 🎯 Estructura de Respuestas

### ✅ Respuesta Exitosa (Success)

```json
{
  "message": "Descripción del éxito",
  "data": { ... }  // Opcional
}
```

### ❌ Respuesta de Error

```json
{
  "message": "Descripción del error"
}
```

## 🛠️ Uso con `handleResult`

### Caso 1: Success con data

```typescript
router.get("/users/:id", (req: Request, res: Response) => {
  const result = getUserById(req.params.id);
  return handleResult(res, result, "User retrieved successfully");
});

// Respuesta:
// Status: 200
// Body: { "message": "User retrieved successfully", "data": { id: "1", name: "John" } }
```

### Caso 2: Success sin data

```typescript
router.delete("/users/:id", (req: Request, res: Response) => {
  const result = deleteUser(req.params.id);
  return handleResult(res, result, "User deleted successfully");
});

// Respuesta:
// Status: 200
// Body: { "message": "User deleted successfully" }
```

### Caso 3: Error

```typescript
router.get("/users/:id", (req: Request, res: Response) => {
  const result = getUserById(req.params.id);
  return handleResult(res, result, "User retrieved successfully");
});

// Si el usuario no existe:
// Status: 404
// Body: { "message": "User with id 999 not found" }
```

### Caso 4: Status code personalizado

```typescript
router.post("/users", (req: Request, res: Response) => {
  const result = createUser(req.body);
  return handleResult(res, result, "User created successfully", 201);
});

// Respuesta:
// Status: 201
// Body: { "message": "User created successfully", "data": { id: "123", name: "John" } }
```

## 🔧 Funciones Auxiliares

### `handleSuccess` - Para respuestas directas sin Result

```typescript
router.get("/health", (_req: Request, res: Response) => {
  return handleSuccess(res, "Service is healthy");
});

// O con data:
return handleSuccess(res, "Data retrieved", { count: 10 }, 200);
```

### `handleError` - Para manejar errores directos

```typescript
router.get("/something", (_req: Request, res: Response) => {
  try {
    // ... código
  } catch (error) {
    return handleError(res, error);
  }
});
```

## 📦 Patrón Result en Servicios

Tu lógica de negocio debe retornar `Result<T>`:

```typescript
// ✅ Caso exitoso
function getUser(id: string): Result<User> {
  const user = database.findUser(id);
  if (user) {
    return Result.success(user);
  }
  return Result.error(CustomError.notFound(`User ${id} not found`));
}

// ✅ Éxito sin datos
function deleteUser(id: string): Result<void> {
  database.deleteUser(id);
  return Result.success();
}

// ✅ Con validación
function createUser(data: UserDTO): Result<User> {
  if (!data.email) {
    return Result.error(CustomError.badRequest("Email is required"));
  }

  const user = database.createUser(data);
  return Result.success(user);
}
```

## 🎨 Códigos de Estado HTTP Comunes

- `200` - OK (default para success)
- `201` - Created (para creación de recursos)
- `204` - No Content (para deletes sin body)
- `400` - Bad Request (errores de validación)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no encontrado)
- `500` - Internal Server Error (errores del servidor)

## 💡 Ventajas de esta Convención

1. **Consistencia**: Todas las respuestas tienen el mismo formato
2. **Predecibilidad**: El frontend sabe qué esperar siempre
3. **Type Safety**: TypeScript ayuda a mantener el contrato
4. **Manejo de Errores**: Los errores se propagan de forma controlada
5. **Flexibilidad**: Puedes customizar mensajes y status codes
6. **DRY**: No repites código de respuesta en cada endpoint

## 🔍 Ejemplos Completos

### Endpoint de Login

```typescript
router.post("/auth/login", async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return handleResult(res, result, "Login successful");
});

// Success:
// { "message": "Login successful", "data": { token: "...", user: {...} } }

// Error:
// { "message": "Invalid credentials" }
```

### Endpoint de Lista

```typescript
router.get("/products", async (req: Request, res: Response) => {
  const result = await productService.getAll(req.query);
  return handleResult(res, result, "Products retrieved successfully");
});

// Success:
// { "message": "Products retrieved successfully", "data": [{ id: 1, name: "..." }] }
```

### Endpoint de Update

```typescript
router.put("/products/:id", async (req: Request, res: Response) => {
  const result = await productService.update(req.params.id, req.body);
  return handleResult(res, result, "Product updated successfully");
});

// Success:
// { "message": "Product updated successfully", "data": { id: 1, name: "...", updatedAt: "..." } }

// Error (not found):
// { "message": "Product with id 999 not found" }

// Error (validation):
// { "message": "Price must be a positive number" }
```
