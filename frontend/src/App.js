import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  MessageCircle,
  Bell,
  Send,
  Check,
  CheckCheck,
  Circle,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  Camera,
  Video,
  Upload,
  Image as ImageIcon
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
    { path: '/coaching', label: 'Coaching', icon: Target },
    { path: '/agenda', label: 'Agenda', icon: Clock },
    { path: '/messagerie', label: 'Messagerie', icon: MessageCircle },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/suggestions', label: 'Suggestions', icon: Star },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-emerald-100">
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
  const [showCoachingPanel, setShowCoachingPanel] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    // Check for patient ID in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    
    if (patientId && patients.length > 0) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setSelectedPatient(patient);
        setShowPatientDetails(true);
        // Clear the URL parameter
        window.history.replaceState({}, '', '/patients');
      }
    }
  }, [patients]);

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
                  onClick={() => {
                    window.location.href = `/patients/${patient.id}`;
                  }}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowCoachingPanel(true);
                  }}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700"
                >
                  <Target className="w-4 h-4 mr-1" />
                  Coaching
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

                {/* Photos/Vidéos Section */}
                <MediaSection patient={selectedPatient} />
                
                {/* Exercise Assignment Section */}
                <ExerciseAssignmentSection patient={selectedPatient} />
                
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
// Pain Drawing Component - Mark Laslett Style with Canvas Drawing
const PainDrawing = ({ painAreas, onPainAreaClick, onDrawingUpdate }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FF0000'); // Rouge par défaut
  const [brushSize, setBrushSize] = useState(5);
  const [drawingData, setDrawingData] = useState([]);

  // Codes couleurs Mark Laslett
  const painColors = [
    { id: 1, color: '#FF0000', name: 'Douleur aiguë', label: 'Rouge: Douleur aiguë, coup de poignard, pincement, élancement, traitement' },
    { id: 2, color: '#FFFF00', name: 'Douleur profonde', label: 'Jaune: Douleur profonde, difficile à localiser précisément, sourde, floue' },
    { id: 3, color: '#0000FF', name: 'Chaud/Froid', label: 'Bleu: Sensation de chaud ou de froid' },
    { id: 4, color: '#00FF00', name: 'Fourmillement', label: 'Vert: Sensation de fourmillement ou de piqûre d\'aiguille' },
    { id: 5, color: '#000000', name: 'Engourdissement', label: 'Noir: Engourdissement, anesthésie, perte de sensation' },
    { id: 6, color: '#8B4513', name: 'Raideur/Fatigue', label: 'Marron: Sensation de raideur, de fatigue, autre' }
  ];

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Save drawing data
    const newPoint = { x, y, color: selectedColor, size: brushSize };
    setDrawingData([...drawingData, newPoint]);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      if (onDrawingUpdate) {
        onDrawingUpdate(drawingData);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawingData([]);
    if (onDrawingUpdate) {
      onDrawingUpdate([]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Body Chart (code couleur M.Laslett)</h3>
        <Button
          onClick={clearCanvas}
          variant="outline"
          size="sm"
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Effacer
        </Button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Dessinez sur le corps humain pour indiquer les zones de douleur (compatible souris et stylet)
      </p>

      {/* Color Palette - Mark Laslett */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-semibold text-gray-700 mb-3">Sélectionnez le type de douleur :</p>
        <div className="grid grid-cols-1 gap-2">
          {painColors.map((painType) => (
            <button
              key={painType.id}
              onClick={() => setSelectedColor(painType.color)}
              className={`flex items-center space-x-3 p-2 rounded-lg border-2 transition-all hover:bg-white ${
                selectedColor === painType.color ? 'border-emerald-500 bg-white shadow-md' : 'border-transparent'
              }`}
            >
              <div 
                className="w-8 h-8 rounded border-2 border-gray-300 flex-shrink-0"
                style={{ backgroundColor: painType.color }}
              ></div>
              <span className="text-xs text-gray-700 text-left flex-1">{painType.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brush Size Control */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Taille du pinceau: {brushSize}px
        </Label>
        <input
          type="range"
          min="2"
          max="15"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
      </div>

      {/* Canvas Drawing Area with Body Chart Background */}
      <div className="flex justify-center mb-4 bg-white p-4 rounded-lg border-2 border-gray-300">
        <div className="relative">
          {/* Background Body Chart SVG */}
          <svg 
            width="600" 
            height="800" 
            viewBox="0 0 600 800" 
            className="absolute top-0 left-0 pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {/* Vue de face */}
            <g transform="translate(100, 50)">
              {/* Tête */}
              <ellipse cx="100" cy="40" rx="35" ry="45" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Cou */}
              <rect x="85" y="85" width="30" height="20" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Corps/Torse */}
              <ellipse cx="100" cy="170" rx="55" ry="80" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Bras gauche */}
              <line x1="45" y1="120" x2="20" y2="180" stroke="#cbd5e1" strokeWidth="2"/>
              <line x1="20" y1="180" x2="15" y2="240" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Bras droit */}
              <line x1="155" y1="120" x2="180" y2="180" stroke="#cbd5e1" strokeWidth="2"/>
              <line x1="180" y1="180" x2="185" y2="240" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Mains */}
              <ellipse cx="15" cy="250" rx="8" ry="12" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              <ellipse cx="185" cy="250" rx="8" ry="12" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Bassin */}
              <rect x="65" y="250" width="70" height="40" rx="10" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Jambe gauche */}
              <line x1="75" y1="290" x2="70" y2="400" stroke="#cbd5e1" strokeWidth="2"/>
              <line x1="70" y1="400" x2="68" y2="500" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Jambe droite */}
              <line x1="125" y1="290" x2="130" y2="400" stroke="#cbd5e1" strokeWidth="2"/>
              <line x1="130" y1="400" x2="132" y2="500" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Pieds */}
              <ellipse cx="68" cy="510" rx="12" ry="6" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              <ellipse cx="132" cy="510" rx="12" ry="6" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
            </g>

            {/* Vue de dos */}
            <g transform="translate(350, 50)">
              {/* Tête dos */}
              <ellipse cx="100" cy="40" rx="35" ry="45" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Cou */}
              <rect x="85" y="85" width="30" height="20" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Dos */}
              <ellipse cx="100" cy="170" rx="55" ry="80" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Colonne vertébrale */}
              <line x1="100" y1="100" x2="100" y2="250" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3"/>
              {/* Bras gauche */}
              <line x1="45" y1="120" x2="20" y2="180" stroke="#cbd5e1" strokeWidth="2"/>
              <line x1="20" y1="180" x2="15" y2="240" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Bras droit */}
              <line x1="155" y1="120" x2="180" y2="180" stroke="#cbd5e1" strokeWidth="2"/>
              <line x1="180" y1="180" x2="185" y2="240" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Mains */}
              <ellipse cx="15" cy="250" rx="8" ry="12" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              <ellipse cx="185" cy="250" rx="8" ry="12" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Bassin */}
              <rect x="65" y="250" width="70" height="40" rx="10" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Jambe gauche */}
              <line x1="75" y1="290" x2="70" y2="400" stroke="#cbd5e1" strokeWidth="2"/>
              <line x1="70" y1="400" x2="68" y2="500" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Jambe droite */}
              <line x1="125" y1="290" x2="130" y2="400" stroke="#cbd5e1" strokeWidth="2"/>
              <line x1="130" y1="400" x2="132" y2="500" stroke="#cbd5e1" strokeWidth="2"/>
              {/* Pieds */}
              <ellipse cx="68" cy="510" rx="12" ry="6" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
              <ellipse cx="132" cy="510" rx="12" ry="6" fill="none" stroke="#cbd5e1" strokeWidth="2"/>
            </g>
          </svg>

          {/* Drawing Canvas */}
          <canvas
            ref={canvasRef}
            width={600}
            height={800}
            className="border-2 border-gray-400 rounded cursor-crosshair"
            style={{ touchAction: 'none', zIndex: 2, position: 'relative' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
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

// Messagerie & Notifications Page Component
const MessagingPage = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [patients, setPatients] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchConversations();
    fetchPatients();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API}/notifications`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.lu).length);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      // Données factices pour démonstration
      setNotifications([
        {
          id: '1',
          type: 'exercice_complete',
          titre: 'Exercice terminé',
          message: 'Marie Dupont a terminé sa séance de renforcement quadriceps',
          patient_nom: 'Marie Dupont',
          patient_id: '1',
          lu: false,
          created_at: new Date().toISOString(),
          icone: 'CheckCircle'
        },
        {
          id: '2',
          type: 'commentaire',
          titre: 'Nouveau commentaire',
          message: 'Test TestPatient a ajouté un commentaire sur son programme',
          patient_nom: 'Test TestPatient',
          patient_id: '2',
          lu: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          icone: 'MessageCircle'
        },
        {
          id: '3',
          type: 'douleur_elevee',
          titre: 'Douleur élevée signalée',
          message: 'Marie Dupont a signalé une douleur de 8/10 après sa séance',
          patient_nom: 'Marie Dupont', 
          patient_id: '1',
          lu: true,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          icone: 'AlertCircle'
        }
      ]);
      setUnreadCount(2);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API}/conversations`);
      setConversations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
      // Données factices pour démonstration
      setConversations([
        {
          id: '1',
          patient_id: '1',
          patient_nom: 'Marie Dupont',
          patient_avatar: null,
          dernier_message: 'Merci pour les exercices, je me sens mieux !',
          dernier_message_date: new Date().toISOString(),
          messages_non_lus: 2,
          statut: 'active'
        },
        {
          id: '2', 
          patient_id: '2',
          patient_nom: 'Test TestPatient',
          patient_avatar: null,
          dernier_message: 'Bonjour docteur, j\'ai une question sur mon programme',
          dernier_message_date: new Date(Date.now() - 1800000).toISOString(),
          messages_non_lus: 0,
          statut: 'active'
        }
      ]);
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

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`${API}/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      // Messages factices pour démonstration
      if (conversationId === '1') {
        setMessages([
          {
            id: '1',
            contenu: 'Bonjour, comment se passent vos exercices ?',
            expediteur: 'therapeute',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            lu: true
          },
          {
            id: '2',
            contenu: 'Bonjour docteur ! Ça va bien, mais j\'ai encore un peu mal au genou après les squats muraux.',
            expediteur: 'patient',
            timestamp: new Date(Date.now() - 82800000).toISOString(),
            lu: true
          },
          {
            id: '3',
            contenu: 'C\'est normal au début. Essayez de réduire un peu l\'amplitude et augmentez progressivement. Comment évaluez-vous votre douleur sur 10 ?',
            expediteur: 'therapeute',
            timestamp: new Date(Date.now() - 82800000).toISOString(),
            lu: true
          },
          {
            id: '4',
            contenu: 'Je dirais environ 4/10 pendant l\'exercice, et 2/10 au repos. C\'est supportable !',
            expediteur: 'patient',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            lu: true
          },
          {
            id: '5',
            contenu: 'Parfait ! Continuez comme ça. Merci pour les exercices, je me sens mieux !',
            expediteur: 'patient',
            timestamp: new Date().toISOString(),
            lu: false
          }
        ]);
      }
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageData = {
        contenu: newMessage,
        conversation_id: selectedConversation.id,
        expediteur: 'therapeute'
      };

      await axios.post(`${API}/messages`, messageData);
      
      // Ajouter le message localement
      const newMessageObj = {
        id: Date.now().toString(),
        contenu: newMessage,
        expediteur: 'therapeute',
        timestamp: new Date().toISOString(),
        lu: true
      };
      
      setMessages(prev => [...prev, newMessageObj]);
      setNewMessage('');
      
      // Mettre à jour la conversation
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, dernier_message: newMessage, dernier_message_date: new Date().toISOString() }
          : conv
      ));

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert('Erreur lors de l\'envoi du message');
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`${API}/notifications/${notificationId}/read`);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, lu: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      // Marquer localement pour la démo
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, lu: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'exercice_complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'commentaire':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'douleur_elevee':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'seance_manquee':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays}j`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messagerie & Notifications</h1>
          <p className="text-gray-600">Communication avec vos patients et suivi d'activité</p>
        </div>
        {unreadCount > 0 && (
          <Badge className="bg-red-500 text-white">
            {unreadCount} non lues
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar avec onglets */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Communication</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                    activeTab === 'notifications' 
                      ? 'bg-emerald-100 text-emerald-700 border-r-2 border-emerald-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                    activeTab === 'messages' 
                      ? 'bg-emerald-100 text-emerald-700 border-r-2 border-emerald-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 mr-3" />
                  <span>Messages</span>
                  {conversations.reduce((acc, conv) => acc + conv.messages_non_lus, 0) > 0 && (
                    <Badge className="ml-auto bg-blue-500 text-white text-xs">
                      {conversations.reduce((acc, conv) => acc + conv.messages_non_lus, 0)}
                    </Badge>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3">
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-emerald-600" />
                  Notifications d'Activité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                        !notification.lu 
                          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => !notification.lu && markNotificationAsRead(notification.id)}
                    >
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${!notification.lu ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.titre}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                            {!notification.lu && (
                              <Circle className="w-2 h-2 fill-blue-600 text-blue-600" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className="text-xs">
                            {notification.patient_nom}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {notifications.length === 0 && (
                    <div className="text-center py-12">
                      <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucune notification
                      </h3>
                      <p className="text-gray-600">
                        Les activités de vos patients apparaîtront ici
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'messages' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Liste des conversations */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Conversations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-1">
                        {conversations.map((conversation) => (
                          <button
                            key={conversation.id}
                            onClick={() => {
                              setSelectedConversation(conversation);
                              fetchMessages(conversation.id);
                            }}
                            className={`w-full flex items-center p-4 text-left transition-colors ${
                              selectedConversation?.id === conversation.id
                                ? 'bg-emerald-100 border-r-2 border-emerald-600'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {conversation.patient_nom.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {conversation.patient_nom}
                                </h4>
                                {conversation.messages_non_lus > 0 && (
                                  <Badge className="bg-blue-500 text-white text-xs">
                                    {conversation.messages_non_lus}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 truncate mt-1">
                                {conversation.dernier_message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTimeAgo(conversation.dernier_message_date)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Zone de chat */}
              <div className="lg:col-span-2">
                <Card className="h-full flex flex-col">
                  {selectedConversation ? (
                    <>
                      <CardHeader className="border-b">
                        <CardTitle className="flex items-center">
                          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {selectedConversation.patient_nom.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {selectedConversation.patient_nom}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="flex-1 flex flex-col p-0">
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-4">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.expediteur === 'therapeute' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    message.expediteur === 'therapeute'
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  <p className="text-sm">{message.contenu}</p>
                                  <div className={`flex items-center justify-end mt-1 space-x-1 ${
                                    message.expediteur === 'therapeute' ? 'text-emerald-100' : 'text-gray-500'
                                  }`}>
                                    <span className="text-xs">
                                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                    {message.expediteur === 'therapeute' && (
                                      message.lu ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        
                        <div className="border-t p-4">
                          <form onSubmit={sendMessage} className="flex space-x-2">
                            <Input
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Tapez votre message..."
                              className="flex-1"
                            />
                            <Button 
                              type="submit" 
                              disabled={!newMessage.trim()}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </form>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Sélectionnez une conversation
                        </h3>
                        <p className="text-gray-600">
                          Choisissez un patient pour commencer à discuter
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Coaching Panel Component
const CoachingPanel = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [cycles, setCycles] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [coachingProfile, setCoachingProfile] = useState({
    sport_principal: '',
    niveau: 'debutant',
    objectifs: [],
    contraintes: [],
    disponibilites: {}
  });
  const [aiSuggestions, setAiSuggestions] = useState([]);

  useEffect(() => {
    if (patient) {
      fetchCoachingData();
      generateAISuggestions();
    }
  }, [patient]);

  const fetchCoachingData = async () => {
    try {
      // Récupérer les cycles existants
      const cyclesRes = await axios.get(`${API}/coaching/cycles/patient/${patient.id}`);
      setCycles(cyclesRes.data);
      
      // Récupérer les séances
      const sessionsRes = await axios.get(`${API}/coaching/sessions/patient/${patient.id}`);  
      setSessions(sessionsRes.data);
      
      // Récupérer le profil coaching
      const profileRes = await axios.get(`${API}/coaching/profile/patient/${patient.id}`);
      setCoachingProfile(profileRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données de coaching:', error);
      // Données factices pour démonstration
      setCycles([
        {
          id: '1',
          nom: 'Cycle Récupération Post-Blessure',
          type: 'macro',
          duree_semaines: 8,
          phase_actuelle: 2,
          phases: [
            { nom: 'Récupération', semaines: 2, objectif: 'Réduction douleur' },
            { nom: 'Renforcement', semaines: 4, objectif: 'Renforcement progressif' },
            { nom: 'Retour activité', semaines: 2, objectif: 'Retour au sport' }
          ],
          statut: 'actif',
          progression: 35
        }
      ]);
      
      setSessions([
        { id: '1', date: '2024-01-15', type: 'evaluation', statut: 'termine', douleur: 6 },
        { id: '2', date: '2024-01-17', type: 'renforcement', statut: 'termine', douleur: 5 },
        { id: '3', date: '2024-01-19', type: 'renforcement', statut: 'planifie', douleur: null },
        { id: '4', date: '2024-01-22', type: 'proprioception', statut: 'planifie', douleur: null }
      ]);
      
      setCoachingProfile({
        sport_principal: 'Course à pied',
        niveau: 'intermediaire',
        objectifs: ['Retour au sport', 'Prévention des blessures'],
        contraintes: ['Disponibilité limitée en semaine'],
        disponibilites: { lundi: true, mercredi: true, vendredi: true }
      });
    }
  };

  const generateAISuggestions = async () => {
    try {
      const response = await axios.post(`${API}/coaching/ai-suggestions/${patient.id}`);
      setAiSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Erreur lors de la génération des suggestions IA:', error);
      // Suggestions factices pour démonstration
      setAiSuggestions([
        {
          type: 'progression',
          titre: 'Augmenter l\'intensité',
          description: 'Le patient montre une bonne évolution. Vous pouvez augmenter l\'intensité de 10-15%.',
          priorite: 'moyenne',
          icone: 'TrendingUp'
        },
        {
          type: 'exercice',
          titre: 'Ajouter proprioception', 
          description: 'Intégrer des exercices de proprioception pour améliorer la stabilité.',
          priorite: 'haute',
          icone: 'Target'
        },
        {
          type: 'planning',
          titre: 'Optimiser les créneaux',
          description: 'Programmer les séances intenses en début de semaine selon ses disponibilités.',
          priorite: 'basse',
          icone: 'Calendar'
        }
      ]);
    }
  };

  const getSuggestionIcon = (iconName) => {
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'Target': return <Target className="w-5 h-5" />;
      case 'Calendar': return <Calendar className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case 'haute': return 'border-l-red-500 bg-red-50';
      case 'moyenne': return 'border-l-yellow-500 bg-yellow-50';
      case 'basse': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[95vw] h-[90vh] max-w-7xl overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar Patient */}
          <div className="w-80 bg-gradient-to-b from-emerald-50 to-blue-50 border-r border-emerald-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Coaching Panel</h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Profil Patient */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {patient.prenom?.[0]}{patient.nom?.[0]}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">
                    {patient.prenom} {patient.nom}
                  </h3>
                  <p className="text-sm text-gray-600">{patient.age} ans</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pathologie:</span>
                  <span className="font-medium">{patient.pathologie}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sport:</span>
                  <span className="font-medium">{coachingProfile.sport_principal || 'Non défini'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Niveau:</span>
                  <Badge variant="outline" className="capitalize">
                    {coachingProfile.niveau}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation Coaching */}
            <div className="space-y-2">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
                { id: 'cycles', label: 'Cycles & Phases', icon: Calendar },
                { id: 'planning', label: 'Planning', icon: Clock },
                { id: 'ai-coach', label: 'Assistant IA', icon: Sparkles },
                { id: 'analytics', label: 'Analyses', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenu Principal */}
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h3>
                    <Badge className="bg-emerald-100 text-emerald-800">
                      Cycle actif
                    </Badge>
                  </div>

                  {/* Métriques rapides */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Calendar className="w-8 h-8 text-emerald-600" />
                          <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">8</p>
                            <p className="text-sm text-gray-600">Séances total</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <TrendingUp className="w-8 h-8 text-blue-600" />
                          <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">35%</p>
                            <p className="text-sm text-gray-600">Progression</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Target className="w-8 h-8 text-orange-600" />
                          <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">6→4</p>
                            <p className="text-sm text-gray-600">Douleur (/10)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                          <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">92%</p>
                            <p className="text-sm text-gray-600">Compliance</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Cycle actuel */}
                  {cycles.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Cycle Actuel</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{cycles[0].nom}</h4>
                            <Badge className="bg-blue-100 text-blue-800">
                              Semaine {cycles[0].phase_actuelle}/{cycles[0].duree_semaines}
                            </Badge>
                          </div>
                          
                          <Progress value={cycles[0].progression} className="h-3" />
                          
                          <div className="grid grid-cols-3 gap-4">
                            {cycles[0].phases.map((phase, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                  index + 1 === cycles[0].phase_actuelle
                                    ? 'bg-emerald-50 border-emerald-200'
                                    : index + 1 < cycles[0].phase_actuelle
                                    ? 'bg-gray-50 border-gray-200'
                                    : 'bg-white border-gray-200'
                                }`}
                              >
                                <div className="flex items-center mb-2">
                                  {index + 1 < cycles[0].phase_actuelle ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : index + 1 === cycles[0].phase_actuelle ? (
                                    <Clock className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-gray-400" />
                                  )}
                                  <span className="ml-2 font-medium text-sm">{phase.nom}</span>
                                </div>
                                <p className="text-xs text-gray-600">{phase.objectif}</p>
                                <p className="text-xs text-gray-500 mt-1">{phase.semaines} semaines</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === 'ai-coach' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">Assistant Coaching IA</h3>
                    <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Nouvelles suggestions
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {aiSuggestions.map((suggestion, index) => (
                      <Card key={index} className={`border-l-4 ${getPriorityColor(suggestion.priorite)}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {getSuggestionIcon(suggestion.icone)}
                            </div>
                            <div className="ml-4 flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {suggestion.titre}
                              </h4>
                              <p className="text-gray-600 text-sm mb-4">
                                {suggestion.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge 
                                  className={`${
                                    suggestion.priorite === 'haute' ? 'bg-red-100 text-red-800' :
                                    suggestion.priorite === 'moyenne' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {suggestion.priorite}
                                </Badge>
                                <div className="space-x-2">
                                  <Button variant="outline" size="sm">
                                    Ignorer
                                  </Button>
                                  <Button size="sm" className="bg-emerald-600">
                                    Appliquer
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'planning' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">Planning des Séances</h3>
                    <Button className="bg-emerald-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Planifier séance
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Séances à venir</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {sessions.filter(s => s.statut === 'planifie').map((session) => (
                            <div key={session.id} className="flex items-center p-3 bg-blue-50 rounded-lg">
                              <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                              <div className="flex-1">
                                <div className="font-medium">{session.type}</div>
                                <div className="text-sm text-gray-600">
                                  {new Date(session.date).toLocaleDateString('fr-FR')}
                                </div>
                              </div>
                              <Badge variant="outline">Planifiée</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Historique</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {sessions.filter(s => s.statut === 'termine').map((session) => (
                            <div key={session.id} className="flex items-center p-3 bg-green-50 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                              <div className="flex-1">
                                <div className="font-medium">{session.type}</div>
                                <div className="text-sm text-gray-600">
                                  {new Date(session.date).toLocaleDateString('fr-FR')}
                                  {session.douleur && ` • Douleur: ${session.douleur}/10`}
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Terminée</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Agenda Page Component
const AgendaPage = () => {
  const [currentView, setCurrentView] = useState('semaine'); // jour, 3jours, semaine, mois
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rendezVous, setRendezVous] = useState([]);
  const [categories, setCategories] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showNewRdvModal, setShowNewRdvModal] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showSeriesModal, setShowSeriesModal] = useState(null);
  const [showWorkingHoursModal, setShowWorkingHoursModal] = useState(false);
  const [workingHours, setWorkingHours] = useState({
    lundi: { active: true, start: '08:00', end: '20:00', pauseStart: '12:00', pauseEnd: '14:00' },
    mardi: { active: true, start: '08:00', end: '20:00', pauseStart: '12:00', pauseEnd: '14:00' },
    mercredi: { active: true, start: '08:00', end: '20:00', pauseStart: '12:00', pauseEnd: '14:00' },
    jeudi: { active: true, start: '08:00', end: '20:00', pauseStart: '12:00', pauseEnd: '14:00' },
    vendredi: { active: true, start: '08:00', end: '20:00', pauseStart: '12:00', pauseEnd: '14:00' },
    samedi: { active: false, start: '09:00', end: '12:00', pauseStart: '', pauseEnd: '' },
    dimanche: { active: false, start: '09:00', end: '12:00', pauseStart: '', pauseEnd: '' }
  });
  const [practitioners, setPractitioners] = useState([
    { 
      id: 'default', 
      nom: 'Dr. Principal', 
      actif: true, 
      couleur: '#3B82F6',
      cabinet: {
        nom: 'DUPUIS ADRIEN',
        titre: 'Kinésithérapeute',
        adresse: '2 Rue Jean Baptiste Weckerlin',
        ville: '68500 Guebwiller', 
        telephone: '03 89 37 31 90',
        email: 'adrien.dupuis.kine@gmail.com',
        rpps: '10107211574',
        am: '9774555773'
      },
      horaires: {
        debut: '07:30',
        fin: '20:00'
      }
    }
  ]);
  const [selectedPractitioner, setSelectedPractitioner] = useState('default');
  const [showPractitionersModal, setShowPractitionersModal] = useState(false);
  const [blockedSlots, setBlockedSlots] = useState({});
  const [showCoachingModal, setShowCoachingModal] = useState(false);
  const [selectedPatientForCoaching, setSelectedPatientForCoaching] = useState(null);
  const [seriesSelection, setSeriesSelection] = useState({
    isSelecting: false,
    selectedSlots: [],
    baseRdv: null
  });
  const [loading, setLoading] = useState(true);
  
  // Advanced features state
  const [copiedRdv, setCopiedRdv] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [draggedRdv, setDraggedRdv] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Quick input state
  const [quickInputVisible, setQuickInputVisible] = useState(null); // {day, time}
  const [quickInputValue, setQuickInputValue] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Initialize default categories if needed
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/agenda/init-categories-defaut`);
        
        // Fetch categories, patients, and appointments
        const [categoriesRes, patientsRes, rdvRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categories-seances`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/patients`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/rendez-vous`)
        ]);
        
        setCategories(categoriesRes.data);
        setPatients(patientsRes.data);
        setRendezVous(rdvRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter patients based on input
  useEffect(() => {
    if (quickInputValue.length > 0) {
      const filtered = patients.filter(patient => 
        `${patient.nom} ${patient.prenom}`.toLowerCase().includes(quickInputValue.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients([]);
    }
  }, [quickInputValue, patients]);

  // Navigation functions
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    switch (currentView) {
      case 'jour':
        newDate.setDate(newDate.getDate() + direction);
        break;
      case '3jours':
        newDate.setDate(newDate.getDate() + (direction * 3));
        break;
      case 'semaine':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'mois':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
    }
    
    setCurrentDate(newDate);
  };

  const formatDateTitle = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    switch (currentView) {
      case 'jour':
        return currentDate.toLocaleDateString('fr-FR', options);
      case '3jours':
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 2);
        return `${currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
      case 'semaine':
        const startWeek = new Date(currentDate);
        startWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        const endWeek = new Date(startWeek);
        endWeek.setDate(startWeek.getDate() + 6);
        const weekNumber = getWeekNumber(startWeek);
        return `Semaine ${weekNumber} • ${startWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
      case 'mois':
        return currentDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
      default:
        return '';
    }
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  const getViewDays = () => {
    const days = [];
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    
    switch (currentView) {
      case 'jour':
        days.push(new Date(currentDate));
        break;
      case '3jours':
        for (let i = 0; i < 3; i++) {
          const day = new Date(currentDate);
          day.setDate(currentDate.getDate() + i);
          days.push(day);
        }
        break;
      case 'semaine':
        const startWeek = new Date(currentDate);
        startWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        
        // Filter days based on working hours settings
        for (let i = 0; i < 7; i++) {
          const day = new Date(startWeek);
          day.setDate(startWeek.getDate() + i);
          const dayName = dayNames[day.getDay()];
          
          // Only include days that are marked as active in working hours
          if (workingHours[dayName]?.active) {
            days.push(day);
          }
        }
        break;
    }
    
    return days;
  };

  const isTimeSlotWorking = (day, time) => {
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const dayName = dayNames[day.getDay()];
    const daySettings = workingHours[dayName];
    
    if (!daySettings?.active) return false;
    
    const [hour, minute] = time.split(':').map(Number);
    const timeValue = hour * 60 + minute;
    
    // Check if within working hours
    const [startHour, startMinute] = daySettings.start.split(':').map(Number);
    const [endHour, endMinute] = daySettings.end.split(':').map(Number);
    const startValue = startHour * 60 + startMinute;
    const endValue = endHour * 60 + endMinute;
    
    if (timeValue < startValue || timeValue >= endValue) return false;
    
    // Check if during pause
    if (daySettings.pauseStart && daySettings.pauseEnd) {
      const [pauseStartHour, pauseStartMinute] = daySettings.pauseStart.split(':').map(Number);
      const [pauseEndHour, pauseEndMinute] = daySettings.pauseEnd.split(':').map(Number);
      const pauseStartValue = pauseStartHour * 60 + pauseStartMinute;
      const pauseEndValue = pauseEndHour * 60 + pauseEndMinute;
      
      if (timeValue >= pauseStartValue && timeValue < pauseEndValue) return false;
    }
    
    return true;
  };

  const getRdvForDay = (day) => {
    const dayStr = day.toISOString().split('T')[0];
    return rendezVous.filter(rdv => {
      const rdvDate = new Date(rdv.date_debut).toISOString().split('T')[0];
      return rdvDate === dayStr;
    }).sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut));
  };

  const generateTimeSlots = () => {
    const currentPractitioner = practitioners.find(p => p.id === selectedPractitioner);
    const startTime = currentPractitioner?.horaires?.debut || '07:30';
    const endTime = currentPractitioner?.horaires?.fin || '20:00';
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const slots = [];
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const time = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      slots.push(time);
      
      currentMin += 15;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour++;
      }
    }
    
    return slots;
  };

  const isSlotBlocked = (day, time, practitionerId) => {
    const slotKey = `${practitionerId}_${day.toISOString().split('T')[0]}_${time}`;
    return blockedSlots[slotKey] || false;
  };

  const toggleSlotBlocked = (day, time, practitionerId) => {
    const slotKey = `${practitionerId}_${day.toISOString().split('T')[0]}_${time}`;
    setBlockedSlots({
      ...blockedSlots,
      [slotKey]: !blockedSlots[slotKey]
    });
  };

  const handleQuickInput = (day, time) => {
    setQuickInputVisible({ day, time });
    setQuickInputValue('');
    setFilteredPatients([]);
  };

  const handlePatientSelect = async (patient, selectedCategory) => {
    if (!quickInputVisible) return;

    const { day, time } = quickInputVisible;
    const [hour, minute] = time.split(':').map(Number);
    const dateDebut = new Date(day);
    dateDebut.setHours(hour, minute, 0, 0);
    
    // Use first category as default if none selected
    const category = selectedCategory || categories[0];
    if (!category) return;

    const dateFin = new Date(dateDebut.getTime() + category.duree_defaut * 60000);

    const rdvData = {
      patient_id: patient.id,
      patient_nom: `${patient.nom} ${patient.prenom}`,
      categorie_id: category.id,
      categorie_nom: category.nom,
      date_debut: dateDebut.toISOString(),
      date_fin: dateFin.toISOString(),
      duree_minutes: category.duree_defaut,
      notes: ''
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/rendez-vous`, rdvData);
      setRendezVous([...rendezVous, response.data]);
      setQuickInputVisible(null);
      setQuickInputValue('');
    } catch (error) {
      console.error('Erreur lors de la création du RDV:', error);
      alert(error.response?.data?.detail || 'Erreur lors de la création du rendez-vous');
    }
  };

  const createNewRdv = async (rdvData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/rendez-vous`, rdvData);
      setRendezVous([...rendezVous, response.data]);
      setShowNewRdvModal(false);
    } catch (error) {
      console.error('Erreur lors de la création du RDV:', error);
      alert(error.response?.data?.detail || 'Erreur lors de la création du rendez-vous');
    }
  };

  // Advanced RDV management functions
  const handleCopyRdv = (rdv) => {
    setCopiedRdv(rdv);
    setContextMenu(null);
  };

  const handlePasteRdv = async (targetDay, targetTime) => {
    if (!copiedRdv) return;

    const [hour, minute] = targetTime.split(':').map(Number);
    const dateDebut = new Date(targetDay);
    dateDebut.setHours(hour, minute, 0, 0);
    const dateFin = new Date(dateDebut.getTime() + copiedRdv.duree_minutes * 60000);

    const newRdvData = {
      ...copiedRdv,
      id: undefined,
      date_debut: dateDebut.toISOString(),
      date_fin: dateFin.toISOString(),
      created_at: undefined,
      updated_at: undefined
    };

    try {
      await createNewRdv(newRdvData);
    } catch (error) {
      alert('Erreur lors du collage du rendez-vous');
    }
  };

  const handleDuplicateRdv = async (rdv) => {
    const nextWeek = new Date(rdv.date_debut);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateFin = new Date(nextWeek.getTime() + rdv.duree_minutes * 60000);

    const duplicatedRdv = {
      ...rdv,
      id: undefined,
      date_debut: nextWeek.toISOString(),
      date_fin: dateFin.toISOString(),
      created_at: undefined,
      updated_at: undefined
    };

    try {
      await createNewRdv(duplicatedRdv);
      setContextMenu(null);
    } catch (error) {
      alert('Erreur lors de la duplication du rendez-vous');
    }
  };

  const handleCreateSeries = (rdv) => {
    if (rdv) {
      // Start series selection mode with existing RDV
      setSeriesSelection({
        isSelecting: true,
        selectedSlots: [],
        baseRdv: rdv
      });
      setContextMenu(null);
    } else {
      // Create new series - this will be handled when a slot is selected
      setSeriesSelection({
        isSelecting: true,
        selectedSlots: [],
        baseRdv: null
      });
    }
  };

  const handleSlotSelection = (day, time) => {
    if (!seriesSelection.isSelecting) return;
    
    const slotKey = `${day.toISOString().split('T')[0]}_${time}`;
    const isSelected = seriesSelection.selectedSlots.includes(slotKey);
    
    if (isSelected) {
      // Remove from selection
      setSeriesSelection({
        ...seriesSelection,
        selectedSlots: seriesSelection.selectedSlots.filter(slot => slot !== slotKey)
      });
    } else {
      // Add to selection
      setSeriesSelection({
        ...seriesSelection,
        selectedSlots: [...seriesSelection.selectedSlots, slotKey]
      });
    }
  };

  const handleConfirmSeriesSelection = () => {
    if (seriesSelection.selectedSlots.length === 0) {
      alert('Veuillez sélectionner au moins un créneau');
      return;
    }
    
    if (seriesSelection.baseRdv) {
      // Create series based on existing RDV
      createRdvSeriesFromSelection();
    } else {
      // Open modal to create new RDV series
      setShowSeriesModal({
        isOpen: true,
        selectedSlots: seriesSelection.selectedSlots
      });
    }
  };

  const handleCancelSeriesSelection = () => {
    setSeriesSelection({
      isSelecting: false,
      selectedSlots: [],
      baseRdv: null
    });
  };

  const createRdvSeriesFromSelection = async () => {
    const { baseRdv, selectedSlots } = seriesSelection;
    const newRdvs = [];

    for (const slotKey of selectedSlots) {
      const [dateStr, time] = slotKey.split('_');
      const [hour, minute] = time.split(':').map(Number);
      
      const dateDebut = new Date(dateStr);
      dateDebut.setHours(hour, minute, 0, 0);
      const dateFin = new Date(dateDebut.getTime() + baseRdv.duree_minutes * 60000);

      const newRdvData = {
        ...baseRdv,
        id: undefined,
        date_debut: dateDebut.toISOString(),
        date_fin: dateFin.toISOString(),
        created_at: undefined,
        updated_at: undefined
      };

      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/rendez-vous`, newRdvData);
        newRdvs.push(response.data);
      } catch (error) {
        console.error('Erreur création série:', error);
      }
    }

    setRendezVous([...rendezVous, ...newRdvs]);
    handleCancelSeriesSelection();
  };

  const createRdvSeriesFromNewData = async (seriesData) => {
    const { selectedSlots, patient, category, notes } = seriesData;
    const newRdvs = [];

    for (const slotKey of selectedSlots) {
      const [dateStr, time] = slotKey.split('_');
      const [hour, minute] = time.split(':').map(Number);
      
      const dateDebut = new Date(dateStr);
      dateDebut.setHours(hour, minute, 0, 0);
      const dateFin = new Date(dateDebut.getTime() + category.duree_defaut * 60000);

      const newRdvData = {
        patient_id: patient.id,
        patient_nom: `${patient.nom} ${patient.prenom}`,
        categorie_id: category.id,
        categorie_nom: category.nom,
        date_debut: dateDebut.toISOString(),
        date_fin: dateFin.toISOString(),
        duree_minutes: category.duree_defaut,
        notes: notes || ''
      };

      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/rendez-vous`, newRdvData);
        newRdvs.push(response.data);
      } catch (error) {
        console.error('Erreur création série:', error);
      }
    }

    setRendezVous([...rendezVous, ...newRdvs]);
  };

  const createRdvSeries = async (seriesData) => {
    const { rdv, numberOfSessions, frequency, startDate } = seriesData;
    const newRdvs = [];

    for (let i = 0; i < numberOfSessions; i++) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(sessionDate.getDate() + (i * frequency));
      
      const dateDebut = new Date(sessionDate);
      dateDebut.setHours(new Date(rdv.date_debut).getHours());
      dateDebut.setMinutes(new Date(rdv.date_debut).getMinutes());
      
      const dateFin = new Date(dateDebut.getTime() + rdv.duree_minutes * 60000);

      const newRdvData = {
        ...rdv,
        id: undefined,
        date_debut: dateDebut.toISOString(),
        date_fin: dateFin.toISOString(),
        created_at: undefined,
        updated_at: undefined
      };

      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/rendez-vous`, newRdvData);
        newRdvs.push(response.data);
      } catch (error) {
        console.error('Erreur création série:', error);
      }
    }

    setRendezVous([...rendezVous, ...newRdvs]);
  };

  const handleDragStart = (rdv, e) => {
    setDraggedRdv(rdv);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedRdv(null);
    setIsDragging(false);
  };

  const handleDrop = async (targetDay, targetTime, e) => {
    e.preventDefault();
    
    if (!draggedRdv) return;

    const [hour, minute] = targetTime.split(':').map(Number);
    const dateDebut = new Date(targetDay);
    dateDebut.setHours(hour, minute, 0, 0);
    const dateFin = new Date(dateDebut.getTime() + draggedRdv.duree_minutes * 60000);

    const updatedRdvData = {
      ...draggedRdv,
      date_debut: dateDebut.toISOString(),
      date_fin: dateFin.toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/rendez-vous/${draggedRdv.id}`, updatedRdvData);
      setRendezVous(rendezVous.map(r => r.id === draggedRdv.id ? response.data : r));
    } catch (error) {
      console.error('Erreur lors du déplacement:', error);
      alert('Erreur lors du déplacement du rendez-vous');
    }

    setDraggedRdv(null);
    setIsDragging(false);
  };

  const handleContextMenu = (e, rdv) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      rdv: rdv
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedRdv) {
        e.preventDefault();
        handleCopyRdv(selectedRdv);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && copiedRdv && quickInputVisible) {
        e.preventDefault();
        handlePasteRdv(quickInputVisible.day, quickInputVisible.time);
      }
      if (e.key === 'Escape') {
        setContextMenu(null);
        setQuickInputVisible(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRdv, copiedRdv, quickInputVisible]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', handleClickOutside);
      return () => window.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Practitioner Header */}
      {(() => {
        const currentPractitioner = practitioners.find(p => p.id === selectedPractitioner);
        const cabinet = currentPractitioner?.cabinet;
        
        return cabinet ? (
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto p-4">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">{cabinet.titre}</h1>
                <h2 className="text-xl font-semibold text-gray-700 mt-1">{cabinet.nom}</h2>
                <div className="mt-2 text-sm text-gray-600">
                  <div>{cabinet.adresse}, {cabinet.ville}</div>
                  <div className="mt-1">
                    <span className="mr-4">Tél : {cabinet.telephone}</span>
                    <span className="text-blue-600">{cabinet.email}</span>
                  </div>
                  <div className="mt-1 text-xs">
                    <span className="mr-4">IDENTIFIANT RPPS : {cabinet.rpps}</span>
                    <span>N°AM : {cabinet.am}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null;
      })()}
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
              <p className="text-gray-600 mt-1">Gestion des rendez-vous</p>
            </div>
            
            <div className="flex space-x-3">
              <Select value={selectedPractitioner} onValueChange={setSelectedPractitioner}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {practitioners.map((practitioner) => (
                    <SelectItem key={practitioner.id} value={practitioner.id}>
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: practitioner.couleur }}
                        ></div>
                        {practitioner.nom}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={() => setShowPractitionersModal(true)}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Users className="w-4 h-4 mr-2" />
                Praticiens
              </Button>
              <Button 
                onClick={() => setShowWorkingHoursModal(true)}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Clock className="w-4 h-4 mr-2" />
                Horaires
              </Button>
              <Button 
                onClick={() => setShowCategoriesModal(true)}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Catégories
              </Button>
              <Button 
                onClick={() => handleCreateSeries(null)}
                variant="outline"
                className={`border-blue-600 text-blue-600 hover:bg-blue-50 ${
                  seriesSelection.isSelecting ? 'bg-blue-100' : ''
                }`}
              >
                <Target className="w-4 h-4 mr-2" />
                {seriesSelection.isSelecting ? 'Sélection...' : 'Créer Série'}
              </Button>
              <Button 
                onClick={() => setShowNewRdvModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau RDV
              </Button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigateDate(-1)}
                className="p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
                {formatDateTitle()}
              </h2>
              
              <Button 
                variant="outline" 
                onClick={() => navigateDate(1)}
                className="p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setCurrentDate(new Date())}
              >
                Aujourd'hui
              </Button>
            </div>

            {/* View Selector */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              {[
                { key: 'jour', label: 'Jour' },
                { key: '3jours', label: '3 Jours' },
                { key: 'semaine', label: 'Semaine' },
                { key: 'mois', label: 'Mois' }
              ].map((view) => (
                <button
                  key={view.key}
                  onClick={() => setCurrentView(view.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === view.key
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6 h-[calc(100vh-180px)]">
          {/* Categories Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm border p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Types de consultation</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderLeftColor: category.couleur, borderLeftWidth: '4px' }}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('category', JSON.stringify(category));
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: category.couleur }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {category.nom}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.duree_defaut} min • {category.prix}€
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          {currentView !== 'mois' ? (
            <Card className="flex-1 overflow-hidden">
              <div className="flex h-full">
                {/* Time Column */}
                <div className="w-16 bg-gray-50 border-r flex-shrink-0">
                  <div className="h-10 border-b flex items-center justify-center bg-white">
                    <span className="text-xs font-medium text-gray-500">Heure</span>
                  </div>
                  <div className="overflow-hidden" style={{ height: 'calc(100vh - 230px)' }}>
                    <div id="time-slots-container">
                      {generateTimeSlots().map((time) => (
                        <div key={time} className="h-8 border-b flex items-center justify-center">
                          <span className="text-xs text-gray-600">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Single Scrollable Container for All Days */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex">
                    {/* Day Headers */}
                    <div className="flex flex-1">
                      {getViewDays().map((day, dayIndex) => {
                        const isToday = day.toDateString() === new Date().toDateString();
                        
                        return (
                          <div key={dayIndex} className="flex-1 border-r last:border-r-0">
                            <div className={`h-10 border-b flex items-center justify-center ${
                              isToday ? 'bg-emerald-100' : 'bg-white'
                            }`}>
                              <div className="text-center">
                                <div className="text-xs font-medium text-gray-500 uppercase">
                                  {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                                </div>
                                <div className={`text-sm font-semibold ${
                                  isToday
                                    ? 'text-white bg-emerald-600 rounded-full w-6 h-6 flex items-center justify-center mx-auto'
                                    : 'text-gray-900'
                                }`}>
                                  {day.getDate()}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Single Scroll Container */}
                  <div 
                    className="overflow-y-auto"
                    style={{ height: 'calc(100vh - 230px)' }}
                    onScroll={(e) => {
                      // Synchronize with time column
                      const timeContainer = document.getElementById('time-slots-container');
                      if (timeContainer) {
                        timeContainer.style.transform = `translateY(-${e.target.scrollTop}px)`;
                      }
                    }}
                  >
                    <div className="flex relative">
                      {getViewDays().map((day, dayIndex) => {
                        const dayRdvs = getRdvForDay(day).filter(rdv => 
                          rdv.praticien_id === selectedPractitioner || rdv.praticien_id === 'default'
                        );
                        
                        return (
                          <div key={dayIndex} className="flex-1 border-r last:border-r-0">
                            {generateTimeSlots().map((time, timeIndex) => {
                              const hasQuickInput = quickInputVisible && 
                                quickInputVisible.day.toDateString() === day.toDateString() &&
                                quickInputVisible.time === time;
                              
                              const isWorkingTime = isTimeSlotWorking(day, time);
                              const isBlocked = isSlotBlocked(day, time, selectedPractitioner);
                              const slotKey = `${day.toISOString().split('T')[0]}_${time}`;
                              const isSelectedForSeries = seriesSelection.selectedSlots.includes(slotKey);
                              
                              return (
                                <div 
                                  key={time}
                                  className={`h-8 border-b cursor-pointer relative ${
                                    isBlocked
                                      ? 'bg-red-100 hover:bg-red-200'
                                      : !isWorkingTime 
                                        ? 'bg-gray-200 hover:bg-gray-300' 
                                        : isDragging 
                                          ? 'hover:bg-emerald-100' 
                                          : seriesSelection.isSelecting 
                                            ? isSelectedForSeries 
                                              ? 'bg-blue-200 hover:bg-blue-300' 
                                              : 'hover:bg-blue-50'
                                            : 'hover:bg-gray-50'
                                  }`}
                                  onClick={(e) => {
                                    if (e.altKey) {
                                      // Alt + Click = Toggle blocked status
                                      toggleSlotBlocked(day, time, selectedPractitioner);
                                      return;
                                    }
                                    
                                    if (!isWorkingTime || isBlocked) return;
                                    
                                    if (seriesSelection.isSelecting) {
                                      handleSlotSelection(day, time);
                                    } else {
                                      handleQuickInput(day, time);
                                    }
                                  }}
                                  onDrop={(e) => handleDrop(day, time, e)}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = 'move';
                                  }}
                                  onContextMenu={(e) => {
                                    if (!hasQuickInput && (isWorkingTime && !isBlocked)) {
                                      e.preventDefault();
                                      if (copiedRdv) {
                                        handlePasteRdv(day, time);
                                      }
                                    }
                                  }}
                                  title={isBlocked ? 'Créneau fermé (Alt+Clic pour rouvrir)' : isWorkingTime ? 'Alt+Clic pour fermer ce créneau' : ''}
                                >
                                  {/* Blocked indicator */}
                                  {isBlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <X className="w-3 h-3 text-red-600" />
                                    </div>
                                  )}
                                  
                                  {/* Working time indicator */}
                                  {!isWorkingTime && !isBlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-xs text-gray-500">Fermé</span>
                                    </div>
                                  )}
                                  
                                  {/* Series selection indicator */}
                                  {seriesSelection.isSelecting && isSelectedForSeries && isWorkingTime && !isBlocked && (
                                    <div className="absolute top-1 right-1 w-3 h-3 bg-blue-600 rounded-full"></div>
                                  )}

                                  {/* Quick Input */}
                                  {hasQuickInput && isWorkingTime && !isBlocked && (
                                    <div className="absolute inset-0 bg-white border-2 border-emerald-500 z-30 p-1">
                                      <input
                                        type="text"
                                        value={quickInputValue}
                                        onChange={(e) => setQuickInputValue(e.target.value)}
                                        placeholder="Nom du patient..."
                                        className="w-full text-xs outline-none"
                                        autoFocus
                                        onBlur={() => {
                                          if (filteredPatients.length === 0) {
                                            setQuickInputVisible(null);
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && filteredPatients.length > 0) {
                                            handlePatientSelect(filteredPatients[0]);
                                          } else if (e.key === 'Escape') {
                                            setQuickInputVisible(null);
                                          }
                                        }}
                                      />
                                      
                                      {/* Patient Suggestions */}
                                      {filteredPatients.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-40 max-h-32 overflow-y-auto">
                                          {filteredPatients.map((patient) => (
                                            <div
                                              key={patient.id}
                                              className="p-2 text-xs hover:bg-emerald-50 cursor-pointer border-b last:border-b-0"
                                              onClick={() => handlePatientSelect(patient)}
                                            >
                                              <div className="font-medium">{patient.nom} {patient.prenom}</div>
                                              <div className="text-gray-500">{patient.pathologie}</div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Appointments for this time slot */}
                                  {dayRdvs
                                    .filter(rdv => {
                                      const rdvTime = new Date(rdv.date_debut);
                                      const [hour, minute] = time.split(':').map(Number);
                                      
                                      return rdvTime.getHours() === hour && 
                                             Math.floor(rdvTime.getMinutes() / 15) * 15 === minute;
                                    })
                                    .map((rdv) => {
                                      const category = categories.find(c => c.id === rdv.categorie_id);
                                      const duration = rdv.duree_minutes;
                                      const heightInSlots = Math.ceil(duration / 15);
                                      
                                      return (
                                        <div
                                          key={rdv.id}
                                          className={`absolute left-1 right-1 rounded-md shadow-sm border-l-4 cursor-move z-10 ${
                                            draggedRdv?.id === rdv.id ? 'opacity-50' : ''
                                          }`}
                                          style={{
                                            backgroundColor: category?.couleur + '20' || '#3B82F620',
                                            borderLeftColor: category?.couleur || '#3B82F6',
                                            height: `${heightInSlots * 2 - 0.25}rem`,
                                            top: '1px'
                                          }}
                                          draggable
                                          onDragStart={(e) => handleDragStart(rdv, e)}
                                          onDragEnd={handleDragEnd}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (!seriesSelection.isSelecting) {
                                              setSelectedRdv(rdv);
                                            }
                                          }}
                                          onContextMenu={(e) => handleContextMenu(e, rdv)}
                                        >
                                          <div className="p-1 text-xs">
                                            <div 
                                              className="font-semibold text-gray-900 truncate hover:text-emerald-600 cursor-pointer"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (!seriesSelection.isSelecting) {
                                                  window.location.href = `/patients?id=${rdv.patient_id}`;
                                                }
                                              }}
                                            >
                                              {rdv.patient_nom}
                                            </div>
                                            <div className="text-gray-600 truncate">
                                              {rdv.categorie_nom}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                              {new Date(rdv.date_debut).toLocaleTimeString('fr-FR', { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  }
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            // Monthly View
            <Card className="flex-1 p-6">
              <div className="text-center text-gray-600">
                Vue mensuelle en cours de développement...
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Series Selection Controls */}
      {seriesSelection.isSelecting && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Mode Sélection • {seriesSelection.selectedSlots.length} créneaux sélectionnés
            </div>
            <Button
              onClick={handleConfirmSeriesSelection}
              disabled={seriesSelection.selectedSlots.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmer
            </Button>
            <Button
              onClick={handleCancelSeriesSelection}
              variant="outline"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showNewRdvModal && (
        <NewRdvModal
          categories={categories}
          patients={patients}
          onSave={createNewRdv}
          onClose={() => setShowNewRdvModal(false)}
          selectedDate={currentDate}
        />
      )}

      {showPractitionersModal && (
        <PractitionersModal
          practitioners={practitioners}
          onSave={(updatedPractitioners) => {
            setPractitioners(updatedPractitioners);
            setShowPractitionersModal(false);
          }}
          onClose={() => setShowPractitionersModal(false)}
        />
      )}

      {showWorkingHoursModal && (
        <WorkingHoursModal
          workingHours={workingHours}
          onSave={(newWorkingHours) => {
            setWorkingHours(newWorkingHours);
            setShowWorkingHoursModal(false);
            // Refresh the view to reflect changes
            window.location.reload();
          }}
          onClose={() => setShowWorkingHoursModal(false)}
        />
      )}

      {showCategoriesModal && (
        <CategoriesModal
          categories={categories}
          onSave={(updatedCategories) => {
            setCategories(updatedCategories);
            setShowCategoriesModal(false);
          }}
          onClose={() => setShowCategoriesModal(false)}
        />
      )}

      {showSeriesModal && (
        <SeriesSelectionModal
          selectedSlots={showSeriesModal.selectedSlots}
          categories={categories}
          patients={patients}
          onSave={async (seriesData) => {
            await createRdvSeriesFromNewData(seriesData);
            setShowSeriesModal(null);
            handleCancelSeriesSelection();
          }}
          onClose={() => {
            setShowSeriesModal(null);
            handleCancelSeriesSelection();
          }}
        />
      )}

      {selectedRdv && (
        <RdvDetailsModal
          rdv={selectedRdv}
          categories={categories}
          onClose={() => setSelectedRdv(null)}
          onUpdate={(updatedRdv) => {
            setRendezVous(rendezVous.map(r => r.id === updatedRdv.id ? updatedRdv : r));
            setSelectedRdv(null);
          }}
          onDelete={(rdvId) => {
            setRendezVous(rendezVous.filter(r => r.id !== rdvId));
            setSelectedRdv(null);
          }}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          rdv={contextMenu.rdv}
          onCopy={() => handleCopyRdv(contextMenu.rdv)}
          onDuplicate={() => handleDuplicateRdv(contextMenu.rdv)}
          onCreateSeries={() => handleCreateSeries(contextMenu.rdv)}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Keyboard shortcuts info */}
      {copiedRdv && (
        <div className="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <Copy className="w-4 h-4" />
            <span className="text-sm">RDV copié • Ctrl+V pour coller</span>
          </div>
        </div>
      )}

      {/* Alt+Click help */}
      <div className="fixed bottom-4 left-4 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg z-40 text-xs">
        <div className="space-y-1">
          <div>Alt+Clic : Fermer/Ouvrir créneau</div>
          <div>Clic droit : Menu contextuel</div>
        </div>
      </div>
    </div>
  );
};

// New Appointment Modal Component
const NewRdvModal = ({ categories, patients, onSave, onClose, selectedDate }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    categorie_id: '',
    date: selectedDate.toISOString().split('T')[0],
    heure: '09:00',
    duree_minutes: 30,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selectedCategory = categories.find(c => c.id === formData.categorie_id);
    const selectedPatient = patients.find(p => p.id === formData.patient_id);
    
    if (!selectedCategory || !selectedPatient) {
      alert('Veuillez sélectionner un patient et une catégorie');
      return;
    }

    const dateDebut = new Date(`${formData.date}T${formData.heure}:00`);
    const dateFin = new Date(dateDebut.getTime() + formData.duree_minutes * 60000);

    const rdvData = {
      patient_id: formData.patient_id,
      patient_nom: `${selectedPatient.nom} ${selectedPatient.prenom}`,
      categorie_id: formData.categorie_id,
      categorie_nom: selectedCategory.nom,
      date_debut: dateDebut.toISOString(),
      date_fin: dateFin.toISOString(),
      duree_minutes: formData.duree_minutes,
      notes: formData.notes
    };

    onSave(rdvData);
  };

  const selectedCategory = categories.find(c => c.id === formData.categorie_id);

  useEffect(() => {
    if (selectedCategory && formData.duree_minutes === 30) {
      setFormData(prev => ({ ...prev, duree_minutes: selectedCategory.duree_defaut }));
    }
  }, [selectedCategory]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Nouveau Rendez-vous</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label>Patient</Label>
            <Select value={formData.patient_id} onValueChange={(value) => setFormData({...formData, patient_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.nom} {patient.prenom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Catégorie de séance</Label>
            <Select value={formData.categorie_id} onValueChange={(value) => setFormData({...formData, categorie_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.couleur }}
                      ></div>
                      {category.nom} ({category.duree_defaut} min)
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <Label>Heure</Label>
              <Input
                type="time"
                value={formData.heure}
                onChange={(e) => setFormData({...formData, heure: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label>Durée (minutes)</Label>
            <Select 
              value={formData.duree_minutes.toString()} 
              onValueChange={(value) => setFormData({...formData, duree_minutes: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Notes (optionnel)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Notes sur le rendez-vous..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Créer le RDV
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Appointment Details Modal Component
const RdvDetailsModal = ({ rdv, categories, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const category = categories.find(c => c.id === rdv.categorie_id);

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/rendez-vous/${rdv.id}`);
      onDelete(rdv.id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du rendez-vous');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Détails du Rendez-vous</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: category?.couleur || '#3B82F6' }}
            ></div>
            <div>
              <h4 className="font-semibold text-lg">{rdv.patient_nom}</h4>
              <p className="text-gray-600">{rdv.categorie_nom}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date(rdv.date_debut).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Heure:</span>
              <span className="font-medium">
                {new Date(rdv.date_debut).toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })} - {new Date(rdv.date_fin).toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Durée:</span>
              <span className="font-medium">{rdv.duree_minutes} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Statut:</span>
              <Badge className={`${
                rdv.statut === 'planifie' ? 'bg-blue-100 text-blue-800' :
                rdv.statut === 'confirme' ? 'bg-green-100 text-green-800' :
                rdv.statut === 'termine' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {rdv.statut}
              </Badge>
            </div>
          </div>

          {rdv.notes && (
            <div>
              <span className="text-gray-600">Notes:</span>
              <p className="mt-1 text-sm bg-gray-50 p-3 rounded-md">{rdv.notes}</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
            <div className="space-x-3">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h4 className="text-lg font-semibold mb-2">Confirmer la suppression</h4>
              <p className="text-gray-600 mb-4">
                Êtes-vous sûr de vouloir supprimer ce rendez-vous ?
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Categories Management Modal Component
const CategoriesModal = ({ categories, onSave, onClose }) => {
  const [categoriesList, setCategoriesList] = useState(categories);
  const [newCategory, setNewCategory] = useState({
    nom: '',
    duree_defaut: 30,
    couleur: '#3B82F6',
    prix: 0,
    description: ''
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', 
    '#06B6D4', '#84CC16', '#EF4444', '#6B7280', '#14B8A6'
  ];

  const handleSaveCategory = async () => {
    if (!newCategory.nom.trim()) {
      alert('Le nom de la catégorie est obligatoire');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/categories-seances`, newCategory);
      setCategoriesList([...categoriesList, response.data]);
      setNewCategory({
        nom: '',
        duree_defaut: 30,
        couleur: '#3B82F6',
        prix: 0,
        description: ''
      });
      setIsAddingNew(false);
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      alert('Erreur lors de la création de la catégorie');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/categories-seances/${categoryId}`);
      setCategoriesList(categoriesList.filter(c => c.id !== categoryId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert(error.response?.data?.detail || 'Erreur lors de la suppression');
    }
  };

  const handleUpdateCategory = async (categoryId, updatedData) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/categories-seances/${categoryId}`, updatedData);
      setCategoriesList(categoriesList.map(c => c.id === categoryId ? response.data : c));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la catégorie');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Gestion des Catégories</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Existing Categories */}
          <div className="space-y-4 mb-6">
            {categoriesList.map((category) => (
              <div key={category.id} className="flex items-center p-4 border rounded-lg">
                <div 
                  className="w-6 h-6 rounded-full mr-4 flex-shrink-0"
                  style={{ backgroundColor: category.couleur }}
                ></div>
                
                <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                  <input
                    type="text"
                    value={category.nom}
                    onChange={(e) => {
                      const updated = { ...category, nom: e.target.value };
                      setCategoriesList(categoriesList.map(c => c.id === category.id ? updated : c));
                    }}
                    onBlur={() => handleUpdateCategory(category.id, category)}
                    className="font-medium border rounded px-2 py-1"
                  />
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={category.duree_defaut}
                      onChange={(e) => {
                        const updated = { ...category, duree_defaut: parseInt(e.target.value) };
                        setCategoriesList(categoriesList.map(c => c.id === category.id ? updated : c));
                      }}
                      onBlur={() => handleUpdateCategory(category.id, category)}
                      className="w-16 border rounded px-2 py-1 text-sm"
                      min="5"
                      max="120"
                      step="5"
                    />
                    <span className="text-xs text-gray-500">min</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={category.prix || 0}
                      onChange={(e) => {
                        const updated = { ...category, prix: parseFloat(e.target.value) };
                        setCategoriesList(categoriesList.map(c => c.id === category.id ? updated : c));
                      }}
                      onBlur={() => handleUpdateCategory(category.id, category)}
                      className="w-16 border rounded px-2 py-1 text-sm"
                      min="0"
                      step="0.5"
                    />
                    <span className="text-xs text-gray-500">€</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={category.couleur}
                      onChange={(e) => {
                        const updated = { ...category, couleur: e.target.value };
                        setCategoriesList(categoriesList.map(c => c.id === category.id ? updated : c));
                        handleUpdateCategory(category.id, updated);
                      }}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {colors.map(color => (
                        <option key={color} value={color} style={{ backgroundColor: color }}>
                          {color}
                        </option>
                      ))}
                    </select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Category */}
          {!isAddingNew ? (
            <Button
              onClick={() => setIsAddingNew(true)}
              variant="outline"
              className="w-full border-dashed border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une catégorie
            </Button>
          ) : (
            <div className="border-2 border-emerald-300 rounded-lg p-4 bg-emerald-50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Nom de la catégorie</Label>
                  <Input
                    value={newCategory.nom}
                    onChange={(e) => setNewCategory({...newCategory, nom: e.target.value})}
                    placeholder="Ex: Ostéopathie"
                  />
                </div>
                
                <div>
                  <Label>Durée par défaut (minutes)</Label>
                  <Select 
                    value={newCategory.duree_defaut.toString()}
                    onValueChange={(value) => setNewCategory({...newCategory, duree_defaut: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Prix (€)</Label>
                  <Input
                    type="number"
                    value={newCategory.prix}
                    onChange={(e) => setNewCategory({...newCategory, prix: parseFloat(e.target.value) || 0})}
                    min="0"
                    step="0.5"
                  />
                </div>
                
                <div>
                  <Label>Couleur</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: newCategory.couleur }}
                    ></div>
                    <Select 
                      value={newCategory.couleur}
                      onValueChange={(value) => setNewCategory({...newCategory, couleur: value})}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map(color => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: color }}
                              ></div>
                              {color}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <Label>Description (optionnel)</Label>
                <Textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  placeholder="Description de la catégorie..."
                  rows={2}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewCategory({
                      nom: '',
                      duree_defaut: 30,
                      couleur: '#3B82F6',
                      prix: 0,
                      description: ''
                    });
                  }}
                >
                  Annuler
                </Button>
                <Button onClick={handleSaveCategory} className="bg-emerald-600 hover:bg-emerald-700">
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <Button onClick={() => onSave(categoriesList)} className="bg-emerald-600 hover:bg-emerald-700">
            Fermer et sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
};

// Media Section Component for Photos/Videos
const MediaSection = ({ patient }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState('photo'); // 'photo' or 'video'
  const [selectedComparison, setSelectedComparison] = useState(null);

  useEffect(() => {
    loadPatientMedia();
  }, [patient.id]);

  const loadPatientMedia = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/patients/${patient.id}/media`);
      setMediaFiles(response.data);
    } catch (error) {
      console.error('Erreur chargement média:', error);
      // Initialize empty if no media found
      setMediaFiles([]);
    }
  };

  const handleFileCapture = async (file, type, category = 'evaluation') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', patient.id);
    formData.append('type', type); // 'photo' or 'video'
    formData.append('category', category); // 'evaluation', 'exercice', 'resultat'
    formData.append('date', new Date().toISOString());

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/patients/${patient.id}/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMediaFiles([...mediaFiles, response.data]);
      setIsCapturing(false);
    } catch (error) {
      console.error('Erreur upload média:', error);
      alert('Erreur lors de l\'upload du fichier');
    }
  };

  const groupedMedia = mediaFiles.reduce((acc, media) => {
    const category = media.category || 'evaluation';
    if (!acc[category]) acc[category] = [];
    acc[category].push(media);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Label className="text-sm font-medium text-gray-600">Documentation Visuelle</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMediaModal(true)}
          className="text-emerald-600 hover:bg-emerald-50"
        >
          <Camera className="w-4 h-4 mr-2" />
          Photos/Vidéos
        </Button>
      </div>

      {/* Media Preview */}
      <div className="bg-gray-50 p-3 rounded-md">
        {Object.keys(groupedMedia).length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(groupedMedia).map(([category, files]) => (
              <div key={category} className="text-center">
                <div className="text-xs font-medium text-gray-600 mb-1 capitalize">
                  {category}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {files.slice(-2).map((file, index) => (
                    <div key={index} className="relative group">
                      {file.type === 'photo' ? (
                        <img
                          src={file.url}
                          alt={`${category} ${index + 1}`}
                          className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => setSelectedComparison({ category, files })}
                        />
                      ) : (
                        <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300">
                          <Video className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-bl">
                        {files.length}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm py-4">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            Aucune photo ou vidéo disponible
          </div>
        )}
      </div>

      {/* Media Modal */}
      {showMediaModal && (
        <MediaModal
          patient={patient}
          mediaFiles={mediaFiles}
          onClose={() => setShowMediaModal(false)}
          onMediaAdded={loadPatientMedia}
        />
      )}

      {/* Comparison Modal */}
      {selectedComparison && (
        <ComparisonModal
          comparison={selectedComparison}
          onClose={() => setSelectedComparison(null)}
        />
      )}
    </div>
  );
};

// Media Modal Component
const MediaModal = ({ patient, mediaFiles, onClose, onMediaAdded }) => {
  const [activeTab, setActiveTab] = useState('capture');
  const [selectedCategory, setSelectedCategory] = useState('evaluation');
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const categories = [
    { key: 'evaluation', label: 'Évaluation initiale', color: '#3B82F6' },
    { key: 'exercice', label: 'Exercices', color: '#10B981' },
    { key: 'resultat', label: 'Résultats', color: '#F59E0B' }
  ];

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Erreur accès caméra:', error);
      alert('Impossible d\'accéder à la caméra');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFileUpload(file, 'photo');
      }, 'image/jpeg', 0.8);
    }
  };

  const handleFileUpload = async (file, type) => {
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', patient.id);
    formData.append('type', type);
    formData.append('category', selectedCategory);
    formData.append('date', new Date().toISOString());

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/patients/${patient.id}/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onMediaAdded();
      alert('Fichier ajouté avec succès !');
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'capture') {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => stopCamera();
  }, [activeTab]);

  const groupedMedia = mediaFiles.reduce((acc, media) => {
    const category = media.category || 'evaluation';
    if (!acc[category]) acc[category] = [];
    acc[category].push(media);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Documentation Visuelle - {patient.prenom} {patient.nom}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('capture')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'capture'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              <Camera className="w-4 h-4 inline mr-2" />
              Capturer
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'gallery'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Galerie
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'comparison'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Avant/Après
            </button>
          </div>

          {/* Category Selection */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Catégorie</Label>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category.key
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.key ? category.color : undefined
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'capture' && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '300px' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button onClick={capturePhoto} disabled={!stream || isUploading}>
                  <Camera className="w-4 h-4 mr-2" />
                  {isUploading ? 'Upload...' : 'Prendre Photo'}
                </Button>
                
                <label className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Importer Fichier
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const type = file.type.startsWith('image/') ? 'photo' : 'video';
                        handleFileUpload(file, type);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {Object.entries(groupedMedia).map(([category, files]) => {
                const categoryInfo = categories.find(c => c.key === category);
                return (
                  <div key={category} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3" style={{ color: categoryInfo?.color }}>
                      {categoryInfo?.label} ({files.length})
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {files.map((file, index) => (
                        <div key={index} className="relative group">
                          {file.type === 'photo' ? (
                            <img
                              src={file.url}
                              alt={`${category} ${index + 1}`}
                              className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                            />
                          ) : (
                            <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                              <Video className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            {new Date(file.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-4">
              {Object.entries(groupedMedia).map(([category, files]) => {
                const categoryInfo = categories.find(c => c.key === category);
                const photos = files.filter(f => f.type === 'photo');
                
                if (photos.length < 2) return null;
                
                return (
                  <div key={category} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3" style={{ color: categoryInfo?.color }}>
                      {categoryInfo?.label} - Évolution
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Avant</Label>
                        <img
                          src={photos[0]?.url}
                          alt="Avant"
                          className="w-full h-40 object-cover rounded border"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(photos[0]?.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Après</Label>
                        <img
                          src={photos[photos.length - 1]?.url}
                          alt="Après"
                          className="w-full h-40 object-cover rounded border"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(photos[photos.length - 1]?.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Comparison Modal Component
const ComparisonModal = ({ comparison, onClose }) => {
  const photos = comparison.files.filter(f => f.type === 'photo');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Comparaison Avant/Après - {comparison.category}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-lg font-medium mb-4 block">Avant</Label>
              <img
                src={photos[0]?.url}
                alt="Avant"
                className="w-full h-64 object-cover rounded border"
              />
              <p className="text-sm text-gray-600 mt-2">
                {new Date(photos[0]?.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <Label className="text-lg font-medium mb-4 block">Après</Label>
              <img
                src={photos[photos.length - 1]?.url}
                alt="Après"
                className="w-full h-64 object-cover rounded border"
              />
              <p className="text-sm text-gray-600 mt-2">
                {new Date(photos[photos.length - 1]?.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Context Menu Component
const ContextMenu = ({ x, y, rdv, onCopy, onDuplicate, onCreateSeries, onClose }) => {
  return (
    <div 
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 min-w-48"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onCopy}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
      >
        <Copy className="w-4 h-4 mr-3" />
        Copier le rendez-vous
      </button>
      <button
        onClick={onDuplicate}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
      >
        <Calendar className="w-4 h-4 mr-3" />
        Dupliquer (semaine suivante)
      </button>
      <button
        onClick={onCreateSeries}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
      >
        <RotateCcw className="w-4 h-4 mr-3" />
        Créer une série
      </button>
      <div className="border-t border-gray-200 my-1"></div>
      <div className="px-4 py-2 text-xs text-gray-500">
        Ctrl+C pour copier • Ctrl+V pour coller
      </div>
    </div>
  );
};

// Series Creation Modal Component
const SeriesModal = ({ rdv, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    numberOfSessions: 4,
    frequency: 7, // days
    startDate: new Date(rdv.date_debut).toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ rdv, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Créer une série de rendez-vous</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Modèle de rendez-vous</h4>
            <div className="text-sm text-gray-600">
              <p><strong>Patient:</strong> {rdv.patient_nom}</p>
              <p><strong>Type:</strong> {rdv.categorie_nom}</p>
              <p><strong>Durée:</strong> {rdv.duree_minutes} minutes</p>
              <p><strong>Heure:</strong> {new Date(rdv.date_debut).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</p>
            </div>
          </div>

          <div>
            <Label>Nombre de séances</Label>
            <Input
              type="number"
              value={formData.numberOfSessions}
              onChange={(e) => setFormData({...formData, numberOfSessions: parseInt(e.target.value)})}
              min="1"
              max="20"
            />
          </div>

          <div>
            <Label>Fréquence</Label>
            <Select 
              value={formData.frequency.toString()}
              onValueChange={(value) => setFormData({...formData, frequency: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Chaque semaine</SelectItem>
                <SelectItem value="14">Toutes les 2 semaines</SelectItem>
                <SelectItem value="1">Tous les jours</SelectItem>
                <SelectItem value="3">Tous les 3 jours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Date de début</Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Aperçu:</strong> {formData.numberOfSessions} séances programmées, 
            une tous les {formData.frequency === 7 ? '7 jours' : 
                        formData.frequency === 14 ? '14 jours' : 
                        formData.frequency === 1 ? 'jour' : 
                        `${formData.frequency} jours`}, 
            à partir du {new Date(formData.startDate).toLocaleDateString('fr-FR')}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Créer la série
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Working Hours Modal Component
const WorkingHoursModal = ({ workingHours, onSave, onClose }) => {
  const [settings, setSettings] = useState(workingHours);

  const daysOfWeek = [
    { key: 'lundi', label: 'Lundi' },
    { key: 'mardi', label: 'Mardi' },
    { key: 'mercredi', label: 'Mercredi' },
    { key: 'jeudi', label: 'Jeudi' },
    { key: 'vendredi', label: 'Vendredi' },
    { key: 'samedi', label: 'Samedi' },
    { key: 'dimanche', label: 'Dimanche' }
  ];

  const handleDayChange = (day, field, value) => {
    setSettings({
      ...settings,
      [day]: {
        ...settings[day],
        [field]: value
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Configuration des Horaires de Travail</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {daysOfWeek.map((day) => (
              <div key={day.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-lg">{day.label}</h4>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[day.key]?.active || false}
                      onChange={(e) => handleDayChange(day.key, 'active', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Jour travaillé</span>
                  </label>
                </div>

                {settings[day.key]?.active && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm">Début</Label>
                      <Input
                        type="time"
                        value={settings[day.key]?.start || '08:00'}
                        onChange={(e) => handleDayChange(day.key, 'start', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm">Fin</Label>
                      <Input
                        type="time"
                        value={settings[day.key]?.end || '18:00'}
                        onChange={(e) => handleDayChange(day.key, 'end', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm">Pause début</Label>
                      <Input
                        type="time"
                        value={settings[day.key]?.pauseStart || ''}
                        onChange={(e) => handleDayChange(day.key, 'pauseStart', e.target.value)}
                        placeholder="12:00"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm">Pause fin</Label>
                      <Input
                        type="time"
                        value={settings[day.key]?.pauseEnd || ''}
                        onChange={(e) => handleDayChange(day.key, 'pauseEnd', e.target.value)}
                        placeholder="14:00"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Informations</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Les créneaux fermés apparaîtront en gris dans l'agenda</li>
              <li>• Les pauses déjeuner empêchent la prise de rendez-vous</li>
              <li>• Laissez les pauses vides si vous n'en avez pas</li>
              <li>• Les changements nécessitent un rechargement de la page</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50 space-x-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => onSave(settings)} className="bg-emerald-600 hover:bg-emerald-700">
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
};

// Series Selection Modal Component
const SeriesSelectionModal = ({ selectedSlots, categories, patients, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    categorie_id: '',
    notes: ''
  });

  const selectedPatient = patients.find(p => p.id === formData.patient_id);
  const selectedCategory = categories.find(c => c.id === formData.categorie_id);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedPatient || !selectedCategory) {
      alert('Veuillez sélectionner un patient et une catégorie');
      return;
    }

    onSave({
      selectedSlots,
      patient: selectedPatient,
      category: selectedCategory,
      notes: formData.notes
    });
  };

  const formatSlotDisplay = (slotKey) => {
    const [dateStr, time] = slotKey.split('_');
    const date = new Date(dateStr);
    return `${date.toLocaleDateString('fr-FR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    })} à ${time}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Créer une série de rendez-vous</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Selected slots preview */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">
                Créneaux sélectionnés ({selectedSlots.length})
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {selectedSlots.map((slot) => (
                  <div key={slot} className="text-sm text-blue-800 bg-white px-2 py-1 rounded">
                    {formatSlotDisplay(slot)}
                  </div>
                ))}
              </div>
            </div>

            {/* Patient selection */}
            <div>
              <Label>Patient</Label>
              <Select value={formData.patient_id} onValueChange={(value) => setFormData({...formData, patient_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.nom} {patient.prenom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category selection */}
            <div>
              <Label>Type de séance</Label>
              <Select value={formData.categorie_id} onValueChange={(value) => setFormData({...formData, categorie_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.couleur }}
                        ></div>
                        {category.nom} ({category.duree_defaut} min)
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <Label>Notes (optionnel)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Notes pour tous les rendez-vous de la série..."
                rows={3}
              />
            </div>

            {/* Summary */}
            {selectedPatient && selectedCategory && (
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-medium text-emerald-900 mb-2">Résumé</h4>
                <div className="text-sm text-emerald-800">
                  <p><strong>Patient:</strong> {selectedPatient.nom} {selectedPatient.prenom}</p>
                  <p><strong>Type:</strong> {selectedCategory.nom} ({selectedCategory.duree_defaut} min)</p>
                  <p><strong>Nombre de séances:</strong> {selectedSlots.length}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Créer les {selectedSlots.length} rendez-vous
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Practitioners Management Modal Component
const PractitionersModal = ({ practitioners, onSave, onClose }) => {
  const [practitionersList, setPractitionersList] = useState(practitioners);
  const [newPractitioner, setNewPractitioner] = useState({
    nom: '',
    couleur: '#3B82F6',
    actif: true
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', 
    '#06B6D4', '#84CC16', '#EF4444', '#6B7280', '#14B8A6'
  ];

  const handleSavePractitioner = () => {
    if (!newPractitioner.nom.trim()) {
      alert('Le nom du praticien est obligatoire');
      return;
    }

    const practitioner = {
      id: `practitioner_${Date.now()}`,
      ...newPractitioner
    };

    setPractitionersList([...practitionersList, practitioner]);
    setNewPractitioner({
      nom: '',
      couleur: '#3B82F6',
      actif: true
    });
    setIsAddingNew(false);
  };

  const handleDeletePractitioner = (practitionerId) => {
    if (practitionerId === 'default') {
      alert('Impossible de supprimer le praticien principal');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce praticien ?')) {
      return;
    }

    setPractitionersList(practitionersList.filter(p => p.id !== practitionerId));
  };

  const handleUpdatePractitioner = (practitionerId, updatedData) => {
    setPractitionersList(practitionersList.map(p => 
      p.id === practitionerId ? { ...p, ...updatedData } : p
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Gestion des Praticiens</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Existing Practitioners */}
          <div className="space-y-4 mb-6">
            {practitionersList.map((practitioner) => (
              <div key={practitioner.id} className="flex items-center p-4 border rounded-lg">
                <div 
                  className="w-6 h-6 rounded-full mr-4 flex-shrink-0"
                  style={{ backgroundColor: practitioner.couleur }}
                ></div>
                
                <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                  <input
                    type="text"
                    value={practitioner.nom}
                    onChange={(e) => handleUpdatePractitioner(practitioner.id, { nom: e.target.value })}
                    className="font-medium border rounded px-2 py-1"
                    disabled={practitioner.id === 'default'}
                  />
                  
                  <div className="flex items-center space-x-1">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => handleUpdatePractitioner(practitioner.id, { couleur: color })}
                        className={`w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform ${
                          practitioner.couleur === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={practitioner.actif}
                        onChange={(e) => handleUpdatePractitioner(practitioner.id, { actif: e.target.checked })}
                        className="mr-1"
                        disabled={practitioner.id === 'default'}
                      />
                      Actif
                    </label>
                    
                    {practitioner.id !== 'default' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePractitioner(practitioner.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Practitioner */}
          {!isAddingNew ? (
            <Button
              onClick={() => setIsAddingNew(true)}
              variant="outline"
              className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un praticien
            </Button>
          ) : (
            <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Nom du praticien</Label>
                  <Input
                    value={newPractitioner.nom}
                    onChange={(e) => setNewPractitioner({...newPractitioner, nom: e.target.value})}
                    placeholder="Ex: Dr. Martin"
                  />
                </div>
                
                <div>
                  <Label>Couleur</Label>
                  <div className="flex items-center space-x-1 mt-1">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewPractitioner({...newPractitioner, couleur: color})}
                        className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                          newPractitioner.couleur === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewPractitioner({ nom: '', couleur: '#3B82F6', actif: true });
                  }}
                >
                  Annuler
                </Button>
                <Button onClick={handleSavePractitioner} className="bg-blue-600 hover:bg-blue-700">
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <Button onClick={() => onSave(practitionersList)} className="bg-emerald-600 hover:bg-emerald-700">
            Fermer et sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
};

// Notifications Page Component
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // all, sessions, exercises, progress

  useEffect(() => {
    // Simulate notifications data with patient IDs
    const mockNotifications = [
      {
        id: '1',
        type: 'session_completed',
        patientId: 'patient_1',
        patientName: 'Marie Dupont',
        message: 'a validé sa séance du 30/08/2025',
        timestamp: new Date().toISOString(),
        read: false,
        sessionDate: '2025-08-30'
      },
      {
        id: '2', 
        type: 'exercise_completed',
        patientId: 'patient_2',
        patientName: 'Pierre Martin',
        message: 'a complété l\'exercice "Étirement cervical" avec une charge de 5kg',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        exerciseId: 'ex_1'
      },
      {
        id: '3',
        type: 'pain_reported',
        patientId: 'patient_3',
        patientName: 'Sophie Blanc',
        message: 'a signalé une douleur niveau 6/10 après l\'exercice',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const filterNotifications = () => {
    if (filter === 'all') return notifications;
    return notifications.filter(n => {
      switch (filter) {
        case 'sessions': return n.type === 'session_completed';
        case 'exercises': return n.type === 'exercise_completed';
        case 'progress': return n.type === 'pain_reported' || n.type === 'progress_update';
        default: return true;
      }
    });
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Rediriger vers la page patient appropriée
    if (notification.patientId) {
      if (notification.type === 'session_completed' && notification.sessionDate) {
        // Rediriger vers la page coaching avec la date de la séance
        window.location.href = `/coaching?patient=${notification.patientId}&date=${notification.sessionDate}`;
      } else {
        // Rediriger vers la fiche patient
        window.location.href = `/patients/${notification.patientId}`;
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'session_completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'exercise_completed': return <Dumbbell className="w-5 h-5 text-blue-600" />;
      case 'pain_reported': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Activités et mises à jour des patients</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex space-x-1 bg-white p-1 rounded-lg shadow-sm border">
          {[
            { key: 'all', label: 'Toutes', count: notifications.length },
            { key: 'sessions', label: 'Séances', count: notifications.filter(n => n.type === 'session_completed').length },
            { key: 'exercises', label: 'Exercices', count: notifications.filter(n => n.type === 'exercise_completed').length },
            { key: 'progress', label: 'Progrès', count: notifications.filter(n => n.type === 'pain_reported').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  filter === tab.key ? 'bg-white text-emerald-600' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filterNotifications().map((notification) => (
            <Card 
              key={notification.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] ${
                !notification.read ? 'border-l-4 border-l-emerald-500 bg-emerald-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      <span className="text-emerald-600 font-semibold">
                        {notification.patientName}
                      </span>{' '}
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {filterNotifications().length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune notification pour ce filtre</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Coaching Page Component (TrueCoach Style)
// Exercise Card Component - Visual and Editable
const ExerciseCard = ({ exercise, onUpdate, onDelete, onToggleComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localExercise, setLocalExercise] = useState(exercise);

  const handleSave = () => {
    onUpdate(localExercise);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalExercise(exercise);
    setIsEditing(false);
  };

  return (
    <div className={`bg-white border-2 rounded-xl shadow-md hover:shadow-lg transition-all p-5 ${
      exercise.completed ? 'border-green-400 bg-green-50' : 'border-gray-200'
    }`}>
      {/* Exercise Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-base mb-1">{exercise.nom}</h4>
          {exercise.notes && (
            <p className="text-sm text-gray-600 italic">{exercise.notes}</p>
          )}
        </div>
        <div className="flex space-x-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleComplete()}
            className={`p-1 h-7 w-7 ${exercise.completed ? 'text-green-600' : 'text-gray-400'}`}
            title={exercise.completed ? "Marquer incomplet" : "Marquer complet"}
          >
            {exercise.completed ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 h-7 w-7 text-blue-600"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="p-1 h-7 w-7 text-red-600"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Exercise Parameters */}
      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-gray-700">Séries</Label>
              <Input
                type="number"
                value={localExercise.sets}
                onChange={(e) => setLocalExercise({...localExercise, sets: parseInt(e.target.value) || 0})}
                className="h-9 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700">Reps</Label>
              <Input
                value={localExercise.reps}
                onChange={(e) => setLocalExercise({...localExercise, reps: e.target.value})}
                className="h-9 text-sm"
                placeholder="12 ou 30s"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-gray-700">Tempo</Label>
              <Input
                value={localExercise.tempo || ''}
                onChange={(e) => setLocalExercise({...localExercise, tempo: e.target.value})}
                className="h-9 text-sm"
                placeholder="2-0-2-0"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700">Repos</Label>
              <Input
                value={localExercise.rest}
                onChange={(e) => setLocalExercise({...localExercise, rest: e.target.value})}
                className="h-9 text-sm"
                placeholder="60s"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-medium text-gray-700">Charge</Label>
              <Input
                value={localExercise.weight || ''}
                onChange={(e) => setLocalExercise({...localExercise, weight: e.target.value})}
                className="h-9 text-sm"
                placeholder="20kg"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700">RIR</Label>
              <Input
                type="number"
                value={localExercise.rir || ''}
                onChange={(e) => setLocalExercise({...localExercise, rir: parseInt(e.target.value) || null})}
                className="h-9 text-sm"
                placeholder="0-3"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700">RPE</Label>
              <Input
                type="number"
                value={localExercise.rpe || ''}
                onChange={(e) => setLocalExercise({...localExercise, rpe: parseInt(e.target.value) || null})}
                className="h-9 text-sm"
                placeholder="1-10"
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button onClick={handleSave} size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <Check className="w-4 h-4 mr-1" />
              Enregistrer
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
              <X className="w-4 h-4 mr-1" />
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500">Séries:</span>
              <span className="text-sm font-semibold text-gray-900">{exercise.sets}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500">Reps:</span>
              <span className="text-sm font-semibold text-gray-900">{exercise.reps}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500">Tempo:</span>
              <span className="text-sm font-semibold text-gray-900">{exercise.tempo || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-500">Repos:</span>
              <span className="text-sm font-semibold text-gray-900">{exercise.rest}</span>
            </div>
          </div>

          {(exercise.weight || exercise.rir || exercise.rpe) && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
              {exercise.weight && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">💪</span>
                  <span className="text-xs font-semibold text-gray-900">{exercise.weight}</span>
                </div>
              )}
              {exercise.rir && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">RIR:</span>
                  <span className="text-xs font-semibold text-gray-900">{exercise.rir}</span>
                </div>
              )}
              {exercise.rpe && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">RPE:</span>
                  <span className="text-xs font-semibold text-gray-900">{exercise.rpe}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CoachingPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sessions, setSessions] = useState({}); // Patient sessions by date
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [copiedSession, setCopiedSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchExercises();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientSessions(selectedPatient.id);
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API}/patients`);
      setPatients(response.data);
      if (response.data.length > 0) {
        setSelectedPatient(response.data[0]);
      }
    } catch (error) {
      console.error('Erreur chargement patients:', error);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await axios.get(`${API}/exercices`);
      setExerciseLibrary(response.data);
    } catch (error) {
      console.error('Erreur chargement exercices:', error);
    }
  };

  const fetchPatientSessions = async (patientId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/coaching/seances/patient/${patientId}`);
      const sessionsMap = {};
      response.data.forEach(session => {
        sessionsMap[session.date] = session;
      });
      setSessions(sessionsMap);
    } catch (error) {
      console.error('Erreur chargement séances:', error);
      setSessions({});
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1); // Start Monday
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDaySession = (date) => {
    if (!selectedPatient) return null;
    const dateKey = date.toISOString().split('T')[0];
    return sessions[dateKey];
  };

  const addExerciseToDay = async (date, exercise) => {
    if (!selectedPatient) return;
    
    const dateKey = date.toISOString().split('T')[0];
    const session = sessions[dateKey];
    
    const newExercise = {
      exercice_id: exercise.id,
      nom: exercise.nom,
      sets: 3,
      reps: "12",
      tempo: "2-0-2-0",
      rest: "60s",
      weight: null,
      rir: null,
      rpe: null,
      notes: "",
      completed: false,
      ordre: session ? session.exercices.length : 0
    };
    
    try {
      if (session) {
        // Update existing session
        const updatedExercices = [...session.exercices, newExercise];
        await axios.put(`${API}/coaching/seances/${session.id}`, {
          exercices: updatedExercices
        });
      } else {
        // Create new session
        await axios.post(`${API}/coaching/seances`, {
          patient_id: selectedPatient.id,
          date: dateKey,
          exercices: [newExercise],
          notes: ""
        });
      }
      await fetchPatientSessions(selectedPatient.id);
    } catch (error) {
      console.error('Erreur ajout exercice:', error);
    }
  };

  const updateExerciseParams = async (date, exerciseId, updates) => {
    if (!selectedPatient) return;
    
    const dateKey = date.toISOString().split('T')[0];
    const session = sessions[dateKey];
    
    if (!session) return;
    
    try {
      const updatedExercices = session.exercices.map(ex => 
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      );
      
      await axios.put(`${API}/coaching/seances/${session.id}`, {
        exercices: updatedExercices
      });
      
      await fetchPatientSessions(selectedPatient.id);
    } catch (error) {
      console.error('Erreur mise à jour exercice:', error);
    }
  };

  const deleteExercise = async (date, exerciseId) => {
    if (!selectedPatient) return;
    
    const dateKey = date.toISOString().split('T')[0];
    const session = sessions[dateKey];
    
    if (!session) return;
    
    try {
      const updatedExercices = session.exercices.filter(ex => ex.id !== exerciseId);
      
      if (updatedExercices.length === 0) {
        // Delete session if no exercises left
        await axios.delete(`${API}/coaching/seances/${session.id}`);
      } else {
        await axios.put(`${API}/coaching/seances/${session.id}`, {
          exercices: updatedExercices
        });
      }
      
      await fetchPatientSessions(selectedPatient.id);
    } catch (error) {
      console.error('Erreur suppression exercice:', error);
    }
  };

  const updateSessionNotes = async (date, notes) => {
    if (!selectedPatient) return;
    
    const dateKey = date.toISOString().split('T')[0];
    const session = sessions[dateKey];
    
    if (!session) return;
    
    try {
      await axios.put(`${API}/coaching/seances/${session.id}`, {
        notes: notes
      });
      
      await fetchPatientSessions(selectedPatient.id);
    } catch (error) {
      console.error('Erreur mise à jour notes:', error);
    }
  };

  const copySession = (date) => {
    const session = getDaySession(date);
    if (session) {
      setCopiedSession({
        ...session,
        sourceDate: date.toISOString().split('T')[0]
      });
    }
  };

  const pasteSession = async (targetDate) => {
    if (!copiedSession || !selectedPatient) return;
    
    const dateKey = targetDate.toISOString().split('T')[0];
    
    try {
      // Create new session with copied exercises
      await axios.post(`${API}/coaching/seances`, {
        patient_id: selectedPatient.id,
        date: dateKey,
        exercices: copiedSession.exercices.map(ex => ({
          ...ex,
          completed: false
        })),
        notes: copiedSession.notes
      });
      
      await fetchPatientSessions(selectedPatient.id);
    } catch (error) {
      console.error('Erreur copie séance:', error);
    }
  };

  const duplicateWeek = async () => {
    if (!selectedPatient) return;
    
    const currentWeekDays = getWeekDays();
    
    try {
      for (const currentDay of currentWeekDays) {
        const session = getDaySession(currentDay);
        if (session && session.exercices.length > 0) {
          const nextWeek = new Date(currentDay);
          nextWeek.setDate(currentDay.getDate() + 7);
          const nextDateKey = nextWeek.toISOString().split('T')[0];
          
          await axios.post(`${API}/coaching/seances`, {
            patient_id: selectedPatient.id,
            date: nextDateKey,
            exercices: session.exercices.map(ex => ({
              ...ex,
              completed: false
            })),
            notes: session.notes
          });
        }
      }
      
      // Move to next week
      const nextWeek = new Date(currentWeek);
      nextWeek.setDate(currentWeek.getDate() + 7);
      setCurrentWeek(nextWeek);
      
      await fetchPatientSessions(selectedPatient.id);
    } catch (error) {
      console.error('Erreur duplication semaine:', error);
    }
  };

  const toggleExerciseCompletion = async (date, exerciseId) => {
    if (!selectedPatient) return;
    
    const dateKey = date.toISOString().split('T')[0];
    const session = sessions[dateKey];
    
    if (!session) return;
    
    try {
      const updatedExercices = session.exercices.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      );
      
      await axios.put(`${API}/coaching/seances/${session.id}`, {
        exercices: updatedExercices
      });
      
      await fetchPatientSessions(selectedPatient.id);
    } catch (error) {
      console.error('Erreur toggle exercice:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header - Pleine largeur */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Coaching - Programme d'exercices</h1>
              <p className="text-gray-600 mt-1 text-sm">Vue hebdomadaire des séances</p>
            </div>
            <Button 
              onClick={() => setShowProgramModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Programme
            </Button>
          </div>
        </div>
      </div>

      {/* Layout pleine largeur sans max-width */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Patient Sidebar - Plus compact */}
        <div className="w-72 bg-white border-r shadow-sm overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Patients</h3>
            </div>
            <div className="space-y-1 p-2">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedPatient?.id === patient.id
                      ? 'bg-blue-100 text-blue-900 border-l-4 border-l-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{patient.nom} {patient.prenom}</div>
                  <div className="text-sm text-gray-500">{patient.pathologie}</div>
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600">Actif</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Coaching Area - Pleine largeur */}
          <div className="flex-1 bg-white overflow-hidden">
            {selectedPatient ? (
              <div className="h-full flex flex-col">
                {/* Patient Header - Plus compact */}
                <div className="px-6 py-3 border-b bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {selectedPatient.nom} {selectedPatient.prenom}
                      </h2>
                      <p className="text-emerald-100 text-sm">{selectedPatient.pathologie}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-emerald-100">Âge</div>
                    <div className="text-lg font-semibold">{selectedPatient.age} ans</div>
                  </div>
                </div>

                {/* Week Navigation with Actions - Plus compact */}
                <div className="px-6 py-3 border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newWeek = new Date(currentWeek);
                          newWeek.setDate(newWeek.getDate() - 7);
                          setCurrentWeek(newWeek);
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      
                      <h3 className="text-lg font-semibold">
                        Semaine du {getWeekDays()[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                      </h3>
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newWeek = new Date(currentWeek);
                          newWeek.setDate(newWeek.getDate() + 7);
                          setCurrentWeek(newWeek);
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {copiedSession && (
                        <div className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-md">
                          Séance copiée • Clic droit pour coller
                        </div>
                      )}
                      <Button
                        onClick={duplicateWeek}
                        variant="outline"
                        className="text-purple-600 border-purple-600 hover:bg-purple-50"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Dupliquer semaine
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Weekly Program Grid - Pleine largeur avec scroll horizontal */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden bg-gray-50">
                  <div className="flex gap-4 p-4 h-full" style={{ minWidth: 'max-content' }}>
                      {getWeekDays().map((day, dayIndex) => {
                        const daySession = getDaySession(day);
                        const isToday = day.toDateString() === new Date().toDateString();
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                        
                        return (
                          <div 
                            key={dayIndex} 
                            className={`bg-white rounded-xl shadow-lg border-2 flex flex-col flex-shrink-0 transition-all hover:shadow-2xl ${
                              isToday ? 'ring-4 ring-emerald-400 border-emerald-400' : 'border-gray-200'
                            }`}
                            style={{ width: '320px', height: 'calc(100vh - 220px)' }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              if (copiedSession) {
                                pasteSession(day);
                              }
                            }}
                          >
                            {/* Day Header - Plus compact */}
                            <div className={`p-4 text-center border-b-2 flex-shrink-0 ${
                              isToday 
                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' 
                                : isWeekend 
                                  ? 'bg-gradient-to-br from-gray-100 to-gray-200' 
                                  : 'bg-gradient-to-br from-blue-50 to-blue-100'
                            }`}>
                              <div className={`text-xs font-bold uppercase tracking-wider ${
                                isToday ? 'text-emerald-100' : 'text-gray-600'
                              }`}>
                                {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                              </div>
                              <div className={`text-2xl font-bold mt-1 ${
                                isToday ? 'text-white' : 'text-gray-900'
                              }`}>
                                {day.getDate()}
                              </div>
                              <div className={`text-xs ${
                                isToday ? 'text-emerald-100' : 'text-gray-500'
                              }`}>
                                {day.toLocaleDateString('fr-FR', { month: 'short' })}
                              </div>
                            </div>

                            {/* Day Content - Scrollable verticalement */}
                            <div className="flex-1 p-4 overflow-y-auto">
                              {isWeekend ? (
                                <div className="text-center py-8">
                                  <div className="text-gray-400 mb-4">
                                    <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <div className="text-sm font-medium">Jour de repos</div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    className="w-full border-2 border-dashed text-emerald-600 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 py-2 text-sm"
                                    onClick={() => {
                                      setSelectedDate(day);
                                      setShowProgramModal(true);
                                    }}
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Exercices à domicile
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {/* Session Actions - Plus compact */}
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="text-xs font-semibold text-gray-600">
                                      {daySession?.exercices?.length || 0} exercice(s)
                                    </div>
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copySession(day)}
                                        className="p-1 h-7 w-7 hover:bg-blue-100"
                                        title="Copier la séance"
                                      >
                                        <Copy className="w-3 h-3 text-blue-600" />
                                      </Button>
                                      {daySession && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={async () => {
                                            if (window.confirm('Supprimer toute la séance ?')) {
                                              await axios.delete(`${API}/coaching/seances/${daySession.id}`);
                                              await fetchPatientSessions(selectedPatient.id);
                                            }
                                          }}
                                          className="p-1 h-7 w-7 hover:bg-red-100"
                                          title="Effacer la séance"
                                        >
                                          <Trash2 className="w-3 h-3 text-red-600" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Exercises - Plus compact */}
                                  <div className="space-y-3">
                                    {daySession?.exercices?.map((exercise) => (
                                      <ExerciseCard
                                        key={exercise.id}
                                        exercise={exercise}
                                        onToggleComplete={() => toggleExerciseCompletion(day, exercise.id)}
                                        onUpdate={(updatedExercise) => updateExerciseParams(day, exercise.id, updatedExercise)}
                                        onDelete={() => deleteExercise(day, exercise.id)}
                                      />
                                    ))}
                                  </div>

                                  {/* Add Exercise Button - Plus compact */}
                                  <Button
                                    variant="outline"
                                    className="w-full border-dashed border-2 border-emerald-300 text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 py-2 mt-3 text-sm"
                                    onClick={() => {
                                      setSelectedDate(day);
                                      setShowProgramModal(true);
                                    }}
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter exercice
                                  </Button>

                                  {/* Session Notes - Plus compact */}
                                  {daySession && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                      <Label className="text-xs font-semibold text-gray-700 mb-1 block">
                                        Notes
                                      </Label>
                                      <Textarea
                                        placeholder="Notes de séance..."
                                        value={daySession.notes || ''}
                                        onChange={(e) => updateSessionNotes(day, e.target.value)}
                                        className="text-xs resize-none border focus:border-emerald-400"
                                        rows={2}
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Sélectionnez un patient pour commencer</p>
                </div>
              </div>
            )}

            {showProgramModal && selectedDate && (
              <ProgramModal
            selectedDate={selectedDate}
            exerciseLibrary={exerciseLibrary}
            onAddExercise={async (exercise) => {
              await addExerciseToDay(selectedDate, exercise);
              setShowProgramModal(false);
              setSelectedDate(null);
            }}
            onClose={() => {
              setShowProgramModal(false);
              setSelectedDate(null);
            }}
          />
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Program Modal Component
const ProgramModal = ({ selectedDate, exerciseLibrary, onAddExercise, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('tous');

  const bodyParts = [
    'tous', 'cervical', 'epaule', 'coude', 'poignet', 
    'thoracique', 'lombaire', 'hanche', 'genou', 'cheville'
  ];

  const filteredExercises = exerciseLibrary.filter(exercise => {
    const matchesSearch = exercise.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBodyPart = selectedBodyPart === 'tous' || exercise.zone_corporelle === selectedBodyPart;
    return matchesSearch && matchesBodyPart;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">
            Ajouter un exercice - {selectedDate.toLocaleDateString('fr-FR')}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Rechercher un exercice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedBodyPart} onValueChange={setSelectedBodyPart}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bodyParts.map(part => (
                  <SelectItem key={part} value={part}>
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exercise List */}
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredExercises.map((exercise) => (
              <Card
                key={exercise.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onAddExercise(exercise)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Dumbbell className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{exercise.nom}</h4>
                    <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {exercise.zone_corporelle}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Exercise Assignment Section Component
const ExerciseAssignmentSection = ({ patient }) => {
  const [assignedExercises, setAssignedExercises] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('tous');
  const [exerciseStats, setExerciseStats] = useState({});

  useEffect(() => {
    loadPatientExercises();
    loadAvailableExercises();
    loadExerciseStats();
  }, [patient.id]);

  const loadPatientExercises = async () => {
    try {
      // Simulate loading patient exercises
      const mockExercises = [
        {
          id: '1',
          nom: 'Étirement cervical',
          zone_corporelle: 'cervical',
          description: 'Étirement doux des muscles cervicaux',
          sets: 3,
          reps: '30s',
          frequency: 'quotidien',
          assigned_date: new Date().toISOString(),
          video_url: 'https://example.com/cervical.mp4'
        }
      ];
      setAssignedExercises(mockExercises);
    } catch (error) {
      console.error('Erreur chargement exercices patient:', error);
    }
  };

  const loadAvailableExercises = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/exercices`);
      setAvailableExercises(response.data);
    } catch (error) {
      console.error('Erreur chargement exercices:', error);
    }
  };

  const loadExerciseStats = async () => {
    // Simulate exercise usage statistics (most assigned by body part)
    const stats = {
      cervical: [
        { nom: 'Étirement cervical', count: 45 },
        { nom: 'Rotation cervicale', count: 38 },
        { nom: 'Renforcement cervical', count: 32 }
      ],
      genou: [
        { nom: 'Squats thérapeutiques', count: 67 },
        { nom: 'Extension genou', count: 54 },
        { nom: 'Flexion genou', count: 41 }
      ],
      epaule: [
        { nom: 'Élévation épaule', count: 52 },
        { nom: 'Rotation externe', count: 44 },
        { nom: 'Pendulaires', count: 39 }
      ]
    };
    setExerciseStats(stats);
  };

  const assignExerciseToPatient = async (exercise, params) => {
    const newAssignment = {
      id: Date.now().toString(),
      ...exercise,
      sets: params.sets || 3,
      reps: params.reps || 10,
      frequency: params.frequency || 'quotidien',
      assigned_date: new Date().toISOString()
    };

    setAssignedExercises([...assignedExercises, newAssignment]);
    setShowExerciseModal(false);

    // Update exercise statistics
    const bodyPart = exercise.zone_corporelle;
    if (exerciseStats[bodyPart]) {
      const updated = exerciseStats[bodyPart].map(stat => 
        stat.nom === exercise.nom 
          ? { ...stat, count: stat.count + 1 }
          : stat
      );
      setExerciseStats({ ...exerciseStats, [bodyPart]: updated });
    }
  };

  const removeExercise = (exerciseId) => {
    setAssignedExercises(assignedExercises.filter(ex => ex.id !== exerciseId));
  };

  const bodyParts = ['tous', 'cervical', 'epaule', 'coude', 'poignet', 'thoracique', 'lombaire', 'hanche', 'genou', 'cheville'];

  // Get popular exercises for the selected body part
  const getPopularExercises = (bodyPart) => {
    if (bodyPart === 'tous') return [];
    return exerciseStats[bodyPart]?.slice(0, 3) || [];
  };

  const filteredExercises = availableExercises.filter(exercise => {
    const matchesSearch = exercise.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBodyPart = selectedBodyPart === 'tous' || exercise.zone_corporelle === selectedBodyPart;
    return matchesSearch && matchesBodyPart;
  });

  // Sort by popularity for selected body part
  const sortedExercises = filteredExercises.sort((a, b) => {
    if (selectedBodyPart === 'tous') return 0;
    
    const aStats = exerciseStats[selectedBodyPart]?.find(stat => stat.nom === a.nom);
    const bStats = exerciseStats[selectedBodyPart]?.find(stat => stat.nom === b.nom);
    
    const aCount = aStats?.count || 0;
    const bCount = bStats?.count || 0;
    
    return bCount - aCount; // Most used first
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Label className="text-sm font-medium text-gray-600">Exercices Assignés</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExerciseModal(true)}
          className="text-blue-600 hover:bg-blue-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter Exercice
        </Button>
      </div>

      {/* Assigned Exercises */}
      <div className="bg-gray-50 p-3 rounded-md">
        {assignedExercises.length > 0 ? (
          <div className="space-y-2">
            {assignedExercises.map((exercise) => (
              <div key={exercise.id} className="bg-white p-3 rounded-lg border flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{exercise.nom}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {exercise.sets} × {exercise.reps} • {exercise.frequency}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Zone: {exercise.zone_corporelle}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* Open video modal */}}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExercise(exercise.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm py-4">
            <Dumbbell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            Aucun exercice assigné
          </div>
        )}
      </div>

      {/* Exercise Assignment Modal */}
      {showExerciseModal && (
        <ExerciseAssignmentModal
          availableExercises={sortedExercises}
          popularExercises={getPopularExercises(selectedBodyPart)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedBodyPart={selectedBodyPart}
          setSelectedBodyPart={setSelectedBodyPart}
          bodyParts={bodyParts}
          exerciseStats={exerciseStats}
          onAssignExercise={assignExerciseToPatient}
          onClose={() => setShowExerciseModal(false)}
        />
      )}
    </div>
  );
};

// Exercise Assignment Modal Component
const ExerciseAssignmentModal = ({ 
  availableExercises, 
  popularExercises, 
  searchTerm, 
  setSearchTerm, 
  selectedBodyPart, 
  setSelectedBodyPart, 
  bodyParts,
  exerciseStats,
  onAssignExercise, 
  onClose 
}) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseParams, setExerciseParams] = useState({
    sets: 3,
    reps: 10,
    frequency: 'quotidien'
  });

  const handleAssign = () => {
    if (!selectedExercise) return;
    onAssignExercise(selectedExercise, exerciseParams);
  };

  const getUsageCount = (exerciseName) => {
    if (selectedBodyPart === 'tous') return 0;
    const stat = exerciseStats[selectedBodyPart]?.find(s => s.nom === exerciseName);
    return stat?.count || 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold">Assigner des Exercices</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Exercise Library */}
          <div className="flex-1 p-6 border-r">
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <Input
                type="text"
                placeholder="Rechercher un exercice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={selectedBodyPart} onValueChange={setSelectedBodyPart}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bodyParts.map(part => (
                    <SelectItem key={part} value={part}>
                      {part.charAt(0).toUpperCase() + part.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Popular Exercises */}
            {popularExercises.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-orange-600" />
                  Exercices populaires pour {selectedBodyPart}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {popularExercises.map((popular) => {
                    const exercise = availableExercises.find(ex => ex.nom === popular.nom);
                    if (!exercise) return null;
                    
                    return (
                      <div
                        key={exercise.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedExercise?.id === exercise.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-orange-200 bg-orange-50 hover:border-orange-300'
                        }`}
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{exercise.nom}</div>
                            <div className="text-xs text-gray-600 mt-1">{exercise.description}</div>
                          </div>
                          <div className="flex items-center text-xs text-orange-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {popular.count}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Exercises */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Tous les exercices ({availableExercises.length})
              </h4>
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {availableExercises.map((exercise) => {
                  const usageCount = getUsageCount(exercise.nom);
                  
                  return (
                    <div
                      key={exercise.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedExercise?.id === exercise.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedExercise(exercise)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{exercise.nom}</div>
                          <div className="text-sm text-gray-600 mt-1">{exercise.description}</div>
                          <div className="flex items-center mt-2">
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {exercise.zone_corporelle}
                            </span>
                            {usageCount > 0 && (
                              <span className="ml-2 text-xs text-gray-500">
                                Utilisé {usageCount}× 
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <Video className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Assignment Parameters */}
          <div className="w-96 p-6 bg-gray-50">
            {selectedExercise ? (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Paramètres d'Assignment</h4>
                
                <div className="bg-white p-4 rounded-lg border mb-6">
                  <h5 className="font-medium text-gray-900 mb-2">{selectedExercise.nom}</h5>
                  <p className="text-sm text-gray-600 mb-3">{selectedExercise.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {selectedExercise.zone_corporelle}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Voir vidéo
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Séries</Label>
                    <Input
                      type="number"
                      value={exerciseParams.sets}
                      onChange={(e) => setExerciseParams({...exerciseParams, sets: parseInt(e.target.value)})}
                      min="1"
                      max="10"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Répétitions</Label>
                    <Input
                      type="number"
                      value={exerciseParams.reps}
                      onChange={(e) => setExerciseParams({...exerciseParams, reps: parseInt(e.target.value)})}
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Fréquence</Label>
                    <Select 
                      value={exerciseParams.frequency}
                      onValueChange={(value) => setExerciseParams({...exerciseParams, frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quotidien">Quotidien</SelectItem>
                        <SelectItem value="2x/jour">2x par jour</SelectItem>
                        <SelectItem value="3x/semaine">3x par semaine</SelectItem>
                        <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleAssign}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Assigner cet Exercice
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-12">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Sélectionnez un exercice pour configurer l'assignment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Patient Detail Page Component
const PatientDetailPage = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');
  const [appointments, setAppointments] = useState([]);

  // Get patient ID from URL
  const patientId = window.location.pathname.split('/')[2];

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails();
      fetchPatientAppointments();
    }
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/patients/${patientId}`);
      setPatient(response.data);
      setNotes(response.data.notes || '');
    } catch (error) {
      console.error('Erreur chargement patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientAppointments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/rendez-vous?patient_id=${patientId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Erreur chargement RDV:', error);
    }
  };

  const saveNotes = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/patients/${patientId}`, {
        ...patient,
        notes: notes
      });
      alert('Notes sauvegardées');
    } catch (error) {
      console.error('Erreur sauvegarde notes:', error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) return;
    
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/rendez-vous/${appointmentId}`);
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
      alert('Rendez-vous annulé');
    } catch (error) {
      console.error('Erreur annulation RDV:', error);
      alert('Erreur lors de l\'annulation');
    }
  };

  const sendSMSNotification = async (message) => {
    try {
      // Simulate SMS sending
      alert(`SMS envoyé à ${patient.prenom} ${patient.nom}: ${message}`);
    } catch (error) {
      console.error('Erreur envoi SMS:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient non trouvé</h2>
          <Button onClick={() => window.location.href = '/patients'}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <Users className="w-4 h-4" /> },
    { id: 'exercises', label: 'Exercices', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'appointments', label: 'Rendez-vous', icon: <Calendar className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'media', label: 'Médias', icon: <Camera className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/patients'}
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {patient.prenom} {patient.nom}
                </h1>
                <p className="text-gray-600">{patient.pathologie} • {patient.age} ans</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => sendSMSNotification('Rappel de votre prochain rendez-vous')}
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                SMS
              </Button>
              <Button 
                onClick={() => window.location.href = `/coaching?patient=${patient.id}`}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Target className="w-4 h-4 mr-2" />
                Coaching
              </Button>
            </div>
          </div>

          {/* Zone Notes Cliniques - Grande zone en haut */}
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-bold text-blue-900 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Notes Cliniques - Ce que raconte le patient
              </Label>
              <Button 
                onClick={saveNotes} 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Check className="w-4 h-4 mr-1" />
                Enregistrer
              </Button>
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notez ici ce que le patient vous raconte : symptômes, plaintes, historique, observations cliniques..."
              className="w-full min-h-[100px] text-sm border-2 border-blue-300 focus:border-blue-500 bg-white"
              rows={4}
            />
            <p className="text-xs text-blue-700 mt-2">
              💡 Zone de prise de notes rapide pendant la consultation. Enregistrez régulièrement.
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'overview' && (
          <PatientOverviewTab patient={patient} />
        )}
        
        {activeTab === 'exercises' && (
          <PatientExercisesTab patient={patient} />
        )}
        
        {activeTab === 'appointments' && (
          <PatientAppointmentsTab 
            appointments={appointments}
            onCancelAppointment={cancelAppointment}
            onSendSMS={sendSMSNotification}
          />
        )}
        
        {activeTab === 'notes' && (
          <PatientNotesTab 
            notes={notes}
            setNotes={setNotes}
            onSave={saveNotes}
          />
        )}
        
        {activeTab === 'media' && (
          <PatientMediaTab patient={patient} />
        )}
      </div>
    </div>
  );
};

// Patient Overview Tab Component
const PatientOverviewTab = ({ patient }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Patient Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informations Patient</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Nom complet:</span>
            <span className="font-medium">{patient.prenom} {patient.nom}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Âge:</span>
            <span className="font-medium">{patient.age} ans</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Téléphone:</span>
            <span className="font-medium">{patient.telephone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-blue-600">{patient.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pathologie:</span>
            <span className="font-medium">{patient.pathologie}</span>
          </div>
        </div>
      </Card>

      {/* Medical Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informations Médicales</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Prescription médicale</Label>
            <p className="text-sm bg-gray-50 p-3 rounded-md mt-1">
              {patient.prescription_medicale}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Date de création</Label>
            <p className="text-sm mt-1">
              {new Date(patient.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-20 flex-col space-y-2">
            <FileText className="w-6 h-6" />
            <span className="text-xs">Générer Rapport</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Nouveau RDV</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs">Ajouter Exercice</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Camera className="w-6 h-6" />
            <span className="text-xs">Photos/Vidéos</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Patient Exercises Tab Component  
const PatientExercisesTab = ({ patient }) => {
  return (
    <div className="space-y-6">
      <ExerciseAssignmentSection patient={patient} />
    </div>
  );
};

// Patient Appointments Tab Component
const PatientAppointmentsTab = ({ appointments, onCancelAppointment, onSendSMS }) => {
  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date_debut) > new Date() && apt.statut !== 'annule'
  );
  const pastAppointments = appointments.filter(apt => 
    new Date(apt.date_debut) <= new Date() || apt.statut === 'annule'
  );

  return (
    <div className="space-y-6">
      {/* Upcoming Appointments */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Rendez-vous à venir ({upcomingAppointments.length})</h3>
          <Button 
            onClick={() => onSendSMS('Rappel: Vous avez un rendez-vous prévu prochainement')}
            variant="outline"
            className="text-blue-600"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Rappel SMS
          </Button>
        </div>
        
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">
                      {new Date(appointment.date_debut).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(appointment.date_debut).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} • {appointment.categorie_nom}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSendSMS(`Rappel: RDV le ${new Date(appointment.date_debut).toLocaleDateString('fr-FR')} à ${new Date(appointment.date_debut).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}`)}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancelAppointment(appointment.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucun rendez-vous à venir</p>
        )}
      </Card>

      {/* Past Appointments */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Historique ({pastAppointments.length})</h3>
        {pastAppointments.length > 0 ? (
          <div className="space-y-2">
            {pastAppointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    appointment.statut === 'annule' ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <div className="font-medium">
                      {new Date(appointment.date_debut).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {appointment.categorie_nom} • {appointment.statut}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucun historique</p>
        )}
      </Card>
    </div>
  );
};

// Patient Notes Tab Component
const PatientNotesTab = ({ notes, setNotes, onSave }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Notes Patient</h3>
        <Button onClick={onSave} className="bg-emerald-600 hover:bg-emerald-700">
          <FileText className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
      
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Saisissez vos notes sur ce patient..."
        className="min-h-[400px] resize-none"
      />
      
      <div className="mt-4 text-sm text-gray-500">
        Dernière modification: {new Date().toLocaleString('fr-FR')}
      </div>
    </Card>
  );
};

// Patient Media Tab Component
const PatientMediaTab = ({ patient }) => {
  return (
    <div className="space-y-6">
      <MediaSection patient={patient} />
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="App min-h-screen bg-gray-50">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientsList />} />
          <Route path="/patients/:patientId" element={<PatientDetailPage />} />
          <Route path="/nouveau-patient" element={<NewPatientForm />} />
          <Route path="/exercices" element={<ExercicesPage />} />
          <Route path="/programmes" element={<ProgrammesPage />} />
          <Route path="/coaching" element={<CoachingPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/messagerie" element={<MessagingPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/suggestions" element={<SuggestionsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;