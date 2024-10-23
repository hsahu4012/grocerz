import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.grocji.app',
  appName: 'grocji',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: "#ff0000",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;
