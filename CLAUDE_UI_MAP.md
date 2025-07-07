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

**Last Updated:** 2025-07-07T18:24:50.055Z
**Project:** climb-connect-toronto
**Components Scanned:** 105
**Total Files:** 105
**Latest File Modified:** Mon Jul 07 2025 14:06:25 GMT-0400 (Eastern Daylight Time)

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

#### ProtectedRoute
**File:** `src/components/ProtectedRoute.tsx`
**Lines:** 32
**Last Modified:** 2025-07-03T21:42:28.127Z

**Key Elements:**
- **Skeleton** (line 18) - `skeleton`
  - Context: `<Skeleton className="h-8 w-64" />`
- **Skeleton** (line 19) - `skeleton`
  - Context: `<Skeleton className="h-64 w-full" />`
- **Skeleton** (line 20) - `skeleton`
  - Context: `<Skeleton className="h-32 w-full" />`
- **Navigate** (line 27) - `navigate`
  - Context: `return <Navigate to="/auth" replace />;`

#### handleCreateEvent
**File:** `src/components/chat-actions-menu.tsx`
**Lines:** 45
**Last Modified:** 2025-07-06T03:22:56.345Z

**Key Elements:**
- **DropdownMenu** (line 24) - `dropdownmenu`
  - Context: `<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>`
- **DropdownMenuTrigger** (line 25) - `dropdownmenutrigger`
  - Context: `<DropdownMenuTrigger asChild>`
- **Button** (line 26) - `button`
  - Context: `<Button`
- **Plus** (line 31) - `plus`
  - Context: `<Plus className="h-4 w-4 text-gray-500" />`
- **DropdownMenuContent** (line 34) - `dropdownmenucontent`
  - Context: `<DropdownMenuContent align="start" className="w-48">`
- **DropdownMenuItem** (line 35) - `dropdownmenuitem`
  - Context: `<DropdownMenuItem`
- **Calendar** (line 39) - `calendar`
  - Context: `<Calendar className="h-4 w-4" />`

#### getLocationSuggestion
**File:** `src/components/create-event-modal.tsx`
**Lines:** 263
**Last Modified:** 2025-07-07T02:17:32.664Z

**Key Elements:**
- **HTMLInputElement** (line 81) - `htmlinputelement`
  - Context: `const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaE...`
- **Dialog** (line 176) - `dialog`
  - Context: `<Dialog open={isOpen} onOpenChange={handleClose}>`
- **DialogContent** (line 177) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 178) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 179) - `dialogtitle`
  - Context: `<DialogTitle className="flex items-center gap-2">`
- **CalendarDays** (line 180) - `calendardays`
  - Context: `<CalendarDays className="h-5 w-5" />`
- **Label** (line 191) - `label`
  - Context: `<Label htmlFor="title">Event Title *</Label>`
- **Input** (line 192) - `input`
  - Context: `<Input`
- **Label** (line 203) - `label`
  - Context: `<Label htmlFor="description">Description</Label>`
- **Textarea** (line 204) - `textarea`
  - Context: `<Textarea`
- **Label** (line 215) - `label`
  - Context: `<Label htmlFor="location">Location *</Label>`
- **Input** (line 216) - `input`
  - Context: `<Input`
- **Label** (line 227) - `label`
  - Context: `<Label htmlFor="event_date">Date & Time *</Label>`
- **Input** (line 228) - `input`
  - Context: `<Input`
- **Label** (line 239) - `label`
  - Context: `<Label htmlFor="max_participants">Max Participants</Label>`
- **Input** (line 240) - `input`
  - Context: `<Input`
- **Button** (line 252) - `button`
  - Context: `<Button type="button" variant="outline" onClick={handleClose} className="flex-1"...`
- **Button** (line 255) - `button`
  - Context: `<Button type="submit" disabled={isCreating} className="flex-1">`

#### viewport
**File:** `src/components/enhanced-realtime-chat.tsx`
**Lines:** 530
**Last Modified:** 2025-07-07T18:04:10.387Z

**Key Elements:**
- **ChatMessage** (line 38) - `chatmessage`
  - Context: `const [messages, setMessages] = useState<ChatMessage[]>([]);`
- **Set** (line 44) - `set`
  - Context: `const [joiningEventIds, setJoiningEventIds] = useState<Set<string>>(new Set());`
- **HTMLDivElement** (line 45) - `htmldivelement`
  - Context: `const viewportRef = useRef<HTMLDivElement>(null);`
- **Card** (line 331) - `card`
  - Context: `<Card className="h-full flex items-center justify-center">`
- **Input** (line 347) - `input`
  - Context: `<Input`
- **Button** (line 354) - `button`
  - Context: `<Button`
- **Search** (line 362) - `search`
  - Context: `<Search className="h-4 w-4" />`
- **Avatar** (line 390) - `avatar`
  - Context: `<Avatar className="h-8 w-8 flex-shrink-0">`
- **AvatarImage** (line 391) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 392) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Button** (line 406) - `button`
  - Context: `<Button`
- **X** (line 413) - `x`
  - Context: `<X className="h-3 w-3" />`
- **Button** (line 446) - `button`
  - Context: `<Button`
- **UserPlus** (line 459) - `userplus`
  - Context: `<UserPlus className="h-3 w-3" />`
- **Input** (line 505) - `input`
  - Context: `<Input`
- **Button** (line 518) - `button`
  - Context: `<Button`
- **Send** (line 524) - `send`
  - Context: `<Send className="h-4 w-4" />`

#### navigate
**File:** `src/components/group-chat.tsx`
**Lines:** 626
**Last Modified:** 2025-07-07T16:13:30.326Z

**Key Elements:**
- **GroupMessage** (line 40) - `groupmessage`
  - Context: `const [messages, setMessages] = useState<GroupMessage[]>([]);`
- **Set** (line 47) - `set`
  - Context: `const [joiningEventIds, setJoiningEventIds] = useState<Set<string>>(new Set());`
- **HTMLDivElement** (line 48) - `htmldivelement`
  - Context: `const viewportRef = useRef<HTMLDivElement>(null);`
- **NodeJS** (line 49) - `nodejs`
  - Context: `const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);`
- **Card** (line 415) - `card`
  - Context: `<Card className="h-full flex items-center justify-center">`
- **Button** (line 426) - `button`
  - Context: `<Button`
- **ArrowLeft** (line 432) - `arrowleft`
  - Context: `<ArrowLeft className="h-5 w-5" />`
- **Input** (line 441) - `input`
  - Context: `<Input`
- **Button** (line 448) - `button`
  - Context: `<Button`
- **X** (line 460) - `x`
  - Context: `{showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}`
- **Search** (line 460) - `search`
  - Context: `{showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}`
- **Avatar** (line 482) - `avatar`
  - Context: `<Avatar className="h-8 w-8 flex-shrink-0">`
- **AvatarImage** (line 483) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 484) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Button** (line 498) - `button`
  - Context: `<Button`
- **X** (line 505) - `x`
  - Context: `<X className="h-3 w-3" />`
- **Button** (line 538) - `button`
  - Context: `<Button`
- **UserPlus** (line 551) - `userplus`
  - Context: `<UserPlus className="h-3 w-3" />`
- **ChatActionsMenu** (line 589) - `chatactionsmenu`
  - Context: `<ChatActionsMenu`
- **Input** (line 592) - `input`
  - Context: `<Input`
- **Button** (line 605) - `button`
  - Context: `<Button`
- **Send** (line 610) - `send`
  - Context: `<Send className="h-4 w-4" />`
- **CreateEventModal** (line 616) - `createeventmodal`
  - Context: `<CreateEventModal`

### 📁 src/components/chat/

#### Chat
**File:** `src/components/chat/Chat.tsx`
**Lines:** 131
**Last Modified:** 2025-07-06T21:50:02.367Z

**Key Elements:**
- **ChatConfig** (line 11) - `chatconfig`
  - Context: `config?: Partial<ChatConfig>;`
- **LoadingSpinner** (line 31) - `loadingspinner`
  - Context: `return <LoadingSpinner message={`Loading ${config.type} chat...`} className={cla...`
- **ChatContainer** (line 37) - `chatcontainer`
  - Context: `<ChatContainer className={className}>`
- **ChatHeader** (line 38) - `chatheader`
  - Context: `<ChatHeader`
- **MessageList** (line 55) - `messagelist`
  - Context: `<MessageList`
- **MessageInput** (line 63) - `messageinput`
  - Context: `<MessageInput`
- **ChatProvider** (line 105) - `chatprovider`
  - Context: `<ChatProvider`
- **ChatInternal** (line 111) - `chatinternal`
  - Context: `<ChatInternal`
- **ChatProps** (line 121) - `chatprops`
  - Context: `export function CommunityChat(props: Omit<ChatProps, 'chatType'>) {`
- **Chat** (line 122) - `chat`
  - Context: `return <Chat {...props} chatType="community" />;`
- **ChatProps** (line 125) - `chatprops`
  - Context: `export function GroupChat(props: Omit<ChatProps, 'chatType'>) {`
- **Chat** (line 126) - `chat`
  - Context: `return <Chat {...props} chatType="group" />;`
- **ChatProps** (line 129) - `chatprops`
  - Context: `export function EventChat(props: Omit<ChatProps, 'chatType'>) {`
- **Chat** (line 130) - `chat`
  - Context: `return <Chat {...props} chatType="event" />;`

#### ChatContext
**File:** `src/components/chat/ChatContext.ts`
**Lines:** 83
**Last Modified:** 2025-07-06T21:48:51.522Z

**Key Elements:**
- **ChatContextValue** (line 42) - `chatcontextvalue`
  - Context: `export const ChatContext = createContext<ChatContextValue | null>(null);`

#### state
**File:** `src/components/chat/ChatProvider.tsx`
**Lines:** 301
**Last Modified:** 2025-07-06T21:49:32.495Z

**Key Elements:**
- **IChatServices** (line 29) - `ichatservices`
  - Context: `services?: Partial<IChatServices>;`
- **ChatContext** (line 291) - `chatcontext`
  - Context: `<ChatContext.Provider value={contextValue}>`

#### handleSendMessage
**File:** `src/components/chat/EnhancedChatDemo.tsx`
**Lines:** 343
**Last Modified:** 2025-07-07T16:28:29.671Z

**Key Elements:**
- **ConnectionBanner** (line 105) - `connectionbanner`
  - Context: `<ConnectionBanner`
- **Card** (line 112) - `card`
  - Context: `<Card>`
- **CardHeader** (line 113) - `cardheader`
  - Context: `<CardHeader className="pb-3">`
- **MessageSquare** (line 116) - `messagesquare`
  - Context: `<MessageSquare className="h-5 w-5" />`
- **CardTitle** (line 117) - `cardtitle`
  - Context: `<CardTitle className="text-lg">{roomName}</CardTitle>`
- **Badge** (line 118) - `badge`
  - Context: `<Badge variant="outline" className="text-xs">`
- **ConnectionIndicator** (line 125) - `connectionindicator`
  - Context: `<ConnectionIndicator connectionState={connectionState} />`
- **Badge** (line 129) - `badge`
  - Context: `<Badge variant="secondary" className="text-xs">`
- **Badge** (line 136) - `badge`
  - Context: `<Badge variant="outline" className="text-xs">`
- **Button** (line 142) - `button`
  - Context: `<Button`
- **Settings** (line 147) - `settings`
  - Context: `<Settings className="h-4 w-4" />`
- **ConnectionStatus** (line 154) - `connectionstatus`
  - Context: `<ConnectionStatus`
- **CardContent** (line 164) - `cardcontent`
  - Context: `<CardContent className="space-y-4">`
- **ConnectionMonitor** (line 166) - `connectionmonitor`
  - Context: `<ConnectionMonitor`
- **Input** (line 204) - `input`
  - Context: `<Input`
- **Button** (line 215) - `button`
  - Context: `<Button`
- **Send** (line 220) - `send`
  - Context: `<Send className="h-4 w-4" />`
- **Separator** (line 224) - `separator`
  - Context: `<Separator />`
- **Button** (line 228) - `button`
  - Context: `<Button`
- **RotateCcw** (line 234) - `rotateccw`
  - Context: `<RotateCcw className="h-3 w-3 mr-1" />`
- **Button** (line 238) - `button`
  - Context: `<Button`
- **Activity** (line 244) - `activity`
  - Context: `<Activity className="h-3 w-3 mr-1" />`
- **Button** (line 248) - `button`
  - Context: `<Button`
- **Button** (line 256) - `button`
  - Context: `<Button`
- **Trash2** (line 262) - `trash2`
  - Context: `<Trash2 className="h-3 w-3 mr-1" />`
- **Button** (line 307) - `button`
  - Context: `<Button size="sm" variant="ghost" onClick={clearError}>`

#### index
**File:** `src/components/chat/index.ts`
**Lines:** 40
**Last Modified:** 2025-07-06T21:50:19.446Z

### 📁 src/components/chat/hooks/

#### index
**File:** `src/components/chat/hooks/index.ts`
**Lines:** 21
**Last Modified:** 2025-07-07T16:26:49.177Z

#### loadMessages
**File:** `src/components/chat/hooks/useChatMessages.ts`
**Lines:** 179
**Last Modified:** 2025-07-06T21:40:10.950Z

**Key Elements:**
- **BaseMessage** (line 26) - `basemessage`
  - Context: `const [messages, setMessages] = useState<BaseMessage[]>([]);`
- **BaseMessage** (line 73) - `basemessage`
  - Context: `const sendMessage = useCallback(async (content: string): Promise<BaseMessage | n...`
- **BaseMessage** (line 151) - `basemessage`
  - Context: `const updateMessage = useCallback((messageId: string, updates: Partial<BaseMessa...`

#### checkAdminStatus
**File:** `src/components/chat/hooks/useChatPermissions.ts`
**Lines:** 171
**Last Modified:** 2025-07-06T21:41:45.501Z

**Key Elements:**
- **UserPermissions** (line 25) - `userpermissions`
  - Context: `const [permissions, setPermissions] = useState<UserPermissions>(DEFAULT_USER_PER...`

#### getReadStatusTable
**File:** `src/components/chat/hooks/useChatReadStatus.ts`
**Lines:** 206
**Last Modified:** 2025-07-06T21:41:13.265Z

**Key Elements:**
- **ReadStatusConfig** (line 15) - `readstatusconfig`
  - Context: `config?: Partial<ReadStatusConfig>;`
- **ReadStatus** (line 28) - `readstatus`
  - Context: `const [readStatus, setReadStatus] = useState<ReadStatus | null>(null);`
- **NodeJS** (line 31) - `nodejs`
  - Context: `const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);`
- **HTMLDivElement** (line 107) - `htmldivelement`
  - Context: `const handleScroll = useCallback((viewportRef: React.RefObject<HTMLDivElement>) ...`

#### cleanup
**File:** `src/components/chat/hooks/useChatRealtime.ts`
**Lines:** 103
**Last Modified:** 2025-07-06T21:40:34.181Z

#### scrollToBottom
**File:** `src/components/chat/hooks/useChatScroll.ts`
**Lines:** 157
**Last Modified:** 2025-07-06T21:42:13.052Z

**Key Elements:**
- **HTMLDivElement** (line 14) - `htmldivelement`
  - Context: `const viewportRef = useRef<HTMLDivElement>(null);`
- **NodeJS** (line 15) - `nodejs`
  - Context: `const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);`

#### filteredMessages
**File:** `src/components/chat/hooks/useChatSearch.ts`
**Lines:** 191
**Last Modified:** 2025-07-06T21:42:47.571Z

#### getConnectionQuality
**File:** `src/components/chat/hooks/useConnectionState.ts`
**Lines:** 355
**Last Modified:** 2025-07-07T16:20:49.436Z

**Key Elements:**
- **ConnectionConfig** (line 13) - `connectionconfig`
  - Context: `config?: Partial<ConnectionConfig>;`
- **ConnectionState** (line 34) - `connectionstate`
  - Context: `const [connectionState, setConnectionState] = useState<ConnectionState>({`
- **NodeJS** (line 47) - `nodejs`
  - Context: `const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);`
- **NodeJS** (line 48) - `nodejs`
  - Context: `const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);`
- **NodeJS** (line 49) - `nodejs`
  - Context: `const latencyTimeoutRef = useRef<NodeJS.Timeout | null>(null);`
- **NodeJS** (line 50) - `nodejs`
  - Context: `const networkStatusIntervalRef = useRef<NodeJS.Timeout | null>(null);`

#### lastMessageCheckRef
**File:** `src/components/chat/hooks/useEnhancedChat.ts`
**Lines:** 409
**Last Modified:** 2025-07-07T16:26:24.435Z

**Key Elements:**
- **ConnectionConfig** (line 20) - `connectionconfig`
  - Context: `config?: Partial<ConnectionConfig>;`
- **Date** (line 74) - `date`
  - Context: `const [lastSuccessfulConnection, setLastSuccessfulConnection] = useState<Date | ...`
- **NodeJS** (line 78) - `nodejs`
  - Context: `const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);`
- **Date** (line 79) - `date`
  - Context: `const lastMessageCheckRef = useRef<Date>(new Date());`

#### getTableName
**File:** `src/components/chat/hooks/useMessageQueue.ts`
**Lines:** 365
**Last Modified:** 2025-07-07T16:21:48.627Z

**Key Elements:**
- **ConnectionConfig** (line 15) - `connectionconfig`
  - Context: `config?: Partial<ConnectionConfig>;`
- **MessageQueue** (line 47) - `messagequeue`
  - Context: `const [queue, setQueue] = useState<MessageQueue>({`
- **NodeJS** (line 57) - `nodejs`
  - Context: `const processTimeoutRef = useRef<NodeJS.Timeout | null>(null);`
- **BaseMessage** (line 190) - `basemessage`
  - Context: `const sendMessage = useCallback(async (item: MessageQueueItem): Promise<BaseMess...`

### 📁 src/components/chat/services/

#### MessageService
**File:** `src/components/chat/services/MessageService.ts`
**Lines:** 289
**Last Modified:** 2025-07-06T21:46:20.124Z

**Key Elements:**
- **BaseMessage** (line 18) - `basemessage`
  - Context: `): Promise<BaseMessage[]> {`
- **BaseMessage** (line 62) - `basemessage`
  - Context: `): Promise<BaseMessage> {`
- **BaseMessage** (line 134) - `basemessage`
  - Context: `): Promise<BaseMessage> {`
- **BaseMessage** (line 176) - `basemessage`
  - Context: `): Promise<BaseMessage[]> {`

#### PermissionService
**File:** `src/components/chat/services/PermissionService.ts`
**Lines:** 275
**Last Modified:** 2025-07-06T21:48:08.198Z

**Key Elements:**
- **UserPermissions** (line 41) - `userpermissions`
  - Context: `): Promise<UserPermissions> {`

#### now
**File:** `src/components/chat/services/ReadStatusService.ts`
**Lines:** 336
**Last Modified:** 2025-07-06T21:47:34.260Z

**Key Elements:**
- **ReadStatus** (line 64) - `readstatus`
  - Context: `): Promise<ReadStatus | null> {`
- **Record** (line 171) - `record`
  - Context: `): Promise<Record<string, number>> {`

#### RealtimeService
**File:** `src/components/chat/services/RealtimeService.ts`
**Lines:** 252
**Last Modified:** 2025-07-06T21:46:52.556Z

#### index
**File:** `src/components/chat/services/index.ts`
**Lines:** 21
**Last Modified:** 2025-07-06T21:48:21.049Z

### 📁 src/components/chat/types/

#### ChatTypes
**File:** `src/components/chat/types/ChatTypes.ts`
**Lines:** 153
**Last Modified:** 2025-07-06T21:38:23.597Z

**Key Elements:**
- **ChatType** (line 74) - `chattype`
  - Context: `export const CHAT_CONFIGS: Record<ChatType, Partial<ChatConfig>> = {`

#### ConnectionTypes
**File:** `src/components/chat/types/ConnectionTypes.ts`
**Lines:** 121
**Last Modified:** 2025-07-07T16:19:07.201Z

**Key Elements:**
- **ConnectionStatus** (line 107) - `connectionstatus`
  - Context: `export const CONNECTION_STATUS_MESSAGES: Record<ConnectionStatus, string> = {`
- **ConnectionStatus** (line 115) - `connectionstatus`
  - Context: `export const CONNECTION_STATUS_COLORS: Record<ConnectionStatus, string> = {`

#### MessageTypes
**File:** `src/components/chat/types/MessageTypes.ts`
**Lines:** 148
**Last Modified:** 2025-07-06T21:38:48.556Z

**Key Elements:**
- **BaseMessage** (line 142) - `basemessage`
  - Context: `send: (content: string, type?: MessageType, metadata?: MessageMetadata) => Promi...`
- **BaseMessage** (line 147) - `basemessage`
  - Context: `reply: (messageId: string, content: string) => Promise<BaseMessage>;`

#### PermissionTypes
**File:** `src/components/chat/types/PermissionTypes.ts`
**Lines:** 142
**Last Modified:** 2025-07-06T21:39:28.537Z

**Key Elements:**
- **UserPermissions** (line 84) - `userpermissions`
  - Context: `) => Promise<UserPermissions>;`

#### ReadStatusTypes
**File:** `src/components/chat/types/ReadStatusTypes.ts`
**Lines:** 41
**Last Modified:** 2025-07-06T21:39:03.357Z

**Key Elements:**
- **ReadStatus** (line 20) - `readstatus`
  - Context: `getReadStatus: (roomId: string, userId: string) => Promise<ReadStatus | null>;`
- **NodeJS** (line 30) - `nodejs`
  - Context: `scrollTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;`

#### index
**File:** `src/components/chat/types/index.ts`
**Lines:** 54
**Last Modified:** 2025-07-07T16:19:29.052Z

### 📁 src/components/chat/ui/

#### handleDelete
**File:** `src/components/chat/ui/AdminControls.tsx`
**Lines:** 111
**Last Modified:** 2025-07-06T21:45:08.621Z

**Key Elements:**
- **Button** (line 63) - `button`
  - Context: `<Button`
- **Edit** (line 70) - `edit`
  - Context: `<Edit className="h-3 w-3" />`
- **Button** (line 75) - `button`
  - Context: `<Button`
- **Pin** (line 82) - `pin`
  - Context: `<Pin className="h-3 w-3" />`
- **Button** (line 87) - `button`
  - Context: `<Button`
- **Flag** (line 94) - `flag`
  - Context: `<Flag className="h-3 w-3" />`
- **Button** (line 99) - `button`
  - Context: `<Button`
- **X** (line 106) - `x`
  - Context: `<X className="h-3 w-3" />`

#### ChatContainer
**File:** `src/components/chat/ui/ChatContainer.tsx`
**Lines:** 23
**Last Modified:** 2025-07-06T21:44:50.197Z

**Key Elements:**
- **Card** (line 16) - `card`
  - Context: `<Card`

#### ChatHeader
**File:** `src/components/chat/ui/ChatHeader.tsx`
**Lines:** 49
**Last Modified:** 2025-07-06T21:44:28.693Z

**Key Elements:**
- **Button** (line 26) - `button`
  - Context: `<Button`
- **ArrowLeft** (line 32) - `arrowleft`
  - Context: `<ArrowLeft className="h-5 w-5" />`

#### getBannerContent
**File:** `src/components/chat/ui/ConnectionMonitor.tsx`
**Lines:** 301
**Last Modified:** 2025-07-07T16:24:30.891Z

**Key Elements:**
- **ConnectionIndicator** (line 72) - `connectionindicator`
  - Context: `<ConnectionIndicator connectionState={connectionState} />`
- **ConnectionStatus** (line 81) - `connectionstatus`
  - Context: `<ConnectionStatus`
- **Card** (line 90) - `card`
  - Context: `<Card>`
- **CardContent** (line 91) - `cardcontent`
  - Context: `<CardContent className="p-4">`
- **RefreshCw** (line 94) - `refreshcw`
  - Context: `<RefreshCw className="h-4 w-4 animate-spin text-orange-500" />`
- **Progress** (line 101) - `progress`
  - Context: `<Progress value={reconnectProgress} className="h-2" />`
- **Button** (line 105) - `button`
  - Context: `<Button`
- **Alert** (line 121) - `alert`
  - Context: `<Alert>`
- **WifiOff** (line 122) - `wifioff`
  - Context: `<WifiOff className="h-4 w-4" />`
- **AlertDescription** (line 123) - `alertdescription`
  - Context: `<AlertDescription>`
- **Alert** (line 131) - `alert`
  - Context: `<Alert variant="destructive">`
- **AlertTriangle** (line 132) - `alerttriangle`
  - Context: `<AlertTriangle className="h-4 w-4" />`
- **AlertDescription** (line 133) - `alertdescription`
  - Context: `<AlertDescription className="flex items-center justify-between">`
- **Button** (line 138) - `button`
  - Context: `<Button`
- **Alert** (line 155) - `alert`
  - Context: `<Alert>`
- **Signal** (line 156) - `signal`
  - Context: `<Signal className="h-4 w-4" />`
- **AlertDescription** (line 157) - `alertdescription`
  - Context: `<AlertDescription>`
- **Alert** (line 166) - `alert`
  - Context: `<Alert>`
- **Clock** (line 167) - `clock`
  - Context: `<Clock className="h-4 w-4" />`
- **AlertDescription** (line 168) - `alertdescription`
  - Context: `<AlertDescription>`
- **Card** (line 183) - `card`
  - Context: `<Card>`
- **CardContent** (line 184) - `cardcontent`
  - Context: `<CardContent className="p-4">`
- **WifiOff** (line 229) - `wifioff`
  - Context: `icon: <WifiOff className="h-4 w-4" />,`
- **AlertTriangle** (line 238) - `alerttriangle`
  - Context: `icon: <AlertTriangle className="h-4 w-4" />,`
- **RefreshCw** (line 247) - `refreshcw`
  - Context: `icon: <RefreshCw className="h-4 w-4 animate-spin" />,`
- **RefreshCw** (line 256) - `refreshcw`
  - Context: `icon: <RefreshCw className="h-4 w-4 animate-spin" />,`
- **Clock** (line 265) - `clock`
  - Context: `icon: <Clock className="h-4 w-4" />,`
- **Alert** (line 279) - `alert`
  - Context: `<Alert variant={content.variant} className={`border-l-4 ${className}`}>`
- **AlertDescription** (line 283) - `alertdescription`
  - Context: `<AlertDescription className="mb-0">`
- **Button** (line 289) - `button`
  - Context: `<Button`

#### getStatusIcon
**File:** `src/components/chat/ui/ConnectionStatus.tsx`
**Lines:** 290
**Last Modified:** 2025-07-07T16:23:38.058Z

**Key Elements:**
- **CheckCircle** (line 44) - `checkcircle`
  - Context: `return <CheckCircle {...iconProps} className="h-4 w-4 text-green-500" />;`
- **RefreshCw** (line 46) - `refreshcw`
  - Context: `return <RefreshCw {...iconProps} className="h-4 w-4 text-yellow-500 animate-spin...`
- **WifiOff** (line 48) - `wifioff`
  - Context: `return <WifiOff {...iconProps} className="h-4 w-4 text-red-500" />;`
- **RefreshCw** (line 50) - `refreshcw`
  - Context: `return <RefreshCw {...iconProps} className="h-4 w-4 text-orange-500 animate-spin...`
- **AlertTriangle** (line 52) - `alerttriangle`
  - Context: `return <AlertTriangle {...iconProps} className="h-4 w-4 text-red-600" />;`
- **Wifi** (line 54) - `wifi`
  - Context: `return <Wifi {...iconProps} className="h-4 w-4 text-gray-500" />;`
- **TooltipProvider** (line 101) - `tooltipprovider`
  - Context: `<TooltipProvider>`
- **Tooltip** (line 102) - `tooltip`
  - Context: `<Tooltip>`
- **TooltipTrigger** (line 103) - `tooltiptrigger`
  - Context: `<TooltipTrigger asChild>`
- **WifiOff** (line 106) - `wifioff`
  - Context: `{!isOnline && <WifiOff className="h-3 w-3 text-red-500" />}`
- **TooltipContent** (line 109) - `tooltipcontent`
  - Context: `<TooltipContent>`
- **Badge** (line 125) - `badge`
  - Context: `<Badge variant={getBadgeVariant(status)} className="flex items-center gap-2">`
- **Badge** (line 132) - `badge`
  - Context: `<Badge variant="destructive" className="flex items-center gap-1">`
- **WifiOff** (line 133) - `wifioff`
  - Context: `<WifiOff className="h-3 w-3" />`
- **Activity** (line 141) - `activity`
  - Context: `<Activity className="h-4 w-4 text-gray-500" />`
- **TooltipProvider** (line 158) - `tooltipprovider`
  - Context: `<TooltipProvider>`
- **Tooltip** (line 159) - `tooltip`
  - Context: `<Tooltip>`
- **TooltipTrigger** (line 160) - `tooltiptrigger`
  - Context: `<TooltipTrigger asChild>`
- **Clock** (line 162) - `clock`
  - Context: `<Clock className="h-3 w-3" />`
- **TooltipContent** (line 166) - `tooltipcontent`
  - Context: `<TooltipContent>`
- **Button** (line 181) - `button`
  - Context: `<Button`
- **RefreshCw** (line 187) - `refreshcw`
  - Context: `<RefreshCw className="h-3 w-3 mr-1" />`
- **Button** (line 193) - `button`
  - Context: `<Button`
- **TooltipProvider** (line 207) - `tooltipprovider`
  - Context: `<TooltipProvider>`
- **Tooltip** (line 208) - `tooltip`
  - Context: `<Tooltip>`
- **TooltipTrigger** (line 209) - `tooltiptrigger`
  - Context: `<TooltipTrigger asChild>`
- **AlertTriangle** (line 210) - `alerttriangle`
  - Context: `<AlertTriangle className="h-4 w-4 text-red-500 cursor-help" />`
- **TooltipContent** (line 212) - `tooltipcontent`
  - Context: `<TooltipContent>`
- **WifiOff** (line 241) - `wifioff`
  - Context: `{!isOnline && <WifiOff className="h-3 w-3 text-red-500" />}`

#### LoadingSpinner
**File:** `src/components/chat/ui/LoadingSpinner.tsx`
**Lines:** 21
**Last Modified:** 2025-07-06T21:45:19.330Z

**Key Elements:**
- **Card** (line 14) - `card`
  - Context: `<Card className={`h-full flex items-center justify-center ${className}`}>`

#### handleDelete
**File:** `src/components/chat/ui/MessageBubble.tsx`
**Lines:** 103
**Last Modified:** 2025-07-06T21:43:39.481Z

**Key Elements:**
- **Avatar** (line 56) - `avatar`
  - Context: `<Avatar className="h-8 w-8 flex-shrink-0">`
- **AvatarImage** (line 57) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 58) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Button** (line 78) - `button`
  - Context: `<Button`
- **X** (line 85) - `x`
  - Context: `<X className="h-3 w-3" />`

#### handleKeyPress
**File:** `src/components/chat/ui/MessageInput.tsx`
**Lines:** 66
**Last Modified:** 2025-07-06T21:44:14.398Z

**Key Elements:**
- **HTMLInputElement** (line 27) - `htmlinputelement`
  - Context: `const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {`
- **Input** (line 45) - `input`
  - Context: `<Input`
- **Button** (line 55) - `button`
  - Context: `<Button`
- **Send** (line 60) - `send`
  - Context: `<Send className="h-4 w-4" />`

#### MessageList
**File:** `src/components/chat/ui/MessageList.tsx`
**Lines:** 70
**Last Modified:** 2025-07-07T02:14:24.965Z

**Key Elements:**
- **HTMLDivElement** (line 17) - `htmldivelement`
  - Context: `export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(({`
- **MessageBubble** (line 56) - `messagebubble`
  - Context: `<MessageBubble`

#### handleToggle
**File:** `src/components/chat/ui/SearchBar.tsx`
**Lines:** 49
**Last Modified:** 2025-07-06T21:44:41.106Z

**Key Elements:**
- **Input** (line 33) - `input`
  - Context: `<Input`
- **Button** (line 40) - `button`
  - Context: `<Button`
- **X** (line 45) - `x`
  - Context: `{showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}`
- **Search** (line 45) - `search`
  - Context: `{showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}`

#### index
**File:** `src/components/chat/ui/index.ts`
**Lines:** 20
**Last Modified:** 2025-07-07T16:25:36.553Z

### 📁 src/components/layout/

#### Layout
**File:** `src/components/layout/Layout.tsx`
**Lines:** 26
**Last Modified:** 2025-07-07T18:06:25.849Z

**Key Elements:**
- **NavBar** (line 13) - `navbar`
  - Context: `<NavBar />`

#### location
**File:** `src/components/layout/NavBar.tsx`
**Lines:** 141
**Last Modified:** 2025-07-07T02:32:36.043Z

**Key Elements:**
- **Link** (line 29) - `link`
  - Context: `<Link to="/" className="flex items-center space-x-2">`
- **Mountain** (line 30) - `mountain`
  - Context: `<Mountain className="h-8 w-8 text-green-600" />`
- **Link** (line 45) - `link`
  - Context: `<Link`
- **Icon** (line 54) - `icon`
  - Context: `<Icon className="h-4 w-4" />`
- **Link** (line 60) - `link`
  - Context: `<Link to="/profile">`
- **Avatar** (line 61) - `avatar`
  - Context: `<Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-green-300 tran...`
- **AvatarImage** (line 62) - `avatarimage`
  - Context: `<AvatarImage src={user?.user_metadata?.avatar_url} />`
- **AvatarFallback** (line 63) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Button** (line 68) - `button`
  - Context: `<Button variant="ghost" size="sm" onClick={signOut}>`
- **LogOut** (line 69) - `logout`
  - Context: `<LogOut className="h-4 w-4" />`
- **Sheet** (line 76) - `sheet`
  - Context: `<Sheet open={isOpen} onOpenChange={setIsOpen}>`
- **SheetTrigger** (line 77) - `sheettrigger`
  - Context: `<SheetTrigger asChild>`
- **Button** (line 78) - `button`
  - Context: `<Button variant="ghost" size="sm">`
- **Menu** (line 79) - `menu`
  - Context: `<Menu className="h-6 w-6" />`
- **SheetContent** (line 82) - `sheetcontent`
  - Context: `<SheetContent side="right" className="w-64">`
- **Link** (line 84) - `link`
  - Context: `<Link`
- **Avatar** (line 89) - `avatar`
  - Context: `<Avatar className="h-10 w-10">`
- **AvatarImage** (line 90) - `avatarimage`
  - Context: `<AvatarImage src={user?.user_metadata?.avatar_url} />`
- **AvatarFallback** (line 91) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Link** (line 105) - `link`
  - Context: `<Link`
- **Icon** (line 115) - `icon`
  - Context: `<Icon className="h-5 w-5" />`
- **Button** (line 121) - `button`
  - Context: `<Button`
- **LogOut** (line 129) - `logout`
  - Context: `<LogOut className="h-5 w-5 mr-3" />`

### 📁 src/components/ui/

#### accordion
**File:** `src/components/ui/accordion.tsx`
**Lines:** 57
**Last Modified:** 2025-07-03T21:42:28.163Z

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
**Last Modified:** 2025-07-03T21:42:28.169Z

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
**Last Modified:** 2025-07-03T21:42:28.173Z

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
**Last Modified:** 2025-07-03T21:42:28.177Z

#### avatar
**File:** `src/components/ui/avatar.tsx`
**Lines:** 49
**Last Modified:** 2025-07-03T21:42:28.183Z

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
**Last Modified:** 2025-07-03T21:42:28.187Z

**Key Elements:**
- **HTMLDivElement** (line 27) - `htmldivelement`
  - Context: `extends React.HTMLAttributes<HTMLDivElement>,`

#### breadcrumb
**File:** `src/components/ui/breadcrumb.tsx`
**Lines:** 116
**Last Modified:** 2025-07-03T21:42:28.191Z

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
**Last Modified:** 2025-07-03T21:42:28.196Z

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
**Last Modified:** 2025-07-03T21:42:28.200Z

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
**Last Modified:** 2025-07-03T21:42:28.204Z

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
**Last Modified:** 2025-07-03T21:42:28.208Z

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
**Last Modified:** 2025-07-03T21:42:28.213Z

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
**Last Modified:** 2025-07-03T21:42:28.217Z

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
**Last Modified:** 2025-07-03T21:42:28.221Z

#### CommandDialog
**File:** `src/components/ui/command.tsx`
**Lines:** 154
**Last Modified:** 2025-07-03T21:42:28.228Z

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
**Last Modified:** 2025-07-03T21:42:28.232Z

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
**Last Modified:** 2025-07-03T21:42:28.236Z

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
**Last Modified:** 2025-07-03T21:42:28.240Z

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
**Last Modified:** 2025-07-03T21:42:28.244Z

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

#### useFormField
**File:** `src/components/ui/form.tsx`
**Lines:** 177
**Last Modified:** 2025-07-03T21:42:28.249Z

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
**Last Modified:** 2025-07-03T21:42:28.253Z

**Key Elements:**
- **HoverCardPrimitive** (line 14) - `hovercardprimitive`
  - Context: `<HoverCardPrimitive.Content`

#### input-otp
**File:** `src/components/ui/input-otp.tsx`
**Lines:** 70
**Last Modified:** 2025-07-03T21:42:28.257Z

**Key Elements:**
- **OTPInput** (line 11) - `otpinput`
  - Context: `<OTPInput`
- **Dot** (line 64) - `dot`
  - Context: `<Dot />`

#### Input
**File:** `src/components/ui/input.tsx`
**Lines:** 23
**Last Modified:** 2025-07-03T21:42:28.261Z

**Key Elements:**
- **HTMLInputElement** (line 5) - `htmlinputelement`
  - Context: `const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(`

#### label
**File:** `src/components/ui/label.tsx`
**Lines:** 25
**Last Modified:** 2025-07-03T21:42:28.266Z

**Key Elements:**
- **LabelPrimitive** (line 16) - `labelprimitive`
  - Context: `<LabelPrimitive.Root`

#### menubar
**File:** `src/components/ui/menubar.tsx`
**Lines:** 235
**Last Modified:** 2025-07-03T21:42:28.272Z

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
**Last Modified:** 2025-07-03T21:42:28.276Z

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
**Last Modified:** 2025-07-03T21:42:28.280Z

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
**Last Modified:** 2025-07-03T21:42:28.284Z

**Key Elements:**
- **PopoverPrimitive** (line 14) - `popoverprimitive`
  - Context: `<PopoverPrimitive.Portal>`
- **PopoverPrimitive** (line 15) - `popoverprimitive`
  - Context: `<PopoverPrimitive.Content`

#### progress
**File:** `src/components/ui/progress.tsx`
**Lines:** 27
**Last Modified:** 2025-07-03T21:42:28.289Z

**Key Elements:**
- **ProgressPrimitive** (line 10) - `progressprimitive`
  - Context: `<ProgressPrimitive.Root`
- **ProgressPrimitive** (line 18) - `progressprimitive`
  - Context: `<ProgressPrimitive.Indicator`

#### radio-group
**File:** `src/components/ui/radio-group.tsx`
**Lines:** 43
**Last Modified:** 2025-07-03T21:42:28.293Z

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
**Last Modified:** 2025-07-03T21:42:28.297Z

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
**Last Modified:** 2025-07-03T21:42:28.301Z

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
**Last Modified:** 2025-07-03T21:42:28.306Z

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
**Last Modified:** 2025-07-03T21:42:28.310Z

**Key Elements:**
- **SeparatorPrimitive** (line 14) - `separatorprimitive`
  - Context: `<SeparatorPrimitive.Root`

#### sheet
**File:** `src/components/ui/sheet.tsx`
**Lines:** 132
**Last Modified:** 2025-07-03T21:42:28.314Z

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
**Last Modified:** 2025-07-03T21:42:28.319Z

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
**Last Modified:** 2025-07-03T21:42:28.324Z

**Key Elements:**
- **HTMLDivElement** (line 6) - `htmldivelement`
  - Context: `}: React.HTMLAttributes<HTMLDivElement>) {`

#### slider
**File:** `src/components/ui/slider.tsx`
**Lines:** 27
**Last Modified:** 2025-07-03T21:42:28.331Z

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
**Last Modified:** 2025-07-03T21:42:28.335Z

**Key Elements:**
- **Sonner** (line 10) - `sonner`
  - Context: `<Sonner`

#### switch
**File:** `src/components/ui/switch.tsx`
**Lines:** 28
**Last Modified:** 2025-07-03T21:42:28.339Z

**Key Elements:**
- **SwitchPrimitives** (line 10) - `switchprimitives`
  - Context: `<SwitchPrimitives.Root`
- **SwitchPrimitives** (line 18) - `switchprimitives`
  - Context: `<SwitchPrimitives.Thumb`

#### table
**File:** `src/components/ui/table.tsx`
**Lines:** 118
**Last Modified:** 2025-07-03T21:42:28.343Z

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
**Last Modified:** 2025-07-03T21:42:28.348Z

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
**Last Modified:** 2025-07-03T21:42:28.352Z

**Key Elements:**
- **HTMLTextAreaElement** (line 6) - `htmltextareaelement`
  - Context: `extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}`
- **HTMLTextAreaElement** (line 8) - `htmltextareaelement`
  - Context: `const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(`

#### toast
**File:** `src/components/ui/toast.tsx`
**Lines:** 128
**Last Modified:** 2025-07-07T02:06:34.211Z

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
**Last Modified:** 2025-07-06T20:22:43.542Z

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
**Last Modified:** 2025-07-03T21:42:28.364Z

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
**Last Modified:** 2025-07-03T21:42:28.368Z

**Key Elements:**
- **TogglePrimitive** (line 34) - `toggleprimitive`
  - Context: `<TogglePrimitive.Root`

#### tooltip
**File:** `src/components/ui/tooltip.tsx`
**Lines:** 29
**Last Modified:** 2025-07-03T21:42:28.373Z

**Key Elements:**
- **TooltipPrimitive** (line 16) - `tooltipprimitive`
  - Context: `<TooltipPrimitive.Content`

#### use-toast
**File:** `src/components/ui/use-toast.ts`
**Lines:** 4
**Last Modified:** 2025-07-03T21:42:28.377Z

### 📁 src/pages/

#### checkAdminStatus
**File:** `src/pages/Administrator.tsx`
**Lines:** 328
**Last Modified:** 2025-07-06T03:19:45.965Z

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
  - Context: `<Card>`
- **CardHeader** (line 224) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 225) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Total Users</CardTitle>`
- **Users** (line 226) - `users`
  - Context: `<Users className="h-4 w-4 text-blue-600" />`
- **CardContent** (line 228) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 233) - `card`
  - Context: `<Card>`
- **CardHeader** (line 234) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 235) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Total Messages</CardTitle>`
- **MessageSquare** (line 236) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4 text-green-600" />`
- **CardContent** (line 238) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 243) - `card`
  - Context: `<Card>`
- **CardHeader** (line 244) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 245) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Total Events</CardTitle>`
- **Calendar** (line 246) - `calendar`
  - Context: `<Calendar className="h-4 w-4 text-orange-600" />`
- **CardContent** (line 248) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 253) - `card`
  - Context: `<Card>`
- **CardHeader** (line 254) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 255) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Total Groups</CardTitle>`
- **Users** (line 256) - `users`
  - Context: `<Users className="h-4 w-4 text-purple-600" />`
- **CardContent** (line 258) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 265) - `card`
  - Context: `<Card>`
- **CardHeader** (line 266) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 267) - `cardtitle`
  - Context: `<CardTitle className="flex items-center gap-2">`
- **UserCog** (line 268) - `usercog`
  - Context: `<UserCog className="h-5 w-5" />`
- **CardDescription** (line 271) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 275) - `cardcontent`
  - Context: `<CardContent>`
- **Avatar** (line 280) - `avatar`
  - Context: `<Avatar>`
- **AvatarImage** (line 281) - `avatarimage`
  - Context: `<AvatarImage src={userData.avatar_url} />`
- **AvatarFallback** (line 282) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Badge** (line 290) - `badge`
  - Context: `<Badge variant="secondary" className="text-xs">`
- **Shield** (line 291) - `shield`
  - Context: `<Shield className="h-3 w-3 mr-1" />`
- **Button** (line 303) - `button`
  - Context: `<Button`
- **Button** (line 311) - `button`
  - Context: `<Button`
- **Trash2** (line 318) - `trash2`
  - Context: `<Trash2 className="h-4 w-4" />`

#### handleSignIn
**File:** `src/pages/Auth.tsx`
**Lines:** 176
**Last Modified:** 2025-07-03T21:42:28.433Z

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

#### viewport
**File:** `src/pages/ClubTalk.tsx`
**Lines:** 402
**Last Modified:** 2025-07-07T18:03:24.439Z

**Key Elements:**
- **ClubMessage** (line 24) - `clubmessage`
  - Context: `const [messages, setMessages] = useState<ClubMessage[]>([]);`
- **HTMLDivElement** (line 30) - `htmldivelement`
  - Context: `const viewportRef = useRef<HTMLDivElement>(null);`
- **Card** (line 247) - `card`
  - Context: `<Card className="p-8 text-center">`
- **Card** (line 258) - `card`
  - Context: `<Card className="h-full flex items-center justify-center">`
- **Input** (line 275) - `input`
  - Context: `<Input`
- **Button** (line 282) - `button`
  - Context: `<Button`
- **Search** (line 287) - `search`
  - Context: `<Search className="h-4 w-4" />`
- **Avatar** (line 319) - `avatar`
  - Context: `<Avatar className="h-8 w-8 flex-shrink-0">`
- **AvatarImage** (line 320) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 321) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Button** (line 335) - `button`
  - Context: `<Button`
- **X** (line 342) - `x`
  - Context: `<X className="h-3 w-3" />`
- **Input** (line 377) - `input`
  - Context: `<Input`
- **Button** (line 390) - `button`
  - Context: `<Button`
- **Send** (line 396) - `send`
  - Context: `<Send className="h-4 w-4" />`

#### navigate
**File:** `src/pages/Community.tsx`
**Lines:** 303
**Last Modified:** 2025-07-07T02:00:57.537Z

**Key Elements:**
- **TopicChat** (line 48) - `topicchat`
  - Context: `const [chats, setChats] = useState<TopicChat[]>([]);`
- **Card** (line 232) - `card`
  - Context: `<Card`
- **CardHeader** (line 240) - `cardheader`
  - Context: `<CardHeader>`
- **Avatar** (line 243) - `avatar`
  - Context: `<Avatar className="h-12 w-12">`
- **AvatarImage** (line 245) - `avatarimage`
  - Context: `<AvatarImage src={chat.avatar_url} />`
- **AvatarFallback** (line 247) - `avatarfallback`
  - Context: `<AvatarFallback className="bg-green-100">`
- **IconComponent** (line 248) - `iconcomponent`
  - Context: `<IconComponent className="h-6 w-6 text-green-600" />`
- **CardTitle** (line 253) - `cardtitle`
  - Context: `<CardTitle className="text-lg flex items-center gap-2">`
- **Badge** (line 260) - `badge`
  - Context: `<Badge variant="secondary" className="mt-1">`
- **CardContent** (line 268) - `cardcontent`
  - Context: `<CardContent className="space-y-4">`
- **CardDescription** (line 269) - `carddescription`
  - Context: `<CardDescription>{chat.description}</CardDescription>`
- **Users** (line 273) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Button** (line 280) - `button`
  - Context: `<Button`
- **MessageCircle** (line 284) - `messagecircle`
  - Context: `<MessageCircle className="h-4 w-4 mr-2" />`
- **Button** (line 288) - `button`
  - Context: `<Button`

#### navigate
**File:** `src/pages/EventChat.tsx`
**Lines:** 510
**Last Modified:** 2025-07-07T16:14:28.100Z

**Key Elements:**
- **Event** (line 41) - `event`
  - Context: `const [event, setEvent] = useState<Event | null>(null);`
- **EventMessage** (line 42) - `eventmessage`
  - Context: `const [messages, setMessages] = useState<EventMessage[]>([]);`
- **HTMLDivElement** (line 47) - `htmldivelement`
  - Context: `const viewportRef = useRef<HTMLDivElement>(null);`
- **NodeJS** (line 48) - `nodejs`
  - Context: `const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);`
- **Card** (line 349) - `card`
  - Context: `<Card className="p-8">`
- **Card** (line 359) - `card`
  - Context: `<Card className="p-8 text-center">`
- **Button** (line 362) - `button`
  - Context: `<Button onClick={() => navigate('/events')}>Back to Events</Button>`
- **Button** (line 382) - `button`
  - Context: `<Button`
- **ArrowLeft** (line 388) - `arrowleft`
  - Context: `<ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />`
- **CalendarDays** (line 394) - `calendardays`
  - Context: `<CalendarDays className="h-4 w-4 mr-1" />`
- **MapPin** (line 398) - `mappin`
  - Context: `<MapPin className="h-4 w-4 mr-1" />`
- **Users** (line 402) - `users`
  - Context: `<Users className="h-4 w-4 mr-1" />`
- **Users** (line 409) - `users`
  - Context: `<Users className="h-3 w-3 mr-1" />`
- **Avatar** (line 435) - `avatar`
  - Context: `<Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">`
- **AvatarImage** (line 436) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 437) - `avatarfallback`
  - Context: `<AvatarFallback className="text-xs">`
- **Button** (line 454) - `button`
  - Context: `<Button`
- **X** (line 461) - `x`
  - Context: `<X className="h-3 w-3" />`
- **Input** (line 491) - `input`
  - Context: `<Input`
- **Button** (line 498) - `button`
  - Context: `<Button`
- **Send** (line 504) - `send`
  - Context: `<Send className="h-4 w-4" />`

#### loadEvents
**File:** `src/pages/Events.tsx`
**Lines:** 652
**Last Modified:** 2025-07-07T02:06:10.973Z

**Key Elements:**
- **Event** (line 36) - `event`
  - Context: `const [events, setEvents] = useState<Event[]>([]);`
- **Card** (line 358) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 359) - `cardcontent`
  - Context: `<CardContent>`
- **CalendarDays** (line 360) - `calendardays`
  - Context: `<CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Card** (line 395) - `card`
  - Context: `<Card`
- **CardHeader** (line 403) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 405) - `cardtitle`
  - Context: `<CardTitle className="text-lg flex items-center gap-2">`
- **Badge** (line 411) - `badge`
  - Context: `<Badge variant="secondary" className="bg-green-100 text-green-800">`
- **CardDescription** (line 415) - `carddescription`
  - Context: `<CardDescription>{event.description}</CardDescription>`
- **CardContent** (line 417) - `cardcontent`
  - Context: `<CardContent className="space-y-4">`
- **CalendarDays** (line 420) - `calendardays`
  - Context: `<CalendarDays className="h-4 w-4 mr-2" />`
- **MapPin** (line 424) - `mappin`
  - Context: `<MapPin className="h-4 w-4 mr-2" />`
- **Users** (line 428) - `users`
  - Context: `<Users className="h-4 w-4 mr-2" />`
- **Button** (line 433) - `button`
  - Context: `<Button`
- **Link** (line 439) - `link`
  - Context: `<Link`
- **MessageSquare** (line 443) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4 mr-2" />`
- **Button** (line 447) - `button`
  - Context: `<Button`
- **Dialog** (line 464) - `dialog`
  - Context: `<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>`
- **DialogTrigger** (line 465) - `dialogtrigger`
  - Context: `<DialogTrigger asChild>`
- **Button** (line 466) - `button`
  - Context: `<Button className="bg-green-600 hover:bg-green-700">`
- **Plus** (line 467) - `plus`
  - Context: `<Plus className="h-4 w-4 mr-2" />`
- **DialogContent** (line 471) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 472) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 473) - `dialogtitle`
  - Context: `<DialogTitle>Create New Event</DialogTitle>`
- **Label** (line 477) - `label`
  - Context: `<Label htmlFor="title">Event Title</Label>`
- **Input** (line 478) - `input`
  - Context: `<Input`
- **Label** (line 486) - `label`
  - Context: `<Label htmlFor="description">Description</Label>`
- **Textarea** (line 487) - `textarea`
  - Context: `<Textarea`
- **Label** (line 495) - `label`
  - Context: `<Label htmlFor="location">Location</Label>`
- **Input** (line 496) - `input`
  - Context: `<Input`
- **Label** (line 504) - `label`
  - Context: `<Label htmlFor="event_date">Date & Time</Label>`
- **Input** (line 505) - `input`
  - Context: `<Input`
- **Label** (line 514) - `label`
  - Context: `<Label htmlFor="max_participants">Max Participants (optional)</Label>`
- **Input** (line 515) - `input`
  - Context: `<Input`
- **Button** (line 523) - `button`
  - Context: `<Button type="submit" className="w-full">Create Event</Button>`
- **Card** (line 530) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 531) - `cardcontent`
  - Context: `<CardContent>`
- **CalendarDays** (line 532) - `calendardays`
  - Context: `<CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Card** (line 540) - `card`
  - Context: `<Card`
- **CardHeader** (line 548) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 550) - `cardtitle`
  - Context: `<CardTitle className="text-lg flex items-center gap-2">`
- **Badge** (line 557) - `badge`
  - Context: `<Badge variant="secondary" className="bg-green-100 text-green-800">`
- **CardDescription** (line 562) - `carddescription`
  - Context: `<CardDescription>{event.description}</CardDescription>`
- **CardContent** (line 564) - `cardcontent`
  - Context: `<CardContent className="space-y-4">`
- **CalendarDays** (line 567) - `calendardays`
  - Context: `<CalendarDays className="h-4 w-4 mr-2" />`
- **MapPin** (line 571) - `mappin`
  - Context: `<MapPin className="h-4 w-4 mr-2" />`
- **Users** (line 575) - `users`
  - Context: `<Users className="h-4 w-4 mr-2" />`
- **Button** (line 581) - `button`
  - Context: `<Button`
- **Link** (line 587) - `link`
  - Context: `<Link`
- **MessageSquare** (line 591) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4 mr-2" />`
- **Button** (line 595) - `button`
  - Context: `<Button`
- **Button** (line 604) - `button`
  - Context: `<Button`
- **Loader2** (line 616) - `loader2`
  - Context: `<Loader2 className="h-4 w-4 mr-2 animate-spin" />`
- **Dialog** (line 631) - `dialog`
  - Context: `<Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>`
- **DialogContent** (line 632) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 633) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 634) - `dialogtitle`
  - Context: `<DialogTitle>Leave Event</DialogTitle>`
- **DialogDescription** (line 635) - `dialogdescription`
  - Context: `<DialogDescription>`
- **DialogFooter** (line 639) - `dialogfooter`
  - Context: `<DialogFooter>`
- **Button** (line 640) - `button`
  - Context: `<Button variant="outline" onClick={cancelLeave}>`
- **Button** (line 643) - `button`
  - Context: `<Button variant="destructive" onClick={confirmLeave}>`

#### location
**File:** `src/pages/GroupChat.tsx`
**Lines:** 18
**Last Modified:** 2025-07-06T02:37:21.180Z

**Key Elements:**
- **GroupChatComponent** (line 17) - `groupchatcomponent`
  - Context: `return <GroupChatComponent groupId={groupId} groupName={groupName} />;`

#### navigate
**File:** `src/pages/Groups.tsx`
**Lines:** 387
**Last Modified:** 2025-07-07T02:00:20.956Z

**Key Elements:**
- **Group** (line 26) - `group`
  - Context: `const [groups, setGroups] = useState<Group[]>([]);`
- **Card** (line 280) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 281) - `cardcontent`
  - Context: `<CardContent>`
- **Users** (line 282) - `users`
  - Context: `<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Card** (line 290) - `card`
  - Context: `<Card`
- **CardHeader** (line 298) - `cardheader`
  - Context: `<CardHeader>`
- **Avatar** (line 301) - `avatar`
  - Context: `<Avatar className="h-12 w-12">`
- **AvatarImage** (line 302) - `avatarimage`
  - Context: `<AvatarImage src={group.avatar_url || undefined} />`
- **AvatarFallback** (line 303) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **CardTitle** (line 308) - `cardtitle`
  - Context: `<CardTitle className="text-lg flex items-center gap-2">`
- **Badge** (line 315) - `badge`
  - Context: `<Badge variant="secondary" className="mt-1">`
- **CardContent** (line 323) - `cardcontent`
  - Context: `<CardContent className="space-y-4">`
- **CardDescription** (line 324) - `carddescription`
  - Context: `<CardDescription>{group.description}</CardDescription>`
- **Users** (line 328) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Button** (line 336) - `button`
  - Context: `<Button`
- **MessageSquare** (line 340) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4 mr-2" />`
- **Button** (line 343) - `button`
  - Context: `<Button`
- **Button** (line 351) - `button`
  - Context: `<Button`
- **ArrowRight** (line 356) - `arrowright`
  - Context: `<ArrowRight className="h-4 w-4 ml-2" />`
- **Dialog** (line 367) - `dialog`
  - Context: `<Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>`
- **DialogContent** (line 368) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 369) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 370) - `dialogtitle`
  - Context: `<DialogTitle>Leave Group</DialogTitle>`
- **DialogDescription** (line 371) - `dialogdescription`
  - Context: `<DialogDescription>`
- **DialogFooter** (line 375) - `dialogfooter`
  - Context: `<DialogFooter>`
- **Button** (line 376) - `button`
  - Context: `<Button variant="outline" onClick={cancelLeave}>`
- **Button** (line 379) - `button`
  - Context: `<Button variant="destructive" onClick={confirmLeave}>`

#### Home
**File:** `src/pages/Home.tsx`
**Lines:** 145
**Last Modified:** 2025-07-07T02:34:19.787Z

**Key Elements:**
- **Mountain** (line 17) - `mountain`
  - Context: `<Mountain className="h-16 w-16 text-green-600 mr-4" />`
- **Button** (line 26) - `button`
  - Context: `<Button asChild size="lg" className="bg-green-600 hover:bg-green-700">`
- **Link** (line 27) - `link`
  - Context: `<Link to="/auth">Join the Community</Link>`
- **Card** (line 32) - `card`
  - Context: `<Card>`
- **CardHeader** (line 33) - `cardheader`
  - Context: `<CardHeader>`
- **Users** (line 34) - `users`
  - Context: `<Users className="h-8 w-8 text-green-600 mb-2" />`
- **CardTitle** (line 35) - `cardtitle`
  - Context: `<CardTitle>Group Chats</CardTitle>`
- **CardDescription** (line 36) - `carddescription`
  - Context: `<CardDescription>`
- **Card** (line 41) - `card`
  - Context: `<Card>`
- **CardHeader** (line 42) - `cardheader`
  - Context: `<CardHeader>`
- **Calendar** (line 43) - `calendar`
  - Context: `<Calendar className="h-8 w-8 text-orange-600 mb-2" />`
- **CardTitle** (line 44) - `cardtitle`
  - Context: `<CardTitle>Climbing Events</CardTitle>`
- **CardDescription** (line 45) - `carddescription`
  - Context: `<CardDescription>`
- **Card** (line 50) - `card`
  - Context: `<Card>`
- **CardHeader** (line 51) - `cardheader`
  - Context: `<CardHeader>`
- **Users** (line 52) - `users`
  - Context: `<Users className="h-8 w-8 text-blue-600 mb-2" />`
- **CardTitle** (line 53) - `cardtitle`
  - Context: `<CardTitle>Find Partners</CardTitle>`
- **CardDescription** (line 54) - `carddescription`
  - Context: `<CardDescription>`
- **Button** (line 68) - `button`
  - Context: `<Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">`
- **Link** (line 69) - `link`
  - Context: `<Link to="/auth">Get Started Today</Link>`
- **Card** (line 89) - `card`
  - Context: `<Card className="hover:shadow-lg transition-shadow">`
- **CardHeader** (line 90) - `cardheader`
  - Context: `<CardHeader>`
- **Users** (line 91) - `users`
  - Context: `<Users className="h-8 w-8 text-purple-600 mb-2" />`
- **CardTitle** (line 92) - `cardtitle`
  - Context: `<CardTitle>Your Community</CardTitle>`
- **CardDescription** (line 93) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 97) - `cardcontent`
  - Context: `<CardContent>`
- **Button** (line 99) - `button`
  - Context: `<Button asChild size="sm">`
- **Link** (line 100) - `link`
  - Context: `<Link to="/club-talk">Club Talk</Link>`
- **Button** (line 102) - `button`
  - Context: `<Button asChild size="sm">`
- **Link** (line 103) - `link`
  - Context: `<Link to="/groups">Gym Talk</Link>`
- **Button** (line 105) - `button`
  - Context: `<Button asChild size="sm">`
- **Link** (line 106) - `link`
  - Context: `<Link to="/community">Crag Talk</Link>`
- **Card** (line 112) - `card`
  - Context: `<Card className="hover:shadow-lg transition-shadow">`
- **CardHeader** (line 113) - `cardheader`
  - Context: `<CardHeader>`
- **Calendar** (line 114) - `calendar`
  - Context: `<Calendar className="h-8 w-8 text-orange-600 mb-2" />`
- **CardTitle** (line 115) - `cardtitle`
  - Context: `<CardTitle>Upcoming Events</CardTitle>`
- **CardDescription** (line 116) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 120) - `cardcontent`
  - Context: `<CardContent>`
- **Button** (line 121) - `button`
  - Context: `<Button asChild variant="outline" className="w-full">`
- **Link** (line 122) - `link`
  - Context: `<Link to="/events">View Events</Link>`
- **Card** (line 127) - `card`
  - Context: `<Card className="hover:shadow-lg transition-shadow">`
- **CardHeader** (line 128) - `cardheader`
  - Context: `<CardHeader>`
- **Users** (line 129) - `users`
  - Context: `<Users className="h-8 w-8 text-blue-600 mb-2" />`
- **CardTitle** (line 130) - `cardtitle`
  - Context: `<CardTitle>Your Profile</CardTitle>`
- **CardDescription** (line 131) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 135) - `cardcontent`
  - Context: `<CardContent>`
- **Button** (line 136) - `button`
  - Context: `<Button asChild variant="outline" className="w-full">`
- **Link** (line 137) - `link`
  - Context: `<Link to="/profile">Edit Profile</Link>`

#### Index
**File:** `src/pages/Index.tsx`
**Lines:** 15
**Last Modified:** 2025-07-03T21:42:28.448Z

#### NotFound
**File:** `src/pages/NotFound.tsx`
**Lines:** 28
**Last Modified:** 2025-07-03T21:42:28.453Z

#### loadProfile
**File:** `src/pages/Profile.tsx`
**Lines:** 886
**Last Modified:** 2025-07-07T02:45:47.561Z

**Key Elements:**
- **Profile** (line 46) - `profile`
  - Context: `const [profile, setProfile] = useState<Profile | null>(null);`
- **GroupChat** (line 53) - `groupchat`
  - Context: `const [groupChats, setGroupChats] = useState<GroupChat[]>([]);`
- **EventChat** (line 54) - `eventchat`
  - Context: `const [eventChats, setEventChats] = useState<EventChat[]>([]);`
- **HTMLInputElement** (line 357) - `htmlinputelement`
  - Context: `const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {`
- **Card** (line 479) - `card`
  - Context: `<Card>`
- **CardHeader** (line 480) - `cardheader`
  - Context: `<CardHeader>`
- **CardContent** (line 486) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 501) - `card`
  - Context: `<Card>`
- **CardContent** (line 502) - `cardcontent`
  - Context: `<CardContent className="text-center p-8">`
- **User** (line 503) - `user`
  - Context: `<User className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Card** (line 514) - `card`
  - Context: `<Card>`
- **CardHeader** (line 515) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 516) - `cardtitle`
  - Context: `<CardTitle className="flex items-center space-x-2">`
- **Badge** (line 519) - `badge`
  - Context: `<Badge variant="secondary" className="bg-orange-100 text-orange-800">`
- **CardDescription** (line 524) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 528) - `cardcontent`
  - Context: `<CardContent className="space-y-6">`
- **Avatar** (line 530) - `avatar`
  - Context: `<Avatar className="w-20 h-20">`
- **AvatarImage** (line 531) - `avatarimage`
  - Context: `<AvatarImage src={profile.avatar_url} />`
- **AvatarFallback** (line 532) - `avatarfallback`
  - Context: `<AvatarFallback className="text-lg">`
- **Label** (line 537) - `label`
  - Context: `<Label htmlFor="avatar-upload" className="cursor-pointer">`
- **Button** (line 538) - `button`
  - Context: `<Button variant="outline" size="sm" disabled={uploading} asChild>`
- **Upload** (line 540) - `upload`
  - Context: `<Upload className="h-4 w-4 mr-2" />`
- **Label** (line 561) - `label`
  - Context: `<Label htmlFor="display-name">Display Name</Label>`
- **Input** (line 562) - `input`
  - Context: `<Input`
- **Label** (line 570) - `label`
  - Context: `<Label>Email</Label>`
- **Input** (line 571) - `input`
  - Context: `<Input value={user?.email || ''} disabled />`
- **Button** (line 576) - `button`
  - Context: `<Button type="submit" disabled={updating || displayName === profile.display_name...`
- **Card** (line 584) - `card`
  - Context: `<Card>`
- **CardHeader** (line 585) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 586) - `cardtitle`
  - Context: `<CardTitle className="flex items-center space-x-2">`
- **Shield** (line 587) - `shield`
  - Context: `<Shield className="h-5 w-5 text-blue-600" />`
- **CardDescription** (line 590) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 594) - `cardcontent`
  - Context: `<CardContent>`
- **Tabs** (line 595) - `tabs`
  - Context: `<Tabs defaultValue="groups" className="w-full">`
- **TabsList** (line 596) - `tabslist`
  - Context: `<TabsList className="grid w-full grid-cols-2">`
- **TabsTrigger** (line 597) - `tabstrigger`
  - Context: `<TabsTrigger value="groups" className="flex items-center space-x-2">`
- **MessageSquare** (line 598) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4" />`
- **TabsTrigger** (line 601) - `tabstrigger`
  - Context: `<TabsTrigger value="events" className="flex items-center space-x-2">`
- **Calendar** (line 602) - `calendar`
  - Context: `<Calendar className="h-4 w-4" />`
- **TabsContent** (line 607) - `tabscontent`
  - Context: `<TabsContent value="groups" className="space-y-4">`
- **Badge** (line 611) - `badge`
  - Context: `<Badge variant="outline">{groupChats.length} groups</Badge>`
- **MessageSquare** (line 628) - `messagesquare`
  - Context: `<MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />`
- **Card** (line 634) - `card`
  - Context: `<Card key={group.id} className="p-4">`
- **Input** (line 640) - `input`
  - Context: `<Input`
- **Textarea** (line 647) - `textarea`
  - Context: `<Textarea`
- **Button** (line 655) - `button`
  - Context: `<Button`
- **Save** (line 660) - `save`
  - Context: `<Save className="h-4 w-4 mr-1" />`
- **Button** (line 663) - `button`
  - Context: `<Button`
- **X** (line 668) - `x`
  - Context: `<X className="h-4 w-4 mr-1" />`
- **Button** (line 689) - `button`
  - Context: `<Button`
- **Edit2** (line 695) - `edit2`
  - Context: `<Edit2 className="h-4 w-4" />`
- **AlertDialog** (line 697) - `alertdialog`
  - Context: `<AlertDialog>`
- **AlertDialogTrigger** (line 698) - `alertdialogtrigger`
  - Context: `<AlertDialogTrigger asChild>`
- **Button** (line 699) - `button`
  - Context: `<Button`
- **Trash2** (line 705) - `trash2`
  - Context: `<Trash2 className="h-4 w-4" />`
- **AlertDialogContent** (line 708) - `alertdialogcontent`
  - Context: `<AlertDialogContent>`
- **AlertDialogHeader** (line 709) - `alertdialogheader`
  - Context: `<AlertDialogHeader>`
- **AlertDialogTitle** (line 710) - `alertdialogtitle`
  - Context: `<AlertDialogTitle>Delete Group</AlertDialogTitle>`
- **AlertDialogDescription** (line 711) - `alertdialogdescription`
  - Context: `<AlertDialogDescription>`
- **AlertDialogFooter** (line 715) - `alertdialogfooter`
  - Context: `<AlertDialogFooter>`
- **AlertDialogCancel** (line 716) - `alertdialogcancel`
  - Context: `<AlertDialogCancel>Cancel</AlertDialogCancel>`
- **AlertDialogAction** (line 717) - `alertdialogaction`
  - Context: `<AlertDialogAction`
- **TabsContent** (line 739) - `tabscontent`
  - Context: `<TabsContent value="events" className="space-y-4">`
- **Badge** (line 743) - `badge`
  - Context: `<Badge variant="outline">{eventChats.length} events</Badge>`
- **Calendar** (line 760) - `calendar`
  - Context: `<Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />`
- **Card** (line 766) - `card`
  - Context: `<Card key={event.id} className="p-4">`
- **Input** (line 771) - `input`
  - Context: `<Input`
- **Textarea** (line 776) - `textarea`
  - Context: `<Textarea`
- **Input** (line 783) - `input`
  - Context: `<Input`
- **Input** (line 788) - `input`
  - Context: `<Input`
- **Button** (line 795) - `button`
  - Context: `<Button`
- **Save** (line 800) - `save`
  - Context: `<Save className="h-4 w-4 mr-1" />`
- **Button** (line 803) - `button`
  - Context: `<Button`
- **X** (line 808) - `x`
  - Context: `<X className="h-4 w-4 mr-1" />`
- **Button** (line 829) - `button`
  - Context: `<Button`
- **Edit2** (line 835) - `edit2`
  - Context: `<Edit2 className="h-4 w-4" />`
- **AlertDialog** (line 837) - `alertdialog`
  - Context: `<AlertDialog>`
- **AlertDialogTrigger** (line 838) - `alertdialogtrigger`
  - Context: `<AlertDialogTrigger asChild>`
- **Button** (line 839) - `button`
  - Context: `<Button`
- **Trash2** (line 845) - `trash2`
  - Context: `<Trash2 className="h-4 w-4" />`
- **AlertDialogContent** (line 848) - `alertdialogcontent`
  - Context: `<AlertDialogContent>`
- **AlertDialogHeader** (line 849) - `alertdialogheader`
  - Context: `<AlertDialogHeader>`
- **AlertDialogTitle** (line 850) - `alertdialogtitle`
  - Context: `<AlertDialogTitle>Delete Event</AlertDialogTitle>`
- **AlertDialogDescription** (line 851) - `alertdialogdescription`
  - Context: `<AlertDialogDescription>`
- **AlertDialogFooter** (line 855) - `alertdialogfooter`
  - Context: `<AlertDialogFooter>`
- **AlertDialogCancel** (line 856) - `alertdialogcancel`
  - Context: `<AlertDialogCancel>Cancel</AlertDialogCancel>`
- **AlertDialogAction** (line 857) - `alertdialogaction`
  - Context: `<AlertDialogAction`

## 🎯 QUICK REFERENCE

### Main Components
- **ChatHeader**: `src/components/chat/ui/ChatHeader.tsx`
- **Index**: `src/pages/Index.tsx`
- **Layout**: `src/components/layout/Layout.tsx`

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
