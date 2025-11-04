// src/utils/validation.ts
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Règles de validation communes
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Veuillez saisir une adresse email valide'
  },
  
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
    message: 'Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre'
  },
  
  username: {
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'Le nom d\'utilisateur doit contenir 3-30 caractères (lettres, chiffres, - ou _)'
  },
  
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s-']+$/,
    message: 'Le nom doit contenir 2-50 caractères (lettres, espaces, - ou \')'
  },
  
  phoneNumber: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Numéro de téléphone invalide'
  }
};

// Fonction de validation générique
export const validateField = (value: string, rules: ValidationRule): ValidationResult => {
  // Vérifier si requis
  if (rules.required && (!value || value.trim().length === 0)) {
    return {
      isValid: false,
      error: rules.message || 'Ce champ est requis'
    };
  }

  // Si pas de valeur et pas requis, c'est valide
  if (!value || value.trim().length === 0) {
    return { isValid: true };
  }

  const trimmedValue = value.trim();

  // Vérifier la longueur minimale
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return {
      isValid: false,
      error: rules.message || `Minimum ${rules.minLength} caractères requis`
    };
  }

  // Vérifier la longueur maximale
  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return {
      isValid: false,
      error: rules.message || `Maximum ${rules.maxLength} caractères autorisés`
    };
  }

  // Vérifier le pattern
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return {
      isValid: false,
      error: rules.message || 'Format invalide'
    };
  }

  // Validation personnalisée
  if (rules.custom && !rules.custom(trimmedValue)) {
    return {
      isValid: false,
      error: rules.message || 'Valeur invalide'
    };
  }

  return { isValid: true };
};

// Validations spécifiques
export const validateEmail = (email: string): ValidationResult => {
  return validateField(email, validationRules.email);
};

export const validatePassword = (password: string): ValidationResult => {
  return validateField(password, validationRules.password);
};

export const validatePasswordStrength = (password: string): {
  score: number;
  feedback: string[];
  isStrong: boolean;
} => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1;
  else feedback.push('Au moins 8 caractères');

  if (password.length >= 12) score += 1;
  else feedback.push('12 caractères ou plus recommandés');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Au moins une lettre minuscule');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Au moins une lettre majuscule');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Au moins un chiffre');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Au moins un caractère spécial');

  return {
    score,
    feedback,
    isStrong: score >= 4
  };
};

export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Les mots de passe ne correspondent pas'
    };
  }
  return { isValid: true };
};

export const validateUsername = (username: string): ValidationResult => {
  return validateField(username, validationRules.username);
};

export const validateName = (name: string): ValidationResult => {
  return validateField(name, validationRules.name);
};

export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone) return { isValid: true }; // Optionnel
  return validateField(phone, validationRules.phoneNumber);
};

// Validation d'un formulaire complet
export const validateForm = (
  formData: Record<string, string>,
  validationConfig: Record<string, ValidationRule>
): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  Object.keys(validationConfig).forEach(fieldName => {
    const value = formData[fieldName] || '';
    const rules = validationConfig[fieldName];
    results[fieldName] = validateField(value, rules);
  });

  return results;
};

// Vérifier si le formulaire est valide
export const isFormValid = (validationResults: Record<string, ValidationResult>): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

// Sanitizer pour éviter les attaques XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Supprimer < et >
    .trim();
};

// Validation de force de mot de passe visuelle
export const getPasswordStrengthColor = (score: number): string => {
  if (score <= 2) return '#EF4444'; // Rouge
  if (score <= 4) return '#F59E0B'; // Orange
  return '#10B981'; // Vert
};

export const getPasswordStrengthLabel = (score: number): string => {
  if (score <= 2) return 'Faible';
  if (score <= 4) return 'Moyen';
  return 'Fort';
};

// Utilitaires pour la validation temps réel
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  // Use ReturnType<typeof setTimeout> to be compatible both in browser and Node.
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return ((...args: Parameters<T>) => {
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};


// Validation async pour vérifier la disponibilité
export interface AsyncValidationResult {
  isValid: boolean;
  isLoading: boolean;
  error?: string;
}

export const createAsyncValidator = (
  validationFn: (value: string) => Promise<boolean>,
  errorMessage: string,
  debounceMs: number = 500
) => {
  const debouncedFn = debounce(validationFn, debounceMs);
  
  return async (value: string): Promise<AsyncValidationResult> => {
    if (!value.trim()) {
      return { isValid: true, isLoading: false };
    }

    try {
      const isValid = await debouncedFn(value);
      return { isValid, isLoading: false, error: isValid ? undefined : errorMessage };
    } catch {
      return { isValid: false, isLoading: false, error: 'Erreur de vérification' };
    }
  };
};