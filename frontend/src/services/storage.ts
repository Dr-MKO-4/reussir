/**
 * Service de gestion du stockage local (LocalStorage & SessionStorage)
 * Fournit des méthodes pour sauvegarder, récupérer et gérer les données côté client
 */

/**
 * Options de configuration pour le stockage
 */
interface StorageOptions {
  encrypt?: boolean;
  expiresIn?: number; // Durée d'expiration en millisecondes
}

/**
 * Structure des données stockées avec métadonnées
 */
interface StoredData<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}

/**
 * Clé de chiffrement simple (en production, utiliser une vraie solution de chiffrement)
 */
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

/**
 * Service de stockage générique
 */
class StorageService {
  private storage: Storage;

  constructor(storageType: 'local' | 'session' = 'local') {
    this.storage = storageType === 'local' ? window.localStorage : window.sessionStorage;
  }

  /**
   * Sauvegarder une valeur
   */
  set<T>(key: string, value: T, options?: StorageOptions): void {
    try {
      const data: StoredData<T> = {
        value,
        timestamp: Date.now(),
        expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : undefined,
      };

      let serialized = JSON.stringify(data);

      // Chiffrer si demandé (simple encodage base64 pour l'exemple)
      if (options?.encrypt) {
        serialized = this.encrypt(serialized);
      }

      this.storage.setItem(key, serialized);
    } catch (error) {
      console.error(`[Storage] Error saving ${key}:`, error);
      throw new Error(`Failed to save ${key} to storage`);
    }
  }

  /**
   * Récupérer une valeur
   */
  get<T>(key: string, encrypted: boolean = false): T | null {
    try {
      let serialized = this.storage.getItem(key);

      if (!serialized) {
        return null;
      }

      // Déchiffrer si nécessaire
      if (encrypted) {
        serialized = this.decrypt(serialized);
      }

      const data: StoredData<T> = JSON.parse(serialized);

      // Vérifier l'expiration
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.remove(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error(`[Storage] Error retrieving ${key}:`, error);
      return null;
    }
  }

  /**
   * Supprimer une valeur
   */
  remove(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`[Storage] Error removing ${key}:`, error);
    }
  }

  /**
   * Vérifier si une clé existe
   */
  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  /**
   * Nettoyer toutes les données
   */
  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('[Storage] Error clearing storage:', error);
    }
  }

  /**
   * Récupérer toutes les clés
   */
  keys(): string[] {
    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error('[Storage] Error getting keys:', error);
      return [];
    }
  }

  /**
   * Obtenir la taille du stockage (approximative en bytes)
   */
  getSize(): number {
    try {
      let total = 0;
      for (let key in this.storage) {
        if (this.storage.hasOwnProperty(key)) {
          total += key.length + (this.storage.getItem(key)?.length || 0);
        }
      }
      return total;
    } catch (error) {
      console.error('[Storage] Error calculating size:', error);
      return 0;
    }
  }

  /**
   * Nettoyer les entrées expirées
   */
  clearExpired(): void {
    try {
      const keys = this.keys();
      const now = Date.now();

      keys.forEach((key) => {
        try {
          const serialized = this.storage.getItem(key);
          if (serialized) {
            const data = JSON.parse(serialized);
            if (data.expiresAt && now > data.expiresAt) {
              this.remove(key);
            }
          }
        } catch (error) {
          // Ignorer les erreurs de parsing pour les clés individuelles
        }
      });
    } catch (error) {
      console.error('[Storage] Error clearing expired items:', error);
    }
  }

  /**
   * Chiffrement simple (base64)
   * Note: En production, utiliser crypto-js ou une vraie bibliothèque de chiffrement
   */
  private encrypt(data: string): string {
    try {
      // Combinaison simple avec la clé
      const combined = `${ENCRYPTION_KEY}:${data}`;
      return btoa(combined);
    } catch (error) {
      console.error('[Storage] Encryption error:', error);
      return data; // Fallback: retourner les données non chiffrées
    }
  }

  /**
   * Déchiffrement simple (base64)
   */
  private decrypt(encryptedData: string): string {
    try {
      const decrypted = atob(encryptedData);
      // Extraire les données après la clé
      const parts = decrypted.split(':');
      if (parts[0] === ENCRYPTION_KEY && parts.length > 1) {
        return parts.slice(1).join(':');
      }
      throw new Error('Invalid encryption key');
    } catch (error) {
      console.error('[Storage] Decryption error:', error);
      return encryptedData; // Fallback: retourner les données telles quelles
    }
  }

  /**
   * Sauvegarder avec un namespace (préfixe)
   */
  setNamespaced<T>(namespace: string, key: string, value: T, options?: StorageOptions): void {
    const namespacedKey = `${namespace}:${key}`;
    this.set(namespacedKey, value, options);
  }

  /**
   * Récupérer avec un namespace
   */
  getNamespaced<T>(namespace: string, key: string, encrypted: boolean = false): T | null {
    const namespacedKey = `${namespace}:${key}`;
    return this.get<T>(namespacedKey, encrypted);
  }

  /**
   * Supprimer avec un namespace
   */
  removeNamespaced(namespace: string, key: string): void {
    const namespacedKey = `${namespace}:${key}`;
    this.remove(namespacedKey);
  }

  /**
   * Nettoyer tout un namespace
   */
  clearNamespace(namespace: string): void {
    try {
      const keys = this.keys();
      const prefix = `${namespace}:`;
      
      keys.forEach((key) => {
        if (key.startsWith(prefix)) {
          this.remove(key);
        }
      });
    } catch (error) {
      console.error(`[Storage] Error clearing namespace ${namespace}:`, error);
    }
  }

  /**
   * Obtenir toutes les clés d'un namespace
   */
  getNamespaceKeys(namespace: string): string[] {
    try {
      const keys = this.keys();
      const prefix = `${namespace}:`;
      
      return keys
        .filter((key) => key.startsWith(prefix))
        .map((key) => key.substring(prefix.length));
    } catch (error) {
      console.error(`[Storage] Error getting namespace keys for ${namespace}:`, error);
      return [];
    }
  }
}

/**
 * Classe dédiée pour le stockage sécurisé (tokens, données sensibles)
 */
class SecureStorage extends StorageService {
  /**
   * Sauvegarder une valeur de manière sécurisée (toujours chiffré)
   */
  setSecure<T>(key: string, value: T, expiresIn?: number): void {
    this.set(key, value, { encrypt: true, expiresIn });
  }

  /**
   * Récupérer une valeur sécurisée
   */
  getSecure<T>(key: string): T | null {
    return this.get<T>(key, true);
  }
}

// Instances globales
export const localStore = new StorageService('local');
export const sessionStore = new StorageService('session');
export const secureStorage = new SecureStorage('local');

/**
 * Utilitaires de stockage pour des cas d'usage spécifiques
 */
export const storageUtils = {
  /**
   * Sauvegarder les préférences utilisateur
   */
  saveUserPreferences(preferences: Record<string, any>): void {
    localStore.setNamespaced('user', 'preferences', preferences);
  },

  /**
   * Récupérer les préférences utilisateur
   */
  getUserPreferences(): Record<string, any> | null {
    return localStore.getNamespaced('user', 'preferences');
  },

  /**
   * Sauvegarder le thème
   */
  saveTheme(theme: 'light' | 'dark'): void {
    localStore.set('theme', theme);
  },

  /**
   * Récupérer le thème
   */
  getTheme(): 'light' | 'dark' | null {
    return localStore.get<'light' | 'dark'>('theme');
  },

  /**
   * Sauvegarder la langue
   */
  saveLanguage(language: string): void {
    localStore.set('language', language);
  },

  /**
   * Récupérer la langue
   */
  getLanguage(): string | null {
    return localStore.get<string>('language');
  },

  /**
   * Sauvegarder l'historique de recherche
   */
  saveSearchHistory(history: string[]): void {
    localStore.setNamespaced('search', 'history', history, {
      expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });
  },

  /**
   * Récupérer l'historique de recherche
   */
  getSearchHistory(): string[] | null {
    return localStore.getNamespaced<string[]>('search', 'history');
  },

  /**
   * Nettoyer toutes les données utilisateur
   */
  clearUserData(): void {
    localStore.clearNamespace('user');
    localStore.clearNamespace('search');
    secureStorage.clear();
  },

  /**
   * Obtenir les statistiques de stockage
   */
  getStorageStats() {
    return {
      localStorage: {
        size: localStore.getSize(),
        keys: localStore.keys().length,
      },
      sessionStorage: {
        size: sessionStore.getSize(),
        keys: sessionStore.keys().length,
      },
    };
  },
};

export default storageUtils;