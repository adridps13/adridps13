import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import shadcn components
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Separator } from './components/ui/separator';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription } from './components/ui/alert';
import { ScrollArea } from './components/ui/scroll-area';

// Icons
import { 
  Users, 
  UserPlus, 
  FileText, 
  Activity, 
  Calendar, 
  Download, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileDown,
  Stethoscope,
  Dumbbell,
  Target,
  TrendingUp,
  CheckCircle,
  Copy,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Activity },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/nouveau-patient', label: 'Nouveau Patient', icon: UserPlus },
    { path: '/exercices', label: 'Exercices', icon: Dumbbell },
    { path: '/programmes', label: 'Programmes', icon: Calendar },
    { path: '/suggestions', label: 'Suggestions', icon: Star },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-emerald-900">KineTrack</h1>
            </Link>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalExercices: 0,
    seancesRecentes: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsRes, exercicesRes] = await Promise.all([
        axios.get(`${API}/patients`),
        axios.get(`${API}/exercices`)
      ]);
      
      setStats({
        totalPatients: patientsRes.data.length,
        totalExercices: exercicesRes.data.length,
        seancesRecentes: []
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre activité de kinésithérapie</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
            <Users className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalPatients}</div>
            <p className="text-xs text-gray-500 mt-1">Patients enregistrés</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Exercices</CardTitle>
            <Dumbbell className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalExercices}</div>
            <p className="text-xs text-gray-500 mt-1">Exercices disponibles</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Séances</CardTitle>
            <Calendar className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">Séances cette semaine</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-emerald-600" />
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/nouveau-patient">
              <Button className="w-full justify-start bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Patient
              </Button>
            </Link>
            <Link to="/exercices">
              <Button variant="outline" className="w-full justify-start">
                <Dumbbell className="w-4 h-4 mr-2" />
                Gérer les Exercices
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune activité récente</p>
              <p className="text-sm">Commencez par ajouter un patient</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Patients List Component
const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showDocumentEditor, setShowDocumentEditor] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API}/patients`);
      setPatients(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.prenom} ${patient.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.pathologie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleDeletePatient = async (patientId, patientName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le patient ${patientName} ? Cette action est irréversible.`)) {
      try {
        await axios.delete(`${API}/patients/${patientId}`);
        alert('Patient supprimé avec succès !');
        fetchPatients(); // Recharge la liste
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du patient');
      }
    }
  };

  const generateDocuments = async (patientId, type) => {
    try {
      const endpoint = type === 'anamnese' ? 'compte-rendu-anamnese' : 'lettre-medecin';
      const response = await axios.post(`${API}/generate/${endpoint}/${patientId}`);
      
      // Ouvrir l'éditeur au lieu de télécharger directement
      setCurrentDocument(response.data.document);
      setDocumentContent(response.data.contenu);
      setShowDocumentEditor(true);
      
    } catch (error) {
      console.error('Erreur lors de la génération du document:', error);
      alert('Erreur lors de la génération du document');
    }
  };

  const regenerateWithInstructions = async () => {
    if (!currentDocument || !aiInstructions.trim()) {
      alert('Veuillez saisir des instructions de modification');
      return;
    }

    setIsRegenerating(true);
    try {
      const response = await axios.post(`${API}/modify-document/${currentDocument.id}`, {
        instructions: aiInstructions,
        contenu_actuel: documentContent
      });
      
      setDocumentContent(response.data.contenu_modifie);
      setAiInstructions('');
      alert('Document modifié avec succès !');
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('Erreur lors de la modification du document');
    } finally {
      setIsRegenerating(false);
    }
  };

  const saveAndExportDocument = async () => {
    if (!currentDocument) return;

    try {
      // Sauvegarder le contenu modifié
      await axios.put(`${API}/documents/${currentDocument.id}`, {
        contenu: documentContent
      });

      // Générer le PDF
      const pdfResponse = await axios.post(`${API}/export/pdf/${currentDocument.id}`);
      
      // Télécharger le PDF
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${pdfResponse.data.pdf_data}`;
      link.download = pdfResponse.data.filename;
      link.click();
      
      alert('Document sauvegardé et téléchargé avec succès !');
      setShowDocumentEditor(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du document');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patients</h1>
          <p className="text-gray-600">Gérez vos patients et leur suivi</p>
        </div>
        <Link to="/nouveau-patient">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Patient
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un patient par nom ou pathologie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{patient.prenom} {patient.nom}</CardTitle>
                  <CardDescription>{patient.age} ans</CardDescription>
                </div>
                <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                  {patient.pathologie}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {patient.telephone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {patient.telephone}
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {patient.email}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewPatient(patient)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateDocuments(patient.id, 'anamnese')}
                  className="flex-1"
                >
                  <FileDown className="w-4 h-4 mr-1" />
                  Rapport
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeletePatient(patient.id, `${patient.prenom} ${patient.nom}`)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="mt-8">
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Aucun patient trouvé' : 'Aucun patient enregistré'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Essayez de modifier votre recherche' : 'Commencez par ajouter votre premier patient'}
            </p>
            {!searchTerm && (
              <Link to="/nouveau-patient">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un Patient
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Patient Details Dialog */}
      <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
        <DialogContent className="max-w-2xl">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>{selectedPatient.prenom} {selectedPatient.nom}</span>
                </DialogTitle>
                <DialogDescription>
                  Détails du patient et actions disponibles
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Âge</Label>
                    <p className="text-sm">{selectedPatient.age} ans</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Pathologie</Label>
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                      {selectedPatient.pathologie}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Prescription médicale</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedPatient.prescription_medicale}</p>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-3 block">Actions disponibles</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => generateDocuments(selectedPatient.id, 'anamnese')}
                      className="justify-start"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Compte-rendu d'anamnèse
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => generateDocuments(selectedPatient.id, 'lettre')}
                      className="justify-start"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Lettre au médecin
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeletePatient(selectedPatient.id, `${selectedPatient.prenom} ${selectedPatient.nom}`)}
                      className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer le patient
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Editor Dialog */}
      <Dialog open={showDocumentEditor} onOpenChange={setShowDocumentEditor}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>Éditeur de Document - {currentDocument?.titre}</span>
            </DialogTitle>
            <DialogDescription>
              Modifiez le document ou donnez des instructions à l'IA pour le régénérer
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
            {/* Zone d'édition principale */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Contenu du Document</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDocumentContent(currentDocument?.contenu || '')}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Réinitialiser
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                className="flex-1 font-mono text-sm resize-none"
                placeholder="Le contenu du document apparaîtra ici..."
              />
            </div>

            {/* Panel de modification IA */}
            <div className="lg:col-span-1 flex flex-col">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-4 rounded-lg border border-emerald-200 flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">IA</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Assistant de Modification</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ai-instructions" className="text-sm font-medium text-gray-700 mb-2 block">
                      Instructions de modification
                    </Label>
                    <Textarea
                      id="ai-instructions"
                      value={aiInstructions}
                      onChange={(e) => setAiInstructions(e.target.value)}
                      placeholder="Ex: Rends le ton plus formel, ajoute une section sur les recommandations à domicile, utilise un vocabulaire plus accessible au patient..."
                      className="resize-none h-32"
                    />
                  </div>
                  
                  <Button
                    onClick={regenerateWithInstructions}
                    disabled={isRegenerating || !aiInstructions.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isRegenerating ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Modification en cours...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Modifier avec IA
                      </div>
                    )}
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">Suggestions rapides :</h4>
                    <div className="flex flex-wrap gap-1">
                      {[
                        "Plus formel",
                        "Plus accessible",
                        "Ajouter recommandations",
                        "Ton empathique",
                        "Plus détaillé",
                        "Plus concis"
                      ].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => setAiInstructions(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Statistiques du document */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Statistiques</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>Caractères: {documentContent.length}</div>
                  <div>Mots: {documentContent.split(/\s+/).filter(w => w.length > 0).length}</div>
                  <div>Lignes: {documentContent.split('\n').length}</div>
                  <div>Paragraphes: {documentContent.split('\n\n').length}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowDocumentEditor(false)}
            >
              Annuler
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(documentContent);
                  alert('Contenu copié dans le presse-papiers !');
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copier
              </Button>
              
              <Button
                onClick={saveAndExportDocument}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Sauvegarder & Télécharger PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// New Patient Form Component
const NewPatientForm = () => {
  const [patientData, setPatientData] = useState({
    nom: '',
    prenom: '',
    age: '',
    pathologie: '',
    prescription_medicale: '',
    telephone: '',
    email: ''
  });
  const [anamneseData, setAnamneseData] = useState({
    douleur_niveau: 5,
    douleur_type: undefined,
    douleur_localisation: '',
    debut_symptomes: '',
    facteurs_declenchants: '',
    activites_genantes: [],
    autres_activites: '',
    antecedents_medicaux: '',
    traitements_actuels: '',
    objectifs_patient: '',
    notes_supplementaires: '',
    pain_areas: {},
    red_flags: [],
    yellow_flags: [],
    blue_flags: []
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 2) {
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      // Créer le patient
      const patientResponse = await axios.post(`${API}/patients`, {
        ...patientData,
        age: parseInt(patientData.age)
      });

      // Créer l'anamnèse
      await axios.post(`${API}/anamnese`, {
        ...anamneseData,
        patient_id: patientResponse.data.id
      });

      alert('Patient créé avec succès !');
      
      // Reset form
      setPatientData({
        nom: '',
        prenom: '',
        age: '',
        pathologie: '',
        prescription_medicale: '',
        telephone: '',
        email: ''
      });
      setAnamneseData({
        douleur_niveau: 5,
        douleur_type: undefined,
        douleur_localisation: '',
        debut_symptomes: '',
        facteurs_declenchants: '',
        activites_genantes: [],
        autres_activites: '',
        antecedents_medicaux: '',
        traitements_actuels: '',
        objectifs_patient: '',
        notes_supplementaires: ''
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
      alert('Erreur lors de la création du patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePainAreaClick = (areaId) => {
    if (areaId === 'clear') {
      setAnamneseData(prev => ({ ...prev, pain_areas: {} }));
      return;
    }

    // Demander l'intensité de la douleur (1-10)
    const intensity = prompt(`Intensité de la douleur pour ${areaId} (1-10):`);
    if (intensity && !isNaN(intensity) && intensity >= 1 && intensity <= 10) {
      setAnamneseData(prev => ({
        ...prev,
        pain_areas: {
          ...prev.pain_areas,
          [areaId]: parseInt(intensity)
        }
      }));
    }
  };

  const handleFlagChange = (flagType, flag, checked) => {
    setAnamneseData(prev => ({
      ...prev,
      [flagType]: checked 
        ? [...prev[flagType], flag]
        : prev[flagType].filter(f => f !== flag)
    }));
  };

  const handleActivitesChange = (activite, checked) => {
    if (checked) {
      setAnamneseData(prev => ({
        ...prev,
        activites_genantes: [...prev.activites_genantes, activite]
      }));
    } else {
      setAnamneseData(prev => ({
        ...prev,
        activites_genantes: prev.activites_genantes.filter(a => a !== activite)
      }));
    }
  };

  const activitesList = [
    'Marche', 'Course', 'Montée d\'escaliers', 'Port de charges', 'Position assise prolongée',
    'Position debout prolongée', 'Conduite', 'Activités sportives', 'Travaux ménagers', 'Sommeil'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouveau Patient</h1>
        <p className="text-gray-600">Ajoutez un nouveau patient et réalisez son anamnèse</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded">
              <div className={`h-2 rounded transition-all duration-300 ${currentStep >= 2 ? 'w-full bg-emerald-600' : 'w-0'}`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
          </div>
          <CardTitle className="mt-4">
            {currentStep === 1 ? 'Informations Patient' : 'Anamnèse'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handlePatientSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      value={patientData.nom}
                      onChange={(e) => setPatientData(prev => ({ ...prev, nom: e.target.value.toUpperCase() }))}
                      placeholder="DUPONT"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={patientData.prenom}
                      onChange={(e) => {
                        const value = e.target.value;
                        const capitalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                        setPatientData(prev => ({ ...prev, prenom: capitalized }));
                      }}
                      placeholder="Marie"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="age">Âge *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={patientData.age}
                      onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pathologie">Pathologie *</Label>
                    <Input
                      id="pathologie"
                      value={patientData.pathologie}
                      onChange={(e) => setPatientData(prev => ({ ...prev, pathologie: e.target.value }))}
                      placeholder="Ex: Gonarthrose, Lombalgie..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="prescription">Prescription médicale *</Label>
                  <Textarea
                    id="prescription"
                    value={patientData.prescription_medicale}
                    onChange={(e) => setPatientData(prev => ({ ...prev, prescription_medicale: e.target.value }))}
                    placeholder="Décrivez la prescription médicale..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      value={patientData.telephone}
                      onChange={(e) => setPatientData(prev => ({ ...prev, telephone: e.target.value }))}
                      placeholder="Ex: 01 23 45 67 89"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patientData.email}
                      onChange={(e) => setPatientData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="patient@exemple.com"
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="douleur_niveau">Niveau de douleur (0-10)</Label>
                    <div className="space-y-2">
                      <Input
                        id="douleur_niveau"
                        type="range"
                        min="0"
                        max="10"
                        value={anamneseData.douleur_niveau}
                        onChange={(e) => setAnamneseData(prev => ({ ...prev, douleur_niveau: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="text-center">
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {anamneseData.douleur_niveau}/10
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="douleur_type">Type de douleur</Label>
                    <Select value={anamneseData.douleur_type} onValueChange={(value) => setAnamneseData(prev => ({ ...prev, douleur_type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aigue">Aiguë</SelectItem>
                        <SelectItem value="chronique">Chronique</SelectItem>
                        <SelectItem value="lancinante">Lancinante</SelectItem>
                        <SelectItem value="sourde">Sourde</SelectItem>
                        <SelectItem value="brulante">Brûlante</SelectItem>
                        <SelectItem value="electrique">Électrique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="douleur_localisation">Localisation de la douleur</Label>
                  <Input
                    id="douleur_localisation"
                    value={anamneseData.douleur_localisation}
                    onChange={(e) => setAnamneseData(prev => ({ ...prev, douleur_localisation: e.target.value }))}
                    placeholder="Ex: Genou droit, lombaires, cervicales..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="debut_symptomes">Début des symptômes</Label>
                    <Input
                      id="debut_symptomes"
                      value={anamneseData.debut_symptomes}
                      onChange={(e) => setAnamneseData(prev => ({ ...prev, debut_symptomes: e.target.value }))}
                      placeholder="Ex: Il y a 3 mois, progressif..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="facteurs_declenchants">Facteurs déclenchants</Label>
                    <Input
                      id="facteurs_declenchants"
                      value={anamneseData.facteurs_declenchants}
                      onChange={(e) => setAnamneseData(prev => ({ ...prev, facteurs_declenchants: e.target.value }))}
                      placeholder="Ex: Effort, position prolongée..."
                    />
                  </div>
                </div>

                <div>
                  <Label>Activités gênées (cochez toutes celles qui s'appliquent)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {activitesList.map((activite) => (
                      <label key={activite} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={anamneseData.activites_genantes.includes(activite)}
                          onChange={(e) => handleActivitesChange(activite, e.target.checked)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm">{activite}</span>
                      </label>
                    ))}
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={anamneseData.autres_activites !== ''}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            setAnamneseData(prev => ({ ...prev, autres_activites: '' }));
                          }
                        }}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm">Autres</span>
                    </label>
                  </div>
                  
                  {/* Champ "Autres" activités */}
                  <div className="mt-3">
                    <Input
                      placeholder="Précisez d'autres activités gênantes..."
                      value={anamneseData.autres_activites}
                      onChange={(e) => setAnamneseData(prev => ({ ...prev, autres_activites: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Pain Drawing */}
                <div className="col-span-2">
                  <PainDrawing 
                    painAreas={anamneseData.pain_areas}
                    onPainAreaClick={handlePainAreaClick}
                  />
                </div>

                {/* Drapeaux (Red/Yellow/Blue Flags) */}
                <div className="col-span-2">
                  <Card className="p-4">
                    <h3 className="font-medium text-gray-900 mb-4">Signaux d'Alarme (Flags)</h3>
                    
                    <Tabs defaultValue="red" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="red" className="text-red-600">Red Flags</TabsTrigger>
                        <TabsTrigger value="yellow" className="text-yellow-600">Yellow Flags</TabsTrigger>
                        <TabsTrigger value="blue" className="text-blue-600">Blue Flags</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="red" className="mt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-red-700">Drapeaux Rouges (Urgences médicales)</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              'Fièvre inexpliquée',
                              'Perte de poids non intentionnelle',
                              'Antécédents de cancer',
                              'Douleurs nocturnes intenses',
                              'Troubles sphinctériens',
                              'Déficit neurologique progressif',
                              'Syndrome de la queue de cheval',
                              'Fracture récente',
                              'Infection systémique'
                            ].map((flag) => (
                              <label key={flag} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={anamneseData.red_flags.includes(flag)}
                                  onChange={(e) => handleFlagChange('red_flags', flag, e.target.checked)}
                                  className="rounded border-red-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm">{flag}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="yellow" className="mt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-yellow-700">Drapeaux Jaunes (Facteurs psychosociaux)</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              'Stress au travail',
                              'Anxiété liée à la douleur',
                              'Dépression',
                              'Catastrophisme',
                              'Peur du mouvement (kinésiophobie)',
                              'Évitement des activités',
                              'Croyances négatives sur la douleur',
                              'Mauvaise qualité de sommeil',
                              'Isolement social'
                            ].map((flag) => (
                              <label key={flag} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={anamneseData.yellow_flags.includes(flag)}
                                  onChange={(e) => handleFlagChange('yellow_flags', flag, e.target.checked)}
                                  className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                                />
                                <span className="text-sm">{flag}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="blue" className="mt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-700">Drapeaux Bleus (Facteurs professionnels)</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {[
                              'Insatisfaction au travail',
                              'Mauvaise ambiance de travail',
                              'Manque de soutien des collègues',
                              'Pression temporelle excessive',
                              'Monotonie des tâches',
                              'Absence d\'autonomie',
                              'Perception d\'injustice',
                              'Conflit avec la hiérarchie',
                              'Surcharge de travail'
                            ].map((flag) => (
                              <label key={flag} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={anamneseData.blue_flags.includes(flag)}
                                  onChange={(e) => handleFlagChange('blue_flags', flag, e.target.checked)}
                                  className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm">{flag}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </Card>
                </div>

                <div>
                  <Label htmlFor="antecedents">Antécédents médicaux</Label>
                  <Textarea
                    id="antecedents"
                    value={anamneseData.antecedents_medicaux}
                    onChange={(e) => setAnamneseData(prev => ({ ...prev, antecedents_medicaux: e.target.value }))}
                    placeholder="Décrivez les antécédents médicaux pertinents..."
                  />
                </div>

                <div>
                  <Label htmlFor="traitements">Traitements actuels</Label>
                  <Textarea
                    id="traitements"
                    value={anamneseData.traitements_actuels}
                    onChange={(e) => setAnamneseData(prev => ({ ...prev, traitements_actuels: e.target.value }))}
                    placeholder="Médicaments, traitements en cours..."
                  />
                </div>

                <div>
                  <Label htmlFor="objectifs">Objectifs du patient</Label>
                  <Textarea
                    id="objectifs"
                    value={anamneseData.objectifs_patient}
                    onChange={(e) => setAnamneseData(prev => ({ ...prev, objectifs_patient: e.target.value }))}
                    placeholder="Quels sont les objectifs du patient ?"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes supplémentaires</Label>
                  <Textarea
                    id="notes"
                    value={anamneseData.notes_supplementaires}
                    onChange={(e) => setAnamneseData(prev => ({ ...prev, notes_supplementaires: e.target.value }))}
                    placeholder="Observations supplémentaires..."
                  />
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Précédent
                </Button>
              )}
              <div className="ml-auto">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {currentStep === 1 ? 'Suivant' : isSubmitting ? 'Création...' : 'Créer le Patient'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Pain Drawing Component
const PainDrawing = ({ painAreas, onPainAreaClick }) => {
  const bodyParts = [
    { id: 'tete', name: 'Tête', x: 150, y: 30, width: 60, height: 50 },
    { id: 'cou', name: 'Cou', x: 160, y: 80, width: 40, height: 25 },
    { id: 'epaule_g', name: 'Épaule G', x: 110, y: 105, width: 40, height: 30 },
    { id: 'epaule_d', name: 'Épaule D', x: 210, y: 105, width: 40, height: 30 },
    { id: 'bras_g', name: 'Bras G', x: 90, y: 135, width: 25, height: 60 },
    { id: 'bras_d', name: 'Bras D', x: 245, y: 135, width: 25, height: 60 },
    { id: 'coude_g', name: 'Coude G', x: 85, y: 195, width: 30, height: 20 },
    { id: 'coude_d', name: 'Coude D', x: 245, y: 195, width: 30, height: 20 },
    { id: 'avant_bras_g', name: 'Avant-bras G', x: 90, y: 215, width: 25, height: 50 },
    { id: 'avant_bras_d', name: 'Avant-bras D', x: 245, y: 215, width: 25, height: 50 },
    { id: 'main_g', name: 'Main G', x: 85, y: 265, width: 30, height: 25 },
    { id: 'main_d', name: 'Main D', x: 245, y: 265, width: 30, height: 25 },
    { id: 'thorax', name: 'Thorax', x: 140, y: 105, width: 80, height: 60 },
    { id: 'abdomen', name: 'Abdomen', x: 145, y: 165, width: 70, height: 50 },
    { id: 'dos_haut', name: 'Dos Haut', x: 145, y: 105, width: 70, height: 40 },
    { id: 'dos_bas', name: 'Dos Bas', x: 145, y: 145, width: 70, height: 50 },
    { id: 'bassin', name: 'Bassin', x: 145, y: 215, width: 70, height: 40 },
    { id: 'cuisse_g', name: 'Cuisse G', x: 140, y: 255, width: 30, height: 70 },
    { id: 'cuisse_d', name: 'Cuisse D', x: 190, y: 255, width: 30, height: 70 },
    { id: 'genou_g', name: 'Genou G', x: 140, y: 325, width: 30, height: 25 },
    { id: 'genou_d', name: 'Genou D', x: 190, y: 325, width: 30, height: 25 },
    { id: 'jambe_g', name: 'Jambe G', x: 140, y: 350, width: 25, height: 60 },
    { id: 'jambe_d', name: 'Jambe D', x: 195, y: 350, width: 25, height: 60 },
    { id: 'cheville_g', name: 'Cheville G', x: 140, y: 410, width: 25, height: 20 },
    { id: 'cheville_d', name: 'Cheville D', x: 195, y: 410, width: 25, height: 20 },
    { id: 'pied_g', name: 'Pied G', x: 135, y: 430, width: 30, height: 20 },
    { id: 'pied_d', name: 'Pied D', x: 195, y: 430, width: 30, height: 20 }
  ];

  const getPainColor = (bodyPartId) => {
    if (!painAreas[bodyPartId]) return 'transparent';
    const intensity = painAreas[bodyPartId];
    if (intensity <= 3) return 'rgba(34, 197, 94, 0.6)'; // Vert (léger)
    if (intensity <= 6) return 'rgba(251, 191, 36, 0.6)'; // Jaune (modéré)
    return 'rgba(239, 68, 68, 0.6)'; // Rouge (intense)
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium text-gray-900 mb-4 text-center">Dessin de la Douleur</h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Cliquez sur les zones douloureuses pour indiquer l'intensité (1-10)
      </p>
      
      <div className="flex justify-center mb-4">
        <svg width="360" height="470" viewBox="0 0 360 470" className="border rounded">
          {/* Corps humain simplifié */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor:'#f8fafc', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#e2e8f0', stopOpacity:1}} />
            </linearGradient>
          </defs>
          
          {/* Anatomie de base */}
          {/* Tête */}
          <circle cx="180" cy="55" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Corps */}
          <rect x="145" y="105" width="70" height="110" rx="15" fill="url(#bodyGradient)" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Bras */}
          <rect x="95" y="135" width="20" height="80" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          <rect x="245" y="135" width="20" height="80" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Mains */}
          <ellipse cx="100" cy="275" rx="12" ry="8" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          <ellipse cx="260" cy="275" rx="12" ry="8" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Jambes */}
          <rect x="145" y="255" width="25" height="100" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          <rect x="190" y="255" width="25" height="100" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Pieds */}
          <ellipse cx="150" cy="440" rx="15" ry="8" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          <ellipse cx="210" cy="440" rx="15" ry="8" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Zones cliquables pour douleur */}
          {bodyParts.map((part) => (
            <g key={part.id}>
              <rect
                x={part.x}
                y={part.y}
                width={part.width}
                height={part.height}
                fill={getPainColor(part.id)}
                stroke={painAreas[part.id] ? "#ef4444" : "transparent"}
                strokeWidth="2"
                rx="5"
                className="cursor-pointer hover:stroke-emerald-500 transition-all"
                onClick={() => onPainAreaClick(part.id)}
              />
              {painAreas[part.id] && (
                <text
                  x={part.x + part.width/2}
                  y={part.y + part.height/2 + 5}
                  textAnchor="middle"
                  className="text-xs font-bold fill-white pointer-events-none"
                  style={{fontSize: '12px'}}
                >
                  {painAreas[part.id]}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      
      {/* Légende */}
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span>Léger (1-3)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span>Modéré (4-6)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span>Intense (7-10)</span>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPainAreaClick('clear')}
          className="text-xs"
        >
          Effacer tout
        </Button>
      </div>
    </div>
  );
};
const BodyDiagram = ({ onZoneClick, selectedZone }) => {
  const zones = [
    { id: 'cervicales', name: 'Cervicales', x: 160, y: 75, width: 40, height: 20 },
    { id: 'epaule', name: 'Épaules', x: 85, y: 100, width: 190, height: 40 },
    { id: 'bras', name: 'Bras', x: 70, y: 135, width: 60, height: 75 },
    { id: 'coude', name: 'Coudes', x: 75, y: 205, width: 50, height: 25 },
    { id: 'poignet', name: 'Poignets', x: 80, y: 240, width: 40, height: 20 },
    { id: 'main', name: 'Mains', x: 75, y: 270, width: 50, height: 35 },
    { id: 'dos', name: 'Dos', x: 135, y: 140, width: 90, height: 100 },
    { id: 'cuisse', name: 'Cuisses', x: 135, y: 240, width: 90, height: 70 },
    { id: 'genou', name: 'Genoux', x: 140, y: 310, width: 80, height: 40 },
    { id: 'cheville', name: 'Chevilles', x: 145, y: 395, width: 70, height: 30 }
  ];

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium text-gray-900 mb-4 text-center">Schéma Corporel</h3>
      <div className="flex justify-center">
        <svg width="360" height="450" viewBox="0 0 360 450" className="border rounded">
          {/* Corps humain amélioré */}
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor:'#f8fafc', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#e2e8f0', stopOpacity:1}} />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#00000020"/>
            </filter>
          </defs>
          
          {/* Tête */}
          <circle cx="180" cy="60" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" filter="url(#shadow)"/>
          
          {/* Cou/Cervicales - Zone anatomiquement correcte */}
          <rect x="170" y="85" width="20" height="15" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Épaules - Positionnées anatomiquement aux épaules */}
          <ellipse cx="125" cy="110" rx="20" ry="12" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          <ellipse cx="235" cy="110" rx="20" ry="12" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Bras gauche */}
          <rect x="85" y="140" width="18" height="55" rx="9" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          {/* Coude gauche */}
          <circle cx="94" cy="210" r="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          {/* Avant-bras gauche */}
          <rect x="85" y="220" width="18" height="45" rx="9" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          {/* Main gauche */}
          <ellipse cx="94" cy="280" rx="12" ry="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Bras droit */}
          <rect x="257" y="140" width="18" height="55" rx="9" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          {/* Coude droit */}
          <circle cx="266" cy="210" r="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          {/* Avant-bras droit */}
          <rect x="257" y="220" width="18" height="45" rx="9" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          {/* Main droite */}
          <ellipse cx="266" cy="280" rx="12" ry="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Tronc */}
          <rect x="145" y="110" width="70" height="130" rx="20" fill="url(#bodyGrad)" stroke="#cbd5e1" strokeWidth="2" filter="url(#shadow)"/>
          
          {/* Cuisses */}
          <rect x="155" y="240" width="20" height="70" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          <rect x="185" y="240" width="20" height="70" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Genoux */}
          <circle cx="165" cy="325" r="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          <circle cx="195" cy="325" r="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Jambes */}
          <rect x="155" y="335" width="20" height="50" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          <rect x="185" y="335" width="20" height="50" rx="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Chevilles */}
          <circle cx="165" cy="400" r="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          <circle cx="195" cy="400" r="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Pieds */}
          <ellipse cx="165" cy="420" rx="15" ry="7" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          <ellipse cx="195" cy="420" rx="15" ry="7" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"/>
          
          {/* Zones cliquables avec hover effects */}
          {zones.map((zone) => (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                fill={selectedZone === zone.id ? "rgba(16, 185, 129, 0.4)" : "transparent"}
                stroke={selectedZone === zone.id ? "#10b981" : "transparent"}
                strokeWidth="2"
                rx="8"
                className="cursor-pointer hover:fill-emerald-100 transition-all duration-200"
                onClick={() => onZoneClick(zone.id)}
              />
              <text
                x={zone.x + zone.width/2}
                y={zone.y + zone.height/2 + 3}
                textAnchor="middle"
                className={`text-xs font-medium pointer-events-none transition-colors ${
                  selectedZone === zone.id ? 'fill-emerald-800' : 'fill-gray-600'
                }`}
                style={{fontSize: '9px'}}
              >
                {zone.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-3 text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onZoneClick(null)}
          className="text-xs"
        >
          Voir tout
        </Button>
      </div>
    </div>
  );
};
const ExercicesPage = () => {
  const [exercices, setExercices] = useState([]);
  const [filteredExercices, setFilteredExercices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState(undefined);
  const [zoneFilter, setZoneFilter] = useState(undefined);
  const [selectedBodyZone, setSelectedBodyZone] = useState(null);
  const [showNewExerciceForm, setShowNewExerciceForm] = useState(false);
  const [newExercice, setNewExercice] = useState({
    nom: '',
    description: '',
    type_exercice: undefined,
    zone_corporelle: '',
    difficulte: 1,
    duree_minutes: 10,
    repetitions: '',
    series: 1,
    materiel_requis: '',
    url_video: '',
    consignes_specifiques: ''
  });

  useEffect(() => {
    fetchExercices();
  }, []);

  useEffect(() => {
    filterExercices();
  }, [exercices, searchTerm, typeFilter, zoneFilter, selectedBodyZone]);

  const fetchExercices = async () => {
    try {
      const response = await axios.get(`${API}/exercices`);
      setExercices(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des exercices:', error);
    }
  };

  const filterExercices = () => {
    let filtered = exercices;

    if (searchTerm) {
      filtered = filtered.filter(exercice =>
        exercice.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercice.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter && typeFilter !== 'all-types') {
      filtered = filtered.filter(exercice => exercice.type_exercice === typeFilter);
    }

    if (zoneFilter && zoneFilter !== 'all-zones') {
      filtered = filtered.filter(exercice => exercice.zone_corporelle === zoneFilter);
    }

    // Filtrage par zone corporelle depuis le schéma
    if (selectedBodyZone) {
      filtered = filtered.filter(exercice => exercice.zone_corporelle === selectedBodyZone);
    }

    setFilteredExercices(filtered);
  };

  const handleBodyZoneClick = (zone) => {
    setSelectedBodyZone(zone);
    // Reset autres filtres quand on utilise le schéma corporel
    if (zone) {
      setZoneFilter(undefined);
      setTypeFilter(undefined);
      setSearchTerm('');
    }
  };

  const handleNewExercice = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/exercices`, newExercice);
      alert('Exercice créé avec succès !');
      setShowNewExerciceForm(false);
      setNewExercice({
        nom: '',
        description: '',
        type_exercice: undefined,
        zone_corporelle: '',
        difficulte: 1,
        duree_minutes: 10,
        repetitions: '',
        series: 1,
        materiel_requis: '',
        url_video: '',
        consignes_specifiques: ''
      });
      fetchExercices();
    } catch (error) {
      console.error('Erreur lors de la création de l\'exercice:', error);
      alert('Erreur lors de la création de l\'exercice');
    }
  };

  const getDifficultyColor = (difficulte) => {
    switch (difficulte) {
      case 1:
      case 2:
        return 'bg-green-100 text-green-800';
      case 3:
        return 'bg-yellow-100 text-yellow-800';
      case 4:
      case 5:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'renforcement':
        return 'bg-blue-100 text-blue-800';
      case 'mobilite':
        return 'bg-purple-100 text-purple-800';
      case 'etirement':
        return 'bg-green-100 text-green-800';
      case 'proprioception':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Base d'Exercices</h1>
          <p className="text-gray-600">Gérez vos exercices de kinésithérapie</p>
        </div>
        <Button
          onClick={() => setShowNewExerciceForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Exercice
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Nom ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type-filter">Type d'exercice</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">Tous les types</SelectItem>
                  <SelectItem value="renforcement">Renforcement</SelectItem>
                  <SelectItem value="mobilite">Mobilité</SelectItem>
                  <SelectItem value="etirement">Étirement</SelectItem>
                  <SelectItem value="proprioception">Proprioception</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zone-filter">Zone corporelle</Label>
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les zones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-zones">Toutes les zones</SelectItem>
                  <SelectItem value="genou">Genou</SelectItem>
                  <SelectItem value="epaule">Épaule</SelectItem>
                  <SelectItem value="dos">Dos</SelectItem>
                  <SelectItem value="cheville">Cheville</SelectItem>
                  <SelectItem value="cuisse">Cuisse</SelectItem>
                  <SelectItem value="cervicales">Cervicales</SelectItem>
                  <SelectItem value="bras">Bras</SelectItem>
                  <SelectItem value="coude">Coude</SelectItem>
                  <SelectItem value="poignet">Poignet</SelectItem>
                  <SelectItem value="main">Main</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter(undefined);
                  setZoneFilter(undefined);
                }}
                className="w-full"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content with Body Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Body Diagram Sidebar */}
        <div className="lg:col-span-1">
          <BodyDiagram 
            onZoneClick={handleBodyZoneClick} 
            selectedZone={selectedBodyZone}
          />
          
          {selectedBodyZone && (
            <Alert className="mt-4 border-emerald-200 bg-emerald-50">
              <Target className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800">
                Exercices pour: <strong className="capitalize">{selectedBodyZone}</strong>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Exercises List */}
        <div className="lg:col-span-3">
          {/* Exercises Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExercices.map((exercice) => (
              <Card key={exercice.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{exercice.nom}</CardTitle>
                    <Badge className={getDifficultyColor(exercice.difficulte)}>
                      Niveau {exercice.difficulte}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getTypeColor(exercice.type_exercice)}>
                      {exercice.type_exercice}
                    </Badge>
                    <Badge variant="outline">
                      {exercice.zone_corporelle}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{exercice.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {exercice.duree_minutes} minutes
                    </div>
                    {exercice.repetitions && (
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-2 text-gray-400" />
                        {exercice.repetitions}
                      </div>
                    )}
                    {exercice.materiel_requis && (
                      <div className="flex items-center">
                        <Dumbbell className="w-4 h-4 mr-2 text-gray-400" />
                        {exercice.materiel_requis}
                      </div>
                    )}
                  </div>
                  
                  {exercice.url_video && (
                    <div className="mt-4">
                      <a
                        href={exercice.url_video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir la vidéo
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExercices.length === 0 && (
            <Card className="mt-8">
              <CardContent className="text-center py-12">
                <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun exercice trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedBodyZone 
                    ? `Aucun exercice pour la zone "${selectedBodyZone}"`
                    : "Essayez de modifier vos filtres ou ajoutez un nouvel exercice"
                  }
                </p>
                <Button
                  onClick={() => setShowNewExerciceForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel Exercice
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Exercise Dialog */}
      <Dialog open={showNewExerciceForm} onOpenChange={setShowNewExerciceForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>Nouvel Exercice</span>
            </DialogTitle>
            <DialogDescription>
              Ajoutez un nouvel exercice à votre base de données
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleNewExercice} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom de l'exercice *</Label>
                <Input
                  id="nom"
                  value={newExercice.nom}
                  onChange={(e) => setNewExercice(prev => ({ ...prev, nom: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type d'exercice *</Label>
                <Select
                  value={newExercice.type_exercice}
                  onValueChange={(value) => setNewExercice(prev => ({ ...prev, type_exercice: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="renforcement">Renforcement</SelectItem>
                    <SelectItem value="mobilite">Mobilité</SelectItem>
                    <SelectItem value="etirement">Étirement</SelectItem>
                    <SelectItem value="proprioception">Proprioception</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newExercice.description}
                onChange={(e) => setNewExercice(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez l'exercice en détail..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zone">Zone corporelle *</Label>
                <Input
                  id="zone"
                  value={newExercice.zone_corporelle}
                  onChange={(e) => setNewExercice(prev => ({ ...prev, zone_corporelle: e.target.value }))}
                  placeholder="Ex: genou, épaule, dos..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="difficulte">Difficulté (1-5)</Label>
                <Select
                  value={newExercice.difficulte.toString()}
                  onValueChange={(value) => setNewExercice(prev => ({ ...prev, difficulte: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Très facile</SelectItem>
                    <SelectItem value="2">2 - Facile</SelectItem>
                    <SelectItem value="3">3 - Modéré</SelectItem>
                    <SelectItem value="4">4 - Difficile</SelectItem>
                    <SelectItem value="5">5 - Très difficile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duree">Durée (minutes)</Label>
                <Input
                  id="duree"
                  type="number"
                  value={newExercice.duree_minutes}
                  onChange={(e) => setNewExercice(prev => ({ ...prev, duree_minutes: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="series">Nombre de séries</Label>
                <Input
                  id="series"
                  type="number"
                  value={newExercice.series}
                  onChange={(e) => setNewExercice(prev => ({ ...prev, series: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="repetitions">Répétitions</Label>
                <Input
                  id="repetitions"
                  value={newExercice.repetitions}
                  onChange={(e) => setNewExercice(prev => ({ ...prev, repetitions: e.target.value }))}
                  placeholder="Ex: 3x15, 10 sec..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="materiel">Matériel requis</Label>
              <Input
                id="materiel"
                value={newExercice.materiel_requis}
                onChange={(e) => setNewExercice(prev => ({ ...prev, materiel_requis: e.target.value }))}
                placeholder="Ex: Tapis, élastique, haltères..."
              />
            </div>

            <div>
              <Label htmlFor="video">URL Vidéo (YouTube)</Label>
              <Input
                id="video"
                type="url"
                value={newExercice.url_video}
                onChange={(e) => setNewExercice(prev => ({ ...prev, url_video: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div>
              <Label htmlFor="consignes">Consignes spécifiques</Label>
              <Textarea
                id="consignes"
                value={newExercice.consignes_specifiques}
                onChange={(e) => setNewExercice(prev => ({ ...prev, consignes_specifiques: e.target.value }))}
                placeholder="Consignes de sécurité, précautions..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewExerciceForm(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Créer l'Exercice
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Programmes Page Component
const ProgrammesPage = () => {
  const [programmes, setProgrammes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProgramme, setNewProgramme] = useState({
    patient_id: '',
    nom_programme: '',
    objectif_principal: '',
    duree_semaines: 8,
    frequence_hebdomadaire: 3,
    phases: [],
    notes_kine: '',
    adaptation_auto: true
  });

  useEffect(() => {
    fetchProgrammes();
    fetchPatients();
  }, []);

  const fetchProgrammes = async () => {
    try {
      // Pour l'instant, récupérer tous les programmes de tous les patients
      const patientsRes = await axios.get(`${API}/patients`);
      let allProgrammes = [];
      
      for (const patient of patientsRes.data) {
        try {
          const programmesRes = await axios.get(`${API}/programmes/patient/${patient.id}`);
          const programmesWithPatient = programmesRes.data.map(prog => ({
            ...prog,
            patient_nom: `${patient.prenom} ${patient.nom}`,
            patient_pathologie: patient.pathologie
          }));
          allProgrammes = [...allProgrammes, ...programmesWithPatient];
        } catch (error) {
          console.log(`Pas de programmes pour ${patient.prenom} ${patient.nom}`);
        }
      }
      
      setProgrammes(allProgrammes);
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API}/patients`);
      setPatients(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
    }
  };

  const createExampleProgramme = async (patientId) => {
    try {
      const exampleProgramme = {
        patient_id: patientId,
        nom_programme: "Programme de Rééducation Standard",
        objectif_principal: "Récupération fonctionnelle et réduction de la douleur",
        duree_semaines: 8,
        frequence_hebdomadaire: 3,
        phases: [
          {
            nom: "Phase 1 - Récupération",
            semaines: [1, 2],
            objectif: "Réduction douleur et mobilisation douce",
            exercices: [
              {
                type: "mobilite",
                intensite: 3,
                volume_base: { repetitions: 10, series: 2, duree: 8 }
              }
            ]
          },
          {
            nom: "Phase 2 - Renforcement",
            semaines: [3, 4, 5, 6],
            objectif: "Renforcement musculaire progressif",
            exercices: [
              {
                type: "renforcement",
                intensite: 4,
                volume_base: { repetitions: 12, series: 3, duree: 15 }
              }
            ]
          },
          {
            nom: "Phase 3 - Fonctionnel",
            semaines: [7, 8],
            objectif: "Retour aux activités fonctionnelles",
            exercices: [
              {
                type: "proprioception",
                intensite: 4,
                volume_base: { repetitions: 15, series: 3, duree: 20 }
              }
            ]
          }
        ],
        notes_kine: "Programme adaptatif basé sur la douleur et la compliance patient",
        adaptation_auto: true
      };

      await axios.post(`${API}/programmes`, exampleProgramme);
      alert('Programme créé avec succès !');
      fetchProgrammes();
    } catch (error) {
      console.error('Erreur lors de la création du programme:', error);
      alert('Erreur lors de la création du programme');
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'suspendu':
        return 'bg-yellow-100 text-yellow-800';
      case 'termine':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Programmes de Rééducation</h1>
          <p className="text-gray-600">Gestion des programmes personnalisés avec suivi automatique</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Programme
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Programmes Actifs</CardTitle>
            <Calendar className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {programmes.filter(p => p.statut === 'actif').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">En cours d'exécution</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Programmes</CardTitle>
            <Target className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{programmes.length}</div>
            <p className="text-xs text-gray-500 mt-1">Tous statuts confondus</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Patients Suivis</CardTitle>
            <Users className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {new Set(programmes.map(p => p.patient_id)).size}
            </div>
            <p className="text-xs text-gray-500 mt-1">Avec programmes actifs</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des Programmes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programmes.map((programme) => (
          <Card key={programme.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{programme.nom_programme}</CardTitle>
                  <CardDescription className="mt-1">
                    Patient: <span className="font-medium">{programme.patient_nom}</span>
                  </CardDescription>
                  <Badge variant="outline" className="mt-2 text-emerald-700 border-emerald-200">
                    {programme.patient_pathologie}
                  </Badge>
                </div>
                <Badge className={getStatutColor(programme.statut)}>
                  {programme.statut}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="w-4 h-4 mr-2" />
                  {programme.objectif_principal}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {programme.duree_semaines} semaines
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {programme.frequence_hebdomadaire}x/semaine
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm text-gray-500">
                      Phase {programme.phase_actuelle}/{programme.phases.length}
                    </span>
                  </div>
                  <Progress 
                    value={(programme.phase_actuelle / programme.phases.length) * 100} 
                    className="h-2"
                  />
                </div>

                {programme.adaptation_auto && (
                  <div className="flex items-center text-sm text-emerald-700">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Adaptation automatique activée
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 mt-6">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  Voir Détails
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {programmes.length === 0 && (
        <Card className="mt-8">
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun programme créé
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par créer des programmes personnalisés pour vos patients
            </p>
            
            {/* Actions rapides pour créer des programmes d'exemple */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Créer un programme d'exemple :</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {patients.slice(0, 6).map((patient) => (
                  <Button
                    key={patient.id}
                    variant="outline"
                    onClick={() => createExampleProgramme(patient.id)}
                    className="justify-start"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {patient.prenom} {patient.nom}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Suggestions Page Component
const SuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [showNewSuggestion, setShowNewSuggestion] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    titre: '',
    description: '',
    categorie: 'amelioration',
    priorite: 'moyenne'
  });

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${API}/suggestions`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des suggestions:', error);
    }
  };

  const createSuggestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/suggestions`, newSuggestion);
      alert('Suggestion soumise avec succès !');
      setNewSuggestion({
        titre: '',
        description: '',
        categorie: 'amelioration',
        priorite: 'moyenne'
      });
      setShowNewSuggestion(false);
      fetchSuggestions();
    } catch (error) {
      console.error('Erreur lors de la création de la suggestion:', error);
      alert('Erreur lors de la soumission de votre suggestion');
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'approuve':
        return 'bg-green-100 text-green-800';
      case 'en_cours':
        return 'bg-blue-100 text-blue-800';
      case 'termine':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case 'haute':
        return 'text-red-600';
      case 'moyenne':
        return 'text-yellow-600';
      case 'basse':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Suggestions d'Amélioration</h1>
          <p className="text-gray-600">Proposez vos idées pour améliorer KineTrack</p>
        </div>
        <Button
          onClick={() => setShowNewSuggestion(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Suggestion
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Attente</CardTitle>
            <Clock className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {suggestions.filter(s => s.statut === 'en_attente').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Cours</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {suggestions.filter(s => s.statut === 'en_cours').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Terminées</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {suggestions.filter(s => s.statut === 'termine').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            <Star className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{suggestions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{suggestion.titre}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className={getPriorityColor(suggestion.priorite)}>
                      {suggestion.priorite}
                    </Badge>
                    <Badge className={getStatusColor(suggestion.statut)}>
                      {suggestion.statut?.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{suggestion.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(suggestion.created_at).toLocaleDateString()}
                </div>
                <div className="capitalize">
                  {suggestion.categorie}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {suggestions.length === 0 && (
        <Card className="mt-8">
          <CardContent className="text-center py-12">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune suggestion pour le moment
            </h3>
            <p className="text-gray-600 mb-4">
              Soyez le premier à proposer une amélioration !
            </p>
            <Button
              onClick={() => setShowNewSuggestion(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Proposer une Suggestion
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog nouvelle suggestion */}
      <Dialog open={showNewSuggestion} onOpenChange={setShowNewSuggestion}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-emerald-600" />
              <span>Nouvelle Suggestion</span>
            </DialogTitle>
            <DialogDescription>
              Partagez vos idées pour améliorer KineTrack
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={createSuggestion} className="space-y-4">
            <div>
              <Label htmlFor="titre">Titre de la suggestion *</Label>
              <Input
                id="titre"
                value={newSuggestion.titre}
                onChange={(e) => setNewSuggestion(prev => ({ ...prev, titre: e.target.value }))}
                placeholder="Ex: Ajouter un système de notifications"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categorie">Catégorie</Label>
                <Select
                  value={newSuggestion.categorie}
                  onValueChange={(value) => setNewSuggestion(prev => ({ ...prev, categorie: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amelioration">Amélioration</SelectItem>
                    <SelectItem value="nouvelle_fonctionnalite">Nouvelle fonctionnalité</SelectItem>
                    <SelectItem value="bug">Correction de bug</SelectItem>
                    <SelectItem value="interface">Interface utilisateur</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priorite">Priorité</Label>
                <Select
                  value={newSuggestion.priorite}
                  onValueChange={(value) => setNewSuggestion(prev => ({ ...prev, priorite: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basse">Basse</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description détaillée *</Label>
              <Textarea
                id="description"
                value={newSuggestion.description}
                onChange={(e) => setNewSuggestion(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez votre suggestion en détail..."
                className="h-32"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewSuggestion(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Soumettre
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function App() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientsList />} />
          <Route path="/nouveau-patient" element={<NewPatientForm />} />
          <Route path="/exercices" element={<ExercicesPage />} />
          <Route path="/programmes" element={<ProgrammesPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;