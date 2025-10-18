import { CapacitorConfig } from '@capacitor/cli';

// For development: use Lovable preview URL
// For production: comment out the server section or set to your production URL
const config: CapacitorConfig = {
  appId: 'app.lovable.77ff80669c5b40e7b3ed7ffe793f210e',
  appName: 'EmocionalIA+',
  webDir: 'dist',
  // Uncomment the server section below for development with live reload
  // Comment it out before building for production/app stores
  /*
  server: {
    url: 'https://77ff8066-9c5b-40e7-b3ed-7ffe793f210e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  */
  ios: {
    contentInset: 'automatic',
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  }
};

export default config;
