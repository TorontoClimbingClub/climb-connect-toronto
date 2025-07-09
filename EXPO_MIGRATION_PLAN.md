# React to Expo Migration Plan - Climb Connect Toronto
## Android Play Store Publication Strategy

### Project Overview
**Current Stack**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui + Supabase + React Router  
**Target**: Native Android app via Expo for Play Store publication  
**Complexity**: High - Requires significant refactoring from web to mobile-native paradigm

## Phase 1: Pre-Migration Analysis & Planning

### 1.1 Current Architecture Assessment
**Web-Specific Dependencies to Replace:**
- `react-router-dom` → React Navigation
- `localStorage` → AsyncStorage
- `shadcn/ui` + Radix UI → React Native UI components
- `Tailwind CSS` → NativeWind or React Native StyleSheet
- `Vite` → Metro bundler (Expo)

**Compatible Dependencies:**
- ✅ Supabase JS SDK (works with React Native)
- ✅ React Query (works with React Native)
- ✅ React Hook Form (works with React Native)
- ✅ Zod (works with React Native)
- ✅ date-fns (works with React Native)

### 1.2 Migration Strategy Decision
**Recommended Approach**: Create new Expo project and migrate code systematically
- Preserves original web app
- Cleaner mobile-first architecture
- Easier to manage platform-specific code

## Phase 2: Expo Project Setup

### 2.1 Initialize New Expo Project
```bash
# Create new Expo project with TypeScript template
npx create-expo-app climb-connect-toronto-mobile --template expo-template-blank-typescript

# Navigate to project
cd climb-connect-toronto-mobile

# Install EAS CLI for building
npm install -g eas-cli
```

### 2.2 Configure app.json
```json
{
  "expo": {
    "name": "Climb Connect Toronto",
    "slug": "climb-connect-toronto",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.torontoclimbingclub.connect"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.torontoclimbingclub.connect",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    "plugins": [
      "expo-secure-store",
      "expo-location",
      "expo-image-picker"
    ]
  }
}
```

### 2.3 Install Core Dependencies
```bash
# Navigation
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated

# Supabase
npm install @supabase/supabase-js
npx expo install expo-secure-store
npm install react-native-url-polyfill

# UI Components
npx expo install react-native-elements react-native-vector-icons
npx expo install react-native-paper

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# State Management
npm install @tanstack/react-query

# Utilities
npx expo install expo-constants expo-device expo-notifications
npx expo install expo-image-picker expo-location
npx expo install @react-native-async-storage/async-storage
```

## Phase 3: Architecture Migration

### 3.1 Project Structure
```
climb-connect-toronto-mobile/
├── app/                    # Expo Router (if using file-based routing)
├── src/
│   ├── components/        # React Native components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API and Supabase services
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilities
│   ├── types/           # TypeScript types
│   └── styles/          # Shared styles
├── assets/              # Images, fonts, etc.
└── App.tsx             # Entry point
```

### 3.2 Navigation Setup
```typescript
// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigator
function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Events" component={EventsStack} />
      <Tab.Screen name="Groups" component={GroupsStack} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Stack navigators for each tab
function EventsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EventsList" component={EventsListScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="EventChat" component={EventChatScreen} />
    </Stack.Navigator>
  );
}
```

### 3.3 Supabase Integration
```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://kufibqipthrwoclhtmmg.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

## Phase 4: UI Component Migration

### 4.1 Component Mapping Strategy
| Web Component | Mobile Replacement |
|--------------|-------------------|
| shadcn/ui Button | React Native Paper Button |
| shadcn/ui Card | React Native View + styling |
| shadcn/ui Dialog | React Native Modal |
| shadcn/ui Select | React Native Picker |
| shadcn/ui Toast | Expo Notifications |
| Tailwind classes | StyleSheet or NativeWind |

### 4.2 Example Component Migration
```typescript
// Web (shadcn/ui)
import { Button } from "@/components/ui/button";
<Button variant="outline" onClick={handleClick}>
  Click me
</Button>

// Mobile (React Native)
import { Button } from 'react-native-paper';
<Button mode="outlined" onPress={handlePress}>
  Click me
</Button>
```

### 4.3 Styling Approach
**Option 1: StyleSheet (Recommended)**
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
  },
});
```

**Option 2: NativeWind (Tailwind-like)**
```bash
npm install nativewind
npm install --dev tailwindcss
```

## Phase 5: Feature-by-Feature Migration

### 5.1 Authentication Flow
```typescript
// src/screens/AuthScreen.tsx
import { supabase } from '../services/supabase';
import { TextInput, Button } from 'react-native-paper';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert('Error', error.message);
  };

  return (
    <View>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={handleSignIn}>Sign In</Button>
    </View>
  );
}
```

### 5.2 Real-time Chat Implementation
```typescript
// src/screens/ChatScreen.tsx
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView } from 'react-native';
import { supabase } from '../services/supabase';

export function ChatScreen({ route }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Subscribe to real-time messages
    const subscription = supabase
      .channel(`room:${route.params.chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [route.params.chatId]);

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageItem message={item} />}
        inverted
      />
      <MessageInput chatId={route.params.chatId} />
    </KeyboardAvoidingView>
  );
}
```

## Phase 6: Android-Specific Configuration

### 6.1 EAS Build Configuration
```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-services-account-key.json",
        "track": "production"
      }
    }
  }
}
```

### 6.2 Android Permissions & Features
```typescript
// App.tsx - Request permissions
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

useEffect(() => {
  (async () => {
    const { status: locationStatus } = 
      await Location.requestForegroundPermissionsAsync();
    const { status: mediaStatus } = 
      await ImagePicker.requestMediaLibraryPermissionsAsync();
  })();
}, []);
```

## Phase 7: Testing & Development Workflow

### 7.1 Development Testing
```bash
# Start Expo development server
npx expo start

# Run on Android emulator
npx expo start --android

# Run on physical device (Expo Go app)
npx expo start --tunnel
```

### 7.2 Build for Testing
```bash
# Create development build
eas build --platform android --profile development

# Create preview APK
eas build --platform android --profile preview
```

### 7.3 Android Studio Integration
1. Generate Android project:
```bash
npx expo prebuild --platform android
```

2. Open in Android Studio:
```bash
cd android
studio .
```

## Phase 8: Play Store Deployment

### 8.1 Production Build
```bash
# Ensure production configuration
eas build --platform android --profile production
```

### 8.2 Play Store Submission
```bash
# Submit to Play Store
eas submit --platform android --latest
```

### 8.3 Required Assets
- App icon: 512x512px PNG
- Feature graphic: 1024x500px
- Screenshots: Min 2, max 8 (various device sizes)
- App description (short & full)
- Privacy policy URL
- Content rating questionnaire

## Phase 9: Migration Timeline

### Week 1-2: Setup & Core Architecture
- Initialize Expo project
- Set up navigation structure
- Configure Supabase integration
- Implement authentication flow

### Week 3-4: Feature Migration
- Migrate Events functionality
- Migrate Groups functionality
- Implement chat systems
- Profile management

### Week 5-6: UI Polish & Testing
- Refine UI/UX for mobile
- Implement push notifications
- Performance optimization
- Beta testing

### Week 7-8: Deployment
- Final testing
- Play Store assets preparation
- Production build
- Play Store submission

## Critical Considerations

### 1. Platform-Specific Code
```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
```

### 2. Performance Optimization
- Use FlatList for long lists
- Implement lazy loading
- Optimize images with expo-image
- Minimize re-renders with memo

### 3. Offline Support
```typescript
// Implement offline queue for messages
import NetInfo from '@react-native-community/netinfo';

const unsubscribe = NetInfo.addEventListener(state => {
  if (state.isConnected) {
    // Sync offline data
  }
});
```

### 4. Push Notifications
```typescript
import * as Notifications from 'expo-notifications';

async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === 'granted') {
    const token = await Notifications.getExpoPushTokenAsync();
    // Send token to Supabase
  }
}
```

## Recommended Next Steps

1. **Create backup** of current web application
2. **Set up new Expo project** following Phase 2
3. **Start with authentication** as the foundation
4. **Migrate one feature at a time** (Events → Groups → Chat)
5. **Test continuously** on real devices
6. **Gather user feedback** early and often

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-react-native)
- [React Native Paper](https://callstack.github.io/react-native-paper)
- [EAS Build](https://docs.expo.dev/build/introduction)