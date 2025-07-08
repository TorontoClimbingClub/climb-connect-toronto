# CLIMB CONNECT TORONTO - DUAL ARCHITECTURE MAP
*Enhanced UI component mapping with desktop/mobile behavior annotations*

## 🚨 MANDATORY DUAL ARCHITECTURE PROTOCOL

**BEFORE MAKING ANY UI CHANGES:**
1. **UPDATE STANDARD MAP:** `npm run ui:update-map` 
2. **CHECK THIS DUAL MAP:** Understand component behavior category
3. **IDENTIFY BREAKPOINT IMPACT:** Know if change affects desktop/mobile/both
4. **LOCATE EXACT COMPONENT:** Use standard CLAUDE_UI_MAP.md for file:line
5. **MAKE TARGETED EDIT:** Consider responsive implications
6. **REQUEST USER TESTING:** Test on both desktop and mobile if applicable

## 📊 ARCHITECTURE OVERVIEW

**Primary Breakpoint:** `768px` (md breakpoint)
- **Mobile:** `< 768px` - Original mobile experience  
- **Desktop:** `≥ 768px` - Enhanced desktop/tablet experience

**Total Components:** 71
**Dual Architecture Components:** 8 key responsive components
**Last Architecture Review:** 2025-07-08T20:52:29.084Z

## 🏗️ COMPONENT CATEGORIZATION BY RESPONSIVE BEHAVIOR

### 🖥️ DESKTOP-ONLY COMPONENTS
*These components NEVER render on mobile (< 768px)*

#### DesktopSidebar.tsx
- **File:** `src/components/layout/DesktopSidebar.tsx`
- **Behavior:** Returns `null` on mobile via `isMobile` check
- **Key Logic:** `if (isMobile) { return null; }` (line 128-130)
- **Features:** Navigation, user profile, activity feed, collapsible states
- **Impact:** Changes here only affect desktop/tablet users

#### GlobalSearch.tsx  
- **File:** `src/components/GlobalSearch.tsx`
- **Behavior:** Desktop-focused search dialog with keyboard shortcuts
- **Key Logic:** Accessed via desktop shortcuts (Ctrl+K)
- **Features:** Advanced search with categorization, complex UI
- **Impact:** Changes here only affect desktop users with search functionality

### 📱 MOBILE-ONLY COMPONENTS
*These components NEVER render on desktop (≥ 768px)*

#### NavBar.tsx (Mobile Menu Section)
- **File:** `src/components/layout/NavBar.tsx` 
- **Behavior:** Mobile hamburger menu hidden on desktop
- **Key Logic:** Mobile menu uses `md:hidden` CSS classes
- **Features:** Sheet/drawer navigation, mobile-optimized layout
- **Impact:** Changes to mobile menu section only affect mobile users

### 🔄 RESPONSIVE COMPONENTS  
*These components adapt behavior based on screen size*

#### Layout.tsx - Core Layout Orchestrator
- **File:** `src/components/layout/Layout.tsx`
- **Behavior:** Switches between MobileLayout and DesktopLayout functions
- **Key Logic:** `useDesktopLayout` prop controls layout mode
- **Mobile Mode:** Traditional navbar + main content
- **Desktop Mode:** Multi-panel layout with sidebar
- **Impact:** Changes here affect layout switching logic for entire app

#### Home.tsx - Responsive Landing Experience
- **File:** `src/pages/Home.tsx`
- **Behavior:** Smart responsive switching based on screen detection
- **Key Logic:** `setIsDesktop(window.innerWidth >= 768)` (line 16)
- **Mobile Mode:** Marketing-style landing page for authenticated users
- **Desktop Mode:** Automatically redirects to Dashboard component
- **Impact:** Changes affect user's first experience differently per platform

#### NavBar.tsx - Hybrid Navigation
- **File:** `src/components/layout/NavBar.tsx`
- **Behavior:** Mobile-first navigation with desktop adaptations
- **Key Logic:** Uses responsive CSS classes throughout
- **Mobile Mode:** Hamburger menu, compact layout, sheet navigation
- **Desktop Mode:** Horizontal nav, full text, inline links
- **Impact:** Changes affect primary navigation across all screen sizes

#### MultiPanelLayout.tsx - Desktop Panel System
- **File:** `src/components/layout/MultiPanelLayout.tsx`
- **Behavior:** Desktop panel system with mobile fallback
- **Key Logic:** Context panels use `hidden md:block` classes
- **Mobile Mode:** Single column, panels hidden
- **Desktop Mode:** Two/three/four panel layouts
- **Impact:** Changes affect panel-based layout structure on desktop

### 🎛️ LAYOUT-CONTROLLED COMPONENTS
*Behavior determined by parent layout configuration*

#### Dashboard.tsx - Desktop-First Page
- **File:** `src/pages/Dashboard.tsx`
- **Behavior:** Forces desktop layout usage
- **Key Logic:** `<Layout useDesktopLayout={true} layoutType="three-panel">`
- **Desktop Features:** Multi-column grids, context panels, weather widget
- **Mobile Access:** Accessed only via Home.tsx redirect on desktop
- **Impact:** Changes here create desktop-specific dashboard experience

#### Events.tsx - Desktop-Optimized Events
- **File:** `src/pages/Events.tsx`
- **Behavior:** Forces desktop layout  
- **Key Logic:** `<Layout useDesktopLayout={true} layoutType="two-panel">`
- **Desktop Features:** Grid layout, enhanced event cards
- **Mobile Access:** Standard responsive access
- **Impact:** Changes optimize event browsing for desktop

#### Groups.tsx - Desktop-Enhanced Groups
- **File:** `src/pages/Groups.tsx`
- **Behavior:** Forces desktop layout with context
- **Key Logic:** `<Layout useDesktopLayout={true} layoutType="two-panel">`
- **Desktop Features:** Context panels, advanced search/filtering
- **Mobile Access:** Standard responsive access
- **Impact:** Changes enhance group management on desktop

### 🌐 SHARED COMPONENTS
*Same behavior across all platforms*

#### Auth.tsx - Universal Authentication
- **File:** `src/pages/Auth.tsx`
- **Behavior:** Identical form layout on all devices
- **Responsive:** Uses standard responsive padding classes
- **Impact:** Changes affect login/signup experience universally

#### Profile.tsx - Responsive Profile Management
- **File:** `src/pages/Profile.tsx`
- **Behavior:** Standard responsive form layout
- **Responsive:** Uses responsive grid classes
- **Impact:** Changes affect user profile management on all devices

#### Community.tsx - Simple Responsive Grid
- **File:** `src/pages/Community.tsx`
- **Behavior:** Basic responsive card layout
- **Responsive:** Standard Tailwind responsive classes
- **Impact:** Changes affect community page across all screen sizes

#### Administrator.tsx - Responsive Admin Panel
- **File:** `src/pages/Administrator.tsx`
- **Behavior:** Standard responsive grid layout
- **Responsive:** Uses responsive classes throughout
- **Impact:** Changes affect admin functionality on all devices

### 💬 FULLSCREEN CHAT COMPONENTS
*Consistent fullscreen behavior across platforms*

#### ClubTalk.tsx - Fullscreen Chat
- **File:** `src/pages/ClubTalk.tsx`
- **Behavior:** Fullscreen chat interface, identical on all sizes
- **Key Logic:** Uses `fullscreen` layout mode
- **Impact:** Changes affect club chat experience universally

#### EventChat.tsx - Event-Specific Chat
- **File:** `src/pages/EventChat.tsx`
- **Behavior:** Fullscreen with responsive header
- **Mobile Header:** Condensed event info
- **Desktop Header:** Full event details
- **Impact:** Changes affect event chat with responsive header context

#### GroupChat.tsx - Group Chat Interface
- **File:** `src/pages/GroupChat.tsx`
- **Behavior:** Fullscreen chat interface
- **Key Logic:** Uses shared `group-chat.tsx` component
- **Impact:** Changes affect group-specific chat experience

#### group-chat.tsx - Shared Chat Component
- **File:** `src/components/group-chat.tsx`
- **Behavior:** Reusable fullscreen chat component
- **Usage:** Used by GroupChat, EventChat, and Community chat
- **Impact:** Changes affect all chat interfaces using this component

## 🛠️ DUAL ARCHITECTURE DEVELOPMENT GUIDELINES

### Making Changes to Desktop-Only Components
```bash
# Only affects users on ≥768px screens
1. Update component map: npm run ui:update-map
2. Locate in CLAUDE_UI_MAP.md
3. Make changes considering desktop UI patterns
4. Test on desktop browser (≥768px window)
```

### Making Changes to Mobile-Only Components  
```bash
# Only affects users on <768px screens
1. Update component map: npm run ui:update-map
2. Locate in CLAUDE_UI_MAP.md
3. Make changes considering mobile UI constraints
4. Test on mobile browser (<768px window)
```

### Making Changes to Responsive Components
```bash
# Affects ALL users - test both experiences!
1. Update component map: npm run ui:update-map
2. Locate in CLAUDE_UI_MAP.md
3. Consider desktop AND mobile implications
4. Use responsive utility classes appropriately
5. Test on BOTH desktop (≥768px) AND mobile (<768px)
```

### Making Changes to Layout-Controlled Components
```bash
# Changes may affect layout behavior
1. Update component map: npm run ui:update-map
2. Check parent layout configuration (useDesktopLayout prop)
3. Consider panel layout implications
4. Test in appropriate layout context
```

## 🎯 COMPONENT TARGETING STRATEGY

### For Navigation Changes:
- **Desktop navigation:** Edit `DesktopSidebar.tsx`
- **Mobile navigation:** Edit `NavBar.tsx` mobile menu section
- **Universal navigation:** Edit shared navigation data/logic

### For Layout Changes:
- **Desktop layout:** Edit `MultiPanelLayout.tsx` or layout-controlled pages
- **Mobile layout:** Edit `Layout.tsx` MobileLayout function
- **Layout switching:** Edit `Layout.tsx` responsive logic

### For Page Experience Changes:
- **Desktop-specific pages:** Edit `Dashboard.tsx`, layout-controlled pages
- **Mobile-specific experience:** Edit `Home.tsx` mobile view
- **Universal pages:** Edit shared components like `Auth.tsx`, `Profile.tsx`

### For Chat Interface Changes:
- **All chats:** Edit `group-chat.tsx` shared component
- **Specific chat headers:** Edit individual chat page files
- **Chat navigation:** Consider both DesktopSidebar and NavBar

## 🔍 QUICK REFERENCE FOR COMMON TASKS

| Task | Component(s) | Screen Impact | Testing Required |
|------|-------------|---------------|------------------|
| Add sidebar menu item | `DesktopSidebar.tsx` | Desktop only | Desktop ≥768px |
| Add mobile menu item | `NavBar.tsx` | Mobile only | Mobile <768px |
| Change home experience | `Home.tsx` | Both (different) | Both desktop & mobile |
| Modify dashboard | `Dashboard.tsx` | Desktop only | Desktop ≥768px |
| Update chat interface | `group-chat.tsx` | Both (same) | Both desktop & mobile |
| Change page layout | `Layout.tsx` | Both (different) | Both desktop & mobile |
| Add responsive component | Various | Both | Both desktop & mobile |

## 🚨 CRITICAL DEVELOPMENT REMINDERS

1. **Always check component category** before making changes
2. **Test appropriate screen sizes** based on component impact
3. **Use responsive utilities** from `/src/utils/responsive.ts`
4. **Consider layout context** for layout-controlled components
5. **Update this map** when adding new responsive components
6. **Request user testing** for changes affecting multiple breakpoints

---

*This dual architecture map should be updated whenever new responsive components are added or existing component behavior is significantly changed.*