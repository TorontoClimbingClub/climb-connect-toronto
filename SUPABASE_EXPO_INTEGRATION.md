# Supabase Integration Guide for Expo Migration
## Climb Connect Toronto Mobile App

### Overview
This guide details the specific considerations and implementation strategies for integrating Supabase with the Expo/React Native version of Climb Connect Toronto.

## Key Differences: Web vs Mobile

### 1. Storage Mechanism
**Web Implementation:**
```typescript
// Current web implementation uses localStorage
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

**Mobile Implementation:**
```typescript
// Mobile requires AsyncStorage or SecureStore
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto'; // Required polyfill

// Option 1: AsyncStorage (simpler, less secure)
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for mobile
  },
});

// Option 2: SecureStore (recommended for sensitive data)
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### 2. Deep Linking for OAuth
**Setup Required for Social Auth:**
```json
// app.json
{
  "expo": {
    "scheme": "climbconnect",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "climbconnect",
              "host": "auth",
              "pathPrefix": "/callback"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

**Auth Implementation:**
```typescript
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export async function signInWithProvider(provider: 'google' | 'facebook') {
  const redirectUrl = Linking.createURL('auth/callback');
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUrl
    );
    
    if (result.type === 'success') {
      const { url } = result;
      // Extract and set the session
      await supabase.auth.getSessionFromUrl({ url });
    }
  }
}
```

## Real-time Subscriptions

### Mobile-Specific Considerations
```typescript
import { AppState, AppStateStatus } from 'react-native';

// Manage subscriptions based on app state
export function useRealtimeSubscription(channel: string, callback: Function) {
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    let sub: RealtimeChannel;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && !sub) {
        // Reconnect when app becomes active
        sub = supabase.channel(channel)
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public' 
          }, callback)
          .subscribe();
        setSubscription(sub);
      } else if (nextAppState === 'background' && sub) {
        // Disconnect when app goes to background
        sub.unsubscribe();
        setSubscription(null);
      }
    };

    // Initial subscription
    sub = supabase.channel(channel)
      .on('postgres_changes', { event: '*', schema: 'public' }, callback)
      .subscribe();
    setSubscription(sub);

    // Listen for app state changes
    const appStateSubscription = AppState.addEventListener(
      'change', 
      handleAppStateChange
    );

    return () => {
      sub?.unsubscribe();
      appStateSubscription.remove();
    };
  }, [channel]);

  return subscription;
}
```

## File Upload/Download

### Mobile Implementation
```typescript
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Upload image from camera/gallery
export async function uploadProfileImage(userId: string) {
  // Request permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return;

  // Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    const image = result.assets[0];
    const fileName = `${userId}-${Date.now()}.jpg`;

    // Convert to blob for upload
    const response = await fetch(image.uri);
    const blob = await response.blob();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
      });

    if (data) {
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    }
  }
}

// Download and cache file
export async function downloadAndCacheFile(url: string, fileName: string) {
  const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
  
  // Check if file exists in cache
  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (fileInfo.exists) {
    return fileUri;
  }

  // Download file
  const downloadResult = await FileSystem.downloadAsync(url, fileUri);
  return downloadResult.uri;
}
```

## Offline Support & Data Sync

### Implementing Offline Queue
```typescript
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

class OfflineQueue {
  private queue: any[] = [];
  private isOnline: boolean = true;

  constructor() {
    this.loadQueue();
    this.setupNetworkListener();
  }

  private async loadQueue() {
    const saved = await AsyncStorage.getItem('offline_queue');
    if (saved) {
      this.queue = JSON.parse(saved);
    }
  }

  private async saveQueue() {
    await AsyncStorage.setItem('offline_queue', JSON.stringify(this.queue));
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      if (this.isOnline) {
        this.processQueue();
      }
    });
  }

  async add(operation: {
    type: 'insert' | 'update' | 'delete';
    table: string;
    data: any;
  }) {
    this.queue.push({
      ...operation,
      timestamp: Date.now(),
      id: Math.random().toString(36),
    });
    await this.saveQueue();
    
    if (this.isOnline) {
      this.processQueue();
    }
  }

  private async processQueue() {
    while (this.queue.length > 0 && this.isOnline) {
      const operation = this.queue[0];
      
      try {
        switch (operation.type) {
          case 'insert':
            await supabase.from(operation.table).insert(operation.data);
            break;
          case 'update':
            await supabase.from(operation.table)
              .update(operation.data)
              .eq('id', operation.data.id);
            break;
          case 'delete':
            await supabase.from(operation.table)
              .delete()
              .eq('id', operation.data.id);
            break;
        }
        
        // Remove from queue on success
        this.queue.shift();
        await this.saveQueue();
      } catch (error) {
        console.error('Failed to sync:', error);
        break; // Stop processing on error
      }
    }
  }
}

export const offlineQueue = new OfflineQueue();
```

## Push Notifications Integration

### Supabase + Expo Notifications
```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function registerForPushNotifications(userId: string) {
  if (!Device.isDevice) return null;

  // Configure notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Get permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') return null;

  // Get Expo push token
  const token = await Notifications.getExpoPushTokenAsync({
    projectId: 'your-project-id',
  });

  // Store token in Supabase
  await supabase.from('user_push_tokens').upsert({
    user_id: userId,
    token: token.data,
    platform: 'android',
    updated_at: new Date().toISOString(),
  });

  return token.data;
}

// Listen for notifications
export function useNotificationListener() {
  useEffect(() => {
    // Received while app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notification received:', notification);
      }
    );

    // User interacted with notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        const { notification } = response;
        // Navigate based on notification data
        if (notification.request.content.data?.chatId) {
          // Navigate to chat
        }
      }
    );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
}
```

## Performance Optimization

### 1. Connection Pooling
```typescript
// Singleton pattern for Supabase client
let supabaseInstance: SupabaseClient | null = null;

export function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10, // Rate limiting
        },
      },
    });
  }
  return supabaseInstance;
}
```

### 2. Query Optimization
```typescript
// Paginated queries for large datasets
export async function getEventsPaginated(page: number, limit: number = 20) {
  const from = page * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('events')
    .select('*', { count: 'exact' })
    .order('event_date', { ascending: true })
    .range(from, to);

  return {
    data,
    error,
    hasMore: count ? to < count - 1 : false,
    totalCount: count,
  };
}

// Use React Query for caching
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

export function useEvents() {
  return useInfiniteQuery({
    queryKey: ['events'],
    queryFn: ({ pageParam = 0 }) => getEventsPaginated(pageParam),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

## Security Considerations

### 1. Secure API Key Storage
```typescript
// Use environment variables with Expo
import Constants from 'expo-constants';

const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey;

// app.json
{
  "expo": {
    "extra": {
      "supabaseUrl": process.env.SUPABASE_URL,
      "supabaseAnonKey": process.env.SUPABASE_ANON_KEY,
    }
  }
}
```

### 2. Row Level Security (RLS)
Ensure all RLS policies work correctly with mobile auth:
```sql
-- Example policy for mobile app
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Mobile-specific considerations for offline support
CREATE POLICY "Users can create pending messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    status = 'pending' -- Allow offline message creation
  );
```

## Migration Checklist

- [ ] Replace localStorage with AsyncStorage/SecureStore
- [ ] Add react-native-url-polyfill import
- [ ] Configure deep linking for OAuth
- [ ] Implement offline queue for critical operations
- [ ] Set up push notification token management
- [ ] Optimize real-time subscriptions for mobile
- [ ] Implement file upload/download with proper permissions
- [ ] Add network state management
- [ ] Configure connection pooling
- [ ] Test RLS policies with mobile auth flow
- [ ] Implement proper error handling for network failures
- [ ] Add retry logic for failed operations
- [ ] Set up analytics tracking for mobile events
- [ ] Test background/foreground state transitions
- [ ] Validate performance on low-end devices

## Common Pitfalls & Solutions

### 1. Authentication State Loss
**Problem**: User gets logged out when app is closed
**Solution**: Use SecureStore and proper session persistence

### 2. Real-time Subscription Memory Leaks
**Problem**: Subscriptions not cleaned up properly
**Solution**: Always unsubscribe in cleanup functions

### 3. Large Data Transfer
**Problem**: Slow initial load on mobile networks
**Solution**: Implement progressive loading and caching

### 4. OAuth Redirect Issues
**Problem**: OAuth flow doesn't complete
**Solution**: Proper deep link configuration and handling

### 5. Background Sync Failures
**Problem**: Data not syncing when app is backgrounded
**Solution**: Implement proper offline queue and background tasks