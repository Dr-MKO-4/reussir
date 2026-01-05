#!/bin/bash
# Script de création de la base de données PostgreSQL
# Utilisation : ./create-database.sh

set -e

# Configuration
DB_HOST="98.86.67.128"
DB_PORT="5432"
DB_USER="gogivam"
DB_PASSWORD="Admin001"
DB_NAME="winplus_db"

echo "=========================================="
echo "Création de la base de données PostgreSQL"
echo "=========================================="
echo "Host: $DB_HOST"
echo "User: $DB_USER"
echo "Database: $DB_NAME"
echo ""

# Vérifier que psql est disponible
if ! command -v psql &> /dev/null; then
    echo "❌ psql n'est pas installé. Installez postgresql-client:"
    echo "   sudo apt install -y postgresql-client"
    exit 1
fi

# Créer la base de données
echo "✓ Création de la base de données..."
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -U "$DB_USER" \
    -p "$DB_PORT" \
    -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -U "$DB_USER" \
    -p "$DB_PORT" \
    -c "CREATE DATABASE $DB_NAME;"

echo "✓ Exécution du schéma SQL..."
# Exécuter le schéma SQL
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -U "$DB_USER" \
    -p "$DB_PORT" \
    -d "$DB_NAME" \
    -f schema.sql

echo ""
echo "=========================================="
echo "✅ Base de données créée avec succès!"
echo "=========================================="
echo ""
echo "Pour charger les données d'exemple :"
echo "  PGPASSWORD='$DB_PASSWORD' psql -h $DB_HOST -U $DB_USER -p $DB_PORT -d $DB_NAME"
echo ""
