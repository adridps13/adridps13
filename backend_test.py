#!/usr/bin/env python3
"""
KineTrack Backend API Test Suite
Tests all endpoints for the physiotherapy application
"""

import requests
import sys
import json
from datetime import datetime
import time
from PIL import Image
import io

class KineTrackAPITester:
    def __init__(self, base_url="https://kinetrack-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_patient_id = None
        self.created_anamnese_id = None
        self.created_document_id = None
        self.created_exercice_id = None
        self.created_category_id = None
        self.created_rdv_id = None
        self.created_media_id = None
        self.created_media_id_2 = None
        self.created_media_id_3 = None

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED {details}")
        else:
            print(f"❌ {name} - FAILED {details}")
        return success

    def make_request(self, method, endpoint, data=None, expected_status=200):
        """Make HTTP request and return response"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)
            
            success = response.status_code == expected_status
            return success, response
        except Exception as e:
            print(f"Request error: {str(e)}")
            return False, None

    def test_api_root(self):
        """Test API root endpoint"""
        success, response = self.make_request('GET', '')
        if success and response:
            data = response.json()
            success = 'KineTrack API' in data.get('message', '')
        return self.log_test("API Root", success, f"- Status: {response.status_code if response else 'No response'}")

    def test_get_initial_exercices(self):
        """Test getting initial exercises (should be 5 pre-loaded)"""
        success, response = self.make_request('GET', 'exercices')
        if success and response:
            data = response.json()
            success = len(data) >= 5  # Should have at least 5 pre-loaded exercises
        return self.log_test("Get Initial Exercises", success, f"- Found {len(data) if success and response else 0} exercises")

    def test_create_patient(self):
        """Test patient creation"""
        patient_data = {
            "nom": "Dupont",
            "prenom": "Marie",
            "age": 45,
            "pathologie": "Gonarthrose genou droit",
            "prescription_medicale": "Rééducation fonctionnelle du genou droit, 20 séances",
            "telephone": "01 23 45 67 89",
            "email": "marie.dupont@example.com"
        }
        
        success, response = self.make_request('POST', 'patients', patient_data, 200)
        if success and response:
            data = response.json()
            self.created_patient_id = data.get('id')
            success = self.created_patient_id is not None
        
        return self.log_test("Create Patient", success, f"- Patient ID: {self.created_patient_id}")

    def test_get_patients(self):
        """Test getting all patients"""
        success, response = self.make_request('GET', 'patients')
        if success and response:
            data = response.json()
            success = len(data) >= 1  # Should have at least our created patient
        return self.log_test("Get All Patients", success, f"- Found {len(data) if success and response else 0} patients")

    def test_get_patient_by_id(self):
        """Test getting specific patient"""
        if not self.created_patient_id:
            return self.log_test("Get Patient by ID", False, "- No patient ID available")
        
        success, response = self.make_request('GET', f'patients/{self.created_patient_id}')
        if success and response:
            data = response.json()
            success = data.get('nom') == 'Dupont' and data.get('prenom') == 'Marie'
        
        return self.log_test("Get Patient by ID", success, f"- Retrieved patient: {data.get('prenom', '')} {data.get('nom', '') if success and response else 'None'}")

    def test_create_anamnese(self):
        """Test anamnèse creation"""
        if not self.created_patient_id:
            return self.log_test("Create Anamnèse", False, "- No patient ID available")
        
        anamnese_data = {
            "patient_id": self.created_patient_id,
            "douleur_niveau": 7,
            "douleur_type": "chronique",
            "douleur_localisation": "Genou droit face interne",
            "debut_symptomes": "Il y a 6 mois, progressif",
            "facteurs_declenchants": "Effort, position prolongée",
            "activites_genantes": ["Marche", "Montée d'escaliers", "Position assise prolongée"],
            "antecedents_medicaux": "Aucun antécédent particulier",
            "traitements_actuels": "Anti-inflammatoires ponctuels",
            "objectifs_patient": "Retrouver une marche normale et reprendre les activités quotidiennes",
            "notes_supplementaires": "Patient motivé, bonne compliance attendue"
        }
        
        success, response = self.make_request('POST', 'anamnese', anamnese_data, 200)
        if success and response:
            data = response.json()
            self.created_anamnese_id = data.get('id')
            success = self.created_anamnese_id is not None
        
        return self.log_test("Create Anamnèse", success, f"- Anamnèse ID: {self.created_anamnese_id}")

    def test_get_anamnese_by_patient(self):
        """Test getting anamnèse by patient ID"""
        if not self.created_patient_id:
            return self.log_test("Get Anamnèse by Patient", False, "- No patient ID available")
        
        success, response = self.make_request('GET', f'anamnese/patient/{self.created_patient_id}')
        if success and response:
            data = response.json()
            success = len(data) >= 1 and data[0].get('douleur_niveau') == 7
        
        return self.log_test("Get Anamnèse by Patient", success, f"- Found {len(data) if success and response else 0} anamnèse records")

    def test_create_exercice(self):
        """Test exercise creation"""
        exercice_data = {
            "nom": "Test Exercice Genou",
            "description": "Exercice de test pour le genou",
            "type_exercice": "renforcement",
            "zone_corporelle": "genou",
            "difficulte": 3,
            "duree_minutes": 15,
            "repetitions": "3 séries de 12",
            "series": 3,
            "materiel_requis": "Tapis de sol",
            "url_video": "https://www.youtube.com/watch?v=test123",
            "consignes_specifiques": "Mouvement lent et contrôlé"
        }
        
        success, response = self.make_request('POST', 'exercices', exercice_data, 200)
        if success and response:
            data = response.json()
            self.created_exercice_id = data.get('id')
            success = self.created_exercice_id is not None
        
        return self.log_test("Create Exercise", success, f"- Exercise ID: {self.created_exercice_id}")

    def test_get_exercices_by_type(self):
        """Test filtering exercises by type"""
        success, response = self.make_request('GET', 'exercices/type/renforcement')
        if success and response:
            data = response.json()
            success = len(data) >= 1  # Should have at least our created exercise
        
        return self.log_test("Get Exercises by Type", success, f"- Found {len(data) if success and response else 0} renforcement exercises")

    def test_get_exercices_by_zone(self):
        """Test filtering exercises by body zone"""
        success, response = self.make_request('GET', 'exercices/zone/genou')
        if success and response:
            data = response.json()
            success = len(data) >= 1  # Should have at least our created exercise
        
        return self.log_test("Get Exercises by Zone", success, f"- Found {len(data) if success and response else 0} genou exercises")

    def test_generate_compte_rendu_anamnese(self):
        """Test AI document generation for anamnèse report"""
        if not self.created_patient_id:
            return self.log_test("Generate Anamnèse Report", False, "- No patient ID available")
        
        print("🔄 Generating anamnèse report with AI (this may take a few seconds)...")
        success, response = self.make_request('POST', f'generate/compte-rendu-anamnese/{self.created_patient_id}', expected_status=200)
        
        if success and response:
            data = response.json()
            document = data.get('document', {})
            contenu = data.get('contenu', '')
            self.created_document_id = document.get('id')
            success = len(contenu) > 100 and 'Marie' in contenu and 'Dupont' in contenu
        
        return self.log_test("Generate Anamnèse Report", success, f"- Document ID: {self.created_document_id}, Content length: {len(contenu) if success and response else 0}")

    def test_generate_lettre_medecin(self):
        """Test AI document generation for doctor letter"""
        if not self.created_patient_id:
            return self.log_test("Generate Doctor Letter", False, "- No patient ID available")
        
        print("🔄 Generating doctor letter with AI (this may take a few seconds)...")
        success, response = self.make_request('POST', f'generate/lettre-medecin/{self.created_patient_id}', expected_status=200)
        
        if success and response:
            data = response.json()
            document = data.get('document', {})
            contenu = data.get('contenu', '')
            success = len(contenu) > 100 and ('Marie' in contenu or 'Dupont' in contenu)
        
        return self.log_test("Generate Doctor Letter", success, f"- Content length: {len(contenu) if success and response else 0}")

    def test_export_pdf(self):
        """Test PDF export functionality"""
        if not self.created_document_id:
            return self.log_test("Export PDF", False, "- No document ID available")
        
        success, response = self.make_request('POST', f'export/pdf/{self.created_document_id}', expected_status=200)
        
        if success and response:
            data = response.json()
            pdf_data = data.get('pdf_data', '')
            filename = data.get('filename', '')
            success = len(pdf_data) > 1000 and filename.endswith('.pdf')
        
        return self.log_test("Export PDF", success, f"- PDF size: {len(pdf_data) if success and response else 0} chars, Filename: {filename if success and response else 'None'}")

    def test_get_documents_by_patient(self):
        """Test getting documents by patient"""
        if not self.created_patient_id:
            return self.log_test("Get Documents by Patient", False, "- No patient ID available")
        
        success, response = self.make_request('GET', f'documents/patient/{self.created_patient_id}')
        if success and response:
            data = response.json()
            success = len(data) >= 1  # Should have at least one generated document
        
        return self.log_test("Get Documents by Patient", success, f"- Found {len(data) if success and response else 0} documents")

    # ===== AGENDA SYSTEM TESTS =====
    
    def test_init_default_categories(self):
        """Test initializing default appointment categories"""
        success, response = self.make_request('POST', 'agenda/init-categories-defaut')
        if success and response:
            data = response.json()
            success = 'catégories' in data.get('message', '')
        return self.log_test("Initialize Default Categories", success, f"- Response: {data.get('message', '') if success and response else 'Failed'}")

    def test_get_categories_seances(self):
        """Test getting all appointment categories"""
        success, response = self.make_request('GET', 'categories-seances')
        if success and response:
            data = response.json()
            success = len(data) >= 7  # Should have 7 default categories
        return self.log_test("Get Categories Seances", success, f"- Found {len(data) if success and response else 0} categories")

    def test_create_custom_category(self):
        """Test creating a custom appointment category"""
        category_data = {
            "nom": "Test Catégorie",
            "duree_defaut": 25,
            "couleur": "#FF5733",
            "prix": 35.0,
            "description": "Catégorie de test personnalisée"
        }
        
        success, response = self.make_request('POST', 'categories-seances', category_data)
        if success and response:
            data = response.json()
            self.created_category_id = data.get('id')
            success = self.created_category_id is not None and data.get('nom') == 'Test Catégorie'
        
        return self.log_test("Create Custom Category", success, f"- Category ID: {self.created_category_id}")

    def test_create_rendez_vous(self):
        """Test creating an appointment"""
        if not self.created_patient_id or not self.created_category_id:
            return self.log_test("Create Rendez-vous", False, "- Missing patient ID or category ID")
        
        # Create appointment for tomorrow at 10:00
        from datetime import datetime, timedelta, timezone
        tomorrow = datetime.now(timezone.utc) + timedelta(days=1)
        start_time = tomorrow.replace(hour=10, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(minutes=25)  # 25 minutes duration
        
        rdv_data = {
            "patient_id": self.created_patient_id,
            "patient_nom": "Marie Dupont",
            "categorie_id": self.created_category_id,
            "categorie_nom": "Test Catégorie",
            "date_debut": start_time.isoformat(),
            "date_fin": end_time.isoformat(),
            "duree_minutes": 25,
            "notes": "Premier rendez-vous de test"
        }
        
        success, response = self.make_request('POST', 'rendez-vous', rdv_data)
        if success and response:
            data = response.json()
            self.created_rdv_id = data.get('id')
            success = self.created_rdv_id is not None
        
        return self.log_test("Create Rendez-vous", success, f"- RDV ID: {self.created_rdv_id}")

    def test_conflict_detection(self):
        """Test appointment conflict detection"""
        if not self.created_patient_id or not self.created_category_id:
            return self.log_test("Test Conflict Detection", False, "- Missing patient ID or category ID")
        
        # Try to create overlapping appointment
        from datetime import datetime, timedelta, timezone
        tomorrow = datetime.now(timezone.utc) + timedelta(days=1)
        start_time = tomorrow.replace(hour=10, minute=10, second=0, microsecond=0)  # Overlaps with previous
        end_time = start_time + timedelta(minutes=25)
        
        rdv_data = {
            "patient_id": self.created_patient_id,
            "patient_nom": "Marie Dupont",
            "categorie_id": self.created_category_id,
            "categorie_nom": "Test Catégorie",
            "date_debut": start_time.isoformat(),
            "date_fin": end_time.isoformat(),
            "duree_minutes": 25,
            "notes": "Rendez-vous en conflit"
        }
        
        success, response = self.make_request('POST', 'rendez-vous', rdv_data, expected_status=400)
        if success and response:
            data = response.json()
            success = 'conflit' in data.get('detail', '').lower()
        
        return self.log_test("Test Conflict Detection", success, f"- Conflict properly detected: {success}")

    def test_get_rendez_vous(self):
        """Test getting appointments"""
        success, response = self.make_request('GET', 'rendez-vous')
        if success and response:
            data = response.json()
            success = len(data) >= 1  # Should have at least our created appointment
        
        return self.log_test("Get Rendez-vous", success, f"- Found {len(data) if success and response else 0} appointments")

    def test_get_rendez_vous_with_filters(self):
        """Test getting appointments with date filters"""
        from datetime import datetime, timedelta, timezone
        today = datetime.now(timezone.utc)
        tomorrow = today + timedelta(days=1)
        day_after = today + timedelta(days=2)
        
        # Filter for tomorrow's appointments
        params = f"?date_debut={tomorrow.isoformat()}&date_fin={day_after.isoformat()}"
        success, response = self.make_request('GET', f'rendez-vous{params}')
        if success and response:
            data = response.json()
            success = len(data) >= 1  # Should find our tomorrow appointment
        
        return self.log_test("Get Rendez-vous with Filters", success, f"- Found {len(data) if success and response else 0} filtered appointments")

    def test_agenda_statistiques(self):
        """Test agenda statistics endpoint"""
        success, response = self.make_request('GET', 'agenda/statistiques')
        if success and response:
            data = response.json()
            required_keys = ['rdv_aujourd_hui', 'rdv_semaine', 'prochains_rdv']
            success = all(key in data for key in required_keys)
            stats_msg = f"Today: {data.get('rdv_aujourd_hui', 0)}, Week: {data.get('rdv_semaine', 0)}"
        else:
            stats_msg = "Failed"
        
        return self.log_test("Agenda Statistics", success, f"- Stats: {stats_msg}")

    def test_update_rendez_vous(self):
        """Test updating an appointment"""
        if not self.created_rdv_id:
            return self.log_test("Update Rendez-vous", False, "- No RDV ID available")
        
        # Update the appointment notes
        from datetime import datetime, timedelta, timezone
        tomorrow = datetime.now(timezone.utc) + timedelta(days=1)
        start_time = tomorrow.replace(hour=10, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(minutes=25)
        
        update_data = {
            "patient_id": self.created_patient_id,
            "patient_nom": "Marie Dupont",
            "categorie_id": self.created_category_id,
            "categorie_nom": "Test Catégorie",
            "date_debut": start_time.isoformat(),
            "date_fin": end_time.isoformat(),
            "duree_minutes": 25,
            "notes": "Notes mises à jour - rendez-vous confirmé",
            "statut": "confirme"
        }
        
        success, response = self.make_request('PUT', f'rendez-vous/{self.created_rdv_id}', update_data)
        if success and response:
            data = response.json()
            success = data.get('statut') == 'confirme' and 'confirmé' in data.get('notes', '')
        
        status_msg = data.get('statut', 'unknown') if success and response else 'Failed'
        return self.log_test("Update Rendez-vous", success, f"- Status updated to: {status_msg}")

    def test_delete_rendez_vous(self):
        """Test deleting an appointment"""
        if not self.created_rdv_id:
            return self.log_test("Delete Rendez-vous", False, "- No RDV ID available")
        
        success, response = self.make_request('DELETE', f'rendez-vous/{self.created_rdv_id}')
        if success and response:
            data = response.json()
            success = 'supprimé' in data.get('message', '')
        
        msg = data.get('message', '') if success and response else 'Failed'
        return self.log_test("Delete Rendez-vous", success, f"- Deletion: {msg}")

    def test_delete_category_with_protection(self):
        """Test that categories with appointments cannot be deleted"""
        if not self.created_category_id:
            return self.log_test("Delete Category Protection", False, "- No category ID available")
        
        # First create a new appointment to test protection
        from datetime import datetime, timedelta, timezone
        tomorrow = datetime.now(timezone.utc) + timedelta(days=1)
        start_time = tomorrow.replace(hour=14, minute=0, second=0, microsecond=0)
        end_time = start_time + timedelta(minutes=25)
        
        rdv_data = {
            "patient_id": self.created_patient_id,
            "patient_nom": "Marie Dupont",
            "categorie_id": self.created_category_id,
            "categorie_nom": "Test Catégorie",
            "date_debut": start_time.isoformat(),
            "date_fin": end_time.isoformat(),
            "duree_minutes": 25,
            "notes": "RDV pour tester la protection"
        }
        
        # Create the appointment
        rdv_success, rdv_response = self.make_request('POST', 'rendez-vous', rdv_data)
        if not rdv_success:
            return self.log_test("Delete Category Protection", False, "- Could not create test appointment")
        
        # Now try to delete the category (should fail)
        success, response = self.make_request('DELETE', f'categories-seances/{self.created_category_id}', expected_status=400)
        if success and response:
            data = response.json()
            success = 'impossible' in data.get('detail', '').lower()
        
        return self.log_test("Delete Category Protection", success, f"- Protection working: {success}")

    # ===== MEDIA MANAGEMENT TESTS =====
    
    def test_get_patient_media_empty(self):
        """Test getting media for patient with no media files"""
        if not self.created_patient_id:
            return self.log_test("Get Patient Media (Empty)", False, "- No patient ID available")
        
        success, response = self.make_request('GET', f'patients/{self.created_patient_id}/media')
        if success and response:
            data = response.json()
            success = isinstance(data, list) and len(data) == 0
        
        return self.log_test("Get Patient Media (Empty)", success, f"- Found {len(data) if success and response else 'N/A'} media files")

    def test_upload_patient_media_photo(self):
        """Test uploading a photo for a patient"""
        if not self.created_patient_id:
            return self.log_test("Upload Patient Photo", False, "- No patient ID available")
        
        # Create a mock image file
        import io
        from PIL import Image
        
        # Create a simple test image
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        # Prepare multipart form data
        files = {
            'file': ('test_photo.jpg', img_bytes, 'image/jpeg')
        }
        data = {
            'type': 'photo',
            'category': 'evaluation'
        }
        
        url = f"{self.api_url}/patients/{self.created_patient_id}/media"
        
        try:
            response = requests.post(url, files=files, data=data, timeout=30)
            success = response.status_code == 200
            
            if success:
                response_data = response.json()
                success = (response_data.get('type') == 'photo' and 
                          response_data.get('category') == 'evaluation' and
                          response_data.get('patient_id') == self.created_patient_id)
                self.created_media_id = response_data.get('id')
        except Exception as e:
            success = False
            print(f"Upload error: {str(e)}")
        
        return self.log_test("Upload Patient Photo", success, f"- Media ID: {getattr(self, 'created_media_id', 'None')}")

    def test_upload_invalid_file_type(self):
        """Test uploading invalid file type for photo"""
        if not self.created_patient_id:
            return self.log_test("Upload Invalid File Type", False, "- No patient ID available")
        
        # Create a mock text file
        import io
        text_content = io.BytesIO(b"This is not an image")
        
        files = {
            'file': ('test.txt', text_content, 'text/plain')
        }
        data = {
            'type': 'photo',
            'category': 'evaluation'
        }
        
        url = f"{self.api_url}/patients/{self.created_patient_id}/media"
        
        try:
            response = requests.post(url, files=files, data=data, timeout=30)
            success = response.status_code == 400
            
            if success:
                response_data = response.json()
                success = 'non supporté' in response_data.get('detail', '').lower()
        except Exception as e:
            success = False
            print(f"Upload error: {str(e)}")
        
        return self.log_test("Upload Invalid File Type", success, "- Validation working correctly")

    def test_filename_generation(self):
        """Test automatic filename generation with timestamp"""
        if not self.created_patient_id:
            return self.log_test("Test Filename Generation", False, "- No patient ID available")
        
        # Create another mock image
        import io
        from PIL import Image
        
        img = Image.new('RGB', (50, 50), color='blue')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {
            'file': ('exercise_photo.png', img_bytes, 'image/png')
        }
        data = {
            'type': 'photo',
            'category': 'exercice'
        }
        
        url = f"{self.api_url}/patients/{self.created_patient_id}/media"
        
        try:
            response = requests.post(url, files=files, data=data, timeout=30)
            success = response.status_code == 200
            
            if success:
                response_data = response.json()
                filename = response_data.get('filename', '')
                # Check filename format: {patient_id}_{category}_{timestamp}.{extension}
                expected_parts = [self.created_patient_id, 'exercice']
                success = (all(part in filename for part in expected_parts) and 
                          filename.endswith('.png') and
                          len(filename.split('_')) >= 3)  # patient_id_category_timestamp.ext
                self.created_media_id_2 = response_data.get('id')
        except Exception as e:
            success = False
            print(f"Upload error: {str(e)}")
        
        return self.log_test("Test Filename Generation", success, f"- Generated filename format correct")

    def test_get_patient_media_with_files(self):
        """Test getting media files after uploading"""
        if not self.created_patient_id:
            return self.log_test("Get Patient Media (With Files)", False, "- No patient ID available")
        
        success, response = self.make_request('GET', f'patients/{self.created_patient_id}/media')
        if success and response:
            data = response.json()
            success = (isinstance(data, list) and len(data) >= 2 and  # Should have at least 2 uploaded files
                      all('id' in item and 'category' in item and 'type' in item for item in data))
        
        return self.log_test("Get Patient Media (With Files)", success, f"- Found {len(data) if success and response else 0} media files")

    def test_media_categories(self):
        """Test all three media categories: evaluation, exercice, resultat"""
        if not self.created_patient_id:
            return self.log_test("Test Media Categories", False, "- No patient ID available")
        
        # Test 'resultat' category
        import io
        from PIL import Image
        
        img = Image.new('RGB', (75, 75), color='green')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        files = {
            'file': ('result_photo.jpg', img_bytes, 'image/jpeg')
        }
        data = {
            'type': 'photo',
            'category': 'resultat'
        }
        
        url = f"{self.api_url}/patients/{self.created_patient_id}/media"
        
        try:
            response = requests.post(url, files=files, data=data, timeout=30)
            success = response.status_code == 200
            
            if success:
                response_data = response.json()
                success = response_data.get('category') == 'resultat'
                self.created_media_id_3 = response_data.get('id')
        except Exception as e:
            success = False
            print(f"Upload error: {str(e)}")
        
        return self.log_test("Test Media Categories", success, "- All categories (evaluation, exercice, resultat) working")

    def test_delete_patient_media(self):
        """Test deleting a media file"""
        if not self.created_patient_id or not hasattr(self, 'created_media_id'):
            return self.log_test("Delete Patient Media", False, "- No patient ID or media ID available")
        
        success, response = self.make_request('DELETE', f'patients/{self.created_patient_id}/media/{self.created_media_id}')
        if success and response:
            data = response.json()
            success = 'supprimé' in data.get('message', '').lower()
        
        return self.log_test("Delete Patient Media", success, f"- Deletion: {data.get('message', '') if success and response else 'Failed'}")

    def test_delete_nonexistent_media(self):
        """Test deleting non-existent media file"""
        if not self.created_patient_id:
            return self.log_test("Delete Non-existent Media", False, "- No patient ID available")
        
        fake_media_id = "non-existent-media-id"
        success, response = self.make_request('DELETE', f'patients/{self.created_patient_id}/media/{fake_media_id}', expected_status=404)
        if success and response:
            data = response.json()
            success = 'non trouvé' in data.get('detail', '').lower()
        
        return self.log_test("Delete Non-existent Media", success, "- 404 error properly returned")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting KineTrack Backend API Tests")
        print("=" * 50)
        
        # Basic API tests
        self.test_api_root()
        self.test_get_initial_exercices()
        
        # Patient workflow tests
        self.test_create_patient()
        self.test_get_patients()
        self.test_get_patient_by_id()
        
        # Anamnèse tests
        self.test_create_anamnese()
        self.test_get_anamnese_by_patient()
        
        # Exercise tests
        self.test_create_exercice()
        self.test_get_exercices_by_type()
        self.test_get_exercices_by_zone()
        
        # AI and document generation tests (critical features)
        self.test_generate_compte_rendu_anamnese()
        self.test_generate_lettre_medecin()
        self.test_export_pdf()
        self.test_get_documents_by_patient()
        
        # ===== AGENDA SYSTEM TESTS =====
        print("\n🗓️  Testing Agenda System...")
        
        # Initialize default categories first
        self.test_init_default_categories()
        self.test_get_categories_seances()
        
        # Test custom category creation
        self.test_create_custom_category()
        
        # Test appointment creation and management
        self.test_create_rendez_vous()
        self.test_conflict_detection()
        self.test_get_rendez_vous()
        self.test_get_rendez_vous_with_filters()
        
        # Test agenda statistics
        self.test_agenda_statistiques()
        
        # Test appointment updates and deletion
        self.test_update_rendez_vous()
        self.test_delete_rendez_vous()
        
        # Test category protection
        self.test_delete_category_with_protection()
        
        # ===== MEDIA MANAGEMENT TESTS =====
        print("\n📸 Testing Media Management System...")
        
        # Test media retrieval for empty patient
        self.test_get_patient_media_empty()
        
        # Test media upload with different categories and types
        self.test_upload_patient_media_photo()
        self.test_upload_invalid_file_type()
        self.test_filename_generation()
        
        # Test media categories
        self.test_media_categories()
        
        # Test media retrieval with files
        self.test_get_patient_media_with_files()
        
        # Test media deletion
        self.test_delete_patient_media()
        self.test_delete_nonexistent_media()
        
        # Print results
        print("=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed! Backend API is working correctly.")
            return 0
        else:
            failed_tests = self.tests_run - self.tests_passed
            print(f"⚠️  {failed_tests} test(s) failed. Please check the issues above.")
            return 1

def main():
    """Main test execution"""
    tester = KineTrackAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())