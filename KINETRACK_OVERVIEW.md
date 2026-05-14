# 🏥 KineTrack — Application web de kinésithérapie assistée par IA

## Stack technique
- **Frontend** : React (CRA + craco), Tailwind CSS, Shadcn UI, MediaRecorder Web API, lucide-react
- **Backend** : FastAPI (Python 3.11), Motor (MongoDB async), Pydantic v2
- **Base de données** : MongoDB (UUIDs string, jamais d'ObjectId dans les réponses)
- **IA** : Emergent LLM Key → GPT-4o-mini (texte) + Whisper-1 (speech-to-text)
- **SMS** : Twilio SDK Python
- **Routing** : React Router DOM
- **Langue** : interfaces et réponses en français

## Modules implémentés

### 1) Gestion patients (CRUD complet)
- Création multi-étape avec anamnèse détaillée
- Pain Drawing canvas (Mark Laslett)
- Notes cliniques et médias patient
- Modal « Voir/Modifier Anamnèse » éditable avec `PUT /api/patients/{id}`

### 2) Anamnèse vocale (P0 terminé)
- `VoiceAnamneseRecorder` : enregistrement, timer, playback
- Transcription Whisper via `POST /api/anamnese-vocale/transcribe`
- Génération LLM : compte-rendu, lettre médecin, notes synthétiques
- Enregistrement au dossier patient

### 3) Agenda multi-praticien
- Vues Jour / 3 jours / Semaine / Mois
- Création rapide, séries, drag & drop, copier/coller, blocage créneau
- Blocs colorés récurrents via `/api/blocs-agenda`

### 4) SMS Twilio (P0 terminé)
- `GET /api/sms/config`
- `POST /api/sms/send`
- `POST /api/sms/send-reminder`
- `POST /api/sms/send-all-tomorrow`
- Normalisation E.164 + template FR + gestion erreur trial 21608

### 5) Portail patient mobile-first (en cours)
- Lien magique `/patient/{token-uuid}`
- Onglets : Accueil, Programme, RDV, Messages
- Validation exercice + EVA + média + message
- Notifications kiné automatiques

### 6) Bibliothèque d'exercices
- Base initialisée au démarrage (zones multiples)
- Recherche et filtres par type/zone

### 7) Programmes de rééducation
- Programmes multi-phases
- Suivi progression + édition complète

### 8) Coaching patient
- Assignation hebdomadaire d'exercices
- Statuts de séance + adaptation automatique

### 9) Génération de documents IA
- PDF compte-rendu anamnèse
- PDF lettre médecin
- PDF programme d'exercices

### 10) Notifications cliquables
- Notifications auto + navigation patient + marquage lu

### 11) Messagerie interne
- Conversations kiné/patient

### 12) Suggestions / feedback
- Page dédiée pour retours utilisateur

## Variables d'environnement backend
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
EMERGENT_LLM_KEY=sk-emergent-...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
PORTAL_BASE_URL=https://...preview.emergentagent.com
```

## Prochaines pistes
- Finaliser les tests E2E du portail patient
- Refactoriser `App.js` (actuellement > 7200 lignes)
- Planifier les rappels SMS J-1 avec APScheduler
- Ajouter un aperçu vidéo YouTube dans la bibliothèque d'exercices
- Afficher les notifications kiné en temps réel
