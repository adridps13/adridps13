from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
import io
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# LLM Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

async def get_llm_chat():
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=str(uuid.uuid4()),
        system_message="Tu es un assistant expert en kinésithérapie. Tu génères des documents médicaux professionnels, précis et conformes aux standards français. Réponds toujours en français avec un vocabulaire médical approprié."
    ).with_model("openai", "gpt-4o-mini")

# Define Models
class Patient(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nom: str
    prenom: str
    age: int
    pathologie: str
    prescription_medicale: str
    telephone: Optional[str] = None
    email: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PatientCreate(BaseModel):
    nom: str
    prenom: str
    age: int
    pathologie: str
    prescription_medicale: str
    telephone: Optional[str] = None
    email: Optional[str] = None

class Anamnese(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    douleur_niveau: int  # 0-10
    douleur_type: str
    douleur_localisation: str
    debut_symptomes: str
    facteurs_declenchants: str
    activites_genantes: List[str]
    autres_activites: Optional[str] = None
    antecedents_medicaux: str
    traitements_actuels: str
    objectifs_patient: str
    notes_supplementaires: Optional[str] = None
    pain_areas: Optional[Dict[str, int]] = None  # Zone: intensité 1-10
    red_flags: Optional[List[str]] = None
    yellow_flags: Optional[List[str]] = None
    blue_flags: Optional[List[str]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AnamneseCreate(BaseModel):
    patient_id: str
    douleur_niveau: int
    douleur_type: str
    douleur_localisation: str
    debut_symptomes: str
    facteurs_declenchants: str
    activites_genantes: List[str]
    autres_activites: Optional[str] = None
    antecedents_medicaux: str
    traitements_actuels: str
    objectifs_patient: str
    notes_supplementaires: Optional[str] = None
    pain_areas: Optional[Dict[str, int]] = None
    red_flags: Optional[List[str]] = None
    yellow_flags: Optional[List[str]] = None
    blue_flags: Optional[List[str]] = None

class Suggestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    titre: str
    description: str
    categorie: str  # amelioration, nouvelle_fonctionnalite, bug, interface, performance
    priorite: str  # basse, moyenne, haute
    statut: str = "en_attente"  # en_attente, approuve, en_cours, termine, rejete
    user_id: Optional[str] = None  # Futur: pour tracer qui a suggéré
    date_approbation: Optional[datetime] = None
    date_completion: Optional[datetime] = None
    notes_admin: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SuggestionCreate(BaseModel):
    titre: str
    description: str
    categorie: str
    priorite: str

class BilanClinique(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    mobilite_articulaire: Dict[str, str]  # ex: {"epaule_droite": "80°", "epaule_gauche": "120°"}
    force_musculaire: Dict[str, int]  # ex: {"quadriceps": 4, "ischio_jambiers": 3}
    tests_cliniques: Dict[str, str]  # ex: {"lachman": "positif", "tiroir_anterieur": "negatif"}
    posture_statique: str
    marche_analyse: str
    douleur_evaluation: int  # 0-10
    limitations_fonctionnelles: List[str]
    diagnostic_kine: str
    objectifs_traitement: List[str]
    notes_bilan: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BilanCliniqueCreate(BaseModel):
    patient_id: str
    mobilite_articulaire: Dict[str, str]
    force_musculaire: Dict[str, int]
    tests_cliniques: Dict[str, str]
    posture_statique: str
    marche_analyse: str
    douleur_evaluation: int
    limitations_fonctionnelles: List[str]
    diagnostic_kine: str
    objectifs_traitement: List[str]
    notes_bilan: Optional[str] = None

class Exercice(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nom: str
    description: str
    type_exercice: str  # "renforcement", "mobilite", "proprioception", "etirement"
    zone_corporelle: str  # "epaule", "genou", "dos", etc.
    difficulte: int  # 1-5
    duree_minutes: int
    repetitions: Optional[str] = None
    series: Optional[int] = None
    materiel_requis: Optional[str] = None
    url_video: Optional[str] = None  # Lien YouTube
    consignes_specifiques: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExerciceCreate(BaseModel):
    nom: str
    description: str
    type_exercice: str
    zone_corporelle: str
    difficulte: int
    duree_minutes: int
    repetitions: Optional[str] = None
    series: Optional[int] = None
    materiel_requis: Optional[str] = None
    url_video: Optional[str] = None
    consignes_specifiques: Optional[str] = None

class Programme(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    nom_programme: str
    objectif_principal: str
    duree_semaines: int
    frequence_hebdomadaire: int
    phase_actuelle: int = 1
    phases: List[Dict[str, Any]]  # Liste des phases avec exercices et paramètres
    statut: str = "actif"  # actif, suspendu, termine
    notes_kine: Optional[str] = None
    adaptation_auto: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProgrammeCreate(BaseModel):
    patient_id: str
    nom_programme: str
    objectif_principal: str
    duree_semaines: int
    frequence_hebdomadaire: int
    phases: List[Dict[str, Any]]
    notes_kine: Optional[str] = None
    adaptation_auto: bool = True

class SeanceDetail(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    programme_id: str
    patient_id: str
    date_seance: datetime
    numero_seance: int
    phase: int
    exercices_prevus: List[Dict[str, Any]]  # Liste avec id_exercice, parametres
    exercices_realises: List[Dict[str, Any]]  # Liste avec id_exercice, parametres_reels
    douleur_avant: Optional[int] = None  # 0-10
    douleur_apres: Optional[int] = None  # 0-10
    douleur_moyenne: Optional[int] = None  # 0-10 pendant
    fatigue_niveau: Optional[int] = None  # 0-10
    motivation_patient: Optional[int] = None  # 0-10
    compliance: Optional[float] = None  # % exercices réalisés
    charge_totale: Optional[float] = None  # Calcul automatique
    volume_total: Optional[int] = None  # Nombre total répétitions
    duree_effective: Optional[int] = None  # minutes
    observations_patient: Optional[str] = None
    observations_kine: Optional[str] = None
    adaptation_suggere: Optional[str] = None
    statut: str = "planifie"  # planifie, en_cours, termine, annule
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SeanceDetailCreate(BaseModel):
    programme_id: str
    patient_id: str
    date_seance: datetime
    numero_seance: int
    phase: int
    exercices_prevus: List[Dict[str, Any]]

class SeanceUpdate(BaseModel):
    exercices_realises: List[Dict[str, Any]]
    douleur_avant: Optional[int] = None
    douleur_apres: Optional[int] = None
    douleur_moyenne: Optional[int] = None  
    fatigue_niveau: Optional[int] = None
    motivation_patient: Optional[int] = None
    duree_effective: Optional[int] = None
    observations_patient: Optional[str] = None
    observations_kine: Optional[str] = None

class MetriqueProgression(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    programme_id: str
    semaine: int
    charge_moyenne: float
    volume_moyen: int
    douleur_moyenne: float
    compliance_moyenne: float
    progression_force: Optional[float] = None  # %
    progression_mobilite: Optional[float] = None  # %
    adaptation_auto_appliquee: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Fonctions de calcul pour le système de programmation
def calculer_charge_exercice(exercice_data: Dict[str, Any]) -> float:
    """
    Calcule la charge d'un exercice basée sur:
    - Difficulté (1-5)
    - Volume (répétitions × séries)
    - Durée
    - Type d'exercice
    """
    difficulte = exercice_data.get('difficulte', 1)
    repetitions = exercice_data.get('repetitions_reelles', exercice_data.get('repetitions_prevues', 10))
    series = exercice_data.get('series_reelles', exercice_data.get('series_prevues', 1))
    duree = exercice_data.get('duree_reelle', exercice_data.get('duree_prevue', 10))
    type_exercice = exercice_data.get('type_exercice', 'mobilite')
    
    # Coefficient selon le type d'exercice
    coefficients = {
        'renforcement': 1.5,
        'proprioception': 1.2,
        'mobilite': 0.8,
        'etirement': 0.6
    }
    
    coeff_type = coefficients.get(type_exercice, 1.0)
    
    # Calcul de base : Difficulté × Volume × Durée × Coefficient type
    charge_base = difficulte * (repetitions * series) * (duree / 10) * coeff_type
    
    return round(charge_base, 2)

def suggerer_adaptation(seances_recentes: List[Dict], seuils: Dict) -> str:
    """
    Suggère des adaptations basées sur les données des séances récentes
    """
    if not seances_recentes:
        return "Pas assez de données"
    
    douleurs = [s.get('douleur_moyenne', 0) for s in seances_recentes if s.get('douleur_moyenne')]
    compliance = [s.get('compliance', 0) for s in seances_recentes if s.get('compliance')]
    
    if not douleurs or not compliance:
        return "Données insuffisantes"
    
    douleur_moy = sum(douleurs) / len(douleurs)
    compliance_moy = sum(compliance) / len(compliance)
    
    suggestions = []
    
    if douleur_moy > seuils.get('douleur_max', 6):
        suggestions.append("⚠️ Réduire l'intensité - Douleur élevée")
    elif douleur_moy < seuils.get('douleur_min', 2) and compliance_moy > 0.9:
        suggestions.append("⬆️ Augmenter l'intensité - Douleur faible et bonne compliance")
    
    if compliance_moy < seuils.get('compliance_min', 0.7):
        suggestions.append("🎯 Simplifier le programme - Compliance faible")
    elif compliance_moy > seuils.get('compliance_max', 0.95):
        suggestions.append("📈 Complexifier le programme - Excellente compliance")
    
    return " | ".join(suggestions) if suggestions else "✅ Programme adapté"

# Nouveaux modèles pour remplacer les anciens

class DocumentGenere(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    type_document: str  # "compte_rendu_anamnese", "lettre_medecin", "programme_exercices"
    titre: str
    contenu: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Seance(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    date_seance: datetime
    exercices_realises: List[str]  # IDs des exercices
    douleur_avant: int  # 0-10
    douleur_apres: int  # 0-10
    observations: str
    progression: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SeanceCreate(BaseModel):
    patient_id: str
    date_seance: datetime
    exercices_realises: List[str]
    douleur_avant: int
    douleur_apres: int
    observations: str
    progression: str

# Routes Patients
@api_router.post("/patients", response_model=Patient)
async def create_patient(patient: PatientCreate):
    patient_dict = patient.dict()
    patient_obj = Patient(**patient_dict)
    await db.patients.insert_one(patient_obj.dict())
    return patient_obj

@api_router.get("/patients", response_model=List[Patient])
async def get_patients():
    patients = await db.patients.find().to_list(1000)
    return [Patient(**patient) for patient in patients]

@api_router.get("/patients/{patient_id}", response_model=Patient)
async def get_patient(patient_id: str):
    patient = await db.patients.find_one({"id": patient_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")
    return Patient(**patient)

@api_router.put("/patients/{patient_id}", response_model=Patient)
async def update_patient(patient_id: str, patient_update: PatientCreate):
    existing_patient = await db.patients.find_one({"id": patient_id})
    if not existing_patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")
    
    update_dict = patient_update.dict()
    await db.patients.update_one({"id": patient_id}, {"$set": update_dict})
    
    updated_patient = await db.patients.find_one({"id": patient_id})
    return Patient(**updated_patient)

@api_router.delete("/patients/{patient_id}")
async def delete_patient(patient_id: str):
    result = await db.patients.delete_one({"id": patient_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient non trouvé")
    return {"message": "Patient supprimé avec succès"}

# Routes Anamnèse
@api_router.post("/anamnese", response_model=Anamnese)
async def create_anamnese(anamnese: AnamneseCreate):
    anamnese_dict = anamnese.dict()
    anamnese_obj = Anamnese(**anamnese_dict)
    await db.anamneses.insert_one(anamnese_obj.dict())
    return anamnese_obj

@api_router.get("/anamnese/patient/{patient_id}", response_model=List[Anamnese])
async def get_anamneses_by_patient(patient_id: str):
    anamneses = await db.anamneses.find({"patient_id": patient_id}).to_list(1000)
    return [Anamnese(**anamnese) for anamnese in anamneses]

@api_router.get("/anamnese/{anamnese_id}", response_model=Anamnese)
async def get_anamnese(anamnese_id: str):
    anamnese = await db.anamneses.find_one({"id": anamnese_id})
    if not anamnese:
        raise HTTPException(status_code=404, detail="Anamnèse non trouvée")
    return Anamnese(**anamnese)

# Routes Bilan Clinique
@api_router.post("/bilan", response_model=BilanClinique)
async def create_bilan(bilan: BilanCliniqueCreate):
    bilan_dict = bilan.dict()
    bilan_obj = BilanClinique(**bilan_dict)
    await db.bilans.insert_one(bilan_obj.dict())
    return bilan_obj

@api_router.get("/bilan/patient/{patient_id}", response_model=List[BilanClinique])
async def get_bilans_by_patient(patient_id: str):
    bilans = await db.bilans.find({"patient_id": patient_id}).to_list(1000)
    return [BilanClinique(**bilan) for bilan in bilans]

# Route pour réinitialiser les exercices de base
@api_router.post("/init-exercises")
async def reinitialize_exercises():
    # Supprimer tous les exercices existants
    await db.exercices.delete_many({})
    
    # Recréer les exercices de base
    sample_exercises = [
        # Exercices Genou
        {
            "id": str(uuid.uuid4()),
            "nom": "Flexion/Extension du genou",
            "description": "Mouvement de flexion et extension du genou en position assise",
            "type_exercice": "mobilite",
            "zone_corporelle": "genou",
            "difficulte": 2,
            "duree_minutes": 10,
            "repetitions": "3 séries de 15",
            "series": 3,
            "materiel_requis": "Chaise",
            "url_video": "https://www.youtube.com/watch?v=example1",
            "consignes_specifiques": "Mouvement lent et contrôlé, ne pas forcer en cas de douleur",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "nom": "Renforcement quadriceps",
            "description": "Exercice de renforcement du quadriceps en contraction isométrique",
            "type_exercice": "renforcement",
            "zone_corporelle": "genou",
            "difficulte": 3,
            "duree_minutes": 15,
            "repetitions": "5 séries de 10 secondes",
            "series": 5,
            "materiel_requis": "Tapis de sol",
            "url_video": "https://www.youtube.com/watch?v=example2",
            "consignes_specifiques": "Maintenir la contraction 10 secondes, relâcher 5 secondes",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "nom": "Squats muraux",
            "description": "Squats avec appui dorsal contre le mur pour renforcement des quadriceps",
            "type_exercice": "renforcement",
            "zone_corporelle": "genou",
            "difficulte": 3,
            "duree_minutes": 12,
            "repetitions": "3 séries de 12",
            "series": 3,
            "materiel_requis": "Mur",
            "url_video": "https://www.youtube.com/watch?v=wall-squats",
            "consignes_specifiques": "Descendre jusqu'à 90° de flexion, maintenir 2 secondes",
            "created_at": datetime.now(timezone.utc)
        },
        
        # Exercices Cuisse
        {
            "id": str(uuid.uuid4()),
            "nom": "Étirement des ischio-jambiers",
            "description": "Étirement passif des muscles ischio-jambiers",
            "type_exercice": "etirement",
            "zone_corporelle": "cuisse",
            "difficulte": 1,
            "duree_minutes": 5,
            "repetitions": "3 fois 30 secondes",
            "series": 3,
            "materiel_requis": "Tapis de sol",
            "url_video": "https://www.youtube.com/watch?v=example3",
            "consignes_specifiques": "Maintenir l'étirement sans rebond, respirer profondément",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "nom": "Renforcement des fessiers",
            "description": "Ponts de hanche pour renforcer les muscles fessiers",
            "type_exercice": "renforcement",
            "zone_corporelle": "cuisse",
            "difficulte": 2,
            "duree_minutes": 10,
            "repetitions": "3 séries de 15",
            "series": 3,
            "materiel_requis": "Tapis de sol",
            "url_video": "https://www.youtube.com/watch?v=hip-bridges",
            "consignes_specifiques": "Serrer les fessiers en haut, maintenir 2 secondes",
            "created_at": datetime.now(timezone.utc)
        },
        
        # Exercices Épaule
        {
            "id": str(uuid.uuid4()),
            "nom": "Mobilisation de l'épaule",
            "description": "Mobilisation passive et active de l'articulation de l'épaule",
            "type_exercice": "mobilite",
            "zone_corporelle": "epaule",
            "difficulte": 2,
            "duree_minutes": 12,
            "repetitions": "3 séries de 10",
            "series": 3,
            "materiel_requis": "Aucun",
            "url_video": "https://www.youtube.com/watch?v=example4",
            "consignes_specifiques": "Commencer par des mouvements de faible amplitude",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "nom": "Renforcement de la coiffe des rotateurs",
            "description": "Exercices avec élastique pour renforcer les rotateurs de l'épaule",
            "type_exercice": "renforcement",
            "zone_corporelle": "epaule",
            "difficulte": 3,
            "duree_minutes": 15,
            "repetitions": "3 séries de 12",
            "series": 3,
            "materiel_requis": "Élastique",
            "url_video": "https://www.youtube.com/watch?v=rotator-cuff",
            "consignes_specifiques": "Maintenir le coude contre le corps, mouvement lent",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "nom": "Étirement capsulaire postérieur",
            "description": "Étirement de la capsule postérieure de l'épaule",
            "type_exercice": "etirement",
            "zone_corporelle": "epaule",
            "difficulte": 2,
            "duree_minutes": 8,
            "repetitions": "3 fois 30 secondes",
            "series": 3,
            "materiel_requis": "Aucun",
            "url_video": "https://www.youtube.com/watch?v=shoulder-stretch",
            "consignes_specifiques": "Étirement doux, ne pas forcer si douleur",
            "created_at": datetime.now(timezone.utc)
        },
        
        # Exercices Cheville
        {
            "id": str(uuid.uuid4()),
            "nom": "Proprioception cheville",
            "description": "Exercice d'équilibre sur un pied pour améliorer la proprioception",
            "type_exercice": "proprioception",
            "zone_corporelle": "cheville",
            "difficulte": 3,
            "duree_minutes": 8,
            "repetitions": "3 séries de 30 secondes",
            "series": 3,
            "materiel_requis": "Coussin d'équilibre (optionnel)",
            "url_video": "https://www.youtube.com/watch?v=example5",
            "consignes_specifiques": "Garder les yeux ouverts puis fermés, progresser vers surfaces instables",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "nom": "Mobilisation cheville",
            "description": "Mobilisations passives et actives de la cheville",
            "type_exercice": "mobilite",
            "zone_corporelle": "cheville",
            "difficulte": 1,
            "duree_minutes": 10,
            "repetitions": "3 séries de 15",
            "series": 3,
            "materiel_requis": "Aucun",
            "url_video": "https://www.youtube.com/watch?v=ankle-mobility",
            "consignes_specifiques": "Mouvements dans tous les plans, amplitude maximale sans douleur",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "nom": "Renforcement des mollets",
            "description": "Élévations sur la pointe des pieds pour renforcer les mollets",
            "type_exercice": "renforcement",
            "zone_corporelle": "cheville",
            "difficulte": 2,
            "duree_minutes": 8,
            "repetitions": "3 séries de 20",
            "series": 3,
            "materiel_requis": "Marche ou surface surélevée",
            "url_video": "https://www.youtube.com/watch?v=calf-raises",
            "consignes_specifiques": "Montée rapide, descente lente et contrôlée",
            "created_at": datetime.now(timezone.utc)
        },
        
        # Exercices Dos
        {
            "id": str(uuid.uuid4()),
            "nom": "Étirement du dos (Chat-Chameau)",
            "description": "Mobilisation de la colonne vertébrale en flexion-extension",
            "type_exercice": "mobilite",
            "zone_corporelle": "dos",
            "difficulte": 1,
            "duree_minutes": 8,
            "repetitions": "3 séries de 10",
            "series": 3,
            "materiel_requis": "Tapis de sol",
            "url_video": "https://www.youtube.com/watch?v=cat-cow",
            "consignes_specifiques": "Mouvements lents et contrôlés, synchroniser avec la respiration",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "nom": "Renforcement du core",
            "description": "Planche statique pour renforcer les muscles profonds du tronc",
            "type_exercice": "renforcement",
            "zone_corporelle": "dos",
            "difficulte": 4,
            "duree_minutes": 10,
            "repetitions": "3 séries de 30 secondes",
            "series": 3,
            "materiel_requis": "Tapis de sol",
            "url_video": "https://www.youtube.com/watch?v=plank",
            "consignes_specifiques": "Maintenir alignement tête-bassin, respiration continue",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "nom": "Étirement des psoas",
            "description": "Étirement du muscle psoas-iliaque",
            "type_exercice": "etirement",
            "zone_corporelle": "dos",
            "difficulte": 2,
            "duree_minutes": 8,
            "repetitions": "2 fois 45 secondes par côté",
            "series": 2,
            "materiel_requis": "Tapis de sol",
            "url_video": "https://www.youtube.com/watch?v=psoas-stretch",
            "consignes_specifiques": "Étirement en fente, pousser le bassin vers l'avant",
            "created_at": datetime.now(timezone.utc)
        },
        
        # Exercices Cervicales
        {
            "id": str(uuid.uuid4()),
            "nom": "Mobilisation cervicale douce",
            "description": "Mouvements doux de rotation et flexion des cervicales",
            "type_exercice": "mobilite",
            "zone_corporelle": "cervicales",
            "difficulte": 1,
            "duree_minutes": 8,
            "repetitions": "5 répétitions dans chaque direction",
            "series": 2,
            "materiel_requis": "Aucun",
            "url_video": "https://www.youtube.com/watch?v=neck-mobility",
            "consignes_specifiques": "Mouvements très lents, arrêter si vertiges ou douleurs",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "id": str(uuid.uuid4()),
            "nom": "Renforcement cervical isométrique",
            "description": "Contractions isométriques pour les muscles cervicaux",
            "type_exercice": "renforcement",
            "zone_corporelle": "cervicales",
            "difficulte": 2,
            "duree_minutes": 10,
            "repetitions": "5 séries de 10 secondes",
            "series": 5,
            "materiel_requis": "Aucun",
            "url_video": "https://www.youtube.com/watch?v=neck-strengthening",
            "consignes_specifiques": "Résistance douce avec la main, pas de mouvement",
            "created_at": datetime.now(timezone.utc)
        }
    ]
    
    await db.exercices.insert_many(sample_exercises)
    
    return {"message": f"Base d'exercices réinitialisée avec {len(sample_exercises)} exercices"}

# Routes Exercices
@api_router.post("/exercices", response_model=Exercice)
async def create_exercice(exercice: ExerciceCreate):
    exercice_dict = exercice.dict()
    exercice_obj = Exercice(**exercice_dict)
    await db.exercices.insert_one(exercice_obj.dict())
    return exercice_obj

@api_router.get("/exercices", response_model=List[Exercice])
async def get_exercices():
    exercices = await db.exercices.find().to_list(1000)
    return [Exercice(**exercice) for exercice in exercices]

@api_router.get("/exercices/type/{type_exercice}", response_model=List[Exercice])
async def get_exercices_by_type(type_exercice: str):
    exercices = await db.exercices.find({"type_exercice": type_exercice}).to_list(1000)
    return [Exercice(**exercice) for exercice in exercices]

@api_router.get("/exercices/zone/{zone_corporelle}", response_model=List[Exercice])
async def get_exercices_by_zone(zone_corporelle: str):
    exercices = await db.exercices.find({"zone_corporelle": zone_corporelle}).to_list(1000)
    return [Exercice(**exercice) for exercice in exercices]

# Routes Programmes d'exercices avancés
@api_router.post("/programmes", response_model=Programme)
async def create_programme(programme: ProgrammeCreate):
    programme_dict = programme.dict()
    programme_obj = Programme(**programme_dict)
    await db.programmes.insert_one(programme_obj.dict())
    return programme_obj

@api_router.get("/programmes/patient/{patient_id}", response_model=List[Programme])
async def get_programmes_by_patient(patient_id: str):
    programmes = await db.programmes.find({"patient_id": patient_id}).to_list(1000)
    return [Programme(**programme) for programme in programmes]

@api_router.get("/programmes/{programme_id}", response_model=Programme)
async def get_programme(programme_id: str):
    programme = await db.programmes.find_one({"id": programme_id})
    if not programme:
        raise HTTPException(status_code=404, detail="Programme non trouvé")
    return Programme(**programme)

@api_router.put("/programmes/{programme_id}", response_model=Programme)
async def update_programme(programme_id: str, programme_update: ProgrammeCreate):
    existing_programme = await db.programmes.find_one({"id": programme_id})
    if not existing_programme:
        raise HTTPException(status_code=404, detail="Programme non trouvé")
    
    update_dict = programme_update.dict()
    await db.programmes.update_one({"id": programme_id}, {"$set": update_dict})
    
    updated_programme = await db.programmes.find_one({"id": programme_id})
    return Programme(**updated_programme)

# Routes Séances Détaillées
@api_router.post("/seances-detail", response_model=SeanceDetail)
async def create_seance_detail(seance: SeanceDetailCreate):
    seance_dict = seance.dict()
    seance_obj = SeanceDetail(**seance_dict)
    await db.seances_detail.insert_one(seance_obj.dict())
    return seance_obj

@api_router.get("/seances-detail/programme/{programme_id}", response_model=List[SeanceDetail])
async def get_seances_by_programme(programme_id: str):
    seances = await db.seances_detail.find({"programme_id": programme_id}).to_list(1000)
    return [SeanceDetail(**seance) for seance in seances]

@api_router.get("/seances-detail/patient/{patient_id}", response_model=List[SeanceDetail])
async def get_seances_detail_by_patient(patient_id: str):
    seances = await db.seances_detail.find({"patient_id": patient_id}).to_list(1000)
    return [SeanceDetail(**seance) for seance in seances]

@api_router.put("/seances-detail/{seance_id}", response_model=SeanceDetail)
async def update_seance_detail(seance_id: str, seance_update: SeanceUpdate):
    existing_seance = await db.seances_detail.find_one({"id": seance_id})
    if not existing_seance:
        raise HTTPException(status_code=404, detail="Séance non trouvée")
    
    update_dict = seance_update.dict(exclude_unset=True)
    
    # Calculer automatiquement la charge totale et volume
    if 'exercices_realises' in update_dict:
        charge_totale = 0
        volume_total = 0
        
        for exercice in update_dict['exercices_realises']:
            charge_exercice = calculer_charge_exercice(exercice)
            charge_totale += charge_exercice
            
            reps = exercice.get('repetitions_reelles', 0)
            series = exercice.get('series_reelles', 1)
            volume_total += reps * series
        
        update_dict['charge_totale'] = charge_totale
        update_dict['volume_total'] = volume_total
        
        # Calculer compliance
        exercices_prevus = existing_seance.get('exercices_prevus', [])
        if exercices_prevus:
            compliance = len(update_dict['exercices_realises']) / len(exercices_prevus)
            update_dict['compliance'] = min(compliance, 1.0)
    
    # Marquer la séance comme terminée si on a des exercices réalisés
    if 'exercices_realises' in update_dict and update_dict['exercices_realises']:
        update_dict['statut'] = 'termine'
    
    await db.seances_detail.update_one({"id": seance_id}, {"$set": update_dict})
    
    updated_seance = await db.seances_detail.find_one({"id": seance_id})
    return SeanceDetail(**updated_seance)

# Route pour calculer les métriques de progression
@api_router.post("/metriques/calculer/{programme_id}")
async def calculer_metriques_progression(programme_id: str):
    # Récupérer toutes les séances du programme
    seances = await db.seances_detail.find({"programme_id": programme_id, "statut": "termine"}).to_list(1000)
    
    if not seances:
        return {"message": "Aucune séance terminée trouvée"}
    
    # Grouper par semaine
    seances_par_semaine = {}
    for seance in seances:
        semaine = seance['numero_seance'] // 3 + 1  # Approximation 3 séances/semaine
        if semaine not in seances_par_semaine:
            seances_par_semaine[semaine] = []
        seances_par_semaine[semaine].append(seance)
    
    # Calculer métriques pour chaque semaine
    programme = await db.programmes.find_one({"id": programme_id})
    if not programme:
        raise HTTPException(status_code=404, detail="Programme non trouvé")
    
    metriques = []
    for semaine, seances_semaine in seances_par_semaine.items():
        charge_moyenne = sum(s.get('charge_totale', 0) for s in seances_semaine) / len(seances_semaine)
        volume_moyen = sum(s.get('volume_total', 0) for s in seances_semaine) / len(seances_semaine)
        
        douleurs = [s.get('douleur_moyenne') for s in seances_semaine if s.get('douleur_moyenne') is not None]
        douleur_moyenne = sum(douleurs) / len(douleurs) if douleurs else 0
        
        compliances = [s.get('compliance') for s in seances_semaine if s.get('compliance') is not None]
        compliance_moyenne = sum(compliances) / len(compliances) if compliances else 0
        
        # Suggérer adaptation
        seuils = {'douleur_max': 6, 'douleur_min': 2, 'compliance_min': 0.7, 'compliance_max': 0.95}
        adaptation = suggerer_adaptation(seances_semaine, seuils)
        
        metrique = MetriqueProgression(
            patient_id=programme['patient_id'],
            programme_id=programme_id,
            semaine=semaine,
            charge_moyenne=charge_moyenne,
            volume_moyen=int(volume_moyen),
            douleur_moyenne=douleur_moyenne,
            compliance_moyenne=compliance_moyenne,
            adaptation_auto_appliquee=adaptation
        )
        
        await db.metriques.insert_one(metrique.dict())
        metriques.append(metrique)
    
    return {"message": f"Métriques calculées pour {len(metriques)} semaines", "metriques": metriques}

@api_router.get("/metriques/patient/{patient_id}", response_model=List[MetriqueProgression])
async def get_metriques_by_patient(patient_id: str):
    metriques = await db.metriques.find({"patient_id": patient_id}).to_list(1000)
    return [MetriqueProgression(**metrique) for metrique in metriques]

# Route de suggestion d'adaptation
@api_router.post("/programmes/{programme_id}/suggerer-adaptation")
async def suggerer_adaptation_programme(programme_id: str):
    # Récupérer les 3 dernières séances
    seances_recentes = await db.seances_detail.find(
        {"programme_id": programme_id, "statut": "termine"}
    ).sort("date_seance", -1).limit(3).to_list(3)
    
    if not seances_recentes:
        return {"suggestion": "Pas assez de données pour suggérer une adaptation"}
    
    seuils = {'douleur_max': 6, 'douleur_min': 2, 'compliance_min': 0.7, 'compliance_max': 0.95}
    suggestion = suggerer_adaptation(seances_recentes, seuils)
    
    return {"suggestion": suggestion, "basee_sur": f"{len(seances_recentes)} séances récentes"}

# Routes Séances
@api_router.post("/seances", response_model=Seance)
async def create_seance(seance: SeanceCreate):
    seance_dict = seance.dict()
    seance_obj = Seance(**seance_dict)
    await db.seances.insert_one(seance_obj.dict())
    return seance_obj

@api_router.get("/seances/patient/{patient_id}", response_model=List[Seance])
async def get_seances_by_patient(patient_id: str):
    seances = await db.seances.find({"patient_id": patient_id}).to_list(1000)
    return [Seance(**seance) for seance in seances]

# Routes Génération de documents avec IA
@api_router.post("/generate/compte-rendu-anamnese/{patient_id}")
async def generate_compte_rendu_anamnese(patient_id: str):
    # Récupérer les données du patient et anamnèse
    patient = await db.patients.find_one({"id": patient_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")
    
    anamneses = await db.anamneses.find({"patient_id": patient_id}).to_list(1000)
    if not anamneses:
        raise HTTPException(status_code=404, detail="Aucune anamnèse trouvée pour ce patient")
    
    anamnese = anamneses[-1]  # Prendre la plus récente
    
    # Générer le compte-rendu avec l'IA
    chat = await get_llm_chat()
    prompt = f"""
    Génère un compte-rendu d'anamnèse professionnel pour le patient suivant :
    
    Patient : {patient['prenom']} {patient['nom']}, {patient['age']} ans
    Pathologie : {patient['pathologie']}
    Prescription médicale : {patient['prescription_medicale']}
    
    Anamnèse :
    - Niveau de douleur : {anamnese['douleur_niveau']}/10
    - Type de douleur : {anamnese['douleur_type']}
    - Localisation : {anamnese['douleur_localisation']}
    - Début des symptômes : {anamnese['debut_symptomes']}
    - Facteurs déclenchants : {anamnese['facteurs_declenchants']}
    - Activités gênantes : {', '.join(anamnese['activites_genantes'])}
    - Antécédents médicaux : {anamnese['antecedents_medicaux']}
    - Traitements actuels : {anamnese['traitements_actuels']}
    - Objectifs du patient : {anamnese['objectifs_patient']}
    - Notes supplémentaires : {anamnese.get('notes_supplementaires', 'Aucune')}
    
    Génère un compte-rendu structuré avec :
    1. Présentation du patient
    2. Motif de consultation
    3. Histoire de la maladie
    4. Analyse fonctionnelle
    5. Objectifs du traitement
    6. Conclusion
    
    Le document doit être professionnel et conforme aux standards de kinésithérapie.
    """
    
    user_message = UserMessage(text=prompt)
    response = await chat.send_message(user_message)
    
    # Sauvegarder le document généré
    document = DocumentGenere(
        patient_id=patient_id,
        type_document="compte_rendu_anamnese",
        titre=f"Compte-rendu d'anamnèse - {patient['prenom']} {patient['nom']}",
        contenu=response
    )
    await db.documents.insert_one(document.dict())
    
    return {"document": document, "contenu": response}

@api_router.post("/generate/lettre-medecin/{patient_id}")
async def generate_lettre_medecin(patient_id: str):
    # Récupérer toutes les données pertinentes
    patient = await db.patients.find_one({"id": patient_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")
    
    anamneses = await db.anamneses.find({"patient_id": patient_id}).to_list(1000)
    bilans = await db.bilans.find({"patient_id": patient_id}).to_list(1000)
    seances = await db.seances.find({"patient_id": patient_id}).to_list(1000)
    
    # Générer la lettre avec l'IA
    chat = await get_llm_chat()
    
    anamnese_info = ""
    if anamneses:
        last_anamnese = anamneses[-1]
        anamnese_info = f"Douleur {last_anamnese['douleur_niveau']}/10, {last_anamnese['douleur_type']}, localisation {last_anamnese['douleur_localisation']}"
    
    bilan_info = ""
    if bilans:
        last_bilan = bilans[-1]
        bilan_info = f"Diagnostic kinésithérapique : {last_bilan['diagnostic_kine']}"
    
    progression_info = ""
    if seances:
        progression_info = f"Nombre de séances réalisées : {len(seances)}"
    
    prompt = f"""
    Génère une lettre professionnelle destinée au médecin prescripteur pour le patient :
    
    Patient : {patient['prenom']} {patient['nom']}, {patient['age']} ans
    Pathologie : {patient['pathologie']}
    Prescription initiale : {patient['prescription_medicale']}
    
    Informations cliniques :
    {anamnese_info}
    {bilan_info}
    {progression_info}
    
    La lettre doit être formelle et structurée avec :
    1. En-tête et objet
    2. Rappel de la prescription
    3. Bilan de la prise en charge
    4. Évolution du patient
    5. Recommandations éventuelles
    6. Formule de politesse
    
    Utilise un ton professionnel médical approprié.
    """
    
    user_message = UserMessage(text=prompt)
    response = await chat.send_message(user_message)
    
    # Sauvegarder le document
    document = DocumentGenere(
        patient_id=patient_id,
        type_document="lettre_medecin",
        titre=f"Lettre au médecin - {patient['prenom']} {patient['nom']}",
        contenu=response
    )
    await db.documents.insert_one(document.dict())
    
    return {"document": document, "contenu": response}

# Route pour créer un PDF
@api_router.post("/export/pdf/{document_id}")
async def export_pdf(document_id: str):
    document = await db.documents.find_one({"id": document_id})
    if not document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    # Créer le PDF en mémoire
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # Titre
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        alignment=1  # Centré
    )
    story.append(Paragraph(document['titre'], title_style))
    story.append(Spacer(1, 12))
    
    # Contenu
    content_style = ParagraphStyle(
        'CustomContent',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=12,
        leftIndent=0,
        rightIndent=0
    )
    
    # Diviser le contenu en paragraphes
    paragraphs = document['contenu'].split('\n\n')
    for paragraph in paragraphs:
        if paragraph.strip():
            story.append(Paragraph(paragraph.strip(), content_style))
            story.append(Spacer(1, 6))
    
    # Date de génération
    story.append(Spacer(1, 20))
    date_style = ParagraphStyle(
        'DateStyle',
        parent=styles['Normal'],
        fontSize=8,
        alignment=2  # Aligné à droite
    )
    story.append(Paragraph(f"Document généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}", date_style))
    
    # Construire le PDF
    doc.build(story)
    
    # Retourner le PDF en base64
    buffer.seek(0)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
    
    return {
        "filename": f"{document['titre'].replace(' ', '_')}.pdf",
        "pdf_data": pdf_base64,
        "content_type": "application/pdf"
    }

# Route pour modifier un document avec l'IA
@api_router.post("/modify-document/{document_id}")
async def modify_document_with_ai(document_id: str, request: Dict[str, Any]):
    document = await db.documents.find_one({"id": document_id})
    if not document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    instructions = request.get('instructions', '')
    contenu_actuel = request.get('contenu_actuel', document.get('contenu', ''))
    
    if not instructions:
        raise HTTPException(status_code=400, detail="Instructions de modification requises")
    
    # Générer le contenu modifié avec l'IA
    chat = await get_llm_chat()
    prompt = f"""
    Tu es un expert en rédaction médicale. Modifie le document médical suivant selon les instructions données.
    
    DOCUMENT ACTUEL :
    {contenu_actuel}
    
    INSTRUCTIONS DE MODIFICATION :
    {instructions}
    
    CONSIGNES :
    - Conserve la structure et le professionnalisme du document
    - Applique uniquement les modifications demandées
    - Garde le vocabulaire médical approprié
    - Maintiens la cohérence avec les données patient
    - Retourne le document complet modifié
    """
    
    user_message = UserMessage(text=prompt)
    response = await chat.send_message(user_message)
    
    return {"contenu_modifie": response, "instructions_appliquees": instructions}

# Route pour mettre à jour un document
@api_router.put("/documents/{document_id}")
async def update_document(document_id: str, request: Dict[str, Any]):
    document = await db.documents.find_one({"id": document_id})
    if not document:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    update_data = {
        "contenu": request.get('contenu', document.get('contenu')),
        "updated_at": datetime.now(timezone.utc)
    }
    
    await db.documents.update_one({"id": document_id}, {"$set": update_data})
    
    updated_document = await db.documents.find_one({"id": document_id})
    return DocumentGenere(**updated_document)

# Routes Suggestions
@api_router.post("/suggestions", response_model=Suggestion)
async def create_suggestion(suggestion: SuggestionCreate):
    suggestion_dict = suggestion.dict()
    suggestion_obj = Suggestion(**suggestion_dict)
    await db.suggestions.insert_one(suggestion_obj.dict())
    return suggestion_obj

@api_router.get("/suggestions", response_model=List[Suggestion])
async def get_suggestions():
    suggestions = await db.suggestions.find().sort("created_at", -1).to_list(1000)
    return [Suggestion(**suggestion) for suggestion in suggestions]

@api_router.get("/suggestions/{suggestion_id}", response_model=Suggestion)
async def get_suggestion(suggestion_id: str):
    suggestion = await db.suggestions.find_one({"id": suggestion_id})
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion non trouvée")
    return Suggestion(**suggestion)

@api_router.put("/suggestions/{suggestion_id}/status")
async def update_suggestion_status(suggestion_id: str, status_update: Dict[str, str]):
    suggestion = await db.suggestions.find_one({"id": suggestion_id})
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion non trouvée")
    
    new_status = status_update.get('statut')
    if new_status not in ['en_attente', 'approuve', 'en_cours', 'termine', 'rejete']:
        raise HTTPException(status_code=400, detail="Statut invalide")
    
    update_data = {'statut': new_status}
    
    if new_status == 'approuve':
        update_data['date_approbation'] = datetime.now(timezone.utc)
    elif new_status == 'termine':
        update_data['date_completion'] = datetime.now(timezone.utc)
    
    await db.suggestions.update_one({"id": suggestion_id}, {"$set": update_data})
    
    updated_suggestion = await db.suggestions.find_one({"id": suggestion_id})
    return Suggestion(**updated_suggestion)

# Routes Documents
@api_router.get("/documents/patient/{patient_id}", response_model=List[DocumentGenere])
async def get_documents_by_patient(patient_id: str):
    documents = await db.documents.find({"patient_id": patient_id}).to_list(1000)
    return [DocumentGenere(**doc) for doc in documents]

# Route de base
@api_router.get("/")
async def root():
    return {"message": "KineTrack API - Application de kinésithérapie", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Initialize database with sample exercises
@app.on_event("startup")
async def initialize_database():
    # Vérifier si la base d'exercices existe déjà
    existing_exercises = await db.exercices.count_documents({})
    if existing_exercises == 0:
        # Créer des exercices de base
        sample_exercises = [
            # Exercices Genou
            {
                "id": str(uuid.uuid4()),
                "nom": "Flexion/Extension du genou",
                "description": "Mouvement de flexion et extension du genou en position assise",
                "type_exercice": "mobilite",
                "zone_corporelle": "genou",
                "difficulte": 2,
                "duree_minutes": 10,
                "repetitions": "3 séries de 15",
                "series": 3,
                "materiel_requis": "Chaise",
                "url_video": "https://www.youtube.com/watch?v=example1",
                "consignes_specifiques": "Mouvement lent et contrôlé, ne pas forcer en cas de douleur",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Renforcement quadriceps",
                "description": "Exercice de renforcement du quadriceps en contraction isométrique",
                "type_exercice": "renforcement",
                "zone_corporelle": "genou",
                "difficulte": 3,
                "duree_minutes": 15,
                "repetitions": "5 séries de 10 secondes",
                "series": 5,
                "materiel_requis": "Tapis de sol",
                "url_video": "https://www.youtube.com/watch?v=example2",
                "consignes_specifiques": "Maintenir la contraction 10 secondes, relâcher 5 secondes",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Squats muraux",
                "description": "Squats avec appui dorsal contre le mur pour renforcement des quadriceps",
                "type_exercice": "renforcement",
                "zone_corporelle": "genou",
                "difficulte": 3,
                "duree_minutes": 12,
                "repetitions": "3 séries de 12",
                "series": 3,
                "materiel_requis": "Mur",
                "url_video": "https://www.youtube.com/watch?v=wall-squats",
                "consignes_specifiques": "Descendre jusqu'à 90° de flexion, maintenir 2 secondes",
                "created_at": datetime.now(timezone.utc)
            },
            
            # Exercices Cuisse
            {
                "id": str(uuid.uuid4()),
                "nom": "Étirement des ischio-jambiers",
                "description": "Étirement passif des muscles ischio-jambiers",
                "type_exercice": "etirement",
                "zone_corporelle": "cuisse",
                "difficulte": 1,
                "duree_minutes": 5,
                "repetitions": "3 fois 30 secondes",
                "series": 3,
                "materiel_requis": "Tapis de sol",
                "url_video": "https://www.youtube.com/watch?v=example3",
                "consignes_specifiques": "Maintenir l'étirement sans rebond, respirer profondément",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Renforcement des fessiers",
                "description": "Ponts de hanche pour renforcer les muscles fessiers",
                "type_exercice": "renforcement",
                "zone_corporelle": "cuisse",
                "difficulte": 2,
                "duree_minutes": 10,
                "repetitions": "3 séries de 15",
                "series": 3,
                "materiel_requis": "Tapis de sol",
                "url_video": "https://www.youtube.com/watch?v=hip-bridges",
                "consignes_specifiques": "Serrer les fessiers en haut, maintenir 2 secondes",
                "created_at": datetime.now(timezone.utc)
            },
            
            # Exercices Épaule
            {
                "id": str(uuid.uuid4()),
                "nom": "Mobilisation de l'épaule",
                "description": "Mobilisation passive et active de l'articulation de l'épaule",
                "type_exercice": "mobilite",
                "zone_corporelle": "epaule",
                "difficulte": 2,
                "duree_minutes": 12,
                "repetitions": "3 séries de 10",
                "series": 3,
                "materiel_requis": "Aucun",
                "url_video": "https://www.youtube.com/watch?v=example4",
                "consignes_specifiques": "Commencer par des mouvements de faible amplitude",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Renforcement de la coiffe des rotateurs",
                "description": "Exercices avec élastique pour renforcer les rotateurs de l'épaule",
                "type_exercice": "renforcement",
                "zone_corporelle": "epaule",
                "difficulte": 3,
                "duree_minutes": 15,
                "repetitions": "3 séries de 12",
                "series": 3,
                "materiel_requis": "Élastique",
                "url_video": "https://www.youtube.com/watch?v=rotator-cuff",
                "consignes_specifiques": "Maintenir le coude contre le corps, mouvement lent",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Étirement capsulaire postérieur",
                "description": "Étirement de la capsule postérieure de l'épaule",
                "type_exercice": "etirement",
                "zone_corporelle": "epaule",
                "difficulte": 2,
                "duree_minutes": 8,
                "repetitions": "3 fois 30 secondes",
                "series": 3,
                "materiel_requis": "Aucun",
                "url_video": "https://www.youtube.com/watch?v=shoulder-stretch",
                "consignes_specifiques": "Étirement doux, ne pas forcer si douleur",
                "created_at": datetime.now(timezone.utc)
            },
            
            # Exercices Cheville
            {
                "id": str(uuid.uuid4()),
                "nom": "Proprioception cheville",
                "description": "Exercice d'équilibre sur un pied pour améliorer la proprioception",
                "type_exercice": "proprioception",
                "zone_corporelle": "cheville",
                "difficulte": 3,
                "duree_minutes": 8,
                "repetitions": "3 séries de 30 secondes",
                "series": 3,
                "materiel_requis": "Coussin d'équilibre (optionnel)",
                "url_video": "https://www.youtube.com/watch?v=example5",
                "consignes_specifiques": "Garder les yeux ouverts puis fermés, progresser vers surfaces instables",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Mobilisation cheville",
                "description": "Mobilisations passives et actives de la cheville",
                "type_exercice": "mobilite",
                "zone_corporelle": "cheville",
                "difficulte": 1,
                "duree_minutes": 10,
                "repetitions": "3 séries de 15",
                "series": 3,
                "materiel_requis": "Aucun",
                "url_video": "https://www.youtube.com/watch?v=ankle-mobility",
                "consignes_specifiques": "Mouvements dans tous les plans, amplitude maximale sans douleur",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Renforcement des mollets",
                "description": "Élévations sur la pointe des pieds pour renforcer les mollets",
                "type_exercice": "renforcement",
                "zone_corporelle": "cheville",
                "difficulte": 2,
                "duree_minutes": 8,
                "repetitions": "3 séries de 20",
                "series": 3,
                "materiel_requis": "Marche ou surface surélevée",
                "url_video": "https://www.youtube.com/watch?v=calf-raises",
                "consignes_specifiques": "Montée rapide, descente lente et contrôlée",
                "created_at": datetime.now(timezone.utc)
            },
            
            # Exercices Dos
            {
                "id": str(uuid.uuid4()),
                "nom": "Étirement du dos (Chat-Chameau)",
                "description": "Mobilisation de la colonne vertébrale en flexion-extension",
                "type_exercice": "mobilite",
                "zone_corporelle": "dos",
                "difficulte": 1,
                "duree_minutes": 8,
                "repetitions": "3 séries de 10",
                "series": 3,
                "materiel_requis": "Tapis de sol",
                "url_video": "https://www.youtube.com/watch?v=cat-cow",
                "consignes_specifiques": "Mouvements lents et contrôlés, synchroniser avec la respiration",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Renforcement du core",
                "description": "Planche statique pour renforcer les muscles profonds du tronc",
                "type_exercice": "renforcement",
                "zone_corporelle": "dos",
                "difficulte": 4,
                "duree_minutes": 10,
                "repetitions": "3 séries de 30 secondes",
                "series": 3,
                "materiel_requis": "Tapis de sol",
                "url_video": "https://www.youtube.com/watch?v=plank",
                "consignes_specifiques": "Maintenir alignement tête-bassin, respiration continue",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Étirement des psoas",
                "description": "Étirement du muscle psoas-iliaque",
                "type_exercice": "etirement",
                "zone_corporelle": "dos",
                "difficulte": 2,
                "duree_minutes": 8,
                "repetitions": "2 fois 45 secondes par côté",
                "series": 2,
                "materiel_requis": "Tapis de sol",
                "url_video": "https://www.youtube.com/watch?v=psoas-stretch",
                "consignes_specifiques": "Étirement en fente, pousser le bassin vers l'avant",
                "created_at": datetime.now(timezone.utc)
            },
            
            # Exercices Bras
            {
                "id": str(uuid.uuid4()),
                "nom": "Flexion/Extension biceps",
                "description": "Exercice de renforcement des biceps avec haltères ou élastique",
                "type_exercice": "renforcement",
                "zone_corporelle": "bras",
                "difficulte": 2,
                "duree_minutes": 12,
                "repetitions": "3 séries de 12",
                "series": 3,
                "materiel_requis": "Haltères ou élastique",
                "url_video": "https://www.youtube.com/watch?v=biceps-curl",
                "consignes_specifiques": "Mouvement contrôlé, coude fixe contre le corps",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Extension triceps",
                "description": "Renforcement des triceps en extension au-dessus de la tête",
                "type_exercice": "renforcement",
                "zone_corporelle": "bras",
                "difficulte": 3,
                "duree_minutes": 10,
                "repetitions": "3 séries de 10",
                "series": 3,
                "materiel_requis": "Haltère",
                "url_video": "https://www.youtube.com/watch?v=triceps-extension",
                "consignes_specifiques": "Garder le coude stable, descente lente",
                "created_at": datetime.now(timezone.utc)
            },
            
            # Exercices Coude
            {
                "id": str(uuid.uuid4()),
                "nom": "Mobilisation du coude",
                "description": "Mouvements de flexion-extension passive et active du coude",
                "type_exercice": "mobilite",
                "zone_corporelle": "coude",
                "difficulte": 1,
                "duree_minutes": 8,
                "repetitions": "3 séries de 15",
                "series": 3,
                "materiel_requis": "Aucun",
                "url_video": "https://www.youtube.com/watch?v=elbow-mobility",
                "consignes_specifiques": "Amplitude maximale sans douleur, mouvement lent",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Étirement épicondyliens",
                "description": "Étirement des muscles épicondyliens (tennis elbow)",
                "type_exercice": "etirement",
                "zone_corporelle": "coude",
                "difficulte": 2,
                "duree_minutes": 8,
                "repetitions": "3 fois 30 secondes",
                "series": 3,
                "materiel_requis": "Aucun",
                "url_video": "https://www.youtube.com/watch?v=tennis-elbow-stretch",
                "consignes_specifiques": "Étirement doux, maintenir sans rebond",
                "created_at": datetime.now(timezone.utc)
            },
            
            # Exercices Poignet
            {
                "id": str(uuid.uuid4()),
                "nom": "Flexion/Extension poignet",
                "description": "Mobilisation active du poignet en flexion et extension",
                "type_exercice": "mobilite",
                "zone_corporelle": "poignet",
                "difficulte": 1,
                "duree_minutes": 6,
                "repetitions": "3 séries de 20",
                "series": 3,
                "materiel_requis": "Aucun",
                "url_video": "https://www.youtube.com/watch?v=wrist-mobility",
                "consignes_specifiques": "Mouvements amples, lents et contrôlés",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Renforcement préhension",
                "description": "Exercices de serrage pour renforcer la préhension",
                "type_exercice": "renforcement",
                "zone_corporelle": "poignet",
                "difficulte": 2,
                "duree_minutes": 10,
                "repetitions": "3 séries de 15",
                "series": 3,
                "materiel_requis": "Balle de préhension",
                "url_video": "https://www.youtube.com/watch?v=grip-strength",
                "consignes_specifiques": "Serrage maximal 3 secondes, relâchement complet",
                "created_at": datetime.now(timezone.utc)
            },
            
            # Exercices Main
            {
                "id": str(uuid.uuid4()),
                "nom": "Mobilisation des doigts",
                "description": "Exercices de flexion-extension des articulations des doigts",
                "type_exercice": "mobilite",
                "zone_corporelle": "main",
                "difficulte": 1,
                "duree_minutes": 8,
                "repetitions": "10 répétitions par doigt",
                "series": 2,
                "materiel_requis": "Aucun",
                "url_video": "https://www.youtube.com/watch?v=finger-mobility",
                "consignes_specifiques": "Mobiliser chaque doigt individuellement",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Exercices de pincement",
                "description": "Renforcement de la pince pouce-index et autres pincements",
                "type_exercice": "renforcement",
                "zone_corporelle": "main",
                "difficulte": 2,
                "duree_minutes": 12,
                "repetitions": "3 séries de 10 par type",
                "series": 3,
                "materiel_requis": "Petits objets, pâte thérapeutique",
                "url_video": "https://www.youtube.com/watch?v=pinch-strength",
                "consignes_specifiques": "Varier les types de pincement : pulpe, latéral, tri-digital",
                "created_at": datetime.now(timezone.utc)
            },
            
            # Exercices Cervicales (déjà existants, je les laisse)
            {
                "id": str(uuid.uuid4()),
                "nom": "Mobilisation cervicale douce",
                "description": "Mouvements doux de rotation et flexion des cervicales",
                "type_exercice": "mobilite",
                "zone_corporelle": "cervicales",
                "difficulte": 1,
                "duree_minutes": 8,
                "repetitions": "5 répétitions dans chaque direction",
                "series": 2,
                "materiel_requis": "Aucun",
                "url_video": "https://www.youtube.com/watch?v=neck-mobility",
                "consignes_specifiques": "Mouvements très lents, arrêter si vertiges ou douleurs",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "nom": "Renforcement cervical isométrique",
                "description": "Contractions isométriques pour les muscles cervicaux",
                "type_exercice": "renforcement",
                "zone_corporelle": "cervicales",
                "difficulte": 2,
                "duree_minutes": 10,
                "repetitions": "5 séries de 10 secondes",
                "series": 5,
                "materiel_requis": "Aucun",
                "url_video": "https://www.youtube.com/watch?v=neck-strengthening",
                "consignes_specifiques": "Résistance douce avec la main, pas de mouvement",
                "created_at": datetime.now(timezone.utc)
            }
        ]
        
        await db.exercices.insert_many(sample_exercises)
        logger.info("Base d'exercices initialisée avec succès")