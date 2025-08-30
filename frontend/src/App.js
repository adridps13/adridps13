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
  CheckCircle
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

  const generateDocuments = async (patientId, type) => {
    try {
      const endpoint = type === 'anamnese' ? 'compte-rendu-anamnese' : 'lettre-medecin';
      const response = await axios.post(`${API}/generate/${endpoint}/${patientId}`);
      
      // Générer le PDF
      const pdfResponse = await axios.post(`${API}/export/pdf/${response.data.document.id}`);
      
      // Télécharger le PDF
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${pdfResponse.data.pdf_data}`;
      link.download = pdfResponse.data.filename;
      link.click();
      
      alert('Document généré et téléchargé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la génération du document:', error);
      alert('Erreur lors de la génération du document');
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
                  </div>
                </div>
              </div>
            </>
          )}
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
    douleur_type: '',
    douleur_localisation: '',
    debut_symptomes: '',
    facteurs_declenchants: '',
    activites_genantes: [],
    antecedents_medicaux: '',
    traitements_actuels: '',
    objectifs_patient: '',
    notes_supplementaires: ''
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
        douleur_type: '',
        douleur_localisation: '',
        debut_symptomes: '',
        facteurs_declenchants: '',
        activites_genantes: [],
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
                      onChange={(e) => setPatientData(prev => ({ ...prev, nom: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={patientData.prenom}
                      onChange={(e) => setPatientData(prev => ({ ...prev, prenom: e.target.value }))}
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
                  </div>
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

// Exercises Component
const ExercicesPage = () => {
  const [exercices, setExercices] = useState([]);
  const [filteredExercices, setFilteredExercices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState(undefined);
  const [zoneFilter, setZoneFilter] = useState(undefined);
  const [showNewExerciceForm, setShowNewExerciceForm] = useState(false);
  const [newExercice, setNewExercice] = useState({
    nom: '',
    description: '',
    type_exercice: '',
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
  }, [exercices, searchTerm, typeFilter, zoneFilter]);

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

    if (typeFilter) {
      filtered = filtered.filter(exercice => exercice.type_exercice === typeFilter);
    }

    if (zoneFilter) {
      filtered = filtered.filter(exercice => exercice.zone_corporelle === zoneFilter);
    }

    setFilteredExercices(filtered);
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
        type_exercice: '',
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
                  <SelectItem value="">Tous les types</SelectItem>
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
                  <SelectItem value="">Toutes les zones</SelectItem>
                  <SelectItem value="genou">Genou</SelectItem>
                  <SelectItem value="epaule">Épaule</SelectItem>
                  <SelectItem value="dos">Dos</SelectItem>
                  <SelectItem value="cheville">Cheville</SelectItem>
                  <SelectItem value="cuisse">Cuisse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('');
                  setZoneFilter('');
                }}
                className="w-full"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              Essayez de modifier vos filtres ou ajoutez un nouvel exercice
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

// Main App Component
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;