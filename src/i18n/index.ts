import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.dashboard': 'Dashboard',
      'nav.mint': 'Mint',
      'nav.transfer': 'Transfer',
      'nav.governance': 'Governance',
      'nav.analytics': 'Analytics',
      'nav.profile': 'Profile',
      'nav.connect': 'Connect Wallet',
      'nav.disconnect': 'Disconnect',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.save': 'Save',
      
      // Home
      'home.title': 'Welcome to CryptoFlow',
      'home.subtitle': 'Your gateway to decentralized finance',
      'home.description': 'Mint, transfer, and manage your crypto assets with ease on the Ethereum blockchain.',
      'home.getStarted': 'Connect Wallet to Get Started',
      'home.goToDashboard': 'Go to Dashboard',
      'home.exploreFeatures': 'Explore Features',
      
      // Wallet
      'wallet.notConnected': 'Wallet Not Connected',
      'wallet.connectPrompt': 'Please connect your wallet to continue',
      'wallet.address': 'Wallet Address',
      'wallet.balance': 'Balance',
      'wallet.network': 'Network',
      
      // Transactions
      'tx.mint': 'Mint Tokens',
      'tx.transfer': 'Transfer Tokens',
      'tx.amount': 'Amount',
      'tx.recipient': 'Recipient',
      'tx.gasPrice': 'Gas Price',
      'tx.estimatedCost': 'Estimated Cost',
      'tx.confirm': 'Confirm Transaction',
      
      // Governance
      'gov.title': 'Governance',
      'gov.votingPower': 'Your Voting Power',
      'gov.createProposal': 'Create Proposal',
      'gov.voteFor': 'Vote For',
      'gov.voteAgainst': 'Vote Against',
      'gov.proposals': 'Proposals',
      
      // Analytics
      'analytics.title': 'Analytics Dashboard',
      'analytics.marketCap': 'Market Cap',
      'analytics.totalSupply': 'Total Supply',
      'analytics.holders': 'Holders',
      'analytics.volume24h': '24h Volume',
      'analytics.distribution': 'Token Distribution',
      'analytics.topHolders': 'Top Token Holders'
    }
  },
  es: {
    translation: {
      // Navigation
      'nav.home': 'Inicio',
      'nav.dashboard': 'Panel',
      'nav.mint': 'Acuñar',
      'nav.transfer': 'Transferir',
      'nav.governance': 'Gobernanza',
      'nav.analytics': 'Análisis',
      'nav.profile': 'Perfil',
      'nav.connect': 'Conectar Billetera',
      'nav.disconnect': 'Desconectar',
      
      // Common
      'common.loading': 'Cargando...',
      'common.error': 'Error',
      'common.success': 'Éxito',
      'common.cancel': 'Cancelar',
      'common.confirm': 'Confirmar',
      'common.save': 'Guardar',
      
      // Home
      'home.title': 'Bienvenido a CryptoFlow',
      'home.subtitle': 'Tu puerta de entrada a las finanzas descentralizadas',
      'home.description': 'Acuña, transfiere y gestiona tus activos cripto con facilidad en la blockchain de Ethereum.',
      'home.getStarted': 'Conectar Billetera para Comenzar',
      'home.goToDashboard': 'Ir al Panel',
      'home.exploreFeatures': 'Explorar Características',
      
      // Wallet
      'wallet.notConnected': 'Billetera No Conectada',
      'wallet.connectPrompt': 'Por favor conecta tu billetera para continuar',
      'wallet.address': 'Dirección de Billetera',
      'wallet.balance': 'Balance',
      'wallet.network': 'Red',
      
      // Transactions
      'tx.mint': 'Acuñar Tokens',
      'tx.transfer': 'Transferir Tokens',
      'tx.amount': 'Cantidad',
      'tx.recipient': 'Destinatario',
      'tx.gasPrice': 'Precio del Gas',
      'tx.estimatedCost': 'Costo Estimado',
      'tx.confirm': 'Confirmar Transacción',
      
      // Governance
      'gov.title': 'Gobernanza',
      'gov.votingPower': 'Tu Poder de Voto',
      'gov.createProposal': 'Crear Propuesta',
      'gov.voteFor': 'Votar a Favor',
      'gov.voteAgainst': 'Votar en Contra',
      'gov.proposals': 'Propuestas',
      
      // Analytics
      'analytics.title': 'Panel de Análisis',
      'analytics.marketCap': 'Capitalización de Mercado',
      'analytics.totalSupply': 'Suministro Total',
      'analytics.holders': 'Poseedores',
      'analytics.volume24h': 'Volumen 24h',
      'analytics.distribution': 'Distribución de Tokens',
      'analytics.topHolders': 'Principales Poseedores de Tokens'
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.dashboard': 'Tableau de bord',
      'nav.mint': 'Frapper',
      'nav.transfer': 'Transférer',
      'nav.governance': 'Gouvernance',
      'nav.analytics': 'Analytique',
      'nav.profile': 'Profil',
      'nav.connect': 'Connecter Portefeuille',
      'nav.disconnect': 'Déconnecter',
      
      // Common
      'common.loading': 'Chargement...',
      'common.error': 'Erreur',
      'common.success': 'Succès',
      'common.cancel': 'Annuler',
      'common.confirm': 'Confirmer',
      'common.save': 'Sauvegarder',
      
      // Home
      'home.title': 'Bienvenue sur CryptoFlow',
      'home.subtitle': 'Votre passerelle vers la finance décentralisée',
      'home.description': 'Frappez, transférez et gérez vos actifs crypto facilement sur la blockchain Ethereum.',
      'home.getStarted': 'Connecter le Portefeuille pour Commencer',
      'home.goToDashboard': 'Aller au Tableau de bord',
      'home.exploreFeatures': 'Explorer les Fonctionnalités',
      
      // Wallet
      'wallet.notConnected': 'Portefeuille Non Connecté',
      'wallet.connectPrompt': 'Veuillez connecter votre portefeuille pour continuer',
      'wallet.address': 'Adresse du Portefeuille',
      'wallet.balance': 'Solde',
      'wallet.network': 'Réseau',
      
      // Transactions
      'tx.mint': 'Frapper des Tokens',
      'tx.transfer': 'Transférer des Tokens',
      'tx.amount': 'Montant',
      'tx.recipient': 'Destinataire',
      'tx.gasPrice': 'Prix du Gaz',
      'tx.estimatedCost': 'Coût Estimé',
      'tx.confirm': 'Confirmer la Transaction',
      
      // Governance
      'gov.title': 'Gouvernance',
      'gov.votingPower': 'Votre Pouvoir de Vote',
      'gov.createProposal': 'Créer une Proposition',
      'gov.voteFor': 'Voter Pour',
      'gov.voteAgainst': 'Voter Contre',
      'gov.proposals': 'Propositions',
      
      // Analytics
      'analytics.title': 'Tableau de bord Analytique',
      'analytics.marketCap': 'Capitalisation Boursière',
      'analytics.totalSupply': 'Offre Totale',
      'analytics.holders': 'Détenteurs',
      'analytics.volume24h': 'Volume 24h',
      'analytics.distribution': 'Distribution des Tokens',
      'analytics.topHolders': 'Principaux Détenteurs de Tokens'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;