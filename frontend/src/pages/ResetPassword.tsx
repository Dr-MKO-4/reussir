import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundAnimation from '../components/ui/BackgroundAnimation';
import HeroSection from '../components/auth/HeroSection';
import PasswordResetForm from '../components/auth/PasswordResetForm';
import SuccessModal from '../components/ui/SuccessModal';
import styles from './ResetPassword.module.css';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { success: showSuccess } = useToast();
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSuccess = () => {
    setShowSuccessModal(true);
    
    showSuccess(
      'Mot de passe réinitialisé !',
      'Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.'
    );
  };

  const handleCancel = () => {
    navigate('/login');
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <div className={styles.resetPasswordPage}>
      <BackgroundAnimation />

      <div className={styles.resetPasswordContainer}>
        <HeroSection
          title="Nouveau départ"
          subtitle="Créez un mot de passe fort et sécurisé pour protéger votre compte. Votre sécurité est notre priorité."
        />

        <PasswordResetForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>

      {/* Modal de succès */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Mot de passe réinitialisé !"
        message="Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page de connexion."
        type="success"
        autoClose={3000}
      />
    </div>
  );
};

export default ResetPassword;