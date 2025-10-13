import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.77ff80669c5b40e7b3ed7ffe793f210e',
  appName: 'EmocionalIA+',
  webDir: 'dist',
  server: {
    url: 'https://77ff8066-9c5b-40e7-b3ed-7ffe793f210e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
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
