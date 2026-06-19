# JavaChilapeno - Backend Spring Boot

Backend Spring Boot para gestión de carrito de compras con PostgreSQL.

## Configuración para Despliegue en Render.com + Neon.tech

### 1. Crear cuenta en Neon.tech (PostgreSQL gratis permanente)

1. Ve a [https://neon.tech](https://neon.tech)
2. Crea una cuenta gratuita (sin tarjeta)
3. Crea un nuevo proyecto PostgreSQL
4. Copia la cadena de conexión que te proporcionan (formato: `postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslmode=require`)

**Credenciales actuales del proyecto:**
- Host: `ep-still-tooth-aipprixy-pooler.c-4.us-east-1.aws.neon.tech`
- Database: `neondb`
- Username: `neondb_owner`
- Password: `npg_Jh0lI5EpVcbR`

### 2. Configurar variables de entorno en Render.com

1. Ve a [https://render.com](https://render.com)
2. Crea una cuenta gratuita (sin tarjeta)
3. Conecta tu repositorio de GitHub
4. Crea un nuevo "Web Service"
5. Selecciona tu repositorio
6. En "Build & Deploy", configura:
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/javachilapeno-1.0-SNAPSHOT.jar`
7. En "Environment", agrega las siguientes variables de entorno:

```
DATABASE_URL=jdbc:postgresql://ep-still-tooth-aipprixy-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
DATABASE_USERNAME=neondb_owner
DATABASE_PASSWORD=npg_Jh0lI5EpVcbR
PORT=8080
```

### 3. Probar localmente con Neon.tech

Para probar la aplicación localmente usando Neon.tech:

**Windows (PowerShell):**
```powershell
$env:DATABASE_URL="jdbc:postgresql://ep-still-tooth-aipprixy-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
$env:DATABASE_USERNAME="neondb_owner"
$env:DATABASE_PASSWORD="npg_Jh0lI5EpVcbR"
mvn spring-boot:run
```

**Linux/Mac:**
```bash
export DATABASE_URL="jdbc:postgresql://ep-still-tooth-aipprixy-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
export DATABASE_USERNAME="neondb_owner"
export DATABASE_PASSWORD="npg_Jh0lI5EpVcbR"
mvn spring-boot:run
```

### 4. Endpoints disponibles

Una vez desplegado, tendrás los siguientes endpoints:

- `GET /api/carrito` - Obtener todos los items del carrito
- `POST /api/carrito` - Agregar item al carrito

**Ejemplo de uso:**
```bash
# Agregar item al carrito
curl -X POST https://tu-app.onrender.com/api/carrito \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto Ejemplo",
    "productoId": 1,
    "cantidad": 2,
    "precio": 99.99,
    "subtotal": 199.98
  }'

# Obtener items del carrito
curl https://tu-app.onrender.com/api/carrito
```

### 5. Estructura del proyecto

```
src/main/java/daotest/
├── JavachilapenoApplication.java  # Clase principal
├── controller/
│   └── CarritoController.java     # REST API del carrito
├── model/
│   └── Carrito.java               # Entidad JPA
└── repository/
    └── CarritoRepository.java     # Repositorio Spring Data JPA
```

### 6. Tecnologías

- Spring Boot 3.3.4
- Spring Data JPA
- PostgreSQL (Neon.tech)
- Maven
- Java 17

### 7. Notas importantes

- El proyecto usa despliegue nativo en Render (sin Docker)
- Neon.tech proporciona PostgreSQL gratis permanente (a diferencia del Postgres gratis de Render que se borra a los 30 días)
- La fecha se establece automáticamente al agregar items al carrito
- La base de datos se crea automáticamente con Hibernate (ddl-auto: update)
