export default {
  expo: {
    name: "타로 타이머",
    slug: "tarot-timer",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "dark",
    
    // Enhanced experiments for faster builds
    experiments: {
      tsconfigPaths: true,
      typedRoutes: false, // Disabled for performance
      reactCompiler: false, // Can enable when stable
      turboModules: true, // Enable new architecture
      newArchEnabled: true, // Enable new React Native architecture
    },
    
    // Performance optimizations
    runtimeVersion: {
      policy: "sdkVersion"
    },
    
    // Enhanced icon and splash configuration
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#1a1f3a" // Mystical midnight blue
    },
    
    // Optimized updates
    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 30000,
      url: "https://u.expo.dev/268f44c1-406f-4387-8589-e62144024eaa"
    },
    
    // Platform-specific optimizations
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.therearenorules.tarottimer",
      buildNumber: "1",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        // Performance optimizations
        UIBackgroundModes: ["background-fetch", "background-processing"],
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: false
        },
        // Privacy settings for tarot app
        NSUserTrackingUsageDescription: "This app uses tracking to provide personalized tarot experiences.",
        NSLocationWhenInUseUsageDescription: "Location is used to provide location-based tarot insights."
      },
      // Enhanced splash screen
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#1a1f3a",
        dark: {
          image: "./assets/splash-dark.png",
          resizeMode: "contain",
          backgroundColor: "#0f0f1a"
        }
      }
    },
    
    android: {
      package: "com.therearenorules.tarottimer",
      versionCode: 1,
      compileSdkVersion: 34,
      targetSdkVersion: 34,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#1a1f3a", // Mystical midnight blue
        monochromeImage: "./assets/adaptive-icon-monochrome.png"
      },
      // Performance optimizations
      enableProguardInReleaseBuilds: true,
      enableSeparateBuildPerCPUArchitecture: true,
      // Enhanced splash screen
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#1a1f3a",
        dark: {
          image: "./assets/splash-dark.png",
          resizeMode: "contain",  
          backgroundColor: "#0f0f1a"
        }
      },
      // Background fetch permissions for tarot timer
      permissions: [
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.WAKE_LOCK",
        "android.permission.VIBRATE"
      ]
    },
    
    // Enhanced web configuration
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/favicon.png",
      // PWA configuration for mystical experience
      meta: {
        name: "타로 타이머 - 시간별 타로 카드",
        description: "🔮 시간별 타로 카드와 함께하는 의미있는 하루",
        themeColor: "#1a1f3a",
        backgroundColor: "#0f0f1a"
      },
      // Service worker for offline support
      serviceWorker: {
        enabled: true,
        precacheManifest: {
          exclude: ["**/*.map", "**/node_modules/**/*"]
        }
      }
    },
    
    // Enhanced plugin configuration
    plugins: [
      "expo-router",
      // Background tasks for tarot timer
      [
        "expo-background-fetch",
        {
          backgroundFetchInterval: 60 // Check every minute for hour changes
        }
      ],
      // Notifications for hourly reminders
      [
        "expo-notifications", 
        {
          icon: "./assets/notification-icon.png",
          color: "#d4af37", // Premium gold
          sounds: ["./assets/notification.wav"]
        }
      ],
      // File system for saving readings
      "expo-file-system",
      // Media library for sharing readings
      "expo-media-library",
      // SQLite for storing tarot data
      [
        "expo-sqlite",
        {
          enableFTS: true, // Full-text search for tarot card database
          // 웹 플랫폼에서 SQLite 비활성화 (성능 이슈로 인해)
          web: false
        }
      ]
    ],
    
    // Enhanced EAS configuration
    extra: {
      eas: {
        projectId: "268f44c1-406f-4387-8589-e62144024eaa"
      },
      // Environment variables for tarot app
      tarotConfig: {
        enableMysticalEffects: true,
        defaultDeck: "classic-tarot",
        maxDailyReadings: 24
      }
    },
    
    scheme: "tarot-timer",
    
    // Asset optimization
    assetBundlePatterns: [
      "**/*"
    ],
    
    // Build optimization
    packagerOpts: {
      config: "metro.config.js"
    },
    
    // Development tools
    developmentClient: {
      silentLaunch: true
    },
    
    // Notification configuration
    notification: {
      icon: "./assets/notification-icon.png",
      color: "#d4af37", // Premium gold
      androidMode: "default",
      androidCollapsedTitle: "타로 타이머",
      iosDisplayInForeground: true
    },
    
    // Privacy and security
    privacy: "unlisted",
    
    // Localization
    locales: {
      ko: "./locales/ko.json",
      en: "./locales/en.json"
    },
    
    // Debugging (only in development)
    ...(process.env.NODE_ENV !== 'production' && {
      developer: {
        tool: "expo-cli",
        projectRoot: __dirname
      }
    })
  }
};