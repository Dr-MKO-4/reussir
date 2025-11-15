import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import Card from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import './Profile.css';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  level?: string;
  school?: string;
  city?: string;
  country?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
}

interface ProfileFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

/**
 * Formulaire de modification du profil utilisateur
 */
const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await onSubmit(formData);
      setSuccessMessage('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="outlined" className={`profile-form ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div>
            <h2 className="form-title">Informations personnelles</h2>
            <p className="form-subtitle">Mettez à jour vos informations de profil</p>
          </div>
        </div>

        {successMessage && (
          <Alert variant="success" title="Succès" isDismissible onDismiss={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="error" title="Erreur" isDismissible onDismiss={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        <div className="form-content">
          {/* Section: Informations de base */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informations de base
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  Prénom <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Jean"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Nom <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Dupont"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="jean.dupont@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+237 6XX XXX XXX"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth" className="form-label">
                  Date de naissance
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ''}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender" className="form-label">
                  Genre
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Sélectionner...</option>
                  <option value="male">Masculin</option>
                  <option value="female">Féminin</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio" className="form-label">
                Biographie
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                className="form-textarea"
                rows={4}
                placeholder="Parlez-nous un peu de vous..."
                maxLength={500}
              />
              <span className="form-hint">
                {formData.bio?.length || 0}/500 caractères
              </span>
            </div>
          </div>

          {/* Section: Éducation */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Éducation
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="level" className="form-label">
                  Niveau d'études
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level || ''}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Sélectionner...</option>
                  <option value="college">Collège</option>
                  <option value="lycee">Lycée</option>
                  <option value="university">Université</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="school" className="form-label">
                  Établissement
                </label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Nom de votre école"
                />
              </div>
            </div>
          </div>

          {/* Section: Localisation */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Localisation
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="city" className="form-label">
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Yaoundé"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country" className="form-label">
                  Pays
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Cameroun"
                />
              </div>
            </div>
          </div>

          {/* Section: Réseaux sociaux */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Liens & Réseaux sociaux
            </h3>

            <div className="form-group">
              <label htmlFor="website" className="form-label">
                Site web
              </label>
              <div className="form-input-with-icon">
                <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://monsite.com"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="linkedin" className="form-label">
                  LinkedIn
                </label>
                <div className="form-input-with-icon">
                  <svg className="input-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <input
                    type="text"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="twitter" className="form-label">
                  Twitter
                </label>
                <div className="form-input-with-icon">
                  <svg className="input-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter || ''}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;