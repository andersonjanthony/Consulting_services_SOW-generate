import { ServicePackage, OrganizationSettings, ClientInfo, ConfiguredService } from '@/types';

const STORAGE_KEYS = {
  PACKAGES: 'cloudstrategik_packages',
  CURRENT_PACKAGE: 'cloudstrategik_current_package',
  ORGANIZATION: 'cloudstrategik_organization',
  CLIENT_INFO: 'cloudstrategik_client_info'
};

export class LocalStorageService {
  static getPackages(): ServicePackage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading packages:', error);
      return [];
    }
  }

  static savePackage(packageData: ServicePackage): void {
    try {
      const packages = this.getPackages();
      const existingIndex = packages.findIndex(p => p.id === packageData.id);
      
      if (existingIndex >= 0) {
        packages[existingIndex] = { ...packageData, updatedAt: new Date().toISOString() };
      } else {
        packages.push(packageData);
      }
      
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    } catch (error) {
      console.error('Error saving package:', error);
    }
  }

  static deletePackage(packageId: string): void {
    try {
      const packages = this.getPackages().filter(p => p.id !== packageId);
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  }

  static getCurrentPackage(): ConfiguredService[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_PACKAGE);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading current package:', error);
      return [];
    }
  }

  static saveCurrentPackage(services: ConfiguredService[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PACKAGE, JSON.stringify(services));
    } catch (error) {
      console.error('Error saving current package:', error);
    }
  }

  static getOrganizationSettings(): OrganizationSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORGANIZATION);
      return stored ? JSON.parse(stored) : {
        companyName: 'CloudStrategik Consulting',
        consultantName: 'Anderson Anthony',
        consultantEmail: 'Anderson@cloudstrategik.com',
        consultantPhone: '',
        address: '504 Lavaca, Suite 1005, Austin, Texas 78701, US'
      };
    } catch (error) {
      console.error('Error loading organization settings:', error);
      return {
        companyName: 'CloudStrategik Consulting',
        consultantName: 'Anderson Anthony',
        consultantEmail: 'Anderson@cloudstrategik.com',
        consultantPhone: '',
        address: '504 Lavaca, Suite 1005, Austin, Texas 78701, US'
      };
    }
  }

  static saveOrganizationSettings(settings: OrganizationSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATION, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving organization settings:', error);
    }
  }

  static getClientInfo(): ClientInfo {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLIENT_INFO);
      return stored ? JSON.parse(stored) : {
        name: '',
        stakeholder: '',
        startDate: new Date().toISOString().split('T')[0],
        timezone: 'America/Chicago',
        email: '',
        phone: ''
      };
    } catch (error) {
      console.error('Error loading client info:', error);
      return {
        name: '',
        stakeholder: '',
        startDate: new Date().toISOString().split('T')[0],
        timezone: 'America/Chicago',
        email: '',
        phone: ''
      };
    }
  }

  static saveClientInfo(clientInfo: ClientInfo): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENT_INFO, JSON.stringify(clientInfo));
    } catch (error) {
      console.error('Error saving client info:', error);
    }
  }

  static exportAllData(): string {
    try {
      const data = {
        packages: this.getPackages(),
        currentPackage: this.getCurrentPackage(),
        organization: this.getOrganizationSettings(),
        clientInfo: this.getClientInfo(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '{}';
    }
  }

  static clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}
