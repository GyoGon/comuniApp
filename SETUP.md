# Setup Guide - ComuniApp

Guía completa para configurar y ejecutar ComuniApp en tu entorno local.

## 📋 Requisitos Previos

- **Docker** (v20.10+) y **Docker Compose** (v1.29+)
- **Node.js** (v20+) y **npm/pnpm** (opcional si usas Docker)
- **MySQL Client** (para ejecutar scripts manualmente)
- **Git**

## 🚀 Inicio Rápido (Docker Compose)

La forma más fácil de ejecutar ComuniApp es con Docker Compose:

### 1. Clonar repositorio
```bash
git clone https://github.com/GyoGon/comuniApp.git
cd comuniApp
```

### 2. Iniciar contenedores
```bash
docker-compose up -d
```

Esto levantará:
- **API**: http://localhost:8080
- **MySQL**: localhost:3306

### 3. Verificar que todo funciona
```bash
# Health check de la API y BD
curl http://localhost:8080/api/health

# Respuesta esperada:
# {
#   "status": "healthy",
#   "database": "connected",
#   "timestamp": "2026-02-26T...",
#   "environment": "development"
# }
```

### 4. Ver logs
```bash
# Todos los servicios
docker-compose logs -f

# Solo la API
docker-compose logs -f app

# Solo la BD
docker-compose logs -f db
```

### 5. Detener servicios
```bash
docker-compose down

# Mantener volúmenes de datos
docker-compose down -v  # Elimina volúmenes (limpia BD)
```

---

## 🗄️ Base de Datos

### Esquema de Base de Datos

La BD se inicializa automáticamente con el archivo `src/utils/schema.sql`:

**Tablas creadas:**
- `usuarios` (5 usuarios de prueba)
- `categorias` (5 categorías)
- `ubicaciones` (5 ubicaciones españolas)
- `posts` (8 posts de ejemplo)
- `media` (4 archivos media)
- `google_places` (vacía, para futuros datos)

### Datos de Prueba

**Usuarios de prueba:**
```
Email: juan@example.com
Contraseña: password123

Email: maria@example.com
Contraseña: password123

(+ 3 usuarios más)
```

### Inicializar BD Manualmente

Si necesitas reinicializar la BD:

```bash
# Opción 1: Eliminando y recreando los contenedores
docker-compose down -v
docker-compose up -d

# Opción 2: Ejecutar script de inicialización (requiere MySQL client)
./scripts/init-db.sh

# Opción 3: Conectar directamente a MySQL
docker exec -it comuniapp_db mysql -u root -prootpassword comuniApp < src/utils/schema.sql
```

---

## 📝 Archivos de Configuración

### `.env` (Configuración local)
```env
PORT=8080
NODE_ENV=development
DB_HOST=db          # O 'localhost' si ejecutas MySQL sin Docker
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=comuniApp
```

### `docker-compose.yml`
Define dos servicios:
- **app**: Servidor Node.js con nodemon (auto-reload)
- **db**: MySQL 8.0 con volumen persistente

**Health Checks:**
- La API tiene un health check cada 10s
- MySQL tiene un health check cada 10s
- La API solo inicia cuando MySQL está healthy

### `src/utils/schema.sql`
Esquema SQL con:
- Definición de tablas
- Relaciones (FK)
- Índices para optimizar búsquedas
- Datos de prueba (seed)

---

## 🛠️ Desarrollo Local

### Sin Docker (MySQL local)

Si quieres ejecutar Node directamente:

```bash
# 1. Crear base de datos MySQL local
mysql -u root -p
CREATE DATABASE comuniApp;
EXIT;

# 2. Ejecutar schema
mysql -u root -p comuniApp < src/utils/schema.sql

# 3. Instalar dependencias
npm install
# o
pnpm install

# 4. Actualizar .env
DB_HOST=localhost
DB_PASSWORD=           # Tu contraseña local

# 5. Iniciar servidor
npm run dev
# o
pnpm run dev
```

### Con Docker (Recomendado)

```bash
# Construir imagen (si es necesario)
docker-compose build

# Iniciar en modo desarrollo
docker-compose up

# En otra terminal, ver logs en tiempo real
docker-compose logs -f app

# Hacer cambios en código - nodemon recargará automáticamente
```

---

## 🧪 Testing (Próxima implementación)

```bash
npm test              # Ejecutar todos los tests
npm run test:watch   # Watch mode
npm run test:cov     # Coverage report
```

---

## 📌 Endpoints Principales

### Health Check
```
GET /api/health
Respuesta: Estado de la API y conexión a BD
```

### Usuarios
```
GET    /api/users              - Listar usuarios
GET    /api/users/:id          - Obtener usuario por ID
POST   /api/users              - Crear usuario
PUT    /api/users/:id          - Actualizar usuario
DELETE /api/users/:id          - Eliminar usuario
```

---

## 🐛 Troubleshooting

### "Connection refused" (3306)
**Problema:** MySQL no está corriendo
```bash
docker-compose logs db
docker-compose restart db
```

### "ECONNREFUSED" desde la app
**Problema:** La app intenta conectarse antes de que MySQL esté listo
```bash
# Los health checks ya manejan esto, pero puedes esperar manualmente
sleep 5
docker-compose restart app
```

### "File not found: schema.sql"
**Problema:** Ruta incorrecta en docker-compose.yml
```bash
# Verificar que el archivo existe
ls -la src/utils/schema.sql

# Verificar volumen en Docker
docker inspect comuniapp_db | grep -A 5 "Mounts"
```

### Reset completo
```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes
docker rmi comuniapp-app mysql:8.0

# Iniciar de nuevo
docker-compose up --build
```

---

## 📚 Archivos Importantes

```
comuniApp/
├── docker-compose.yml          # Configuración de Docker
├── Dockerfile                  # Imagen de Node.js
├── .env                        # Variables de entorno
├── package.json                # Dependencias Node
├── index.js                    # Punto de entrada
├── AGENTS.md                   # Guía para agentes de código
├── SETUP.md                    # Este archivo
└── src/
    ├── db/
    │   └── indexDb.js         # Pool de conexión MySQL
    ├── utils/
    │   ├── schema.sql         # Definición de tablas
    │   └── errorHandler.js    # Manejador de errores
    ├── controllers/           # Controladores HTTP
    ├── services/              # Lógica de negocio
    ├── routes/                # Definición de rutas
    └── schemas/               # Validación con Joi
```

---

## 🔗 Enlaces Útiles

- [Docker Documentation](https://docs.docker.com/)
- [MySQL 8.0 Docs](https://dev.mysql.com/doc/refman/8.0/en/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [AGENTS.md](./AGENTS.md) - Guía de código para agentes

---

## ❓ Preguntas Frecuentes

**P: ¿Cómo accedo a MySQL desde fuera del contenedor?**
R: Usa `localhost:3306` con usuario `root` y contraseña `rootpassword`

**P: ¿Cómo actualizo el esquema de la BD?**
R: Edita `src/utils/schema.sql` y reinicia los contenedores con `docker-compose down -v && docker-compose up`

**P: ¿Puedo cambiar las credenciales de la BD?**
R: Sí, edita `docker-compose.yml` y `.env` con las nuevas credenciales

**P: ¿Los datos de prueba se mantienen entre reinicios?**
R: Sí, porque MySQL usa un volumen persistente (`db_data`). Para limpiar: `docker-compose down -v`

---

**Última actualización:** 26 de febrero de 2026
**Versión:** 1.0.0
