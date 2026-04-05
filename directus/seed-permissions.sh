#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Tutulipe — Seed des rôles, policies et permissions
# ─────────────────────────────────────────────────────────
# Usage : ./seed-permissions.sh [DIRECTUS_URL] [ADMIN_TOKEN]
#
# Ce script configure :
# 1. Rôle "Éditeur" avec policy "Gestion contenu"
# 2. Policy "Lecture publique" sur le rôle Public
#
# Prérequis : Directus démarré + snapshot appliqué + jq installé
# ─────────────────────────────────────────────────────────

set -euo pipefail

DIRECTUS_URL="${1:-http://localhost:8055}"
ADMIN_TOKEN="${2:-}"

if [ -z "$ADMIN_TOKEN" ]; then
  echo "⚠️  Token admin requis."
  echo ""
  echo "Obtenir un token :"
  echo "  curl -X POST $DIRECTUS_URL/auth/login \\"
  echo "    -H 'Content-Type: application/json' \\"
  echo "    -d '{\"email\":\"admin@tutulipe.ch\",\"password\":\"admin-dev-123\"}'"
  echo ""
  echo "Usage : $0 $DIRECTUS_URL <TOKEN>"
  exit 1
fi

API="$DIRECTUS_URL"
AUTH="Authorization: Bearer $ADMIN_TOKEN"
CT="Content-Type: application/json"

echo "🔧 Configuration des permissions Tutulipe..."
echo "   URL : $API"

# ─────────────────────────────────────────────────────────
# 1. Créer la policy "Lecture publique"
# ─────────────────────────────────────────────────────────
echo ""
echo "📖 Création de la policy 'Lecture publique'..."

PUBLIC_POLICY_ID=$(curl -s -X POST "$API/policies" \
  -H "$AUTH" -H "$CT" \
  -d '{
    "name": "Lecture publique",
    "description": "Accès en lecture pour le frontend (API publique)",
    "icon": "public",
    "admin_access": false,
    "app_access": false
  }' | jq -r '.data.id')

echo "   Policy ID : $PUBLIC_POLICY_ID"

# Permissions lecture publique (filtre statut=published)
for COLLECTION in pages articles produits; do
  curl -s -X POST "$API/permissions" \
    -H "$AUTH" -H "$CT" \
    -d "{
      \"policy\": \"$PUBLIC_POLICY_ID\",
      \"collection\": \"$COLLECTION\",
      \"action\": \"read\",
      \"permissions\": {\"_and\":[{\"statut\":{\"_eq\":\"published\"}}]},
      \"fields\": [\"*\"]
    }" > /dev/null
  echo "   ✅ $COLLECTION : read (published)"
done

# Paramètres du site — lecture sans filtre
curl -s -X POST "$API/permissions" \
  -H "$AUTH" -H "$CT" \
  -d "{
    \"policy\": \"$PUBLIC_POLICY_ID\",
    \"collection\": \"parametres_site\",
    \"action\": \"read\",
    \"permissions\": {},
    \"fields\": [\"*\"]
  }" > /dev/null
echo "   ✅ parametres_site : read"

# Fichiers — lecture sans filtre
curl -s -X POST "$API/permissions" \
  -H "$AUTH" -H "$CT" \
  -d "{
    \"policy\": \"$PUBLIC_POLICY_ID\",
    \"collection\": \"directus_files\",
    \"action\": \"read\",
    \"permissions\": {},
    \"fields\": [\"*\"]
  }" > /dev/null
echo "   ✅ directus_files : read"

# Attacher la policy au rôle Public (null = public)
curl -s -X POST "$API/access" \
  -H "$AUTH" -H "$CT" \
  -d "{
    \"policy\": \"$PUBLIC_POLICY_ID\",
    \"role\": null
  }" > /dev/null
echo "   🔗 Policy attachée au rôle Public"

# ─────────────────────────────────────────────────────────
# 2. Créer le rôle "Éditeur" + policy "Gestion contenu"
# ─────────────────────────────────────────────────────────
echo ""
echo "✏️  Création du rôle 'Éditeur'..."

EDITOR_ROLE_ID=$(curl -s -X POST "$API/roles" \
  -H "$AUTH" -H "$CT" \
  -d '{
    "name": "Éditeur",
    "description": "Utilisateur non-technique — gestion du contenu",
    "icon": "edit"
  }' | jq -r '.data.id')

echo "   Rôle ID : $EDITOR_ROLE_ID"

echo "📝 Création de la policy 'Gestion contenu'..."

EDITOR_POLICY_ID=$(curl -s -X POST "$API/policies" \
  -H "$AUTH" -H "$CT" \
  -d '{
    "name": "Gestion contenu",
    "description": "Création et modification du contenu du site",
    "icon": "edit_note",
    "admin_access": false,
    "app_access": true
  }' | jq -r '.data.id')

echo "   Policy ID : $EDITOR_POLICY_ID"

# Permissions éditeur — create, read, update (pas delete) sur le contenu
for COLLECTION in pages articles produits; do
  for ACTION in create read update; do
    curl -s -X POST "$API/permissions" \
      -H "$AUTH" -H "$CT" \
      -d "{
        \"policy\": \"$EDITOR_POLICY_ID\",
        \"collection\": \"$COLLECTION\",
        \"action\": \"$ACTION\",
        \"permissions\": {},
        \"fields\": [\"*\"]
      }" > /dev/null
  done
  echo "   ✅ $COLLECTION : create, read, update"
done

# Paramètres du site — read + update uniquement
for ACTION in read update; do
  curl -s -X POST "$API/permissions" \
    -H "$AUTH" -H "$CT" \
    -d "{
      \"policy\": \"$EDITOR_POLICY_ID\",
      \"collection\": \"parametres_site\",
      \"action\": \"$ACTION\",
      \"permissions\": {},
      \"fields\": [\"*\"]
    }" > /dev/null
done
echo "   ✅ parametres_site : read, update"

# Fichiers — create, read, update
for ACTION in create read update; do
  curl -s -X POST "$API/permissions" \
    -H "$AUTH" -H "$CT" \
    -d "{
      \"policy\": \"$EDITOR_POLICY_ID\",
      \"collection\": \"directus_files\",
      \"action\": \"$ACTION\",
      \"permissions\": {},
      \"fields\": [\"*\"]
    }" > /dev/null
done
echo "   ✅ directus_files : create, read, update"

# Attacher la policy au rôle Éditeur
curl -s -X POST "$API/access" \
  -H "$AUTH" -H "$CT" \
  -d "{
    \"policy\": \"$EDITOR_POLICY_ID\",
    \"role\": \"$EDITOR_ROLE_ID\"
  }" > /dev/null
echo "   🔗 Policy attachée au rôle Éditeur"

# ─────────────────────────────────────────────────────────
echo ""
echo "✅ Configuration terminée !"
echo ""
echo "Résumé :"
echo "  • Rôle Public → Policy 'Lecture publique' (read published)"
echo "  • Rôle Éditeur ($EDITOR_ROLE_ID) → Policy 'Gestion contenu' (CRUD sans delete)"
echo ""
echo "Pour créer un utilisateur éditeur :"
echo "  Aller dans Settings > Users > Créer un utilisateur > Rôle : Éditeur"
