#!/bin/bash

# ============================================
# COMUNIAPP - DATABASE INITIALIZATION SCRIPT
# ============================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables de configuración
DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-rootpassword}"
DB_NAME="${DB_NAME:-comuniApp}"
SCHEMA_FILE="./src/utils/schema.sql"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}COMUNIAPP - Database Initialization${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verificar que existe el archivo schema.sql
if [ ! -f "$SCHEMA_FILE" ]; then
    echo -e "${RED}❌ Error: $SCHEMA_FILE no encontrado${NC}"
    exit 1
fi

echo -e "${YELLOW}Conectando a MySQL en ${DB_HOST}:${DB_PORT}...${NC}"

# Esperar a que MySQL esté disponible
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1" &>/dev/null; then
        echo -e "${GREEN}✓ MySQL disponible${NC}"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo -e "${RED}❌ No se pudo conectar a MySQL después de ${max_attempts} intentos${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Intento $attempt/$max_attempts - MySQL no está listo, esperando...${NC}"
    sleep 2
    ((attempt++))
done

echo ""
echo -e "${YELLOW}Inicializando base de datos...${NC}"

# Ejecutar el schema SQL
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" < "$SCHEMA_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Schema ejecutado correctamente${NC}"
else
    echo -e "${RED}❌ Error al ejecutar schema${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Verificando tablas creadas...${NC}"

# Verificar que las tablas se crearon
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << VERIFY_EOF
SELECT CONCAT(TABLE_NAME, ' - ', TABLE_ROWS, ' filas') as 'Tabla'
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = '$DB_NAME'
ORDER BY TABLE_NAME;
VERIFY_EOF

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Base de datos inicializada correctamente!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Resumen:${NC}"
echo "  Base de datos: $DB_NAME"
echo "  Usuario: $DB_USER"
echo "  Host: $DB_HOST"
echo "  Esquema: $SCHEMA_FILE"
echo ""
echo -e "${YELLOW}Credenciales de prueba:${NC}"
echo "  Email: juan@example.com"
echo "  Contraseña: password123"
echo ""
