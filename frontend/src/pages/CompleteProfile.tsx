// src/pages/CompleteProfile.tsx - Page de complétion de profil utilisateur

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Camera,FileText, Upload, User, School, GraduationCap, Target, MapPin, Calendar, BookOpen, Trophy, Star, ArrowRight, Check, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import './CompleteProfile.css';

interface ProfileData {
  username: string;
  profileImage: File | null;
  profileImageUrl: string;
  institution: string;
  currentLevel: string;
  specialization: string;
  academicYear: string;
  targetExam: string;
  targetExamDate: string;
  enrollmentDate: string;
  academicGoals: string[];
  learningStyle: {
    preferredTime: string;
    studyMethod: string;
    difficulty: string;
  };
  bio: string;
  interests: string[];
  studySchedule: {
    mondayToFriday: string;
    weekend: string;
    preferredDuration: string;
  };
}

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, isLoading } = useAuth();
  const { success: showSuccess, error: showError, info: showInfo } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    profileImage: null,
    profileImageUrl: '',
    institution: '',
    currentLevel: '',
    specialization: '',
    academicYear: new Date().getFullYear().toString(),
    targetExam: '',
    targetExamDate: '',
    enrollmentDate: '',
    academicGoals: [],
    learningStyle: {
      preferredTime: '',
      studyMethod: '',
      difficulty: 'intermediate'
    },
    bio: '',
    interests: [],
    studySchedule: {
      mondayToFriday: '',
      weekend: '',
      preferredDuration: ''
    }
  });

  // Options prédéfinies
  const institutions = [
    'Université de Yaoundé I',
    'Université de Yaoundé II',
    'Université de Douala',
    'École Nationale Supérieure Polytechnique (ENSP)',
    'École Normale Supérieure de Yaoundé',
    'Université de Dschang',
    'Université de Ngaoundéré',
    'Université de Buea',
    'Université de Bamenda',
    'Institut Universitaire de Technologie (IUT)',
    'École Supérieure des Sciences Économiques et Commerciales (ESSEC)',
    'Institut des Relations Internationales du Cameroun (IRIC)',
    'Autre'
  ];

  const levels = [
    { value: 'seconde', label: 'Seconde' },
    { value: 'premiere', label: 'Première' },
    { value: 'terminale', label: 'Terminale' },
    { value: 'licence-1', label: 'Licence 1' },
    { value: 'licence-2', label: 'Licence 2' },
    { value: 'licence-3', label: 'Licence 3' },
    { value: 'master-1', label: 'Master 1' },
    { value: 'master-2', label: 'Master 2' },
    { value: 'doctorat', label: 'Doctorat' },
    { value: 'prepa', label: 'Classes préparatoires' }
  ];

  const specializations = [
    'Sciences Mathématiques',
    'Sciences Physiques',
    'Sciences de la Vie et de la Terre',
    'Sciences Économiques et Sociales',
    'Littérature et Langues',
    'Arts et Design',
    'Informatique et Technologies',
    'Ingénierie',
    'Médecine',
    'Droit',
    'Architecture',
    'Commerce et Gestion',
    'Communication et Journalisme',
    'Psychologie',
    'Sociologie',
    'Histoire et Géographie',
    'Philosophie',
    'Autre'
  ];

  const targetExams = [
    'Baccalauréat Général',
    'Baccalauréat Technique',
    'BEPC',
    'Concours ENS',
    'Concours ENSP',
    'Concours ENAM',
    'Concours IRIC',
    'Concours Médecine',
    'Concours Grandes Écoles',
    'Licence Professionnelle',
    'Master',
    'Concours de la Fonction Publique',
    'Certifications Professionnelles',
    'Autre'
  ];

  const academicGoalsList = [
    'Obtenir une mention au baccalauréat',
    'Intégrer une grande école',
    'Réussir les concours d\'entrée',
    'Améliorer ma moyenne générale',
    'Maîtriser les matières scientifiques',
    'Développer mes compétences linguistiques',
    'Préparer mon orientation post-bac',
    'Obtenir une bourse d\'études',
    'Exceller dans ma spécialisation',
    'Devenir major de promotion'
  ];

  const interestsList = [
    'Sciences et Technologies',
    'Littérature et Écriture',
    'Arts et Créativité',
    'Sport et Bien-être',
    'Musique et Culture',
    'Entrepreneuriat',
    'Recherche et Innovation',
    'Environnement et Écologie',
    'Voyages et Langues',
    'Développement Personnel',
    'Informatique et Programmation',
    'Histoire et Civilisations'
  ];

  // Sync avec le mode sombre global
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    document.documentElement.className.includes('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Initialiser avec les données utilisateur existantes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        username: user.username || '',
        profileImageUrl: user.avatar || user.profileImageUrl || '',
      }));
    }
  }, [user]);

  // Calculer le pourcentage de completion
  useEffect(() => {
    const calculateCompletion = () => {
      const fields = [
        profileData.username,
        profileData.profileImageUrl || profileData.profileImage,
        profileData.institution,
        profileData.currentLevel,
        profileData.specialization,
        profileData.targetExam,
        profileData.academicGoals.length > 0,
        profileData.learningStyle.preferredTime,
        profileData.bio
      ];

      const completed = fields.filter(field => field && field !== '').length;
      const percentage = Math.round((completed / fields.length) * 100);
      setProfileCompletion(percentage);
    };

    calculateCompletion();
  }, [profileData]);

  // Gestionnaire pour les changements de champs
  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestionnaire pour les champs imbriqués
  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setProfileData(prev => ({
        ...prev,
        [parent]: {
            ...(prev[parent as keyof ProfileData] as Record<string, unknown>),
            [field]: value
        }
        }));
  };

  // Gestionnaire pour les tableaux
  const handleArrayToggle = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: (prev[field as keyof ProfileData] as string[]).includes(value) 
        ? (prev[field as keyof ProfileData] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof ProfileData] as string[]), value]
    }));
  };

  // Gestionnaire pour l'upload d'image
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image trop volumineuse', 'La taille maximum autorisée est de 5MB');
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        showError('Format non supporté', 'Veuillez sélectionner une image (JPG, PNG, GIF)');
        return;
      }

      // Créer une URL temporaire pour la prévisualisation
      const imageUrl = URL.createObjectURL(file);
      
      setProfileData(prev => ({
        ...prev,
        profileImage: file,
        profileImageUrl: imageUrl
      }));

      showInfo('Image sélectionnée', 'Votre photo de profil a été ajoutée');
    }
  }, [showError, showInfo]);

  // Validation des données
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Informations de base
        if (!profileData.username.trim()) {
          showError('Champ requis', 'Le nom d\'utilisateur est obligatoire');
          return false;
        }
        if (profileData.username.length < 3) {
          showError('Nom d\'utilisateur trop court', 'Minimum 3 caractères requis');
          return false;
        }
        return true;
        
      case 2: // Informations académiques
        if (!profileData.institution || !profileData.currentLevel) {
          showError('Champs requis', 'Veuillez remplir tous les champs obligatoires');
          return false;
        }
        return true;
        
      case 3: // Objectifs et préférences
        if (!profileData.targetExam || profileData.academicGoals.length === 0) {
          showError('Informations manquantes', 'Veuillez sélectionner un objectif d\'examen et au moins un objectif académique');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  // Navigation entre les étapes
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Soumission finale
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validation finale
      if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
        return;
      }

      // Préparer les données pour l'API
      const formData = new FormData();
      
      // Données de base
      formData.append('username', profileData.username);
      formData.append('bio', profileData.bio);
      
      // Image de profil
      if (profileData.profileImage) {
        formData.append('profileImage', profileData.profileImage);
      }
      
      // Informations académiques
      formData.append('institution', profileData.institution);
      formData.append('currentLevel', profileData.currentLevel);
      formData.append('specialization', profileData.specialization);
      formData.append('academicYear', profileData.academicYear);
      formData.append('targetExam', profileData.targetExam);
      formData.append('targetExamDate', profileData.targetExamDate);
      formData.append('enrollmentDate', profileData.enrollmentDate);
      
      // Objectifs et préférences (JSON)
      formData.append('academicGoals', JSON.stringify(profileData.academicGoals));
      formData.append('learningStyle', JSON.stringify(profileData.learningStyle));
      formData.append('interests', JSON.stringify(profileData.interests));
      formData.append('studySchedule', JSON.stringify(profileData.studySchedule));

      // Appel API pour mettre à jour le profil
      await updateProfile(formData);

      showSuccess(
        'Profil complété !', 
        'Votre profil a été mis à jour avec succès. Bienvenue sur Réussir !'
      );

      // Redirection vers le dashboard après un délai
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);

    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      showError(
        'Erreur de mise à jour',
        error.message || 'Une erreur est survenue lors de la sauvegarde'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Step 1 - Informations personnelles
  const renderStep1 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Informations personnelles</h2>
        <p className="step-subtitle">Commençons par créer votre identité sur la plateforme</p>
      </div>

      {/* Photo de profil */}
      <div className="profile-image-section">
        <div className="profile-image-container">
          <div className="profile-image-wrapper">
            {profileData.profileImageUrl ? (
              <img 
                src={profileData.profileImageUrl} 
                alt="Photo de profil" 
                className="profile-image"
              />
            ) : (
              <div className="profile-image-placeholder">
                <User size={48} />
              </div>
            )}
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="profile-image-upload-btn"
              aria-label="Changer la photo de profil"
            >
              <Camera size={20} />
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            aria-hidden="true"
          />
        </div>
        
        <div className="profile-image-info">
          <h3>Photo de profil</h3>
          <p>Ajoutez une photo pour personnaliser votre profil. Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
        </div>
      </div>

      {/* Nom d'utilisateur */}
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Nom d'utilisateur *
        </label>
        <div className="input-with-icon">
          <User size={20} className="input-icon" />
          <input
            type="text"
            id="username"
            value={profileData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="form-input"
            placeholder="ex: marie_student"
            required
          />
        </div>
        <p className="input-hint">
          Choisissez un nom unique qui vous représente (minimum 3 caractères)
        </p>
      </div>

      {/* Bio */}
      <div className="form-group">
        <label htmlFor="bio" className="form-label">
          Présentation personnelle
        </label>
        <div className = 'input-with-icon'>
        <FileText size={20} className="input-icon" />
        <textarea
          id="bio"
          value={profileData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          className="form-textarea"
          placeholder="Parlez-nous de vous, vos passions, vos ambitions..."
          rows={4}
          maxLength={300}
        />  
        </div>
        
        <p className="input-hint">
          {profileData.bio.length}/300 caractères
        </p>
      </div>

      {/* Centres d'intérêt */}
      <div className="form-group">
        <label className="form-label">Centres d'intérêt</label>
        <div className="interest-grid">
          {interestsList.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => handleArrayToggle('interests', interest)}
              className={`interest-chip ${profileData.interests.includes(interest) ? 'selected' : ''}`}
            >
              <span>{interest}</span>
              {profileData.interests.includes(interest) && (
                <Check size={16} />
              )}
            </button>
          ))}
        </div>
        <p className="input-hint">
          Sélectionnez vos domaines d'intérêt ({profileData.interests.length} sélectionné{profileData.interests.length > 1 ? 's' : ''})
        </p>
      </div>
    </div>
  );

  // Render Step 2 - Informations académiques
  const renderStep2 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Parcours académique</h2>
        <p className="step-subtitle">Dites-nous où vous en êtes dans vos études</p>
      </div>

      {/* Institution */}
      <div className="form-group">
        <label htmlFor="institution" className="form-label">
          Établissement actuel *
        </label>
        <div className="input-with-icon">
          <School size={20} className="input-icon" />
          <select
            id="institution"
            value={profileData.institution}
            onChange={(e) => handleInputChange('institution', e.target.value)}
            className="form-select"
            required
          >
            <option value="">Sélectionnez votre établissement</option>
            {institutions.map((institution) => (
              <option key={institution} value={institution}>
                {institution}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Niveau et Spécialisation */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="currentLevel" className="form-label">
            Niveau d'études *
          </label>
          <div className="input-with-icon">
            <GraduationCap size={20} className="input-icon" />
            <select
              id="currentLevel"
              value={profileData.currentLevel}
              onChange={(e) => handleInputChange('currentLevel', e.target.value)}
              className="form-select"
              required
            >
              <option value="">Sélectionnez votre niveau</option>
              {levels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="specialization" className="form-label">
            Spécialisation
          </label>
          <div className="input-with-icon">
            <BookOpen size={20} className="input-icon" />
            <select
              id="specialization"
              value={profileData.specialization}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
              className="form-select"
            >
              <option value="">Choisissez votre spécialisation</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Année académique et dates */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="academicYear" className="form-label">
            Année académique
          </label>
          <div className="input-with-icon">
            <Calendar size={20} className="input-icon" />
            <input
              type="text"
              id="academicYear"
              value={profileData.academicYear}
              onChange={(e) => handleInputChange('academicYear', e.target.value)}
              className="form-input"
              placeholder="2024-2025"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="enrollmentDate" className="form-label">
            Date d'inscription
          </label>
          <div className="input-with-icon">
            <Calendar size={20} className="input-icon" />
            <input
              type="date"
              id="enrollmentDate"
              value={profileData.enrollmentDate}
              onChange={(e) => handleInputChange('enrollmentDate', e.target.value)}
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render Step 3 - Objectifs et préférences
  const renderStep3 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Vos objectifs</h2>
        <p className="step-subtitle">Définissons ensemble vos ambitions académiques</p>
      </div>

      {/* Examen cible */}
      <div className="form-group">
        <label htmlFor="targetExam" className="form-label">
          Examen ou concours visé *
        </label>
        <div className="input-with-icon">
          <Target size={20} className="input-icon" />
          <select
            id="targetExam"
            value={profileData.targetExam}
            onChange={(e) => handleInputChange('targetExam', e.target.value)}
            className="form-select"
            required
          >
            <option value="">Sélectionnez votre objectif principal</option>
            {targetExams.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date cible */}
      <div className="form-group">
        <label htmlFor="targetExamDate" className="form-label">
          Date prévue de l'examen
        </label>
        <div className="input-with-icon">
          <Calendar size={20} className="input-icon" />
          <input
            type="date"
            id="targetExamDate"
            value={profileData.targetExamDate}
            onChange={(e) => handleInputChange('targetExamDate', e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {/* Objectifs académiques */}
      <div className="form-group">
        <label className="form-label">
          Objectifs académiques *
        </label>
        <div className="goals-grid">
          {academicGoalsList.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => handleArrayToggle('academicGoals', goal)}
              className={`goal-chip ${profileData.academicGoals.includes(goal) ? 'selected' : ''}`}
            >
              <span>{goal}</span>
              {profileData.academicGoals.includes(goal) && (
                <Check size={16} />
              )}
            </button>
          ))}
        </div>
        <p className="input-hint">
          Sélectionnez vos principaux objectifs ({profileData.academicGoals.length} sélectionné{profileData.academicGoals.length > 1 ? 's' : ''})
        </p>
      </div>

      {/* Préférences d'apprentissage */}
      <div className="learning-preferences">
        <h3 className="subsection-title">Préférences d'apprentissage</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="preferredTime" className="form-label">
              Moment préféré pour étudier
            </label>
            <select
              id="preferredTime"
              value={profileData.learningStyle.preferredTime}
              onChange={(e) => handleNestedInputChange('learningStyle', 'preferredTime', e.target.value)}
              className="form-select"
            >
              <option value="">Sélectionnez</option>
              <option value="morning">Matin (6h - 12h)</option>
              <option value="afternoon">Après-midi (12h - 18h)</option>
              <option value="evening">Soirée (18h - 22h)</option>
              <option value="night">Nuit (22h - 6h)</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="studyMethod" className="form-label">
              Méthode d'étude préférée
            </label>
            <select
              id="studyMethod"
              value={profileData.learningStyle.studyMethod}
              onChange={(e) => handleNestedInputChange('learningStyle', 'studyMethod', e.target.value)}
              className="form-select"
            >
              <option value="">Sélectionnez</option>
              <option value="visual">Visuel (schémas, graphiques)</option>
              <option value="auditory">Auditif (écoute, discussion)</option>
              <option value="kinesthetic">Kinesthésique (pratique)</option>
              <option value="reading">Lecture/écriture</option>
              <option value="mixed">Mixte</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty" className="form-label">
            Niveau de difficulté préféré
          </label>
          <div className="difficulty-selector">
            {[
              { value: 'beginner', label: 'Débutant', color: 'green' },
              { value: 'intermediate', label: 'Intermédiaire', color: 'orange' },
              { value: 'advanced', label: 'Avancé', color: 'red' },
              { value: 'expert', label: 'Expert', color: 'purple' }
            ].map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleNestedInputChange('learningStyle', 'difficulty', level.value)}
                className={`difficulty-chip ${profileData.learningStyle.difficulty === level.value ? 'selected' : ''} ${level.color}`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Step 4 - Planning et résumé
  const renderStep4 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2 className="step-title">Organisation et résumé</h2>
        <p className="step-subtitle">Finalisez votre profil avec vos préférences de planning</p>
      </div>

      {/* Planning d'étude */}
      <div className="study-schedule">
        <h3 className="subsection-title">Planning d'étude idéal</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="weekdaySchedule" className="form-label">
              Lundi - Vendredi
            </label>
            <select
              id="weekdaySchedule"
              value={profileData.studySchedule.mondayToFriday}
              onChange={(e) => handleNestedInputChange('studySchedule', 'mondayToFriday', e.target.value)}
              className="form-select"
            >
              <option value="">Sélectionnez votre créneaux</option>
              <option value="morning">Matin (6h - 12h)</option>
              <option value="afternoon">Après-midi (12h - 18h)</option>
              <option value="evening">Soirée (18h - 22h)</option>
              <option value="all-day">Toute la journée</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="weekendSchedule" className="form-label">
              Week-end
            </label>
            <select
              id="weekendSchedule"
              value={profileData.studySchedule.weekend}
              onChange={(e) => handleNestedInputChange('studySchedule', 'weekend', e.target.value)}
              className="form-select"
            >
              <option value="">Sélectionnez votre créneaux</option>
              <option value="morning">Matin (6h - 12h)</option>
              <option value="afternoon">Après-midi (12h - 18h)</option>
              <option value="evening">Soirée (18h - 22h)</option>
              <option value="minimal">Études légères</option>
              <option value="rest">Repos complet</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sessionDuration" className="form-label">
            Durée de session préférée
          </label>
          <select
            id="sessionDuration"
            value={profileData.studySchedule.preferredDuration}
            onChange={(e) => handleNestedInputChange('studySchedule', 'preferredDuration', e.target.value)}
            className="form-select"
          >
            <option value="">Sélectionnez une durée</option>
            <option value="30min">30 minutes</option>
            <option value="1hour">1 heure</option>
            <option value="2hours">2 heures</option>
            <option value="3hours">3 heures</option>
            <option value="4hours+">4 heures et plus</option>
            <option value="flexible">Variable selon le sujet</option>
          </select>
        </div>
      </div>

      {/* Résumé du profil */}
      <div className="profile-summary">
        <h3 className="subsection-title">Aperçu de votre profil</h3>
        
        <div className="summary-card">
          <div className="summary-header">
            <div className="summary-avatar">
              {profileData.profileImageUrl ? (
                <img src={profileData.profileImageUrl} alt="Avatar" />
              ) : (
                <User size={32} />
              )}
            </div>
            <div className="summary-info">
              <h4>{profileData.username || 'Nom d\'utilisateur'}</h4>
              <p>{profileData.currentLevel && levels.find(l => l.value === profileData.currentLevel)?.label}</p>
            </div>
          </div>

          <div className="summary-content">
            <div className="summary-item">
              <School size={16} />
              <span>{profileData.institution || 'Établissement non défini'}</span>
            </div>
            
            <div className="summary-item">
              <Target size={16} />
              <span>{profileData.targetExam || 'Objectif non défini'}</span>
            </div>
            
            <div className="summary-item">
              <Trophy size={16} />
              <span>{profileData.academicGoals.length} objectif{profileData.academicGoals.length > 1 ? 's' : ''} académique{profileData.academicGoals.length > 1 ? 's' : ''}</span>
            </div>

            <div className="summary-item">
              <Star size={16} />
              <span>{profileData.interests.length} centre{profileData.interests.length > 1 ? 's' : ''} d'intérêt</span>
            </div>
          </div>

          <div className="completion-indicator">
            <div className="completion-bar">
              <div 
                className="completion-fill" 
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <span className="completion-text">{profileCompletion}% complété</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`complete-profile-page ${isDarkMode ? 'dark' : ''}`}>
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <img src='ReussirLogo1.png' alt='Réussir logo' />
            </div>
            <span className="logo-text">Réussir</span>
          </div>
          
          <div className="progress-section">
            <div className="step-indicator">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step}
                  className={`step-dot ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                >
                  {currentStep > step ? <Check size={16} /> : step}
                </div>
              ))}
            </div>
            <p className="progress-text">Étape {currentStep} sur 4</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-container">
        <div className="profile-card">
          {/* Progress Bar */}
          <div className="overall-progress">
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(currentStep - 1) * 33.33}%` }}
              ></div>
            </div>
            <span className="progress-percentage">
              {Math.round((currentStep - 1) * 33.33)}% terminé
            </span>
          </div>

          {/* Step Content */}
          <div className="step-container">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          {/* Navigation Buttons */}
          <div className="step-navigation">
            <div className="nav-left">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="btn-secondary nav-btn"
                  disabled={isSubmitting}
                >
                  Précédent
                </button>
              )}
            </div>

            <div className="nav-right">
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary nav-btn"
                  disabled={isLoading}
                >
                  <span>Suivant</span>
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary nav-btn submit-btn"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="spinner" />
                      <span>Finalisation...</span>
                    </>
                  ) : (
                    <>
                      <span>Finaliser mon profil</span>
                      <Check size={20} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Skip Option */}
          <div className="skip-section">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="skip-btn"
              disabled={isSubmitting}
            >
              Passer cette étape et continuer plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;