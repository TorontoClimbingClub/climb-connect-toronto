# CLAUDE UI MAP - SELF-UPDATING
*Auto-generated component mapping for precise UI editing*

## 🚨 MANDATORY UPDATE CHECK
**BEFORE USING THIS MAP:** Always run the update command to ensure accuracy!

```bash
# UPDATE this map before making any UI changes:
npm run ui:update-map
# OR manually:
node /mnt/ssd/Projects/claude/tools/ui-editor/enhanced-map-generator.cjs .
```

## ⚠️ STALE MAP WARNING
**This map may be outdated:** Source files have been modified since last MAP generation
**Action Required:** Run `npm run ui:update-map` before proceeding

**Last Updated:** 2025-07-09T04:19:03.446Z
**Project:** climb-connect-toronto
**Components Scanned:** 81
**Total Files:** 81
**Latest File Modified:** Wed Jul 09 2025 00:17:46 GMT-0400 (Eastern Daylight Time)

## 📋 UI EDITING PROTOCOL (WSL Environment)
1. **UPDATE MAP:** Run `npm run ui:update-map` (essential!)
2. **LOCATE COMPONENT:** Find target component below
3. **NOTE FILE:LINE:** Use exact file path and line number
4. **MAKE EDIT:** Modify component with precision
5. **REQUEST USER TESTING:** Ask user to run `npm run dev` in Windows
6. **PROVIDE TEST INSTRUCTIONS:** Specific features to test
7. **AWAIT CONFIRMATION:** Wait for user verification
8. **UPDATE MAP:** Re-run `npm run ui:update-map` after major changes

### ⚠️ WSL ENVIRONMENT CONSTRAINT
**Claude operates in WSL and CANNOT:**
- ❌ Run `npm run dev` (Windows application)
- ❌ Access `localhost:5173` or Windows localhost addresses
- ❌ See browser output or Windows GUI applications

**Therefore, after UI changes, Claude MUST request user testing in Windows.**

## 🗺️ COMPONENT HIERARCHY

### 📁 src/components/

#### navigate
**File:** `src/components/GlobalSearch.tsx`
**Lines:** 235
**Last Modified:** 2025-07-08T23:36:51.137Z

**Key Elements:**
- **SearchResult** (line 26) - `searchresult`
  - Context: `const [results, setResults] = useState<SearchResult[]>([]);`
- **Calendar** (line 131) - `calendar`
  - Context: `return <Calendar className="h-4 w-4 text-orange-600" />;`
- **Users** (line 133) - `users`
  - Context: `return <Users className="h-4 w-4 text-blue-600" />;`
- **MessageSquare** (line 135) - `messagesquare`
  - Context: `return <MessageSquare className="h-4 w-4 text-green-600" />;`
- **Search** (line 137) - `search`
  - Context: `return <Search className="h-4 w-4 text-gray-600" />;`
- **Dialog** (line 155) - `dialog`
  - Context: `<Dialog open={isOpen} onOpenChange={onClose}>`
- **DialogContent** (line 156) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[600px]">`
- **DialogHeader** (line 157) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 158) - `dialogtitle`
  - Context: `<DialogTitle className="flex items-center gap-2">`
- **Search** (line 159) - `search`
  - Context: `<Search className="h-5 w-5" />`
- **Search** (line 166) - `search`
  - Context: `<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 te...`
- **Input** (line 167) - `input`
  - Context: `<Input`
- **Search** (line 185) - `search`
  - Context: `<Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />`
- **Badge** (line 212) - `badge`
  - Context: `<Badge variant="secondary" className={`text-xs ${getResultBadgeColor(result.type...`
- **ArrowRight** (line 215) - `arrowright`
  - Context: `<ArrowRight className="h-3 w-3 text-gray-400" />`

#### ProtectedRoute
**File:** `src/components/ProtectedRoute.tsx`
**Lines:** 32
**Last Modified:** 2025-07-08T18:09:39.483Z

**Key Elements:**
- **Skeleton** (line 18) - `skeleton`
  - Context: `<Skeleton className="h-8 w-64" />`
- **Skeleton** (line 19) - `skeleton`
  - Context: `<Skeleton className="h-64 w-full" />`
- **Skeleton** (line 20) - `skeleton`
  - Context: `<Skeleton className="h-32 w-full" />`
- **Navigate** (line 27) - `navigate`
  - Context: `return <Navigate to="/auth" replace />;`

#### navigate
**File:** `src/components/group-chat.tsx`
**Lines:** 659
**Last Modified:** 2025-07-09T03:50:22.602Z

**Key Elements:**
- **GroupMessage** (line 40) - `groupmessage`
  - Context: `const [messages, setMessages] = useState<GroupMessage[]>([]);`
- **Set** (line 51) - `set`
  - Context: `const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set())...`
- **HTMLDivElement** (line 52) - `htmldivelement`
  - Context: `const viewportRef = useRef<HTMLDivElement>(null);`
- **Button** (line 415) - `button`
  - Context: `<Button`
- **ArrowLeft** (line 421) - `arrowleft`
  - Context: `<ArrowLeft className="h-5 w-5" />`
- **Input** (line 430) - `input`
  - Context: `<Input`
- **Button** (line 437) - `button`
  - Context: `<Button`
- **X** (line 449) - `x`
  - Context: `{showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}`
- **Search** (line 449) - `search`
  - Context: `{showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}`
- **Avatar** (line 494) - `avatar`
  - Context: `<Avatar className="h-8 w-8 flex-shrink-0">`
- **AvatarImage** (line 495) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 496) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **EventMessageButton** (line 532) - `eventmessagebutton`
  - Context: `<EventMessageButton`
- **BelayGroupMessageButton** (line 537) - `belaygroupmessagebutton`
  - Context: `<BelayGroupMessageButton`
- **Button** (line 572) - `button`
  - Context: `<Button`
- **Trash2** (line 578) - `trash2`
  - Context: `<Trash2 className="h-4 w-4" />`
- **ChatActionsMenu** (line 584) - `chatactionsmenu`
  - Context: `<ChatActionsMenu`
- **Input** (line 595) - `input`
  - Context: `<Input`
- **EmojiPickerComponent** (line 609) - `emojipickercomponent`
  - Context: `<EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />`
- **Button** (line 612) - `button`
  - Context: `<Button`
- **Send** (line 617) - `send`
  - Context: `<Send className="h-4 w-4" />`
- **CreateEventModal** (line 622) - `createeventmodal`
  - Context: `<CreateEventModal`
- **CreateBelayGroupModal** (line 631) - `createbelaygroupmodal`
  - Context: `<CreateBelayGroupModal`
- **Dialog** (line 639) - `dialog`
  - Context: `<Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>`
- **DialogContent** (line 640) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 641) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 642) - `dialogtitle`
  - Context: `<DialogTitle>Leave Group</DialogTitle>`
- **DialogDescription** (line 643) - `dialogdescription`
  - Context: `<DialogDescription>`
- **DialogFooter** (line 647) - `dialogfooter`
  - Context: `<DialogFooter>`
- **Button** (line 648) - `button`
  - Context: `<Button variant="outline" onClick={cancelLeave}>`
- **Button** (line 651) - `button`
  - Context: `<Button variant="destructive" onClick={confirmLeave}>`

### 📁 src/components/cards/

#### EventCard
**File:** `src/components/cards/EventCard.tsx`
**Lines:** 145
**Last Modified:** 2025-07-09T03:56:04.574Z

**Key Elements:**
- **CalendarDays** (line 44) - `calendardays`
  - Context: `<CalendarDays className="h-4 w-4" />`
- **MapPin** (line 48) - `mappin`
  - Context: `<MapPin className="h-4 w-4 flex-shrink-0" />`
- **Users** (line 52) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Loader2** (line 74) - `loader2`
  - Context: `<Loader2 className="h-4 w-4 mr-2 animate-spin inline" />`
- **Card** (line 90) - `card`
  - Context: `<Card className={`cursor-pointer transition-colors ${`
- **CardHeader** (line 95) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 97) - `cardtitle`
  - Context: `<CardTitle className="text-lg">{event.title}</CardTitle>`
- **CardDescription** (line 99) - `carddescription`
  - Context: `<CardDescription>{event.description}</CardDescription>`
- **CardContent** (line 101) - `cardcontent`
  - Context: `<CardContent className="space-y-4">`
- **CalendarDays** (line 104) - `calendardays`
  - Context: `<CalendarDays className="h-4 w-4 mr-2" />`
- **MapPin** (line 108) - `mappin`
  - Context: `<MapPin className="h-4 w-4 mr-2" />`
- **Users** (line 115) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Loader2** (line 132) - `loader2`
  - Context: `<Loader2 className="h-4 w-4 mr-2 animate-spin inline" />`

#### GroupCard
**File:** `src/components/cards/GroupCard.tsx`
**Lines:** 127
**Last Modified:** 2025-07-09T04:17:17.000Z

**Key Elements:**
- **Avatar** (line 39) - `avatar`
  - Context: `<Avatar className="h-10 w-10 flex-shrink-0">`
- **AvatarImage** (line 40) - `avatarimage`
  - Context: `<AvatarImage src={group.avatar_url} alt={group.name} />`
- **AvatarFallback** (line 41) - `avatarfallback`
  - Context: `<AvatarFallback>{group.name.charAt(0).toUpperCase()}</AvatarFallback>`
- **Users** (line 47) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Loader2** (line 65) - `loader2`
  - Context: `<Loader2 className="h-4 w-4 mr-2 animate-spin inline" />`
- **Card** (line 79) - `card`
  - Context: `<Card className={`cursor-pointer transition-colors ${`
- **CardHeader** (line 84) - `cardheader`
  - Context: `<CardHeader>`
- **Avatar** (line 86) - `avatar`
  - Context: `<Avatar className="h-12 w-12">`
- **AvatarImage** (line 87) - `avatarimage`
  - Context: `<AvatarImage src={group.avatar_url} alt={group.name} />`
- **AvatarFallback** (line 88) - `avatarfallback`
  - Context: `<AvatarFallback>{group.name.charAt(0).toUpperCase()}</AvatarFallback>`
- **CardTitle** (line 92) - `cardtitle`
  - Context: `<CardTitle className="text-lg">{group.name}</CardTitle>`
- **CardDescription** (line 94) - `carddescription`
  - Context: `<CardDescription>{group.description}</CardDescription>`
- **CardContent** (line 98) - `cardcontent`
  - Context: `<CardContent className="space-y-4">`
- **Users** (line 101) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Loader2** (line 116) - `loader2`
  - Context: `<Loader2 className="h-4 w-4 mr-2 animate-spin inline" />`

### 📁 src/components/chat/

#### ChatActionsMenu
**File:** `src/components/chat/ChatActionsMenu.tsx`
**Lines:** 72
**Last Modified:** 2025-07-09T03:48:01.145Z

**Key Elements:**
- **ChatActionsMenuProps** (line 23) - `chatactionsmenuprops`
  - Context: `export const ChatActionsMenu: React.FC<ChatActionsMenuProps> = ({`
- **DropdownMenu** (line 35) - `dropdownmenu`
  - Context: `<DropdownMenu>`
- **DropdownMenuTrigger** (line 36) - `dropdownmenutrigger`
  - Context: `<DropdownMenuTrigger asChild>`
- **Button** (line 37) - `button`
  - Context: `<Button`
- **Plus** (line 43) - `plus`
  - Context: `<Plus className="h-4 w-4" />`
- **DropdownMenuContent** (line 46) - `dropdownmenucontent`
  - Context: `<DropdownMenuContent align="start" side="top" className="w-48">`
- **DropdownMenuItem** (line 48) - `dropdownmenuitem`
  - Context: `<DropdownMenuItem onClick={onFindPartners}>`
- **Users** (line 49) - `users`
  - Context: `<Users className="mr-2 h-4 w-4" />`
- **DropdownMenuItem** (line 53) - `dropdownmenuitem`
  - Context: `<DropdownMenuItem onClick={onCreateEvent}>`
- **Calendar** (line 54) - `calendar`
  - Context: `<Calendar className="mr-2 h-4 w-4" />`
- **DropdownMenuItem** (line 58) - `dropdownmenuitem`
  - Context: `<DropdownMenuItem onClick={onDeleteMessages} className="text-red-600 focus:text-...`
- **Trash2** (line 59) - `trash2`
  - Context: `<Trash2 className="mr-2 h-4 w-4" />`
- **DropdownMenuItem** (line 64) - `dropdownmenuitem`
  - Context: `<DropdownMenuItem onClick={onLeave} className="text-red-600 focus:text-red-600">`
- **LogOut** (line 65) - `logout`
  - Context: `<LogOut className="mr-2 h-4 w-4" />`

#### CreateBelayGroupModal
**File:** `src/components/chat/CreateBelayGroupModal.tsx`
**Lines:** 292
**Last Modified:** 2025-07-09T03:48:38.872Z

**Key Elements:**
- **CreateBelayGroupModalProps** (line 36) - `createbelaygroupmodalprops`
  - Context: `export const CreateBelayGroupModal: React.FC<CreateBelayGroupModalProps> = ({`
- **ClimbingType** (line 44) - `climbingtype`
  - Context: `const [climbingType, setClimbingType] = useState<ClimbingType>('mixed');`
- **Dialog** (line 158) - `dialog`
  - Context: `<Dialog open={open} onOpenChange={onClose}>`
- **DialogContent** (line 159) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">`
- **DialogHeader** (line 160) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 161) - `dialogtitle`
  - Context: `<DialogTitle className="flex items-center gap-2">`
- **Users** (line 162) - `users`
  - Context: `<Users className="h-5 w-5" />`
- **DialogDescription** (line 165) - `dialogdescription`
  - Context: `<DialogDescription>`
- **Label** (line 171) - `label`
  - Context: `<Label htmlFor="climbingType" className="flex items-center gap-2">`
- **Select** (line 174) - `select`
  - Context: `<Select value={climbingType} onValueChange={(value) => setClimbingType(value as ...`
- **SelectTrigger** (line 175) - `selecttrigger`
  - Context: `<SelectTrigger>`
- **SelectValue** (line 176) - `selectvalue`
  - Context: `<SelectValue />`
- **SelectContent** (line 178) - `selectcontent`
  - Context: `<SelectContent>`
- **SelectItem** (line 180) - `selectitem`
  - Context: `<SelectItem key={key} value={key}>`
- **Label** (line 192) - `label`
  - Context: `<Label htmlFor="name">Session Name</Label>`
- **Input** (line 193) - `input`
  - Context: `<Input`
- **Label** (line 203) - `label`
  - Context: `<Label htmlFor="description">Description (optional)</Label>`
- **Textarea** (line 204) - `textarea`
  - Context: `<Textarea`
- **Label** (line 214) - `label`
  - Context: `<Label htmlFor="location" className="flex items-center gap-2">`
- **MapPin** (line 215) - `mappin`
  - Context: `<MapPin className="h-4 w-4" />`
- **Input** (line 218) - `input`
  - Context: `<Input`
- **Label** (line 228) - `label`
  - Context: `<Label htmlFor="sessionDate" className="flex items-center gap-2">`
- **Clock** (line 229) - `clock`
  - Context: `<Clock className="h-4 w-4" />`
- **Input** (line 232) - `input`
  - Context: `<Input`
- **Label** (line 243) - `label`
  - Context: `<Label htmlFor="capacity" className="flex items-center gap-2">`
- **Users** (line 244) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Select** (line 247) - `select`
  - Context: `<Select value={capacity} onValueChange={setCapacity}>`
- **SelectTrigger** (line 248) - `selecttrigger`
  - Context: `<SelectTrigger>`
- **SelectValue** (line 249) - `selectvalue`
  - Context: `<SelectValue />`
- **SelectContent** (line 251) - `selectcontent`
  - Context: `<SelectContent>`
- **SelectItem** (line 253) - `selectitem`
  - Context: `<SelectItem key={size} value={size.toString()}>`
- **Lock** (line 263) - `lock`
  - Context: `{isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}`
- **Globe** (line 263) - `globe`
  - Context: `{isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}`
- **Label** (line 265) - `label`
  - Context: `<Label className="text-sm font-medium">`
- **Switch** (line 276) - `switch`
  - Context: `<Switch checked={isPrivate} onCheckedChange={setIsPrivate} />`
- **DialogFooter** (line 279) - `dialogfooter`
  - Context: `<DialogFooter>`
- **Button** (line 280) - `button`
  - Context: `<Button type="button" variant="outline" onClick={onClose}>`
- **Button** (line 283) - `button`
  - Context: `<Button type="submit" disabled={isCreating}>`
- **Loader2** (line 284) - `loader2`
  - Context: `{isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}`

#### CreateEventModal
**File:** `src/components/chat/CreateEventModal.tsx`
**Lines:** 235
**Last Modified:** 2025-07-09T03:03:00.936Z

**Key Elements:**
- **CreateEventModalProps** (line 28) - `createeventmodalprops`
  - Context: `export const CreateEventModal: React.FC<CreateEventModalProps> = ({`
- **Dialog** (line 153) - `dialog`
  - Context: `<Dialog open={open} onOpenChange={onClose}>`
- **DialogContent** (line 154) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 155) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 156) - `dialogtitle`
  - Context: `<DialogTitle className="flex items-center gap-2">`
- **Calendar** (line 157) - `calendar`
  - Context: `<Calendar className="h-5 w-5" />`
- **DialogDescription** (line 160) - `dialogdescription`
  - Context: `<DialogDescription>`
- **Label** (line 166) - `label`
  - Context: `<Label htmlFor="title">Event Title</Label>`
- **Input** (line 167) - `input`
  - Context: `<Input`
- **Label** (line 176) - `label`
  - Context: `<Label htmlFor="description">Description</Label>`
- **Textarea** (line 177) - `textarea`
  - Context: `<Textarea`
- **Label** (line 186) - `label`
  - Context: `<Label htmlFor="location" className="flex items-center gap-2">`
- **MapPin** (line 187) - `mappin`
  - Context: `<MapPin className="h-4 w-4" />`
- **Input** (line 190) - `input`
  - Context: `<Input`
- **Label** (line 199) - `label`
  - Context: `<Label htmlFor="eventDate">Date & Time</Label>`
- **Input** (line 200) - `input`
  - Context: `<Input`
- **Label** (line 209) - `label`
  - Context: `<Label htmlFor="maxParticipants" className="flex items-center gap-2">`
- **Users** (line 210) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Input** (line 213) - `input`
  - Context: `<Input`
- **DialogFooter** (line 222) - `dialogfooter`
  - Context: `<DialogFooter>`
- **Button** (line 223) - `button`
  - Context: `<Button type="button" variant="outline" onClick={onClose}>`
- **Button** (line 226) - `button`
  - Context: `<Button type="submit" disabled={isCreating}>`
- **Loader2** (line 227) - `loader2`
  - Context: `{isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}`

### 📁 src/components/dashboard/

#### formatTimeAgo
**File:** `src/components/dashboard/ActiveChats.tsx`
**Lines:** 132
**Last Modified:** 2025-07-09T02:09:47.952Z

**Key Elements:**
- **Card** (line 40) - `card`
  - Context: `<Card>`
- **CardHeader** (line 41) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 42) - `cardtitle`
  - Context: `<CardTitle>Recent Community Activity</CardTitle>`
- **CardContent** (line 44) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 68) - `card`
  - Context: `<Card>`
- **CardHeader** (line 69) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 70) - `cardtitle`
  - Context: `<CardTitle>Recent Community Activity</CardTitle>`
- **CardContent** (line 72) - `cardcontent`
  - Context: `<CardContent>`
- **Link** (line 78) - `link`
  - Context: `<Link`
- **Icon** (line 85) - `icon`
  - Context: `<Icon className="h-5 w-5 text-green-600" />`
- **MessageSquare** (line 91) - `messagesquare`
  - Context: `<MessageSquare className="h-3 w-3 mr-1" />`
- **Badge** (line 106) - `badge`
  - Context: `<Badge variant="secondary" className="text-xs capitalize">`
- **ArrowRight** (line 109) - `arrowright`
  - Context: `<ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />`
- **MessageSquare** (line 116) - `messagesquare`
  - Context: `<MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />`
- **Button** (line 119) - `button`
  - Context: `<Button variant="outline" size="sm" asChild>`
- **Link** (line 120) - `link`
  - Context: `<Link to="/club-talk">Start Club Discussion</Link>`
- **Button** (line 122) - `button`
  - Context: `<Button variant="outline" size="sm" asChild>`
- **Link** (line 123) - `link`
  - Context: `<Link to="/events">Join Event Chat</Link>`

#### StatsGrid
**File:** `src/components/dashboard/StatsGrid.tsx`
**Lines:** 85
**Last Modified:** 2025-07-09T02:09:47.957Z

**Key Elements:**
- **Card** (line 15) - `card`
  - Context: `<Card key={i} className="desktop-card-hover animate-pulse">`
- **CardHeader** (line 16) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardContent** (line 20) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 32) - `card`
  - Context: `<Card className="desktop-card-hover">`
- **CardHeader** (line 33) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 34) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Total Events</CardTitle>`
- **Calendar** (line 35) - `calendar`
  - Context: `<Calendar className="h-4 w-4 text-muted-foreground" />`
- **CardContent** (line 37) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 45) - `card`
  - Context: `<Card className="desktop-card-hover">`
- **CardHeader** (line 46) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 47) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Active Groups</CardTitle>`
- **Users** (line 48) - `users`
  - Context: `<Users className="h-4 w-4 text-muted-foreground" />`
- **CardContent** (line 50) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 58) - `card`
  - Context: `<Card className="desktop-card-hover">`
- **CardHeader** (line 59) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 60) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Messages</CardTitle>`
- **MessageSquare** (line 61) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4 text-muted-foreground" />`
- **CardContent** (line 63) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 71) - `card`
  - Context: `<Card className="desktop-card-hover">`
- **CardHeader** (line 72) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 73) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Community Members</CardTitle>`
- **TrendingUp** (line 74) - `trendingup`
  - Context: `<TrendingUp className="h-4 w-4 text-muted-foreground" />`
- **CardContent** (line 76) - `cardcontent`
  - Context: `<CardContent>`

#### formatDate
**File:** `src/components/dashboard/UpcomingEvents.tsx`
**Lines:** 147
**Last Modified:** 2025-07-09T02:09:47.961Z

**Key Elements:**
- **Card** (line 38) - `card`
  - Context: `<Card>`
- **CardHeader** (line 39) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between">`
- **CardTitle** (line 41) - `cardtitle`
  - Context: `<CardTitle>Upcoming Events</CardTitle>`
- **CardContent** (line 45) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 64) - `card`
  - Context: `<Card>`
- **CardHeader** (line 65) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between">`
- **CardTitle** (line 67) - `cardtitle`
  - Context: `<CardTitle>Upcoming Events</CardTitle>`
- **Select** (line 69) - `select`
  - Context: `<Select value={eventFilter} onValueChange={onFilterChange}>`
- **SelectTrigger** (line 70) - `selecttrigger`
  - Context: `<SelectTrigger className="w-32">`
- **SelectValue** (line 71) - `selectvalue`
  - Context: `<SelectValue />`
- **SelectContent** (line 73) - `selectcontent`
  - Context: `<SelectContent>`
- **SelectItem** (line 74) - `selectitem`
  - Context: `<SelectItem value="all">All</SelectItem>`
- **SelectItem** (line 75) - `selectitem`
  - Context: `<SelectItem value="joined">Joined</SelectItem>`
- **CardContent** (line 79) - `cardcontent`
  - Context: `<CardContent>`
- **Link** (line 89) - `link`
  - Context: `<Link`
- **Calendar** (line 99) - `calendar`
  - Context: `<Calendar className="h-8 w-8 text-green-600" />`
- **Clock** (line 105) - `clock`
  - Context: `<Clock className="h-3 w-3 mr-1" />`
- **MapPin** (line 109) - `mappin`
  - Context: `<MapPin className="h-3 w-3 mr-1 flex-shrink-0" />`
- **Users** (line 113) - `users`
  - Context: `<Users className="h-3 w-3 mr-1" />`
- **ArrowRight** (line 121) - `arrowright`
  - Context: `<ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />`
- **Calendar** (line 126) - `calendar`
  - Context: `<Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />`
- **Button** (line 133) - `button`
  - Context: `<Button variant="outline" size="sm" className="mt-2" asChild>`
- **Link** (line 134) - `link`
  - Context: `<Link to="/events">`

### 📁 src/components/layout/

#### location
**File:** `src/components/layout/DesktopSidebar.tsx`
**Lines:** 129
**Last Modified:** 2025-07-09T03:53:00.077Z

**Key Elements:**
- **Record** (line 28) - `record`
  - Context: `const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});`
- **Mountain** (line 78) - `mountain`
  - Context: `<Mountain className="h-6 w-6 text-green-600" />`
- **Link** (line 83) - `link`
  - Context: `<Link to="/profile" className="flex items-center space-x-3 p-3 rounded-lg bg-gre...`
- **Avatar** (line 84) - `avatar`
  - Context: `<Avatar className="h-12 w-12">`
- **AvatarImage** (line 85) - `avatarimage`
  - Context: `<AvatarImage src={userProfile?.avatar_url} />`
- **AvatarFallback** (line 86) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Link** (line 102) - `link`
  - Context: `<Link`
- **Icon** (line 112) - `icon`
  - Context: `<Icon className="h-5 w-5" />`
- **Badge** (line 116) - `badge`
  - Context: `<Badge variant="destructive" className="h-5 text-xs">`

#### MobileLayout
**File:** `src/components/layout/Layout.tsx`
**Lines:** 63
**Last Modified:** 2025-07-09T02:09:47.975Z

**Key Elements:**
- **NavBar** (line 27) - `navbar`
  - Context: `<NavBar />`
- **MultiPanelLayout** (line 46) - `multipanellayout`
  - Context: `<MultiPanelLayout`
- **DesktopLayout** (line 59) - `desktoplayout`
  - Context: `{shouldUseDesktopLayout ? <DesktopLayout /> : <MobileLayout />}`
- **MobileLayout** (line 59) - `mobilelayout`
  - Context: `{shouldUseDesktopLayout ? <DesktopLayout /> : <MobileLayout />}`

#### getLayoutClass
**File:** `src/components/layout/MultiPanelLayout.tsx`
**Lines:** 185
**Last Modified:** 2025-07-08T22:41:09.283Z

**Key Elements:**
- **DesktopSidebar** (line 55) - `desktopsidebar`
  - Context: `<DesktopSidebar />`
- **ContextPanel** (line 78) - `contextpanel`
  - Context: `<ContextPanel title="Participants">`
- **ContextPanel** (line 120) - `contextpanel`
  - Context: `<ContextPanel title="Event Details">`
- **ContextPanel** (line 172) - `contextpanel`
  - Context: `<ContextPanel title="Recent Activity">`

#### location
**File:** `src/components/layout/NavBar.tsx`
**Lines:** 145
**Last Modified:** 2025-07-09T03:53:22.004Z

**Key Elements:**
- **Link** (line 32) - `link`
  - Context: `<Link to="/" className="flex items-center space-x-2">`
- **Mountain** (line 33) - `mountain`
  - Context: `<Mountain className="h-8 w-8 text-green-600" />`
- **Link** (line 48) - `link`
  - Context: `<Link`
- **Icon** (line 57) - `icon`
  - Context: `<Icon className="h-4 w-4" />`
- **Link** (line 64) - `link`
  - Context: `<Link to="/profile">`
- **Avatar** (line 65) - `avatar`
  - Context: `<Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-green-300 tran...`
- **AvatarImage** (line 66) - `avatarimage`
  - Context: `<AvatarImage src={user?.user_metadata?.avatar_url} />`
- **AvatarFallback** (line 67) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Button** (line 72) - `button`
  - Context: `<Button variant="ghost" size="sm" onClick={signOut}>`
- **LogOut** (line 73) - `logout`
  - Context: `<LogOut className="h-4 w-4" />`
- **Sheet** (line 80) - `sheet`
  - Context: `<Sheet open={isOpen} onOpenChange={setIsOpen}>`
- **SheetTrigger** (line 81) - `sheettrigger`
  - Context: `<SheetTrigger asChild>`
- **Button** (line 82) - `button`
  - Context: `<Button variant="ghost" size="sm">`
- **Menu** (line 83) - `menu`
  - Context: `<Menu className="h-6 w-6" />`
- **SheetContent** (line 86) - `sheetcontent`
  - Context: `<SheetContent side="right" className="w-64">`
- **Link** (line 88) - `link`
  - Context: `<Link`
- **Avatar** (line 93) - `avatar`
  - Context: `<Avatar className="h-10 w-10">`
- **AvatarImage** (line 94) - `avatarimage`
  - Context: `<AvatarImage src={user?.user_metadata?.avatar_url} />`
- **AvatarFallback** (line 95) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Link** (line 109) - `link`
  - Context: `<Link`
- **Icon** (line 119) - `icon`
  - Context: `<Icon className="h-5 w-5" />`
- **Button** (line 125) - `button`
  - Context: `<Button`
- **LogOut** (line 133) - `logout`
  - Context: `<LogOut className="h-5 w-5 mr-3" />`

### 📁 src/components/ui/

#### accordion
**File:** `src/components/ui/accordion.tsx`
**Lines:** 57
**Last Modified:** 2025-07-08T18:09:39.491Z

**Key Elements:**
- **AccordionPrimitive** (line 13) - `accordionprimitive`
  - Context: `<AccordionPrimitive.Item`
- **AccordionPrimitive** (line 25) - `accordionprimitive`
  - Context: `<AccordionPrimitive.Header className="flex">`
- **AccordionPrimitive** (line 26) - `accordionprimitive`
  - Context: `<AccordionPrimitive.Trigger`
- **ChevronDown** (line 35) - `chevrondown`
  - Context: `<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />`
- **AccordionPrimitive** (line 45) - `accordionprimitive`
  - Context: `<AccordionPrimitive.Content`

#### alert-dialog
**File:** `src/components/ui/alert-dialog.tsx`
**Lines:** 140
**Last Modified:** 2025-07-08T18:09:39.501Z

**Key Elements:**
- **AlertDialogPrimitive** (line 17) - `alertdialogprimitive`
  - Context: `<AlertDialogPrimitive.Overlay`
- **AlertDialogPortal** (line 32) - `alertdialogportal`
  - Context: `<AlertDialogPortal>`
- **AlertDialogOverlay** (line 33) - `alertdialogoverlay`
  - Context: `<AlertDialogOverlay />`
- **AlertDialogPrimitive** (line 34) - `alertdialogprimitive`
  - Context: `<AlertDialogPrimitive.Content`
- **HTMLDivElement** (line 49) - `htmldivelement`
  - Context: `}: React.HTMLAttributes<HTMLDivElement>) => (`
- **HTMLDivElement** (line 63) - `htmldivelement`
  - Context: `}: React.HTMLAttributes<HTMLDivElement>) => (`
- **AlertDialogPrimitive** (line 78) - `alertdialogprimitive`
  - Context: `<AlertDialogPrimitive.Title`
- **AlertDialogPrimitive** (line 90) - `alertdialogprimitive`
  - Context: `<AlertDialogPrimitive.Description`
- **AlertDialogPrimitive** (line 103) - `alertdialogprimitive`
  - Context: `<AlertDialogPrimitive.Action`
- **AlertDialogPrimitive** (line 115) - `alertdialogprimitive`
  - Context: `<AlertDialogPrimitive.Cancel`

#### alert
**File:** `src/components/ui/alert.tsx`
**Lines:** 60
**Last Modified:** 2025-07-08T18:09:39.509Z

**Key Elements:**
- **HTMLDivElement** (line 24) - `htmldivelement`
  - Context: `React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>`
- **HTMLHeadingElement** (line 37) - `htmlheadingelement`
  - Context: `React.HTMLAttributes<HTMLHeadingElement>`
- **HTMLParagraphElement** (line 49) - `htmlparagraphelement`
  - Context: `React.HTMLAttributes<HTMLParagraphElement>`

#### aspect-ratio
**File:** `src/components/ui/aspect-ratio.tsx`
**Lines:** 6
**Last Modified:** 2025-07-08T18:09:39.515Z

#### avatar
**File:** `src/components/ui/avatar.tsx`
**Lines:** 49
**Last Modified:** 2025-07-08T18:09:39.523Z

**Key Elements:**
- **AvatarPrimitive** (line 10) - `avatarprimitive`
  - Context: `<AvatarPrimitive.Root`
- **AvatarPrimitive** (line 25) - `avatarprimitive`
  - Context: `<AvatarPrimitive.Image`
- **AvatarPrimitive** (line 37) - `avatarprimitive`
  - Context: `<AvatarPrimitive.Fallback`

#### badge
**File:** `src/components/ui/badge.tsx`
**Lines:** 37
**Last Modified:** 2025-07-08T18:09:39.531Z

**Key Elements:**
- **HTMLDivElement** (line 27) - `htmldivelement`
  - Context: `extends React.HTMLAttributes<HTMLDivElement>,`

#### BelayGroupMessageButton
**File:** `src/components/ui/belay-group-message-button.tsx`
**Lines:** 264
**Last Modified:** 2025-07-09T03:49:15.522Z

**Key Elements:**
- **BelayGroupMessageButtonProps** (line 24) - `belaygroupmessagebuttonprops`
  - Context: `export const BelayGroupMessageButton: React.FC<BelayGroupMessageButtonProps> = (...`
- **BelayGroup** (line 28) - `belaygroup`
  - Context: `const [belayGroup, setBelayGroup] = useState<BelayGroup | null>(null);`
- **Card** (line 144) - `card`
  - Context: `<Card className="w-full max-w-md mx-auto">`
- **CardContent** (line 145) - `cardcontent`
  - Context: `<CardContent className="p-4">`
- **Loader2** (line 147) - `loader2`
  - Context: `<Loader2 className="h-4 w-4 animate-spin" />`
- **Card** (line 157) - `card`
  - Context: `<Card className="w-full max-w-md mx-auto border-red-200">`
- **CardContent** (line 158) - `cardcontent`
  - Context: `<CardContent className="p-4">`
- **Card** (line 170) - `card`
  - Context: `<Card className={`w-full max-w-md mx-auto transition-all hover:shadow-md ${`
- **CardContent** (line 173) - `cardcontent`
  - Context: `<CardContent className="p-4 space-y-3">`
- **Lock** (line 184) - `lock`
  - Context: `{belayGroup.privacy === 'private' ? <Lock className="h-3 w-3" /> : <Globe classN...`
- **Globe** (line 184) - `globe`
  - Context: `{belayGroup.privacy === 'private' ? <Lock className="h-3 w-3" /> : <Globe classN...`
- **Badge** (line 185) - `badge`
  - Context: `<Badge variant={belayGroup.status === 'full' ? 'destructive' : 'default'} classN...`
- **MapPin** (line 194) - `mappin`
  - Context: `<MapPin className="h-3 w-3" />`
- **Clock** (line 198) - `clock`
  - Context: `<Clock className="h-3 w-3" />`
- **Badge** (line 201) - `badge`
  - Context: `<Badge variant="outline" className="text-xs">`
- **Button** (line 217) - `button`
  - Context: `<Button`
- **UserCheck** (line 222) - `usercheck`
  - Context: `<UserCheck className="h-3 w-3 mr-1" />`
- **Button** (line 225) - `button`
  - Context: `<Button size="sm" variant="outline" onClick={handleNavigateToGroups}>`
- **Button** (line 231) - `button`
  - Context: `<Button`
- **Loader2** (line 237) - `loader2`
  - Context: `{isJoining && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}`
- **Users** (line 238) - `users`
  - Context: `<Users className="h-3 w-3 mr-1" />`
- **Button** (line 241) - `button`
  - Context: `<Button size="sm" variant="outline" onClick={handleNavigateToGroups}>`
- **Button** (line 247) - `button`
  - Context: `<Button size="sm" variant="outline" onClick={handleNavigateToGroups} className="...`

#### breadcrumb
**File:** `src/components/ui/breadcrumb.tsx`
**Lines:** 116
**Last Modified:** 2025-07-08T18:09:39.539Z

**Key Elements:**
- **Comp** (line 51) - `comp`
  - Context: `<Comp`
- **ChevronRight** (line 86) - `chevronright`
  - Context: `{children ?? <ChevronRight />}`
- **MoreHorizontal** (line 101) - `morehorizontal`
  - Context: `<MoreHorizontal className="h-4 w-4" />`

#### button
**File:** `src/components/ui/button.tsx`
**Lines:** 57
**Last Modified:** 2025-07-08T18:09:39.546Z

**Key Elements:**
- **HTMLButtonElement** (line 37) - `htmlbuttonelement`
  - Context: `extends React.ButtonHTMLAttributes<HTMLButtonElement>,`
- **HTMLButtonElement** (line 42) - `htmlbuttonelement`
  - Context: `const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(`
- **Comp** (line 46) - `comp`
  - Context: `<Comp`

#### calendar
**File:** `src/components/ui/calendar.tsx`
**Lines:** 65
**Last Modified:** 2025-07-08T18:09:39.555Z

**Key Elements:**
- **DayPicker** (line 17) - `daypicker`
  - Context: `<DayPicker`
- **ChevronLeft** (line 55) - `chevronleft`
  - Context: `IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,`
- **ChevronRight** (line 56) - `chevronright`
  - Context: `IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,`

#### card
**File:** `src/components/ui/card.tsx`
**Lines:** 80
**Last Modified:** 2025-07-08T18:09:39.562Z

**Key Elements:**
- **HTMLDivElement** (line 7) - `htmldivelement`
  - Context: `React.HTMLAttributes<HTMLDivElement>`
- **HTMLDivElement** (line 22) - `htmldivelement`
  - Context: `React.HTMLAttributes<HTMLDivElement>`
- **HTMLHeadingElement** (line 34) - `htmlheadingelement`
  - Context: `React.HTMLAttributes<HTMLHeadingElement>`
- **HTMLParagraphElement** (line 49) - `htmlparagraphelement`
  - Context: `React.HTMLAttributes<HTMLParagraphElement>`
- **HTMLDivElement** (line 61) - `htmldivelement`
  - Context: `React.HTMLAttributes<HTMLDivElement>`
- **HTMLDivElement** (line 69) - `htmldivelement`
  - Context: `React.HTMLAttributes<HTMLDivElement>`

#### onSelect
**File:** `src/components/ui/carousel.tsx`
**Lines:** 261
**Last Modified:** 2025-07-08T18:09:39.573Z

**Key Elements:**
- **CarouselContextProps** (line 31) - `carouselcontextprops`
  - Context: `const CarouselContext = React.createContext<CarouselContextProps | null>(null)`
- **Carousel** (line 37) - `carousel`
  - Context: `throw new Error("useCarousel must be used within a <Carousel />")`
- **HTMLDivElement** (line 45) - `htmldivelement`
  - Context: `React.HTMLAttributes<HTMLDivElement> & CarouselProps`
- **HTMLDivElement** (line 87) - `htmldivelement`
  - Context: `(event: React.KeyboardEvent<HTMLDivElement>) => {`
- **CarouselContext** (line 122) - `carouselcontext`
  - Context: `<CarouselContext.Provider`
- **HTMLDivElement** (line 153) - `htmldivelement`
  - Context: `React.HTMLAttributes<HTMLDivElement>`
- **HTMLDivElement** (line 175) - `htmldivelement`
  - Context: `React.HTMLAttributes<HTMLDivElement>`
- **Button** (line 202) - `button`
  - Context: `<Button`
- **ArrowLeft** (line 217) - `arrowleft`
  - Context: `<ArrowLeft className="h-4 w-4" />`
- **Button** (line 231) - `button`
  - Context: `<Button`
- **ArrowRight** (line 246) - `arrowright`
  - Context: `<ArrowRight className="h-4 w-4" />`

#### uniqueId
**File:** `src/components/ui/chart.tsx`
**Lines:** 364
**Last Modified:** 2025-07-08T18:09:39.584Z

**Key Elements:**
- **ChartContextProps** (line 23) - `chartcontextprops`
  - Context: `const ChartContext = React.createContext<ChartContextProps | null>(null)`
- **ChartContainer** (line 29) - `chartcontainer`
  - Context: `throw new Error("useChart must be used within a <ChartContainer />")`
- **ChartContext** (line 48) - `chartcontext`
  - Context: `<ChartContext.Provider value={{ config }}>`
- **ChartStyle** (line 58) - `chartstyle`
  - Context: `<ChartStyle id={chartId} config={config} />`
- **RechartsPrimitive** (line 59) - `rechartsprimitive`
  - Context: `<RechartsPrimitive.ResponsiveContainer>`
- **RechartsPrimitive** (line 262) - `rechartsprimitive`
  - Context: `Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {`

#### checkbox
**File:** `src/components/ui/checkbox.tsx`
**Lines:** 29
**Last Modified:** 2025-07-08T18:09:39.592Z

**Key Elements:**
- **CheckboxPrimitive** (line 11) - `checkboxprimitive`
  - Context: `<CheckboxPrimitive.Root`
- **CheckboxPrimitive** (line 19) - `checkboxprimitive`
  - Context: `<CheckboxPrimitive.Indicator`
- **Check** (line 22) - `check`
  - Context: `<Check className="h-4 w-4" />`

#### collapsible
**File:** `src/components/ui/collapsible.tsx`
**Lines:** 10
**Last Modified:** 2025-07-08T18:09:39.598Z

#### CommandDialog
**File:** `src/components/ui/command.tsx`
**Lines:** 154
**Last Modified:** 2025-07-08T18:09:39.607Z

**Key Elements:**
- **CommandPrimitive** (line 13) - `commandprimitive`
  - Context: `<CommandPrimitive`
- **Dialog** (line 28) - `dialog`
  - Context: `<Dialog {...props}>`
- **DialogContent** (line 29) - `dialogcontent`
  - Context: `<DialogContent className="overflow-hidden p-0 shadow-lg">`
- **Command** (line 30) - `command`
  - Context: `<Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-...`
- **Search** (line 43) - `search`
  - Context: `<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />`
- **CommandPrimitive** (line 44) - `commandprimitive`
  - Context: `<CommandPrimitive.Input`
- **CommandPrimitive** (line 61) - `commandprimitive`
  - Context: `<CommandPrimitive.List`
- **CommandPrimitive** (line 74) - `commandprimitive`
  - Context: `<CommandPrimitive.Empty`
- **CommandPrimitive** (line 87) - `commandprimitive`
  - Context: `<CommandPrimitive.Group`
- **CommandPrimitive** (line 103) - `commandprimitive`
  - Context: `<CommandPrimitive.Separator`
- **CommandPrimitive** (line 115) - `commandprimitive`
  - Context: `<CommandPrimitive.Item`
- **HTMLSpanElement** (line 130) - `htmlspanelement`
  - Context: `}: React.HTMLAttributes<HTMLSpanElement>) => {`

#### context-menu
**File:** `src/components/ui/context-menu.tsx`
**Lines:** 199
**Last Modified:** 2025-07-08T18:09:39.617Z

**Key Elements:**
- **ContextMenuPrimitive** (line 25) - `contextmenuprimitive`
  - Context: `<ContextMenuPrimitive.SubTrigger`
- **ChevronRight** (line 35) - `chevronright`
  - Context: `<ChevronRight className="ml-auto h-4 w-4" />`
- **ContextMenuPrimitive** (line 44) - `contextmenuprimitive`
  - Context: `<ContextMenuPrimitive.SubContent`
- **ContextMenuPrimitive** (line 59) - `contextmenuprimitive`
  - Context: `<ContextMenuPrimitive.Portal>`
- **ContextMenuPrimitive** (line 60) - `contextmenuprimitive`
  - Context: `<ContextMenuPrimitive.Content`
- **ContextMenuPrimitive** (line 78) - `contextmenuprimitive`
  - Context: `<ContextMenuPrimitive.Item`
- **ContextMenuPrimitive** (line 94) - `contextmenuprimitive`
  - Context: `<ContextMenuPrimitive.CheckboxItem`
- **ContextMenuPrimitive** (line 104) - `contextmenuprimitive`
  - Context: `<ContextMenuPrimitive.ItemIndicator>`
- **Check** (line 105) - `check`
  - Context: `<Check className="h-4 w-4" />`
- **ContextMenuPrimitive** (line 118) - `contextmenuprimitive`
  - Context: `<ContextMenuPrimitive.RadioItem`
- **ContextMenuPrimitive** (line 127) - `contextmenuprimitive`
  - Context: `<ContextMenuPrimitive.ItemIndicator>`
- **Circle** (line 128) - `circle`
  - Context: `<Circle className="h-2 w-2 fill-current" />`
- **ContextMenuPrimitive** (line 142) - `contextmenuprimitive`
  - Context: `<ContextMenuPrimitive.Label`
- **ContextMenuPrimitive** (line 158) - `contextmenuprimitive`
  - Context: `<ContextMenuPrimitive.Separator`
- **HTMLSpanElement** (line 169) - `htmlspanelement`
  - Context: `}: React.HTMLAttributes<HTMLSpanElement>) => {`

#### dialog
**File:** `src/components/ui/dialog.tsx`
**Lines:** 121
**Last Modified:** 2025-07-08T18:09:39.628Z

**Key Elements:**
- **DialogPrimitive** (line 19) - `dialogprimitive`
  - Context: `<DialogPrimitive.Overlay`
- **DialogPortal** (line 34) - `dialogportal`
  - Context: `<DialogPortal>`
- **DialogOverlay** (line 35) - `dialogoverlay`
  - Context: `<DialogOverlay />`
- **DialogPrimitive** (line 36) - `dialogprimitive`
  - Context: `<DialogPrimitive.Content`
- **DialogPrimitive** (line 45) - `dialogprimitive`
  - Context: `<DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 r...`
- **X** (line 46) - `x`
  - Context: `<X className="h-4 w-4" />`
- **HTMLDivElement** (line 57) - `htmldivelement`
  - Context: `}: React.HTMLAttributes<HTMLDivElement>) => (`
- **HTMLDivElement** (line 71) - `htmldivelement`
  - Context: `}: React.HTMLAttributes<HTMLDivElement>) => (`
- **DialogPrimitive** (line 86) - `dialogprimitive`
  - Context: `<DialogPrimitive.Title`
- **DialogPrimitive** (line 101) - `dialogprimitive`
  - Context: `<DialogPrimitive.Description`

#### drawer
**File:** `src/components/ui/drawer.tsx`
**Lines:** 117
**Last Modified:** 2025-07-08T18:09:39.636Z

**Key Elements:**
- **DrawerPrimitive** (line 10) - `drawerprimitive`
  - Context: `<DrawerPrimitive.Root`
- **DrawerPrimitive** (line 27) - `drawerprimitive`
  - Context: `<DrawerPrimitive.Overlay`
- **DrawerPortal** (line 39) - `drawerportal`
  - Context: `<DrawerPortal>`
- **DrawerOverlay** (line 40) - `draweroverlay`
  - Context: `<DrawerOverlay />`
- **DrawerPrimitive** (line 41) - `drawerprimitive`
  - Context: `<DrawerPrimitive.Content`
- **HTMLDivElement** (line 59) - `htmldivelement`
  - Context: `}: React.HTMLAttributes<HTMLDivElement>) => (`
- **HTMLDivElement** (line 70) - `htmldivelement`
  - Context: `}: React.HTMLAttributes<HTMLDivElement>) => (`
- **DrawerPrimitive** (line 82) - `drawerprimitive`
  - Context: `<DrawerPrimitive.Title`
- **DrawerPrimitive** (line 97) - `drawerprimitive`
  - Context: `<DrawerPrimitive.Description`

#### dropdown-menu
**File:** `src/components/ui/dropdown-menu.tsx`
**Lines:** 199
**Last Modified:** 2025-07-08T18:09:39.646Z

**Key Elements:**
- **DropdownMenuPrimitive** (line 25) - `dropdownmenuprimitive`
  - Context: `<DropdownMenuPrimitive.SubTrigger`
- **ChevronRight** (line 35) - `chevronright`
  - Context: `<ChevronRight className="ml-auto h-4 w-4" />`
- **DropdownMenuPrimitive** (line 45) - `dropdownmenuprimitive`
  - Context: `<DropdownMenuPrimitive.SubContent`
- **DropdownMenuPrimitive** (line 61) - `dropdownmenuprimitive`
  - Context: `<DropdownMenuPrimitive.Portal>`
- **DropdownMenuPrimitive** (line 62) - `dropdownmenuprimitive`
  - Context: `<DropdownMenuPrimitive.Content`
- **DropdownMenuPrimitive** (line 81) - `dropdownmenuprimitive`
  - Context: `<DropdownMenuPrimitive.Item`
- **DropdownMenuPrimitive** (line 97) - `dropdownmenuprimitive`
  - Context: `<DropdownMenuPrimitive.CheckboxItem`
- **DropdownMenuPrimitive** (line 107) - `dropdownmenuprimitive`
  - Context: `<DropdownMenuPrimitive.ItemIndicator>`
- **Check** (line 108) - `check`
  - Context: `<Check className="h-4 w-4" />`
- **DropdownMenuPrimitive** (line 121) - `dropdownmenuprimitive`
  - Context: `<DropdownMenuPrimitive.RadioItem`
- **DropdownMenuPrimitive** (line 130) - `dropdownmenuprimitive`
  - Context: `<DropdownMenuPrimitive.ItemIndicator>`
- **Circle** (line 131) - `circle`
  - Context: `<Circle className="h-2 w-2 fill-current" />`
- **DropdownMenuPrimitive** (line 145) - `dropdownmenuprimitive`
  - Context: `<DropdownMenuPrimitive.Label`
- **DropdownMenuPrimitive** (line 161) - `dropdownmenuprimitive`
  - Context: `<DropdownMenuPrimitive.Separator`
- **HTMLSpanElement** (line 172) - `htmlspanelement`
  - Context: `}: React.HTMLAttributes<HTMLSpanElement>) => {`

#### handleEmojiClick
**File:** `src/components/ui/emoji-picker.tsx`
**Lines:** 50
**Last Modified:** 2025-07-08T18:44:59.527Z

**Key Elements:**
- **Popover** (line 21) - `popover`
  - Context: `<Popover open={isOpen} onOpenChange={setIsOpen}>`
- **PopoverTrigger** (line 22) - `popovertrigger`
  - Context: `<PopoverTrigger asChild>`
- **Button** (line 23) - `button`
  - Context: `<Button`
- **Smile** (line 29) - `smile`
  - Context: `<Smile className="h-4 w-4" />`
- **PopoverContent** (line 32) - `popovercontent`
  - Context: `<PopoverContent`
- **EmojiPicker** (line 37) - `emojipicker`
  - Context: `<EmojiPicker`

#### EventMessageButton
**File:** `src/components/ui/event-message-button.tsx`
**Lines:** 85
**Last Modified:** 2025-07-09T03:04:37.238Z

**Key Elements:**
- **EventMessageButtonProps** (line 13) - `eventmessagebuttonprops`
  - Context: `export const EventMessageButton: React.FC<EventMessageButtonProps> = ({`
- **Card** (line 27) - `card`
  - Context: `<Card`
- **Calendar** (line 38) - `calendar`
  - Context: `<Calendar className={`h-5 w-5 ${`
- **ArrowRight** (line 47) - `arrowright`
  - Context: `<ArrowRight className={`h-4 w-4 ${`
- **Button** (line 65) - `button`
  - Context: `<Button`
- **Calendar** (line 78) - `calendar`
  - Context: `<Calendar className="h-4 w-4 mr-2" />`

#### useFormField
**File:** `src/components/ui/form.tsx`
**Lines:** 177
**Last Modified:** 2025-07-08T18:09:39.654Z

**Key Elements:**
- **TFieldValues** (line 20) - `tfieldvalues`
  - Context: `TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>`
- **TFieldValues** (line 20) - `tfieldvalues`
  - Context: `TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>`
- **FormFieldContextValue** (line 25) - `formfieldcontextvalue`
  - Context: `const FormFieldContext = React.createContext<FormFieldContextValue>(`
- **TFieldValues** (line 31) - `tfieldvalues`
  - Context: `TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>`
- **TFieldValues** (line 31) - `tfieldvalues`
  - Context: `TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>`
- **TFieldValues** (line 34) - `tfieldvalues`
  - Context: `}: ControllerProps<TFieldValues, TName>) => {`
- **FormFieldContext** (line 36) - `formfieldcontext`
  - Context: `<FormFieldContext.Provider value={{ name: props.name }}>`
- **Controller** (line 37) - `controller`
  - Context: `<Controller {...props} />`
- **FormField** (line 50) - `formfield`
  - Context: `throw new Error("useFormField should be used within <FormField>")`
- **FormItemContextValue** (line 69) - `formitemcontextvalue`
  - Context: `const FormItemContext = React.createContext<FormItemContextValue>(`
- **HTMLDivElement** (line 75) - `htmldivelement`
  - Context: `React.HTMLAttributes<HTMLDivElement>`
- **FormItemContext** (line 80) - `formitemcontext`
  - Context: `<FormItemContext.Provider value={{ id }}>`
- **Label** (line 94) - `label`
  - Context: `<Label`
- **Slot** (line 111) - `slot`
  - Context: `<Slot`
- **HTMLParagraphElement** (line 128) - `htmlparagraphelement`
  - Context: `React.HTMLAttributes<HTMLParagraphElement>`
- **HTMLParagraphElement** (line 145) - `htmlparagraphelement`
  - Context: `React.HTMLAttributes<HTMLParagraphElement>`

#### hover-card
**File:** `src/components/ui/hover-card.tsx`
**Lines:** 28
**Last Modified:** 2025-07-08T18:09:39.661Z

**Key Elements:**
- **HoverCardPrimitive** (line 14) - `hovercardprimitive`
  - Context: `<HoverCardPrimitive.Content`

#### input-otp
**File:** `src/components/ui/input-otp.tsx`
**Lines:** 70
**Last Modified:** 2025-07-08T18:09:39.668Z

**Key Elements:**
- **OTPInput** (line 11) - `otpinput`
  - Context: `<OTPInput`
- **Dot** (line 64) - `dot`
  - Context: `<Dot />`

#### Input
**File:** `src/components/ui/input.tsx`
**Lines:** 23
**Last Modified:** 2025-07-08T18:09:39.675Z

**Key Elements:**
- **HTMLInputElement** (line 5) - `htmlinputelement`
  - Context: `const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(`

#### label
**File:** `src/components/ui/label.tsx`
**Lines:** 25
**Last Modified:** 2025-07-08T18:09:39.682Z

**Key Elements:**
- **LabelPrimitive** (line 16) - `labelprimitive`
  - Context: `<LabelPrimitive.Root`

#### menubar
**File:** `src/components/ui/menubar.tsx`
**Lines:** 235
**Last Modified:** 2025-07-08T18:09:39.696Z

**Key Elements:**
- **MenubarPrimitive** (line 21) - `menubarprimitive`
  - Context: `<MenubarPrimitive.Root`
- **MenubarPrimitive** (line 36) - `menubarprimitive`
  - Context: `<MenubarPrimitive.Trigger`
- **MenubarPrimitive** (line 53) - `menubarprimitive`
  - Context: `<MenubarPrimitive.SubTrigger`
- **ChevronRight** (line 63) - `chevronright`
  - Context: `<ChevronRight className="ml-auto h-4 w-4" />`
- **MenubarPrimitive** (line 72) - `menubarprimitive`
  - Context: `<MenubarPrimitive.SubContent`
- **MenubarPrimitive** (line 91) - `menubarprimitive`
  - Context: `<MenubarPrimitive.Portal>`
- **MenubarPrimitive** (line 92) - `menubarprimitive`
  - Context: `<MenubarPrimitive.Content`
- **MenubarPrimitive** (line 114) - `menubarprimitive`
  - Context: `<MenubarPrimitive.Item`
- **MenubarPrimitive** (line 130) - `menubarprimitive`
  - Context: `<MenubarPrimitive.CheckboxItem`
- **MenubarPrimitive** (line 140) - `menubarprimitive`
  - Context: `<MenubarPrimitive.ItemIndicator>`
- **Check** (line 141) - `check`
  - Context: `<Check className="h-4 w-4" />`
- **MenubarPrimitive** (line 153) - `menubarprimitive`
  - Context: `<MenubarPrimitive.RadioItem`
- **MenubarPrimitive** (line 162) - `menubarprimitive`
  - Context: `<MenubarPrimitive.ItemIndicator>`
- **Circle** (line 163) - `circle`
  - Context: `<Circle className="h-2 w-2 fill-current" />`
- **MenubarPrimitive** (line 177) - `menubarprimitive`
  - Context: `<MenubarPrimitive.Label`
- **MenubarPrimitive** (line 193) - `menubarprimitive`
  - Context: `<MenubarPrimitive.Separator`
- **HTMLSpanElement** (line 204) - `htmlspanelement`
  - Context: `}: React.HTMLAttributes<HTMLSpanElement>) => {`

#### navigation-menu
**File:** `src/components/ui/navigation-menu.tsx`
**Lines:** 129
**Last Modified:** 2025-07-08T18:09:39.706Z

**Key Elements:**
- **NavigationMenuPrimitive** (line 12) - `navigationmenuprimitive`
  - Context: `<NavigationMenuPrimitive.Root`
- **NavigationMenuViewport** (line 21) - `navigationmenuviewport`
  - Context: `<NavigationMenuViewport />`
- **NavigationMenuPrimitive** (line 30) - `navigationmenuprimitive`
  - Context: `<NavigationMenuPrimitive.List`
- **NavigationMenuPrimitive** (line 51) - `navigationmenuprimitive`
  - Context: `<NavigationMenuPrimitive.Trigger`
- **ChevronDown** (line 57) - `chevrondown`
  - Context: `<ChevronDown`
- **NavigationMenuPrimitive** (line 69) - `navigationmenuprimitive`
  - Context: `<NavigationMenuPrimitive.Content`
- **NavigationMenuPrimitive** (line 87) - `navigationmenuprimitive`
  - Context: `<NavigationMenuPrimitive.Viewport`
- **NavigationMenuPrimitive** (line 104) - `navigationmenuprimitive`
  - Context: `<NavigationMenuPrimitive.Indicator`

#### Pagination
**File:** `src/components/ui/pagination.tsx`
**Lines:** 118
**Last Modified:** 2025-07-08T18:09:39.715Z

**Key Elements:**
- **ButtonProps** (line 39) - `buttonprops`
  - Context: `} & Pick<ButtonProps, "size"> &`
- **PaginationLink** (line 66) - `paginationlink`
  - Context: `<PaginationLink`
- **ChevronLeft** (line 72) - `chevronleft`
  - Context: `<ChevronLeft className="h-4 w-4" />`
- **PaginationLink** (line 82) - `paginationlink`
  - Context: `<PaginationLink`
- **ChevronRight** (line 89) - `chevronright`
  - Context: `<ChevronRight className="h-4 w-4" />`
- **MoreHorizontal** (line 103) - `morehorizontal`
  - Context: `<MoreHorizontal className="h-4 w-4" />`

#### popover
**File:** `src/components/ui/popover.tsx`
**Lines:** 30
**Last Modified:** 2025-07-08T18:09:39.722Z

**Key Elements:**
- **PopoverPrimitive** (line 14) - `popoverprimitive`
  - Context: `<PopoverPrimitive.Portal>`
- **PopoverPrimitive** (line 15) - `popoverprimitive`
  - Context: `<PopoverPrimitive.Content`

#### progress
**File:** `src/components/ui/progress.tsx`
**Lines:** 27
**Last Modified:** 2025-07-08T18:09:39.730Z

**Key Elements:**
- **ProgressPrimitive** (line 10) - `progressprimitive`
  - Context: `<ProgressPrimitive.Root`
- **ProgressPrimitive** (line 18) - `progressprimitive`
  - Context: `<ProgressPrimitive.Indicator`

#### radio-group
**File:** `src/components/ui/radio-group.tsx`
**Lines:** 43
**Last Modified:** 2025-07-08T18:09:39.737Z

**Key Elements:**
- **RadioGroupPrimitive** (line 12) - `radiogroupprimitive`
  - Context: `<RadioGroupPrimitive.Root`
- **RadioGroupPrimitive** (line 26) - `radiogroupprimitive`
  - Context: `<RadioGroupPrimitive.Item`
- **RadioGroupPrimitive** (line 34) - `radiogroupprimitive`
  - Context: `<RadioGroupPrimitive.Indicator className="flex items-center justify-center">`
- **Circle** (line 35) - `circle`
  - Context: `<Circle className="h-2.5 w-2.5 fill-current text-current" />`

#### resizable
**File:** `src/components/ui/resizable.tsx`
**Lines:** 44
**Last Modified:** 2025-07-08T18:09:39.745Z

**Key Elements:**
- **ResizablePrimitive** (line 10) - `resizableprimitive`
  - Context: `<ResizablePrimitive.PanelGroup`
- **ResizablePrimitive** (line 28) - `resizableprimitive`
  - Context: `<ResizablePrimitive.PanelResizeHandle`
- **GripVertical** (line 37) - `gripvertical`
  - Context: `<GripVertical className="h-2.5 w-2.5" />`

#### scroll-area
**File:** `src/components/ui/scroll-area.tsx`
**Lines:** 47
**Last Modified:** 2025-07-08T18:09:39.753Z

**Key Elements:**
- **ScrollAreaPrimitive** (line 10) - `scrollareaprimitive`
  - Context: `<ScrollAreaPrimitive.Root`
- **ScrollAreaPrimitive** (line 15) - `scrollareaprimitive`
  - Context: `<ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">`
- **ScrollBar** (line 18) - `scrollbar`
  - Context: `<ScrollBar />`
- **ScrollAreaPrimitive** (line 19) - `scrollareaprimitive`
  - Context: `<ScrollAreaPrimitive.Corner />`
- **ScrollAreaPrimitive** (line 28) - `scrollareaprimitive`
  - Context: `<ScrollAreaPrimitive.ScrollAreaScrollbar`
- **ScrollAreaPrimitive** (line 41) - `scrollareaprimitive`
  - Context: `<ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-...`

#### select
**File:** `src/components/ui/select.tsx`
**Lines:** 159
**Last Modified:** 2025-07-08T18:09:39.762Z

**Key Elements:**
- **SelectPrimitive** (line 17) - `selectprimitive`
  - Context: `<SelectPrimitive.Trigger`
- **SelectPrimitive** (line 26) - `selectprimitive`
  - Context: `<SelectPrimitive.Icon asChild>`
- **ChevronDown** (line 27) - `chevrondown`
  - Context: `<ChevronDown className="h-4 w-4 opacity-50" />`
- **SelectPrimitive** (line 37) - `selectprimitive`
  - Context: `<SelectPrimitive.ScrollUpButton`
- **ChevronUp** (line 45) - `chevronup`
  - Context: `<ChevronUp className="h-4 w-4" />`
- **SelectPrimitive** (line 54) - `selectprimitive`
  - Context: `<SelectPrimitive.ScrollDownButton`
- **ChevronDown** (line 62) - `chevrondown`
  - Context: `<ChevronDown className="h-4 w-4" />`
- **SelectPrimitive** (line 72) - `selectprimitive`
  - Context: `<SelectPrimitive.Portal>`
- **SelectPrimitive** (line 73) - `selectprimitive`
  - Context: `<SelectPrimitive.Content`
- **SelectScrollUpButton** (line 84) - `selectscrollupbutton`
  - Context: `<SelectScrollUpButton />`
- **SelectPrimitive** (line 85) - `selectprimitive`
  - Context: `<SelectPrimitive.Viewport`
- **SelectScrollDownButton** (line 94) - `selectscrolldownbutton`
  - Context: `<SelectScrollDownButton />`
- **SelectPrimitive** (line 104) - `selectprimitive`
  - Context: `<SelectPrimitive.Label`
- **SelectPrimitive** (line 116) - `selectprimitive`
  - Context: `<SelectPrimitive.Item`
- **SelectPrimitive** (line 125) - `selectprimitive`
  - Context: `<SelectPrimitive.ItemIndicator>`
- **Check** (line 126) - `check`
  - Context: `<Check className="h-4 w-4" />`
- **SelectPrimitive** (line 130) - `selectprimitive`
  - Context: `<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>`
- **SelectPrimitive** (line 139) - `selectprimitive`
  - Context: `<SelectPrimitive.Separator`

#### separator
**File:** `src/components/ui/separator.tsx`
**Lines:** 30
**Last Modified:** 2025-07-08T18:09:39.769Z

**Key Elements:**
- **SeparatorPrimitive** (line 14) - `separatorprimitive`
  - Context: `<SeparatorPrimitive.Root`

#### sheet
**File:** `src/components/ui/sheet.tsx`
**Lines:** 132
**Last Modified:** 2025-07-08T18:09:39.779Z

**Key Elements:**
- **SheetPrimitive** (line 20) - `sheetprimitive`
  - Context: `<SheetPrimitive.Overlay`
- **SheetPortal** (line 58) - `sheetportal`
  - Context: `<SheetPortal>`
- **SheetOverlay** (line 59) - `sheetoverlay`
  - Context: `<SheetOverlay />`
- **SheetPrimitive** (line 60) - `sheetprimitive`
  - Context: `<SheetPrimitive.Content`
- **SheetPrimitive** (line 66) - `sheetprimitive`
  - Context: `<SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ri...`
- **X** (line 67) - `x`
  - Context: `<X className="h-4 w-4" />`
- **HTMLDivElement** (line 78) - `htmldivelement`
  - Context: `}: React.HTMLAttributes<HTMLDivElement>) => (`
- **HTMLDivElement** (line 92) - `htmldivelement`
  - Context: `}: React.HTMLAttributes<HTMLDivElement>) => (`
- **SheetPrimitive** (line 107) - `sheetprimitive`
  - Context: `<SheetPrimitive.Title`
- **SheetPrimitive** (line 119) - `sheetprimitive`
  - Context: `<SheetPrimitive.Description`

#### isMobile
**File:** `src/components/ui/sidebar.tsx`
**Lines:** 762
**Last Modified:** 2025-07-08T18:09:39.798Z

**Key Elements:**
- **SidebarContext** (line 37) - `sidebarcontext`
  - Context: `const SidebarContext = React.createContext<SidebarContext | null>(null)`
- **SidebarContext** (line 117) - `sidebarcontext`
  - Context: `const contextValue = React.useMemo<SidebarContext>(`
- **SidebarContext** (line 131) - `sidebarcontext`
  - Context: `<SidebarContext.Provider value={contextValue}>`
- **TooltipProvider** (line 132) - `tooltipprovider`
  - Context: `<TooltipProvider delayDuration={0}>`
- **Sheet** (line 195) - `sheet`
  - Context: `<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>`
- **SheetContent** (line 196) - `sheetcontent`
  - Context: `<SheetContent`
- **Button** (line 267) - `button`
  - Context: `<Button`
- **PanelLeft** (line 279) - `panelleft`
  - Context: `<PanelLeft />`
- **Input** (line 338) - `input`
  - Context: `<Input`
- **Separator** (line 386) - `separator`
  - Context: `<Separator`
- **Comp** (line 436) - `comp`
  - Context: `<Comp`
- **Comp** (line 457) - `comp`
  - Context: `<Comp`
- **Comp** (line 558) - `comp`
  - Context: `<Comp`
- **Tooltip** (line 579) - `tooltip`
  - Context: `<Tooltip>`
- **TooltipTrigger** (line 580) - `tooltiptrigger`
  - Context: `<TooltipTrigger asChild>{button}</TooltipTrigger>`
- **TooltipContent** (line 581) - `tooltipcontent`
  - Context: `<TooltipContent`
- **Comp** (line 603) - `comp`
  - Context: `<Comp`
- **Skeleton** (line 664) - `skeleton`
  - Context: `<Skeleton`
- **Skeleton** (line 669) - `skeleton`
  - Context: `<Skeleton`
- **Comp** (line 717) - `comp`
  - Context: `<Comp`

#### skeleton
**File:** `src/components/ui/skeleton.tsx`
**Lines:** 16
**Last Modified:** 2025-07-08T18:09:39.805Z

**Key Elements:**
- **HTMLDivElement** (line 6) - `htmldivelement`
  - Context: `}: React.HTMLAttributes<HTMLDivElement>) {`

#### slider
**File:** `src/components/ui/slider.tsx`
**Lines:** 27
**Last Modified:** 2025-07-08T18:09:39.813Z

**Key Elements:**
- **SliderPrimitive** (line 10) - `sliderprimitive`
  - Context: `<SliderPrimitive.Root`
- **SliderPrimitive** (line 18) - `sliderprimitive`
  - Context: `<SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden round...`
- **SliderPrimitive** (line 19) - `sliderprimitive`
  - Context: `<SliderPrimitive.Range className="absolute h-full bg-primary" />`
- **SliderPrimitive** (line 21) - `sliderprimitive`
  - Context: `<SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-pri...`

#### Toaster
**File:** `src/components/ui/sonner.tsx`
**Lines:** 30
**Last Modified:** 2025-07-08T18:09:39.821Z

**Key Elements:**
- **Sonner** (line 10) - `sonner`
  - Context: `<Sonner`

#### switch
**File:** `src/components/ui/switch.tsx`
**Lines:** 28
**Last Modified:** 2025-07-08T18:09:39.828Z

**Key Elements:**
- **SwitchPrimitives** (line 10) - `switchprimitives`
  - Context: `<SwitchPrimitives.Root`
- **SwitchPrimitives** (line 18) - `switchprimitives`
  - Context: `<SwitchPrimitives.Thumb`

#### table
**File:** `src/components/ui/table.tsx`
**Lines:** 118
**Last Modified:** 2025-07-08T18:09:39.836Z

**Key Elements:**
- **HTMLTableElement** (line 7) - `htmltableelement`
  - Context: `React.HTMLAttributes<HTMLTableElement>`
- **HTMLTableSectionElement** (line 21) - `htmltablesectionelement`
  - Context: `React.HTMLAttributes<HTMLTableSectionElement>`
- **HTMLTableSectionElement** (line 29) - `htmltablesectionelement`
  - Context: `React.HTMLAttributes<HTMLTableSectionElement>`
- **HTMLTableSectionElement** (line 41) - `htmltablesectionelement`
  - Context: `React.HTMLAttributes<HTMLTableSectionElement>`
- **HTMLTableRowElement** (line 56) - `htmltablerowelement`
  - Context: `React.HTMLAttributes<HTMLTableRowElement>`
- **HTMLTableCellElement** (line 71) - `htmltablecellelement`
  - Context: `React.ThHTMLAttributes<HTMLTableCellElement>`
- **HTMLTableCellElement** (line 86) - `htmltablecellelement`
  - Context: `React.TdHTMLAttributes<HTMLTableCellElement>`
- **HTMLTableCaptionElement** (line 98) - `htmltablecaptionelement`
  - Context: `React.HTMLAttributes<HTMLTableCaptionElement>`

#### tabs
**File:** `src/components/ui/tabs.tsx`
**Lines:** 54
**Last Modified:** 2025-07-08T18:09:39.843Z

**Key Elements:**
- **TabsPrimitive** (line 12) - `tabsprimitive`
  - Context: `<TabsPrimitive.List`
- **TabsPrimitive** (line 27) - `tabsprimitive`
  - Context: `<TabsPrimitive.Trigger`
- **TabsPrimitive** (line 42) - `tabsprimitive`
  - Context: `<TabsPrimitive.Content`

#### textarea
**File:** `src/components/ui/textarea.tsx`
**Lines:** 25
**Last Modified:** 2025-07-08T18:09:39.851Z

**Key Elements:**
- **HTMLTextAreaElement** (line 6) - `htmltextareaelement`
  - Context: `extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}`
- **HTMLTextAreaElement** (line 8) - `htmltextareaelement`
  - Context: `const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(`

#### toast
**File:** `src/components/ui/toast.tsx`
**Lines:** 128
**Last Modified:** 2025-07-08T18:09:39.860Z

**Key Elements:**
- **ToastPrimitives** (line 14) - `toastprimitives`
  - Context: `<ToastPrimitives.Viewport`
- **ToastPrimitives** (line 47) - `toastprimitives`
  - Context: `<ToastPrimitives.Root`
- **ToastPrimitives** (line 60) - `toastprimitives`
  - Context: `<ToastPrimitives.Action`
- **ToastPrimitives** (line 75) - `toastprimitives`
  - Context: `<ToastPrimitives.Close`
- **X** (line 84) - `x`
  - Context: `<X className="h-4 w-4" />`
- **ToastPrimitives** (line 93) - `toastprimitives`
  - Context: `<ToastPrimitives.Title`
- **ToastPrimitives** (line 105) - `toastprimitives`
  - Context: `<ToastPrimitives.Description`

#### toaster
**File:** `src/components/ui/toaster.tsx`
**Lines:** 34
**Last Modified:** 2025-07-08T18:09:39.867Z

**Key Elements:**
- **ToastProvider** (line 15) - `toastprovider`
  - Context: `<ToastProvider duration={1500}>`
- **Toast** (line 18) - `toast`
  - Context: `<Toast key={id} {...props}>`
- **ToastTitle** (line 20) - `toasttitle`
  - Context: `{title && <ToastTitle>{title}</ToastTitle>}`
- **ToastDescription** (line 22) - `toastdescription`
  - Context: `<ToastDescription>{description}</ToastDescription>`
- **ToastClose** (line 26) - `toastclose`
  - Context: `<ToastClose />`
- **ToastViewport** (line 30) - `toastviewport`
  - Context: `<ToastViewport />`

#### toggle-group
**File:** `src/components/ui/toggle-group.tsx`
**Lines:** 60
**Last Modified:** 2025-07-08T18:09:39.875Z

**Key Elements:**
- **ToggleGroupPrimitive** (line 20) - `togglegroupprimitive`
  - Context: `<ToggleGroupPrimitive.Root`
- **ToggleGroupContext** (line 25) - `togglegroupcontext`
  - Context: `<ToggleGroupContext.Provider value={{ variant, size }}>`
- **ToggleGroupPrimitive** (line 41) - `togglegroupprimitive`
  - Context: `<ToggleGroupPrimitive.Item`

#### toggle
**File:** `src/components/ui/toggle.tsx`
**Lines:** 44
**Last Modified:** 2025-07-08T18:09:39.882Z

**Key Elements:**
- **TogglePrimitive** (line 34) - `toggleprimitive`
  - Context: `<TogglePrimitive.Root`

#### tooltip
**File:** `src/components/ui/tooltip.tsx`
**Lines:** 29
**Last Modified:** 2025-07-08T18:09:39.889Z

**Key Elements:**
- **TooltipPrimitive** (line 16) - `tooltipprimitive`
  - Context: `<TooltipPrimitive.Content`

#### toastTimeouts
**File:** `src/components/ui/use-toast.ts`
**Lines:** 189
**Last Modified:** 2025-07-08T18:22:31.684Z

**Key Elements:**
- **ToasterToast** (line 41) - `toastertoast`
  - Context: `toast: Partial<ToasterToast>`
- **ToasterToast** (line 138) - `toastertoast`
  - Context: `type Toast = Omit<ToasterToast, "id">`
- **State** (line 170) - `state`
  - Context: `const [state, setState] = React.useState<State>(memoryState)`

### 📁 src/pages/

#### checkAdminStatus
**File:** `src/pages/Administrator.tsx`
**Lines:** 376
**Last Modified:** 2025-07-08T22:35:08.659Z

**Key Elements:**
- **User** (line 27) - `user`
  - Context: `const [users, setUsers] = useState<User[]>([]);`
- **AdminStats** (line 28) - `adminstats`
  - Context: `const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalMessages: 0...`
- **Shield** (line 183) - `shield`
  - Context: `<Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />`
- **Shield** (line 195) - `shield`
  - Context: `<Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />`
- **Shield** (line 214) - `shield`
  - Context: `<Shield className="h-8 w-8 text-blue-600" />`
- **Card** (line 223) - `card`
  - Context: `<Card`
- **CardHeader** (line 236) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 237) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Total Users</CardTitle>`
- **Users** (line 238) - `users`
  - Context: `<Users className="h-4 w-4 text-blue-600" />`
- **CardContent** (line 240) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 245) - `card`
  - Context: `<Card`
- **CardHeader** (line 258) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 259) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Total Messages</CardTitle>`
- **MessageSquare** (line 260) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4 text-green-600" />`
- **CardContent** (line 262) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 267) - `card`
  - Context: `<Card`
- **CardHeader** (line 280) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 281) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Total Events</CardTitle>`
- **Calendar** (line 282) - `calendar`
  - Context: `<Calendar className="h-4 w-4 text-orange-600" />`
- **CardContent** (line 284) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 289) - `card`
  - Context: `<Card`
- **CardHeader** (line 302) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 303) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Total Groups</CardTitle>`
- **Users** (line 304) - `users`
  - Context: `<Users className="h-4 w-4 text-purple-600" />`
- **CardContent** (line 306) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 313) - `card`
  - Context: `<Card>`
- **CardHeader** (line 314) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 315) - `cardtitle`
  - Context: `<CardTitle className="flex items-center gap-2">`
- **UserCog** (line 316) - `usercog`
  - Context: `<UserCog className="h-5 w-5" />`
- **CardDescription** (line 319) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 323) - `cardcontent`
  - Context: `<CardContent>`
- **Avatar** (line 328) - `avatar`
  - Context: `<Avatar>`
- **AvatarImage** (line 329) - `avatarimage`
  - Context: `<AvatarImage src={userData.avatar_url} />`
- **AvatarFallback** (line 330) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Badge** (line 338) - `badge`
  - Context: `<Badge variant="secondary" className="text-xs">`
- **Shield** (line 339) - `shield`
  - Context: `<Shield className="h-3 w-3 mr-1" />`
- **Button** (line 351) - `button`
  - Context: `<Button`
- **Button** (line 359) - `button`
  - Context: `<Button`
- **Trash2** (line 366) - `trash2`
  - Context: `<Trash2 className="h-4 w-4" />`

#### handleSignIn
**File:** `src/pages/Auth.tsx`
**Lines:** 176
**Last Modified:** 2025-07-08T18:09:39.958Z

**Key Elements:**
- **Navigate** (line 22) - `navigate`
  - Context: `return <Navigate to="/" replace />;`
- **Card** (line 85) - `card`
  - Context: `<Card className="w-full max-w-md">`
- **CardHeader** (line 86) - `cardheader`
  - Context: `<CardHeader className="space-y-1 text-center">`
- **Mountain** (line 88) - `mountain`
  - Context: `<Mountain className="h-8 w-8 text-green-600 mr-2" />`
- **CardDescription** (line 91) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 95) - `cardcontent`
  - Context: `<CardContent>`
- **Tabs** (line 96) - `tabs`
  - Context: `<Tabs defaultValue="signin" className="w-full">`
- **TabsList** (line 97) - `tabslist`
  - Context: `<TabsList className="grid w-full grid-cols-2">`
- **TabsTrigger** (line 98) - `tabstrigger`
  - Context: `<TabsTrigger value="signin">Sign In</TabsTrigger>`
- **TabsTrigger** (line 99) - `tabstrigger`
  - Context: `<TabsTrigger value="signup">Sign Up</TabsTrigger>`
- **TabsContent** (line 102) - `tabscontent`
  - Context: `<TabsContent value="signin">`
- **Label** (line 105) - `label`
  - Context: `<Label htmlFor="email">Email</Label>`
- **Input** (line 106) - `input`
  - Context: `<Input`
- **Label** (line 116) - `label`
  - Context: `<Label htmlFor="password">Password</Label>`
- **Input** (line 117) - `input`
  - Context: `<Input`
- **Button** (line 125) - `button`
  - Context: `<Button type="submit" className="w-full" disabled={loading}>`
- **TabsContent** (line 131) - `tabscontent`
  - Context: `<TabsContent value="signup">`
- **Label** (line 134) - `label`
  - Context: `<Label htmlFor="displayName">Display Name</Label>`
- **Input** (line 135) - `input`
  - Context: `<Input`
- **Label** (line 145) - `label`
  - Context: `<Label htmlFor="email">Email</Label>`
- **Input** (line 146) - `input`
  - Context: `<Input`
- **Label** (line 156) - `label`
  - Context: `<Label htmlFor="password">Password</Label>`
- **Input** (line 157) - `input`
  - Context: `<Input`
- **Button** (line 165) - `button`
  - Context: `<Button type="submit" className="w-full" disabled={loading}>`

#### navigate
**File:** `src/pages/BelayChat.tsx`
**Lines:** 406
**Last Modified:** 2025-07-09T03:54:16.900Z

**Key Elements:**
- **BelayGroup** (line 19) - `belaygroup`
  - Context: `const [belayGroup, setBelayGroup] = useState<BelayGroup | null>(null);`
- **BelayGroupMessage** (line 20) - `belaygroupmessage`
  - Context: `const [messages, setMessages] = useState<BelayGroupMessage[]>([]);`
- **HTMLDivElement** (line 25) - `htmldivelement`
  - Context: `const messagesEndRef = useRef<HTMLDivElement>(null);`
- **Loader2** (line 219) - `loader2`
  - Context: `<Loader2 className="h-6 w-6 animate-spin" />`
- **Button** (line 231) - `button`
  - Context: `<Button onClick={() => navigate('/belay-groups')}>`
- **Card** (line 242) - `card`
  - Context: `<Card className="max-w-md">`
- **CardContent** (line 243) - `cardcontent`
  - Context: `<CardContent className="p-6 text-center">`
- **Button** (line 248) - `button`
  - Context: `<Button onClick={() => navigate('/belay-groups')}>`
- **Button** (line 266) - `button`
  - Context: `<Button`
- **ArrowLeft** (line 271) - `arrowleft`
  - Context: `<ArrowLeft className="h-4 w-4" />`
- **Button** (line 283) - `button`
  - Context: `<Button`
- **UserMinus** (line 289) - `userminus`
  - Context: `<UserMinus className="h-4 w-4 mr-2" />`
- **MapPin** (line 299) - `mappin`
  - Context: `<MapPin className="h-3 w-3" />`
- **Clock** (line 303) - `clock`
  - Context: `<Clock className="h-3 w-3" />`
- **Badge** (line 306) - `badge`
  - Context: `<Badge variant="outline" className="text-xs ml-1">`
- **Users** (line 318) - `users`
  - Context: `<Users className="h-8 w-8 mx-auto mb-2" />`
- **Avatar** (line 333) - `avatar`
  - Context: `<Avatar className="h-8 w-8">`
- **AvatarImage** (line 334) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 335) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Input** (line 389) - `input`
  - Context: `<Input`
- **EmojiPickerComponent** (line 396) - `emojipickercomponent`
  - Context: `<EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />`
- **Button** (line 399) - `button`
  - Context: `<Button type="submit" disabled={!newMessage.trim()}>`
- **Send** (line 400) - `send`
  - Context: `<Send className="h-4 w-4" />`

#### navigate
**File:** `src/pages/BelayGroups.tsx`
**Lines:** 364
**Last Modified:** 2025-07-09T04:09:10.452Z

**Key Elements:**
- **BelayGroup** (line 22) - `belaygroup`
  - Context: `const [belayGroups, setBelayGroups] = useState<BelayGroup[]>([]);`
- **BelayGroup** (line 23) - `belaygroup`
  - Context: `const [filteredGroups, setFilteredGroups] = useState<BelayGroup[]>([]);`
- **Loader2** (line 207) - `loader2`
  - Context: `<Loader2 className="h-6 w-6 animate-spin" />`
- **Card** (line 223) - `card`
  - Context: `<Card>`
- **CardContent** (line 224) - `cardcontent`
  - Context: `<CardContent className="p-4">`
- **Search** (line 227) - `search`
  - Context: `<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 te...`
- **Input** (line 228) - `input`
  - Context: `<Input`
- **Select** (line 236) - `select`
  - Context: `<Select value={climbingTypeFilter} onValueChange={(value) => setClimbingTypeFilt...`
- **SelectTrigger** (line 237) - `selecttrigger`
  - Context: `<SelectTrigger className="w-[160px]">`
- **SelectValue** (line 238) - `selectvalue`
  - Context: `<SelectValue placeholder="Climbing Type" />`
- **SelectContent** (line 240) - `selectcontent`
  - Context: `<SelectContent>`
- **SelectItem** (line 241) - `selectitem`
  - Context: `<SelectItem value="all">All Types</SelectItem>`
- **SelectItem** (line 243) - `selectitem`
  - Context: `<SelectItem key={key} value={key}>`
- **Select** (line 249) - `select`
  - Context: `<Select value={privacyFilter} onValueChange={(value) => setPrivacyFilter(value a...`
- **SelectTrigger** (line 250) - `selecttrigger`
  - Context: `<SelectTrigger className="w-[120px]">`
- **SelectValue** (line 251) - `selectvalue`
  - Context: `<SelectValue placeholder="Filter" />`
- **SelectContent** (line 253) - `selectcontent`
  - Context: `<SelectContent>`
- **SelectItem** (line 254) - `selectitem`
  - Context: `<SelectItem value="all">All Groups</SelectItem>`
- **SelectItem** (line 255) - `selectitem`
  - Context: `<SelectItem value="public">Public</SelectItem>`
- **SelectItem** (line 256) - `selectitem`
  - Context: `<SelectItem value="private">Private</SelectItem>`
- **SelectItem** (line 257) - `selectitem`
  - Context: `<SelectItem value="joined">Joined</SelectItem>`
- **Card** (line 267) - `card`
  - Context: `<Card>`
- **CardContent** (line 268) - `cardcontent`
  - Context: `<CardContent className="p-8 text-center">`
- **Users** (line 269) - `users`
  - Context: `<Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />`
- **Card** (line 285) - `card`
  - Context: `<Card key={group.id} className={`transition-all hover:shadow-lg ${group.is_parti...`
- **CardHeader** (line 286) - `cardheader`
  - Context: `<CardHeader className="pb-3">`
- **CardTitle** (line 291) - `cardtitle`
  - Context: `<CardTitle className="text-base">{group.name}</CardTitle>`
- **Lock** (line 298) - `lock`
  - Context: `{group.privacy === 'private' ? <Lock className="h-3 w-3" /> : <Globe className="...`
- **Globe** (line 298) - `globe`
  - Context: `{group.privacy === 'private' ? <Lock className="h-3 w-3" /> : <Globe className="...`
- **UserCheck** (line 299) - `usercheck`
  - Context: `{group.is_participant && <UserCheck className="h-3 w-3 text-green-600" />}`
- **CardContent** (line 303) - `cardcontent`
  - Context: `<CardContent className="space-y-3">`
- **MapPin** (line 306) - `mappin`
  - Context: `<MapPin className="h-3 w-3" />`
- **Clock** (line 310) - `clock`
  - Context: `<Clock className="h-3 w-3" />`
- **Badge** (line 312) - `badge`
  - Context: `<Badge variant="outline" className="text-xs">`
- **Users** (line 317) - `users`
  - Context: `<Users className="h-3 w-3" />`
- **Badge** (line 319) - `badge`
  - Context: `<Badge variant={group.status === 'full' ? 'destructive' : 'default'} className="...`
- **Button** (line 333) - `button`
  - Context: `<Button`
- **UserCheck** (line 337) - `usercheck`
  - Context: `<UserCheck className="h-4 w-4 mr-2" />`
- **Button** (line 341) - `button`
  - Context: `<Button`
- **Loader2** (line 346) - `loader2`
  - Context: `{joiningGroupId === group.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" /...`
- **Users** (line 347) - `users`
  - Context: `<Users className="h-4 w-4 mr-2" />`
- **Button** (line 351) - `button`
  - Context: `<Button disabled className="w-full">`

#### scrollToBottom
**File:** `src/pages/ClubTalk.tsx`
**Lines:** 535
**Last Modified:** 2025-07-09T03:07:47.238Z

**Key Elements:**
- **ClubMessage** (line 29) - `clubmessage`
  - Context: `const [messages, setMessages] = useState<ClubMessage[]>([]);`
- **Set** (line 38) - `set`
  - Context: `const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set())...`
- **HTMLDivElement** (line 39) - `htmldivelement`
  - Context: `const viewportRef = useRef<HTMLDivElement>(null);`
- **Card** (line 291) - `card`
  - Context: `<Card className="p-8 text-center">`
- **Input** (line 347) - `input`
  - Context: `<Input`
- **Button** (line 354) - `button`
  - Context: `<Button`
- **Search** (line 359) - `search`
  - Context: `<Search className="h-4 w-4" />`
- **Avatar** (line 407) - `avatar`
  - Context: `<Avatar className="h-8 w-8 flex-shrink-0">`
- **AvatarImage** (line 408) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 409) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **EventMessageButton** (line 445) - `eventmessagebutton`
  - Context: `<EventMessageButton`
- **Button** (line 480) - `button`
  - Context: `<Button`
- **Trash2** (line 486) - `trash2`
  - Context: `<Trash2 className="h-4 w-4" />`
- **ChatActionsMenu** (line 492) - `chatactionsmenu`
  - Context: `<ChatActionsMenu`
- **Input** (line 499) - `input`
  - Context: `<Input`
- **EmojiPickerComponent** (line 513) - `emojipickercomponent`
  - Context: `<EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />`
- **Button** (line 516) - `button`
  - Context: `<Button`
- **Send** (line 521) - `send`
  - Context: `<Send className="h-4 w-4" />`
- **CreateEventModal** (line 526) - `createeventmodal`
  - Context: `<CreateEventModal`

#### navigate
**File:** `src/pages/Community.tsx`
**Lines:** 354
**Last Modified:** 2025-07-09T02:09:48.028Z

**Key Elements:**
- **TopicChat** (line 46) - `topicchat`
  - Context: `const [chats, setChats] = useState<TopicChat[]>([]);`
- **Avatar** (line 250) - `avatar`
  - Context: `<Avatar className="h-16 w-16">`
- **AvatarImage** (line 252) - `avatarimage`
  - Context: `<AvatarImage src={chat.avatar_url} />`
- **AvatarFallback** (line 254) - `avatarfallback`
  - Context: `<AvatarFallback className="bg-green-100">`
- **IconComponent** (line 255) - `iconcomponent`
  - Context: `<IconComponent className="h-8 w-8 text-green-600" />`
- **Users** (line 268) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Avatar** (line 314) - `avatar`
  - Context: `<Avatar className="h-12 w-12">`
- **AvatarImage** (line 316) - `avatarimage`
  - Context: `<AvatarImage src={chat.avatar_url} />`
- **AvatarFallback** (line 318) - `avatarfallback`
  - Context: `<AvatarFallback className="bg-green-100">`
- **IconComponent** (line 319) - `iconcomponent`
  - Context: `<IconComponent className="h-6 w-6 text-green-600" />`
- **Users** (line 335) - `users`
  - Context: `<Users className="h-4 w-4" />`

#### checkAdminStatus
**File:** `src/pages/Dashboard.tsx`
**Lines:** 75
**Last Modified:** 2025-07-09T03:09:50.297Z

**Key Elements:**
- **Shield** (line 53) - `shield`
  - Context: `<Shield className="h-6 w-6 text-red-600" />`
- **StatsGrid** (line 56) - `statsgrid`
  - Context: `<StatsGrid stats={stats} isLoading={isLoading} />`
- **UpcomingEvents** (line 61) - `upcomingevents`
  - Context: `<UpcomingEvents`
- **ActiveChats** (line 69) - `activechats`
  - Context: `<ActiveChats`

#### navigate
**File:** `src/pages/EventChat.tsx`
**Lines:** 847
**Last Modified:** 2025-07-09T03:13:06.098Z

**Key Elements:**
- **Event** (line 49) - `event`
  - Context: `const [event, setEvent] = useState<Event | null>(null);`
- **EventMessage** (line 50) - `eventmessage`
  - Context: `const [messages, setMessages] = useState<EventMessage[]>([]);`
- **Set** (line 60) - `set`
  - Context: `const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set())...`
- **HTMLDivElement** (line 62) - `htmldivelement`
  - Context: `const viewportRef = useRef<HTMLDivElement>(null);`
- **Card** (line 446) - `card`
  - Context: `<Card className="p-8">`
- **Card** (line 505) - `card`
  - Context: `<Card className="p-8 text-center">`
- **Button** (line 509) - `button`
  - Context: `<Button`
- **Button** (line 516) - `button`
  - Context: `<Button`
- **Button** (line 535) - `button`
  - Context: `<Button`
- **ArrowLeft** (line 543) - `arrowleft`
  - Context: `<ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />`
- **CalendarDays** (line 549) - `calendardays`
  - Context: `<CalendarDays className="h-4 w-4 mr-1" />`
- **MapPin** (line 553) - `mappin`
  - Context: `<MapPin className="h-4 w-4 mr-1" />`
- **Users** (line 557) - `users`
  - Context: `<Users className="h-4 w-4 mr-1" />`
- **Users** (line 565) - `users`
  - Context: `<Users className="h-3 w-3 mr-1" />`
- **Button** (line 568) - `button`
  - Context: `<Button`
- **ChevronUp** (line 575) - `chevronup`
  - Context: `<ChevronUp className="h-3 w-3" />`
- **ChevronDown** (line 577) - `chevrondown`
  - Context: `<ChevronDown className="h-3 w-3" />`
- **CalendarDays** (line 612) - `calendardays`
  - Context: `<CalendarDays className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />`
- **MapPin** (line 621) - `mappin`
  - Context: `<MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />`
- **Users** (line 627) - `users`
  - Context: `<Users className="h-4 w-4 text-purple-600 flex-shrink-0" />`
- **Avatar** (line 693) - `avatar`
  - Context: `<Avatar className="h-8 w-8 flex-shrink-0">`
- **AvatarImage** (line 694) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 695) - `avatarfallback`
  - Context: `<AvatarFallback className="text-xs">`
- **EventMessageButton** (line 733) - `eventmessagebutton`
  - Context: `<EventMessageButton`
- **Button** (line 768) - `button`
  - Context: `<Button`
- **Trash2** (line 774) - `trash2`
  - Context: `<Trash2 className="h-4 w-4" />`
- **ChatActionsMenu** (line 786) - `chatactionsmenu`
  - Context: `<ChatActionsMenu`
- **Input** (line 795) - `input`
  - Context: `<Input`
- **EmojiPickerComponent** (line 804) - `emojipickercomponent`
  - Context: `<EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />`
- **Button** (line 807) - `button`
  - Context: `<Button`
- **Send** (line 813) - `send`
  - Context: `<Send className="h-4 w-4" />`
- **CreateEventModal** (line 818) - `createeventmodal`
  - Context: `<CreateEventModal`
- **Dialog** (line 827) - `dialog`
  - Context: `<Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>`
- **DialogContent** (line 828) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 829) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 830) - `dialogtitle`
  - Context: `<DialogTitle>Leave Event</DialogTitle>`
- **DialogDescription** (line 831) - `dialogdescription`
  - Context: `<DialogDescription>`
- **DialogFooter** (line 835) - `dialogfooter`
  - Context: `<DialogFooter>`
- **Button** (line 836) - `button`
  - Context: `<Button variant="outline" onClick={cancelLeave}>`
- **Button** (line 839) - `button`
  - Context: `<Button variant="destructive" onClick={confirmLeave}>`

#### navigate
**File:** `src/pages/Events.tsx`
**Lines:** 170
**Last Modified:** 2025-07-09T03:56:26.390Z

**Key Elements:**
- **Card** (line 31) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 32) - `cardcontent`
  - Context: `<CardContent>`
- **CalendarDays** (line 33) - `calendardays`
  - Context: `<CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **EventCard** (line 78) - `eventcard`
  - Context: `<EventCard`
- **EventCard** (line 96) - `eventcard`
  - Context: `<EventCard`
- **Card** (line 113) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 114) - `cardcontent`
  - Context: `<CardContent>`
- **CalendarDays** (line 115) - `calendardays`
  - Context: `<CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **EventCard** (line 135) - `eventcard`
  - Context: `<EventCard`
- **EventCard** (line 158) - `eventcard`
  - Context: `<EventCard`

#### location
**File:** `src/pages/GroupChat.tsx`
**Lines:** 18
**Last Modified:** 2025-07-08T18:09:40.020Z

**Key Elements:**
- **GroupChatComponent** (line 17) - `groupchatcomponent`
  - Context: `return <GroupChatComponent groupId={groupId} groupName={groupName} />;`

#### navigate
**File:** `src/pages/Groups.tsx`
**Lines:** 260
**Last Modified:** 2025-07-09T04:17:46.050Z

**Key Elements:**
- **Search** (line 104) - `search`
  - Context: `<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 te...`
- **Input** (line 105) - `input`
  - Context: `<Input`
- **Card** (line 127) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 128) - `cardcontent`
  - Context: `<CardContent>`
- **Users** (line 129) - `users`
  - Context: `<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **GroupCard** (line 148) - `groupcard`
  - Context: `<GroupCard`
- **GroupCard** (line 166) - `groupcard`
  - Context: `<GroupCard`
- **GroupCard** (line 192) - `groupcard`
  - Context: `<GroupCard`
- **GroupCard** (line 215) - `groupcard`
  - Context: `<GroupCard`
- **Card** (line 228) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 229) - `cardcontent`
  - Context: `<CardContent>`
- **Users** (line 230) - `users`
  - Context: `<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Dialog** (line 240) - `dialog`
  - Context: `<Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>`
- **DialogContent** (line 241) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 242) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 243) - `dialogtitle`
  - Context: `<DialogTitle>Leave Group</DialogTitle>`
- **DialogDescription** (line 244) - `dialogdescription`
  - Context: `<DialogDescription>`
- **DialogFooter** (line 248) - `dialogfooter`
  - Context: `<DialogFooter>`
- **Button** (line 249) - `button`
  - Context: `<Button variant="outline" onClick={cancelLeave}>`
- **Button** (line 252) - `button`
  - Context: `<Button variant="destructive" onClick={confirmLeave}>`

#### checkScreenSize
**File:** `src/pages/Home.tsx`
**Lines:** 148
**Last Modified:** 2025-07-09T03:16:03.260Z

**Key Elements:**
- **Mountain** (line 30) - `mountain`
  - Context: `<Mountain className="h-16 w-16 text-green-600 mr-4" />`
- **Button** (line 39) - `button`
  - Context: `<Button asChild size="lg" className="bg-green-600 hover:bg-green-700">`
- **Link** (line 40) - `link`
  - Context: `<Link to="/auth">Join the Community</Link>`
- **Card** (line 45) - `card`
  - Context: `<Card>`
- **CardHeader** (line 46) - `cardheader`
  - Context: `<CardHeader>`
- **Users** (line 47) - `users`
  - Context: `<Users className="h-8 w-8 text-green-600 mb-2" />`
- **CardTitle** (line 48) - `cardtitle`
  - Context: `<CardTitle>Group Chats</CardTitle>`
- **CardDescription** (line 49) - `carddescription`
  - Context: `<CardDescription>`
- **Card** (line 54) - `card`
  - Context: `<Card>`
- **CardHeader** (line 55) - `cardheader`
  - Context: `<CardHeader>`
- **Calendar** (line 56) - `calendar`
  - Context: `<Calendar className="h-8 w-8 text-orange-600 mb-2" />`
- **CardTitle** (line 57) - `cardtitle`
  - Context: `<CardTitle>Climbing Events</CardTitle>`
- **CardDescription** (line 58) - `carddescription`
  - Context: `<CardDescription>`
- **Card** (line 63) - `card`
  - Context: `<Card>`
- **CardHeader** (line 64) - `cardheader`
  - Context: `<CardHeader>`
- **Users** (line 65) - `users`
  - Context: `<Users className="h-8 w-8 text-blue-600 mb-2" />`
- **CardTitle** (line 66) - `cardtitle`
  - Context: `<CardTitle>Find Partners</CardTitle>`
- **CardDescription** (line 67) - `carddescription`
  - Context: `<CardDescription>`
- **Button** (line 81) - `button`
  - Context: `<Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">`
- **Link** (line 82) - `link`
  - Context: `<Link to="/auth">Get Started Today</Link>`
- **Dashboard** (line 92) - `dashboard`
  - Context: `return <Dashboard />;`
- **Mountain** (line 103) - `mountain`
  - Context: `<Mountain className="h-16 w-16 text-green-600 mr-4" />`
- **Card** (line 114) - `card`
  - Context: `<Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() =...`
- **CardHeader** (line 115) - `cardheader`
  - Context: `<CardHeader>`
- **Users** (line 116) - `users`
  - Context: `<Users className="h-8 w-8 text-green-600 mb-2" />`
- **CardTitle** (line 117) - `cardtitle`
  - Context: `<CardTitle>Group Chats</CardTitle>`
- **CardDescription** (line 118) - `carddescription`
  - Context: `<CardDescription>`
- **Card** (line 123) - `card`
  - Context: `<Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() =...`
- **CardHeader** (line 124) - `cardheader`
  - Context: `<CardHeader>`
- **Calendar** (line 125) - `calendar`
  - Context: `<Calendar className="h-8 w-8 text-orange-600 mb-2" />`
- **CardTitle** (line 126) - `cardtitle`
  - Context: `<CardTitle>Climbing Events</CardTitle>`
- **CardDescription** (line 127) - `carddescription`
  - Context: `<CardDescription>`
- **Card** (line 132) - `card`
  - Context: `<Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() =...`
- **CardHeader** (line 133) - `cardheader`
  - Context: `<CardHeader>`
- **Users** (line 134) - `users`
  - Context: `<Users className="h-8 w-8 text-blue-600 mb-2" />`
- **CardTitle** (line 135) - `cardtitle`
  - Context: `<CardTitle>Community Chat</CardTitle>`
- **CardDescription** (line 136) - `carddescription`
  - Context: `<CardDescription>`

#### NotFound
**File:** `src/pages/NotFound.tsx`
**Lines:** 28
**Last Modified:** 2025-07-08T18:09:40.047Z

#### loadProfile
**File:** `src/pages/Profile.tsx`
**Lines:** 1045
**Last Modified:** 2025-07-09T02:09:48.050Z

**Key Elements:**
- **Profile** (line 54) - `profile`
  - Context: `const [profile, setProfile] = useState<Profile | null>(null);`
- **GroupChat** (line 61) - `groupchat`
  - Context: `const [groupChats, setGroupChats] = useState<GroupChat[]>([]);`
- **EventChat** (line 62) - `eventchat`
  - Context: `const [eventChats, setEventChats] = useState<EventChat[]>([]);`
- **CommunityGroup** (line 63) - `communitygroup`
  - Context: `const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>([]);`
- **HTMLInputElement** (line 410) - `htmlinputelement`
  - Context: `const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {`
- **Card** (line 532) - `card`
  - Context: `<Card>`
- **CardHeader** (line 533) - `cardheader`
  - Context: `<CardHeader>`
- **CardContent** (line 539) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 554) - `card`
  - Context: `<Card>`
- **CardContent** (line 555) - `cardcontent`
  - Context: `<CardContent className="text-center p-8">`
- **User** (line 556) - `user`
  - Context: `<User className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Card** (line 567) - `card`
  - Context: `<Card>`
- **CardHeader** (line 568) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 569) - `cardtitle`
  - Context: `<CardTitle className="flex items-center space-x-2">`
- **Badge** (line 572) - `badge`
  - Context: `<Badge variant="secondary" className="bg-orange-100 text-orange-800">`
- **CardDescription** (line 577) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 581) - `cardcontent`
  - Context: `<CardContent className="space-y-6">`
- **Avatar** (line 583) - `avatar`
  - Context: `<Avatar className="w-20 h-20">`
- **AvatarImage** (line 584) - `avatarimage`
  - Context: `<AvatarImage src={profile.avatar_url} />`
- **AvatarFallback** (line 585) - `avatarfallback`
  - Context: `<AvatarFallback className="text-lg">`
- **Label** (line 590) - `label`
  - Context: `<Label htmlFor="avatar-upload" className="cursor-pointer">`
- **Button** (line 591) - `button`
  - Context: `<Button variant="outline" size="sm" disabled={uploading} asChild>`
- **Upload** (line 593) - `upload`
  - Context: `<Upload className="h-4 w-4 mr-2" />`
- **Label** (line 614) - `label`
  - Context: `<Label htmlFor="display-name">Display Name</Label>`
- **Input** (line 615) - `input`
  - Context: `<Input`
- **Label** (line 623) - `label`
  - Context: `<Label>Email</Label>`
- **Input** (line 624) - `input`
  - Context: `<Input value={user?.email || ''} disabled />`
- **Button** (line 629) - `button`
  - Context: `<Button type="submit" disabled={updating || displayName === profile.display_name...`
- **Card** (line 637) - `card`
  - Context: `<Card>`
- **CardHeader** (line 638) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 639) - `cardtitle`
  - Context: `<CardTitle className="flex items-center space-x-2">`
- **Shield** (line 640) - `shield`
  - Context: `<Shield className="h-5 w-5 text-blue-600" />`
- **CardDescription** (line 643) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 647) - `cardcontent`
  - Context: `<CardContent>`
- **Tabs** (line 648) - `tabs`
  - Context: `<Tabs defaultValue="groups" className="w-full">`
- **TabsList** (line 649) - `tabslist`
  - Context: `<TabsList className="grid w-full grid-cols-3">`
- **TabsTrigger** (line 650) - `tabstrigger`
  - Context: `<TabsTrigger value="groups" className="flex items-center space-x-2">`
- **MessageSquare** (line 651) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4" />`
- **TabsTrigger** (line 654) - `tabstrigger`
  - Context: `<TabsTrigger value="events" className="flex items-center space-x-2">`
- **Calendar** (line 655) - `calendar`
  - Context: `<Calendar className="h-4 w-4" />`
- **TabsTrigger** (line 658) - `tabstrigger`
  - Context: `<TabsTrigger value="community" className="flex items-center space-x-2">`
- **Settings** (line 659) - `settings`
  - Context: `<Settings className="h-4 w-4" />`
- **TabsContent** (line 664) - `tabscontent`
  - Context: `<TabsContent value="groups" className="space-y-4">`
- **Badge** (line 668) - `badge`
  - Context: `<Badge variant="outline">{groupChats.length} groups</Badge>`
- **MessageSquare** (line 685) - `messagesquare`
  - Context: `<MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />`
- **Card** (line 691) - `card`
  - Context: `<Card key={group.id} className="p-4">`
- **Input** (line 697) - `input`
  - Context: `<Input`
- **Textarea** (line 704) - `textarea`
  - Context: `<Textarea`
- **Button** (line 712) - `button`
  - Context: `<Button`
- **Save** (line 717) - `save`
  - Context: `<Save className="h-4 w-4 mr-1" />`
- **Button** (line 720) - `button`
  - Context: `<Button`
- **X** (line 725) - `x`
  - Context: `<X className="h-4 w-4 mr-1" />`
- **Button** (line 746) - `button`
  - Context: `<Button`
- **Edit2** (line 752) - `edit2`
  - Context: `<Edit2 className="h-4 w-4" />`
- **AlertDialog** (line 754) - `alertdialog`
  - Context: `<AlertDialog>`
- **AlertDialogTrigger** (line 755) - `alertdialogtrigger`
  - Context: `<AlertDialogTrigger asChild>`
- **Button** (line 756) - `button`
  - Context: `<Button`
- **Trash2** (line 762) - `trash2`
  - Context: `<Trash2 className="h-4 w-4" />`
- **AlertDialogContent** (line 765) - `alertdialogcontent`
  - Context: `<AlertDialogContent>`
- **AlertDialogHeader** (line 766) - `alertdialogheader`
  - Context: `<AlertDialogHeader>`
- **AlertDialogTitle** (line 767) - `alertdialogtitle`
  - Context: `<AlertDialogTitle>Delete Group</AlertDialogTitle>`
- **AlertDialogDescription** (line 768) - `alertdialogdescription`
  - Context: `<AlertDialogDescription>`
- **AlertDialogFooter** (line 772) - `alertdialogfooter`
  - Context: `<AlertDialogFooter>`
- **AlertDialogCancel** (line 773) - `alertdialogcancel`
  - Context: `<AlertDialogCancel>Cancel</AlertDialogCancel>`
- **AlertDialogAction** (line 774) - `alertdialogaction`
  - Context: `<AlertDialogAction`
- **TabsContent** (line 796) - `tabscontent`
  - Context: `<TabsContent value="events" className="space-y-4">`
- **Badge** (line 800) - `badge`
  - Context: `<Badge variant="outline">{eventChats.length} events</Badge>`
- **Calendar** (line 817) - `calendar`
  - Context: `<Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />`
- **Card** (line 823) - `card`
  - Context: `<Card key={event.id} className="p-4">`
- **Input** (line 828) - `input`
  - Context: `<Input`
- **Textarea** (line 833) - `textarea`
  - Context: `<Textarea`
- **Input** (line 840) - `input`
  - Context: `<Input`
- **Input** (line 845) - `input`
  - Context: `<Input`
- **Button** (line 852) - `button`
  - Context: `<Button`
- **Save** (line 857) - `save`
  - Context: `<Save className="h-4 w-4 mr-1" />`
- **Button** (line 860) - `button`
  - Context: `<Button`
- **X** (line 865) - `x`
  - Context: `<X className="h-4 w-4 mr-1" />`
- **Button** (line 886) - `button`
  - Context: `<Button`
- **Edit2** (line 892) - `edit2`
  - Context: `<Edit2 className="h-4 w-4" />`
- **AlertDialog** (line 894) - `alertdialog`
  - Context: `<AlertDialog>`
- **AlertDialogTrigger** (line 895) - `alertdialogtrigger`
  - Context: `<AlertDialogTrigger asChild>`
- **Button** (line 896) - `button`
  - Context: `<Button`
- **Trash2** (line 902) - `trash2`
  - Context: `<Trash2 className="h-4 w-4" />`
- **AlertDialogContent** (line 905) - `alertdialogcontent`
  - Context: `<AlertDialogContent>`
- **AlertDialogHeader** (line 906) - `alertdialogheader`
  - Context: `<AlertDialogHeader>`
- **AlertDialogTitle** (line 907) - `alertdialogtitle`
  - Context: `<AlertDialogTitle>Delete Event</AlertDialogTitle>`
- **AlertDialogDescription** (line 908) - `alertdialogdescription`
  - Context: `<AlertDialogDescription>`
- **AlertDialogFooter** (line 912) - `alertdialogfooter`
  - Context: `<AlertDialogFooter>`
- **AlertDialogCancel** (line 913) - `alertdialogcancel`
  - Context: `<AlertDialogCancel>Cancel</AlertDialogCancel>`
- **AlertDialogAction** (line 914) - `alertdialogaction`
  - Context: `<AlertDialogAction`
- **TabsContent** (line 936) - `tabscontent`
  - Context: `<TabsContent value="community" className="space-y-4">`
- **Badge** (line 940) - `badge`
  - Context: `<Badge variant="outline">{communityGroups.length} communities</Badge>`
- **Settings** (line 957) - `settings`
  - Context: `<Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />`
- **Card** (line 963) - `card`
  - Context: `<Card key={community.id} className="p-4">`
- **Input** (line 969) - `input`
  - Context: `<Input`
- **Textarea** (line 976) - `textarea`
  - Context: `<Textarea`
- **Button** (line 984) - `button`
  - Context: `<Button`
- **Save** (line 989) - `save`
  - Context: `<Save className="h-4 w-4 mr-1" />`
- **Button** (line 992) - `button`
  - Context: `<Button`
- **X** (line 997) - `x`
  - Context: `<X className="h-4 w-4 mr-1" />`
- **Button** (line 1018) - `button`
  - Context: `<Button`
- **Edit2** (line 1024) - `edit2`
  - Context: `<Edit2 className="h-4 w-4" />`

## 🎯 QUICK REFERENCE

### Main Components
- **getLayoutClass**: `src/components/layout/MultiPanelLayout.tsx`
- **MobileLayout**: `src/components/layout/Layout.tsx`

## 🔄 UPDATE INSTRUCTIONS
**Before every UI editing session:**
1. Check map timestamp above
2. If >24 hours old or after code changes: `npm run ui:update-map`
3. After major component changes: `npm run ui:update-map`

**After making UI changes:**
1. Request user to run: `npm run dev` in Windows terminal
2. Provide specific test instructions for changes made
3. Wait for user confirmation before proceeding

---
*Generated by enhanced-map-generator.cjs*
*⚠️ This map becomes stale - always update before use!*
