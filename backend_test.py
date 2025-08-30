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

class KineTrackAPITester:
    def __init__(self, base_url="https://kinetrack.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_patient_id = None
        self.created_anamnese_id = None
        self.created_document_id = None
        self.created_exercice_id = None

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