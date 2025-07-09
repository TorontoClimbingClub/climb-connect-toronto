# Android Studio Integration Workflow
## Expo + Android Studio Development Guide

### Overview
This guide details how to integrate Android Studio into your Expo development workflow for the Climb Connect Toronto mobile app, enabling advanced debugging, native module development, and Play Store preparation.

## Prerequisites

### Required Software
- Android Studio (Latest stable version)
- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Git
- Java Development Kit (JDK) 11 or higher

### Android Studio Setup
1. Install Android Studio from [developer.android.com](https://developer.android.com/studio)
2. During installation, ensure these components are selected:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
   - Performance (Intel ® HAXM) - for emulator acceleration

3. Configure SDK:
   ```
   Android Studio → Preferences → System Settings → Android SDK
   - SDK Platforms: Android 13.0 (API 33) or latest
   - SDK Tools:
     ✓ Android SDK Build-Tools
     ✓ Android SDK Command-line Tools
     ✓ Android SDK Platform-Tools
     ✓ Android Emulator
     ✓ Google Play services
   ```

## Workflow Integration

### 1. Generate Native Android Project
```bash
# Navigate to your Expo project
cd climb-connect-toronto-mobile

# Generate Android project files
npx expo prebuild --platform android

# This creates an 'android' folder with native code
```

### 2. Open in Android Studio
```bash
# Open Android Studio with the generated project
cd android
studio .

# Or manually: File → Open → Select the 'android' folder
```

### 3. Configure Gradle
Update `android/gradle.properties`:
```properties
# Increase memory for better build performance
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=1024m
org.gradle.parallel=true
org.gradle.configureondemand=true

# Enable AndroidX
android.useAndroidX=true
android.enableJetifier=true

# Version configurations
compileSdkVersion=33
targetSdkVersion=33
minSdkVersion=21
```

### 4. Set Up Signing for Release
Create `android/app/keystore.properties`:
```properties
storeFile=climb-connect-toronto.keystore
storePassword=your_store_password
keyAlias=climb-connect-key
keyPassword=your_key_password
```

Generate keystore:
```bash
keytool -genkeypair -v -keystore climb-connect-toronto.keystore \
  -alias climb-connect-key -keyalg RSA -keysize 2048 -validity 10000
```

## Development Workflows

### A. Standard Expo Development
```bash
# For most development, use Expo tools
npx expo start

# Run on Android emulator
npx expo start --android

# Run on physical device
npx expo start --tunnel
```

### B. Native Development with Android Studio

#### 1. Running from Android Studio
```
1. Open Android Studio
2. Wait for Gradle sync to complete
3. Select device/emulator from toolbar
4. Click 'Run' (green play button) or press Shift+F10
```

#### 2. Debugging Native Code
```
1. Set breakpoints in Java/Kotlin files
2. Click 'Debug' (bug icon) or press Shift+F9
3. Use Debug panel for:
   - Variable inspection
   - Call stack analysis
   - Memory profiling
```

#### 3. Using Android Studio Emulator with Expo
```bash
# Start emulator from Android Studio AVD Manager
# Then in terminal:
npx expo start --android

# Or for production-like testing:
npx expo run:android --variant release
```

### C. Hybrid Development Workflow

#### Development Build
```bash
# Create a development build with expo-dev-client
npx expo install expo-dev-client

# Build for Android
eas build --platform android --profile development

# Or build locally:
npx expo run:android
```

#### Benefits of Development Builds:
- Use native modules not available in Expo Go
- Test production-like behavior
- Debug with Android Studio tools
- Access to native logs

## Android Studio Features for Expo

### 1. Layout Inspector
Inspect your React Native component hierarchy:
```
Tools → Layout Inspector
- Select running app process
- View component tree
- Inspect layout properties
- Debug rendering issues
```

### 2. Network Profiler
Monitor API calls to Supabase:
```
View → Tool Windows → Profiler
- Select 'Network' tab
- Monitor HTTP/HTTPS requests
- Inspect request/response data
- Track performance metrics
```

### 3. Memory Profiler
Detect memory leaks:
```
View → Tool Windows → Profiler
- Select 'Memory' tab
- Take heap dumps
- Track memory allocation
- Find memory leaks
```

### 4. Logcat
View detailed logs:
```
View → Tool Windows → Logcat
- Filter by app package: com.torontoclimbingclub.connect
- Log levels: Verbose, Debug, Info, Warn, Error
- Search functionality
- Save logs to file
```

### 5. APK Analyzer
Optimize app size:
```
Build → Analyze APK
- View APK contents
- Check method counts
- Analyze resources
- Compare APK sizes
```

## Native Module Development

### Adding Custom Native Modules
When Expo modules don't meet your needs:

#### 1. Create Native Module
`android/app/src/main/java/com/climbconnect/modules/CustomModule.java`:
```java
package com.climbconnect.modules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class CustomModule extends ReactContextBaseJavaModule {
    CustomModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "CustomModule";
    }

    @ReactMethod
    public void customMethod(String param, Promise promise) {
        try {
            // Your native code here
            promise.resolve("Success: " + param);
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }
}
```

#### 2. Register Module
`android/app/src/main/java/com/climbconnect/MainApplication.java`:
```java
@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new CustomPackage() // Add your package
    );
}
```

#### 3. Use in JavaScript
```typescript
import { NativeModules } from 'react-native';

const { CustomModule } = NativeModules;

const result = await CustomModule.customMethod('parameter');
```

## Build Variants & Flavors

### Configure Build Types
`android/app/build.gradle`:
```gradle
android {
    buildTypes {
        debug {
            applicationIdSuffix ".debug"
            versionNameSuffix "-debug"
            debuggable true
        }
        
        staging {
            initWith release
            applicationIdSuffix ".staging"
            versionNameSuffix "-staging"
            matchingFallbacks = ['release']
        }
        
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 
                         'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
    
    flavorDimensions "environment"
    productFlavors {
        development {
            dimension "environment"
            applicationId "com.climbconnect.dev"
            buildConfigField "String", "API_URL", 
                           '"https://dev.api.climbconnect.com"'
        }
        
        production {
            dimension "environment"
            applicationId "com.climbconnect"
            buildConfigField "String", "API_URL", 
                           '"https://api.climbconnect.com"'
        }
    }
}
```

### Build Specific Variants
```bash
# Debug builds
./gradlew assembleDevelopmentDebug
./gradlew assembleProductionDebug

# Release builds
./gradlew assembleDevelopmentRelease
./gradlew assembleProductionRelease
```

## Performance Optimization

### 1. Enable ProGuard/R8
`android/app/build.gradle`:
```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'),
                         'proguard-rules.pro'
        }
    }
}
```

### 2. ProGuard Rules
`android/app/proguard-rules.pro`:
```
# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Supabase
-keep class io.supabase.** { *; }
-keep class com.google.gson.** { *; }

# Your app
-keep class com.climbconnect.** { *; }
```

### 3. Enable Hermes
`android/app/build.gradle`:
```gradle
project.ext.react = [
    enableHermes: true
]
```

### 4. Bundle Splitting
```gradle
android {
    splits {
        abi {
            enable true
            reset()
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
            universalApk false
        }
    }
}
```

## Testing in Android Studio

### 1. Unit Tests
`android/app/src/test/java/com/climbconnect/ExampleUnitTest.java`:
```java
@Test
public void addition_isCorrect() {
    assertEquals(4, 2 + 2);
}

// Run: Right-click test → Run
```

### 2. Instrumented Tests
`android/app/src/androidTest/java/com/climbconnect/ExampleInstrumentedTest.java`:
```java
@Test
public void useAppContext() {
    Context appContext = InstrumentationRegistry.getInstrumentation()
                                                 .getTargetContext();
    assertEquals("com.climbconnect", appContext.getPackageName());
}
```

### 3. UI Tests with Espresso
```java
@Test
public void checkLoginButton() {
    onView(withId(R.id.login_button))
        .perform(click());
    
    onView(withText("Welcome"))
        .check(matches(isDisplayed()));
}
```

## Play Store Preparation

### 1. Build Release APK/AAB
```bash
# Using EAS (Recommended)
eas build --platform android --profile production

# Using Android Studio
Build → Generate Signed Bundle/APK
- Choose Android App Bundle (AAB)
- Select keystore
- Select release build variant
```

### 2. Test Release Build
```bash
# Install release APK on device
adb install app-release.apk

# Or use bundletool for AAB
bundletool build-apks --bundle=app-release.aab --output=app-release.apks
bundletool install-apks --apks=app-release.apks
```

### 3. Pre-launch Testing
1. Upload to Play Console Internal Testing
2. Run pre-launch report
3. Fix any issues found
4. Test on multiple devices

## Troubleshooting

### Common Issues

#### 1. Gradle Sync Failed
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew build

# Reset cache
./gradlew cleanBuildCache
```

#### 2. Metro Bundler Issues
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear all caches
cd android && ./gradlew clean
cd .. && rm -rf node_modules
npm install
cd ios && pod install  # if applicable
```

#### 3. Build Errors
```bash
# Check for detailed error
./gradlew assembleDebug --stacktrace

# Update dependencies
./gradlew dependencies
```

#### 4. Emulator Issues
```bash
# List available emulators
emulator -list-avds

# Start emulator manually
emulator -avd Pixel_4_API_33

# Cold boot
emulator -avd Pixel_4_API_33 -no-snapshot-load
```

## Best Practices

### 1. Version Control
```gitignore
# android/.gitignore
*.iml
.gradle/
local.properties
.idea/
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
*.keystore
keystore.properties
```

### 2. CI/CD Integration
```yaml
# .github/workflows/android.yml
name: Android CI

on:
  push:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up JDK 11
      uses: actions/setup-java@v2
      with:
        java-version: '11'
    - name: Build with Gradle
      run: |
        cd android
        ./gradlew assembleRelease
```

### 3. Code Quality
- Use Android Lint: `Analyze → Inspect Code`
- Format code: `Code → Reformat Code`
- Optimize imports: `Code → Optimize Imports`

## Advanced Debugging

### 1. React Native Debugger Integration
```java
// Enable in MainApplication.java
@Override
public boolean getUseDeveloperSupport() {
    return BuildConfig.DEBUG;
}
```

### 2. Flipper Integration
```gradle
// android/app/build.gradle
dependencies {
    debugImplementation("com.facebook.flipper:flipper:${FLIPPER_VERSION}") {
        exclude group:'com.facebook.fbjni'
    }
    debugImplementation("com.facebook.flipper:flipper-network-plugin:${FLIPPER_VERSION}") {
        exclude group:'com.facebook.fbjni'
    }
    debugImplementation("com.facebook.flipper:flipper-fresco-plugin:${FLIPPER_VERSION}") {
        exclude group:'com.facebook.fbjni'
    }
}
```

### 3. Chrome DevTools
```javascript
// Enable remote debugging
if (__DEV__) {
  require('react-native-debugger-open');
}
```

## Conclusion

This workflow enables you to leverage Android Studio's powerful features while maintaining Expo's developer experience. Use Expo tools for rapid development and Android Studio for native debugging, profiling, and optimization.