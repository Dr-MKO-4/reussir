import { useAuthContext } from '../contexts/AuthContext';
import type { User } from '../services/auth';

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * Fournit des utilitaires et raccourcis pour gérer l'authentification
 */
export const useAuth = () => {
  const context = useAuthContext();

  /**
   * Vérifier si l'utilisateur est admin
   */
  const isAdmin = (): boolean => {
    return context.hasRole('admin');
  };

  /**
   * Vérifier si l'utilisateur est étudiant
   */
  const isStudent = (): boolean => {
    return context.hasRole('student');
  };

  /**
   * Vérifier si l'utilisateur est parent
   */
  const isParent = (): boolean => {
    return context.hasRole('parent');
  };

  /**
   * Vérifier si l'utilisateur est professeur
   */
  const isTeacher = (): boolean => {
    return context.hasRole('teacher');
  };

  /**
   * Obtenir le nom complet de l'utilisateur
   */
  const getFullName = (): string => {
    if (!context.user) return '';
    return `${context.user.firstName} ${context.user.lastName}`;
  };

  /**
   * Obtenir les initiales de l'utilisateur (pour avatar)
   */
  const getInitials = (): string => {
    if (!context.user) return '';
    const firstInitial = context.user.firstName.charAt(0).toUpperCase();
    const lastInitial = context.user.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  /**
   * Obtenir le label du rôle en français
   */
  const getRoleLabel = (): string => {
    if (!context.user) return '';
    
    const roleLabels: Record<User['role'], string> = {
      student: 'Étudiant',
      parent: 'Parent',
      teacher: 'Professeur',
      admin: 'Administrateur',
    };

    return roleLabels[context.user.role] || context.user.role;
  };

  /**
   * Vérifier si l'utilisateur peut accéder à une ressource
   */
  const canAccess = (requiredRoles: User['role'][]): boolean => {
    return context.hasAnyRole(requiredRoles);
  };

  /**
   * Vérifier si l'email doit être vérifié pour continuer
   */
  const requiresEmailVerification = (): boolean => {
    return context.isAuthenticated && !context.isEmailVerified;
  };

  /**
   * Obtenir l'avatar URL ou null
   */
  const getAvatarUrl = (): string | null => {
    return context.user?.avatar || null;
  };

  /**
   * Vérifier si le profil est complet
   * (peut être étendu avec d'autres critères)
   */
  const isProfileComplete = (): boolean => {
    if (!context.user) return false;
    
    return !!(
      context.user.firstName &&
      context.user.lastName &&
      context.user.email &&
      context.user.isEmailVerified
    );
  };

  /**
   * Obtenir le temps depuis la création du compte
   */
  const getAccountAge = (): number => {
    if (!context.user) return 0;
    
    const createdAt = new Date(context.user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  /**
   * Vérifier si le compte est récent (moins de 7 jours)
   */
  const isNewAccount = (): boolean => {
    return getAccountAge() <= 7;
  };

  return {
    // État du contexte
    ...context,

    // Utilitaires de rôles
    isAdmin,
    isStudent,
    isParent,
    isTeacher,
    canAccess,

    // Utilitaires utilisateur
    getFullName,
    getInitials,
    getRoleLabel,
    getAvatarUrl,
    isProfileComplete,
    requiresEmailVerification,

    // Utilitaires compte
    getAccountAge,
    isNewAccount,
  };
};

export default useAuth;