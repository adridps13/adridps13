# KineTrack — Architecture initiale (Étape 1)

Ce repository contient le squelette full-stack de **KineTrack** :

- Frontend : React + Vite + Tailwind CSS + React Router
- Backend : FastAPI (Python)
- Base de données : MongoDB (Motor)
- Structure : `frontend/`, `backend/`, `docs/`

## Arborescence

```text
.
├── frontend/
├── backend/
└── docs/
```

## Variables d'environnement

Copier le fichier exemple :

```bash
cp .env.example .env
```

## Installation

### 1) Frontend

```bash
cd frontend
npm install
```

### 2) Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## Lancement

### 1) API FastAPI

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2) Frontend Vite

```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

## Vérifications rapides

### Santé backend

```bash
curl -s http://localhost:8000/api/health
```

Réponse attendue :

```json
{"status":"ok","service":"KineTrack API"}
```

### Frontend

Ouvrir `http://localhost:5173`.

## Dépannage réseau (proxy/DNS)

Si `npm install` ou `pip install` échoue avec `403` ou `Temporary failure in name resolution`, relancer sans variables proxy :

```bash
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy -u npm_config_http_proxy -u npm_config_https_proxy npm install
```

```bash
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy pip install -r requirements.txt
```

## Modules futurs (préparés côté architecture)

- Patients
- Agenda
- Portail patient
- IA
- SMS

Ces modules ne sont **pas implémentés** à cette étape.
