# Mobile UI/UX Adaptation Guide
## Climb Connect Toronto - Web to Native Mobile Transformation

### Overview
This guide outlines the UI/UX adaptations needed to transform the web-based Climb Connect Toronto into a native mobile experience that follows Android Material Design guidelines and mobile best practices.

## Core Navigation Transformation

### Current Web Navigation
- Desktop: Sidebar navigation with multi-panel layouts
- Mobile Web: Top navigation bar with hamburger menu
- Complex routing with nested layouts

### Native Mobile Navigation
```typescript
// Bottom Tab Navigation (Primary)
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#f97316', // Orange accent
      tabBarInactiveTintColor: '#6b7280',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
    }}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Events" 
      component={EventsStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="calendar" size={size} color={color} />
        ),
        tabBarBadge: unreadEvents > 0 ? unreadEvents : undefined,
      }}
    />
    <Tab.Screen 
      name="Groups" 
      component={GroupsStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="people" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Chat" 
      component={ChatStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubbles" size={size} color={color} />
        ),
        tabBarBadge: unreadMessages > 0 ? unreadMessages : undefined,
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);
```

## Screen-by-Screen UI Adaptations

### 1. Home Screen
**Web Version**: Dashboard with statistics, cards, weather widget
**Mobile Version**: Simplified, action-focused design

```typescript
// Mobile Home Screen Design
export const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.greeting}>Hi, {userName}!</Text>
        <Text style={styles.subtitle}>Ready to climb today?</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="add-circle" size={32} color="#f97316" />
          <Text>Find Partners</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="location" size={32} color="#f97316" />
          <Text>Nearby Gyms</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Activity */}
      <Card style={styles.todayCard}>
        <Text style={styles.sectionTitle}>Today at {currentGym}</Text>
        <View style={styles.activityList}>
          {todayActivities.map(activity => (
            <ActivityItem key={activity.id} {...activity} />
          ))}
        </View>
      </Card>

      {/* Upcoming Events Preview */}
      <View style={styles.upcomingSection}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <FlatList
          horizontal
          data={upcomingEvents}
          renderItem={({ item }) => <EventCard {...item} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};
```

### 2. Events List
**Web Version**: Grid layout with filters and search
**Mobile Version**: Vertical list with swipe actions and pull-to-refresh

```typescript
// Mobile Events List
export const EventsListScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Sticky Header with Filter */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={24} color="#374151" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Events List */}
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <View style={styles.swipeActions}>
                <TouchableOpacity style={styles.joinAction}>
                  <Text>Join</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareAction}>
                  <Text>Share</Text>
                </TouchableOpacity>
              </View>
            )}
          >
            <EventListItem {...item} />
          </Swipeable>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#f97316']}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <EventFilterModal onClose={() => setFilterVisible(false)} />
      </Modal>
    </View>
  );
};
```

### 3. Chat Interface
**Web Version**: Multi-panel with sidebar
**Mobile Version**: Full-screen chat with floating action button

```typescript
// Mobile Chat Screen
export const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const keyboardOffset = useKeyboardOffset();

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.chatTitle}>{chatName}</Text>
          <Text style={styles.chatSubtitle}>{participantCount} members</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={24} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageBubble {...item} />}
        inverted
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
      />

      {/* Input Bar */}
      <View style={[styles.inputBar, { marginBottom: keyboardOffset }]}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="attach" size={24} color="#6b7280" />
        </TouchableOpacity>
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          multiline
          maxHeight={100}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message && styles.sendButtonDisabled]}
          disabled={!message}
          onPress={handleSend}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={message ? '#ffffff' : '#9ca3af'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
```

### 4. Belay Groups (Mobile-First Feature)
**Web Version**: Desktop-optimized grid
**Mobile Version**: Native mobile experience with quick actions

```typescript
// Mobile Belay Groups
export const BelayGroupsScreen = () => {
  return (
    <View style={styles.container}>
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={createBelayGroup}>
        <Ionicons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Active Session Banner */}
      {activeSession && (
        <TouchableOpacity style={styles.activeBanner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Active Belay Session</Text>
            <Text style={styles.bannerSubtitle}>
              {activeSession.location} • {activeSession.participantCount} climbers
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      )}

      {/* Groups List */}
      <SectionList
        sections={[
          { title: 'Your Groups', data: userGroups },
          { title: 'Nearby Groups', data: nearbyGroups },
          { title: 'Recommended', data: recommendedGroups },
        ]}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <BelayGroupCard
            {...item}
            onPress={() => navigateToBelayGroup(item.id)}
            onJoin={() => joinBelayGroup(item.id)}
          />
        )}
      />
    </View>
  );
};
```

## Mobile-Specific UI Components

### 1. Bottom Sheet for Actions
```typescript
import { BottomSheet } from '@gorhom/bottom-sheet';

export const EventActionsSheet = ({ event, isVisible, onClose }) => {
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  return (
    <BottomSheet
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onClose={onClose}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <View style={styles.sheetContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="person-add" size={20} />
          <Text>Join Event</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social" size={20} />
          <Text>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="calendar" size={20} />
          <Text>Add to Calendar</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};
```

### 2. Native Date/Time Pickers
```typescript
import DateTimePicker from '@react-native-community/datetimepicker';

export const EventDatePicker = ({ value, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShow(true)}
      >
        <Ionicons name="calendar" size={20} color="#6b7280" />
        <Text>{format(value, 'MMM dd, yyyy')}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="calendar"
          onChange={(event, date) => {
            setShow(false);
            if (date) onChange(date);
          }}
          minimumDate={new Date()}
        />
      )}
    </>
  );
};
```

### 3. Pull-to-Create Pattern
```typescript
export const usePullToCreate = (onCreateTriggered: () => void) => {
  const [pullProgress, setPullProgress] = useState(0);
  const threshold = 80;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y < 0) {
      setPullProgress(Math.min(Math.abs(contentOffset.y), threshold));
      if (Math.abs(contentOffset.y) >= threshold) {
        onCreateTriggered();
      }
    }
  };

  return {
    onScroll: handleScroll,
    pullProgress,
    PullToCreateIndicator: () => (
      <View style={[styles.pullIndicator, { opacity: pullProgress / threshold }]}>
        <Ionicons 
          name="add-circle" 
          size={32} 
          color="#f97316"
          style={{
            transform: [{ rotate: `${pullProgress * 2}deg` }]
          }}
        />
        <Text>Pull to create event</Text>
      </View>
    ),
  };
};
```

## Gesture-Based Interactions

### 1. Swipe Navigation
```typescript
import { PanGestureHandler } from 'react-native-gesture-handler';

export const SwipeableEventCard = ({ event, onSwipeLeft, onSwipeRight }) => {
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      if (translateX.value < -100) {
        runOnJS(onSwipeLeft)();
      } else if (translateX.value > 100) {
        runOnJS(onSwipeRight)();
      }
      translateX.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <EventCardContent {...event} />
      </Animated.View>
    </PanGestureHandler>
  );
};
```

### 2. Long Press Actions
```typescript
export const GroupCard = ({ group }) => {
  const scale = useSharedValue(1);

  const handleLongPress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // Show action menu
    showActionSheet({
      options: ['Leave Group', 'Mute Notifications', 'Group Info', 'Cancel'],
      cancelButtonIndex: 3,
      destructiveButtonIndex: 0,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity 
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <Animated.View style={[styles.groupCard, animatedStyle]}>
        {/* Card content */}
      </Animated.View>
    </TouchableOpacity>
  );
};
```

## Performance Optimizations

### 1. Image Optimization
```typescript
import { Image } from 'expo-image';

export const OptimizedEventImage = ({ uri, style }) => {
  return (
    <Image
      source={uri}
      style={style}
      contentFit="cover"
      transition={200}
      placeholder={require('./assets/placeholder.png')}
      cachePolicy="memory-disk" // Cache images
    />
  );
};
```

### 2. List Optimization
```typescript
export const EventsList = ({ events }) => {
  const renderItem = useCallback(({ item }) => (
    <EventCard event={item} />
  ), []);

  const keyExtractor = useCallback((item) => item.id, []);

  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
    />
  );
};
```

## Accessibility Considerations

### 1. Screen Reader Support
```typescript
export const AccessibleButton = ({ title, onPress, icon }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={true}
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityHint={`Double tap to ${title.toLowerCase()}`}
    >
      {icon}
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

### 2. Dynamic Font Scaling
```typescript
import { PixelRatio } from 'react-native';

const fontScale = PixelRatio.getFontScale();

export const styles = StyleSheet.create({
  title: {
    fontSize: 18 * fontScale,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14 * fontScale,
    lineHeight: 20 * fontScale,
  },
});
```

## Platform-Specific Adaptations

### Android-Specific Features
```typescript
import { Platform, ToastAndroid } from 'react-native';

export const showToast = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    // iOS fallback
    Alert.alert('', message);
  }
};

// Android back button handling
useEffect(() => {
  if (Platform.OS === 'android') {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }
}, [navigation]);
```

## Design System Tokens

### Colors
```typescript
export const colors = {
  primary: '#f97316', // Orange
  primaryDark: '#ea580c',
  primaryLight: '#fb923c',
  
  surface: '#ffffff',
  background: '#f3f4f6',
  
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    inverse: '#ffffff',
  },
  
  border: '#e5e7eb',
  divider: '#f3f4f6',
  
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};
```

### Typography
```typescript
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
};
```

### Spacing
```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

## Migration Priority

### Phase 1: Core Navigation & Auth (Week 1)
- Bottom tab navigation
- Authentication screens
- Basic profile

### Phase 2: Events & Groups (Week 2)
- Events list and details
- Groups list and details
- Basic search/filter

### Phase 3: Chat System (Week 3)
- Chat list
- Individual chats
- Real-time messaging

### Phase 4: Belay Groups (Week 4)
- Belay group creation
- Partner finding
- Session management

### Phase 5: Polish & Optimization (Week 5)
- Animations
- Performance tuning
- Accessibility
- Error states
- Empty states