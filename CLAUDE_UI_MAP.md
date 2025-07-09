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

**Last Updated:** 2025-07-08T22:42:19.759Z
**Project:** climb-connect-toronto
**Components Scanned:** 71
**Total Files:** 71
**Latest File Modified:** Tue Jul 08 2025 18:41:09 GMT-0400 (Eastern Daylight Time)

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
**Last Modified:** 2025-07-08T19:47:16.390Z

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
**Lines:** 486
**Last Modified:** 2025-07-08T18:53:19.855Z

**Key Elements:**
- **GroupMessage** (line 33) - `groupmessage`
  - Context: `const [messages, setMessages] = useState<GroupMessage[]>([]);`
- **HTMLDivElement** (line 41) - `htmldivelement`
  - Context: `const viewportRef = useRef<HTMLDivElement>(null);`
- **Button** (line 332) - `button`
  - Context: `<Button`
- **ArrowLeft** (line 338) - `arrowleft`
  - Context: `<ArrowLeft className="h-5 w-5" />`
- **Input** (line 347) - `input`
  - Context: `<Input`
- **Button** (line 354) - `button`
  - Context: `<Button`
- **X** (line 366) - `x`
  - Context: `{showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}`
- **Search** (line 366) - `search`
  - Context: `{showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}`
- **Avatar** (line 402) - `avatar`
  - Context: `<Avatar className="h-8 w-8 flex-shrink-0">`
- **AvatarImage** (line 403) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 404) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Button** (line 418) - `button`
  - Context: `<Button`
- **X** (line 425) - `x`
  - Context: `<X className="h-3 w-3" />`
- **ChatActionsMenu** (line 450) - `chatactionsmenu`
  - Context: `<ChatActionsMenu onCreateEvent={handleCreateEvent} />`
- **Input** (line 452) - `input`
  - Context: `<Input`
- **EmojiPickerComponent** (line 465) - `emojipickercomponent`
  - Context: `<EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />`
- **Button** (line 468) - `button`
  - Context: `<Button`
- **Send** (line 473) - `send`
  - Context: `<Send className="h-4 w-4" />`
- **CreateEventModal** (line 478) - `createeventmodal`
  - Context: `<CreateEventModal`

### 📁 src/components/chat/

#### ChatActionsMenu
**File:** `src/components/chat/ChatActionsMenu.tsx`
**Lines:** 40
**Last Modified:** 2025-07-08T18:50:25.419Z

**Key Elements:**
- **ChatActionsMenuProps** (line 16) - `chatactionsmenuprops`
  - Context: `export const ChatActionsMenu: React.FC<ChatActionsMenuProps> = ({`
- **DropdownMenu** (line 21) - `dropdownmenu`
  - Context: `<DropdownMenu>`
- **DropdownMenuTrigger** (line 22) - `dropdownmenutrigger`
  - Context: `<DropdownMenuTrigger asChild>`
- **Button** (line 23) - `button`
  - Context: `<Button`
- **Plus** (line 29) - `plus`
  - Context: `<Plus className="h-4 w-4" />`
- **DropdownMenuContent** (line 32) - `dropdownmenucontent`
  - Context: `<DropdownMenuContent align="start" className="w-48">`
- **DropdownMenuItem** (line 33) - `dropdownmenuitem`
  - Context: `<DropdownMenuItem onClick={onCreateEvent}>`
- **Calendar** (line 34) - `calendar`
  - Context: `<Calendar className="mr-2 h-4 w-4" />`

#### CreateEventModal
**File:** `src/components/chat/CreateEventModal.tsx`
**Lines:** 183
**Last Modified:** 2025-07-08T20:05:17.169Z

**Key Elements:**
- **CreateEventModalProps** (line 26) - `createeventmodalprops`
  - Context: `export const CreateEventModal: React.FC<CreateEventModalProps> = ({`
- **Dialog** (line 101) - `dialog`
  - Context: `<Dialog open={open} onOpenChange={onClose}>`
- **DialogContent** (line 102) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 103) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 104) - `dialogtitle`
  - Context: `<DialogTitle className="flex items-center gap-2">`
- **Calendar** (line 105) - `calendar`
  - Context: `<Calendar className="h-5 w-5" />`
- **DialogDescription** (line 108) - `dialogdescription`
  - Context: `<DialogDescription>`
- **Label** (line 114) - `label`
  - Context: `<Label htmlFor="title">Event Title</Label>`
- **Input** (line 115) - `input`
  - Context: `<Input`
- **Label** (line 124) - `label`
  - Context: `<Label htmlFor="description">Description</Label>`
- **Textarea** (line 125) - `textarea`
  - Context: `<Textarea`
- **Label** (line 134) - `label`
  - Context: `<Label htmlFor="location" className="flex items-center gap-2">`
- **MapPin** (line 135) - `mappin`
  - Context: `<MapPin className="h-4 w-4" />`
- **Input** (line 138) - `input`
  - Context: `<Input`
- **Label** (line 147) - `label`
  - Context: `<Label htmlFor="eventDate">Date & Time</Label>`
- **Input** (line 148) - `input`
  - Context: `<Input`
- **Label** (line 157) - `label`
  - Context: `<Label htmlFor="maxParticipants" className="flex items-center gap-2">`
- **Users** (line 158) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Input** (line 161) - `input`
  - Context: `<Input`
- **DialogFooter** (line 170) - `dialogfooter`
  - Context: `<DialogFooter>`
- **Button** (line 171) - `button`
  - Context: `<Button type="button" variant="outline" onClick={onClose}>`
- **Button** (line 174) - `button`
  - Context: `<Button type="submit" disabled={isCreating}>`
- **Loader2** (line 175) - `loader2`
  - Context: `{isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}`

### 📁 src/components/layout/

#### checkScreenSize
**File:** `src/components/layout/DesktopSidebar.tsx`
**Lines:** 204
**Last Modified:** 2025-07-08T22:39:34.050Z

**Key Elements:**
- **UserProfile** (line 37) - `userprofile`
  - Context: `const [userProfile, setUserProfile] = useState<UserProfile | null>(null);`
- **Record** (line 48) - `record`
  - Context: `const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});`
- **Mountain** (line 151) - `mountain`
  - Context: `<Mountain className="h-6 w-6 text-green-600" />`
- **Link** (line 157) - `link`
  - Context: `<Link to="/profile" className="hover:opacity-80 transition-opacity">`
- **Avatar** (line 158) - `avatar`
  - Context: `<Avatar className="h-12 w-12 cursor-pointer">`
- **AvatarImage** (line 159) - `avatarimage`
  - Context: `<AvatarImage src={userProfile?.avatar_url || user?.user_metadata?.avatar_url} />`
- **AvatarFallback** (line 160) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Link** (line 177) - `link`
  - Context: `<Link`
- **Icon** (line 187) - `icon`
  - Context: `<Icon className="h-5 w-5" />`
- **Badge** (line 191) - `badge`
  - Context: `<Badge variant="destructive" className="h-5 text-xs">`

#### checkScreenSize
**File:** `src/components/layout/Layout.tsx`
**Lines:** 81
**Last Modified:** 2025-07-08T22:40:56.868Z

**Key Elements:**
- **NavBar** (line 50) - `navbar`
  - Context: `<NavBar />`
- **MultiPanelLayout** (line 68) - `multipanellayout`
  - Context: `<MultiPanelLayout`
- **DesktopLayout** (line 79) - `desktoplayout`
  - Context: `return shouldUseDesktopLayout ? <DesktopLayout /> : <MobileLayout />;`
- **MobileLayout** (line 79) - `mobilelayout`
  - Context: `return shouldUseDesktopLayout ? <DesktopLayout /> : <MobileLayout />;`

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
**Lines:** 142
**Last Modified:** 2025-07-08T20:34:04.579Z

**Key Elements:**
- **Link** (line 29) - `link`
  - Context: `<Link to="/" className="flex items-center space-x-2">`
- **Mountain** (line 30) - `mountain`
  - Context: `<Mountain className="h-8 w-8 text-green-600" />`
- **Link** (line 45) - `link`
  - Context: `<Link`
- **Icon** (line 54) - `icon`
  - Context: `<Icon className="h-4 w-4" />`
- **Link** (line 61) - `link`
  - Context: `<Link to="/profile">`
- **Avatar** (line 62) - `avatar`
  - Context: `<Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-green-300 tran...`
- **AvatarImage** (line 63) - `avatarimage`
  - Context: `<AvatarImage src={user?.user_metadata?.avatar_url} />`
- **AvatarFallback** (line 64) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Button** (line 69) - `button`
  - Context: `<Button variant="ghost" size="sm" onClick={signOut}>`
- **LogOut** (line 70) - `logout`
  - Context: `<LogOut className="h-4 w-4" />`
- **Sheet** (line 77) - `sheet`
  - Context: `<Sheet open={isOpen} onOpenChange={setIsOpen}>`
- **SheetTrigger** (line 78) - `sheettrigger`
  - Context: `<SheetTrigger asChild>`
- **Button** (line 79) - `button`
  - Context: `<Button variant="ghost" size="sm">`
- **Menu** (line 80) - `menu`
  - Context: `<Menu className="h-6 w-6" />`
- **SheetContent** (line 83) - `sheetcontent`
  - Context: `<SheetContent side="right" className="w-64">`
- **Link** (line 85) - `link`
  - Context: `<Link`
- **Avatar** (line 90) - `avatar`
  - Context: `<Avatar className="h-10 w-10">`
- **AvatarImage** (line 91) - `avatarimage`
  - Context: `<AvatarImage src={user?.user_metadata?.avatar_url} />`
- **AvatarFallback** (line 92) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Link** (line 106) - `link`
  - Context: `<Link`
- **Icon** (line 116) - `icon`
  - Context: `<Icon className="h-5 w-5" />`
- **Button** (line 122) - `button`
  - Context: `<Button`
- **LogOut** (line 130) - `logout`
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

#### scrollToBottom
**File:** `src/pages/ClubTalk.tsx`
**Lines:** 457
**Last Modified:** 2025-07-08T18:51:42.644Z

**Key Elements:**
- **ClubMessage** (line 26) - `clubmessage`
  - Context: `const [messages, setMessages] = useState<ClubMessage[]>([]);`
- **HTMLDivElement** (line 34) - `htmldivelement`
  - Context: `const viewportRef = useRef<HTMLDivElement>(null);`
- **Card** (line 267) - `card`
  - Context: `<Card className="p-8 text-center">`
- **Input** (line 323) - `input`
  - Context: `<Input`
- **Button** (line 330) - `button`
  - Context: `<Button`
- **Search** (line 335) - `search`
  - Context: `<Search className="h-4 w-4" />`
- **Avatar** (line 374) - `avatar`
  - Context: `<Avatar className="h-8 w-8 flex-shrink-0">`
- **AvatarImage** (line 375) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 376) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Button** (line 390) - `button`
  - Context: `<Button`
- **X** (line 397) - `x`
  - Context: `<X className="h-3 w-3" />`
- **ChatActionsMenu** (line 422) - `chatactionsmenu`
  - Context: `<ChatActionsMenu onCreateEvent={handleCreateEvent} />`
- **Input** (line 424) - `input`
  - Context: `<Input`
- **EmojiPickerComponent** (line 437) - `emojipickercomponent`
  - Context: `<EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />`
- **Button** (line 440) - `button`
  - Context: `<Button`
- **Send** (line 445) - `send`
  - Context: `<Send className="h-4 w-4" />`
- **CreateEventModal** (line 450) - `createeventmodal`
  - Context: `<CreateEventModal`

#### navigate
**File:** `src/pages/Community.tsx`
**Lines:** 303
**Last Modified:** 2025-07-08T20:43:23.142Z

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

#### checkAdminStatus
**File:** `src/pages/Dashboard.tsx`
**Lines:** 386
**Last Modified:** 2025-07-08T21:22:22.630Z

**Key Elements:**
- **DashboardStats** (line 48) - `dashboardstats`
  - Context: `const [stats, setStats] = useState<DashboardStats>({`
- **UpcomingEvent** (line 54) - `upcomingevent`
  - Context: `const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);`
- **RecentMessage** (line 55) - `recentmessage`
  - Context: `const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);`
- **Button** (line 189) - `button`
  - Context: `<Button asChild>`
- **Link** (line 190) - `link`
  - Context: `<Link to="/events">`
- **Plus** (line 191) - `plus`
  - Context: `<Plus className="h-4 w-4 mr-2" />`
- **Shield** (line 201) - `shield`
  - Context: `<Shield className="h-6 w-6 text-red-600" />`
- **Card** (line 205) - `card`
  - Context: `<Card className="desktop-card-hover">`
- **CardHeader** (line 206) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 207) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Total Events</CardTitle>`
- **Calendar** (line 208) - `calendar`
  - Context: `<Calendar className="h-4 w-4 text-muted-foreground" />`
- **CardContent** (line 210) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 218) - `card`
  - Context: `<Card className="desktop-card-hover">`
- **CardHeader** (line 219) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 220) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Active Groups</CardTitle>`
- **Users** (line 221) - `users`
  - Context: `<Users className="h-4 w-4 text-muted-foreground" />`
- **CardContent** (line 223) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 231) - `card`
  - Context: `<Card className="desktop-card-hover">`
- **CardHeader** (line 232) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 233) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Messages</CardTitle>`
- **MessageSquare** (line 234) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4 text-muted-foreground" />`
- **CardContent** (line 236) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 244) - `card`
  - Context: `<Card className="desktop-card-hover">`
- **CardHeader** (line 245) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2...`
- **CardTitle** (line 246) - `cardtitle`
  - Context: `<CardTitle className="text-sm font-medium">Community Members</CardTitle>`
- **TrendingUp** (line 247) - `trendingup`
  - Context: `<TrendingUp className="h-4 w-4 text-muted-foreground" />`
- **CardContent** (line 249) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 261) - `card`
  - Context: `<Card>`
- **CardHeader** (line 262) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between">`
- **CardTitle** (line 264) - `cardtitle`
  - Context: `<CardTitle>Upcoming Events</CardTitle>`
- **CardDescription** (line 265) - `carddescription`
  - Context: `<CardDescription>`
- **Button** (line 269) - `button`
  - Context: `<Button variant="outline" asChild>`
- **Link** (line 270) - `link`
  - Context: `<Link to="/events">`
- **ArrowRight** (line 272) - `arrowright`
  - Context: `<ArrowRight className="h-4 w-4 ml-2" />`
- **CardContent** (line 276) - `cardcontent`
  - Context: `<CardContent>`
- **Calendar** (line 286) - `calendar`
  - Context: `<Calendar className="h-8 w-8 text-green-600" />`
- **Clock** (line 292) - `clock`
  - Context: `<Clock className="h-3 w-3 mr-1" />`
- **MapPin** (line 296) - `mappin`
  - Context: `<MapPin className="h-3 w-3 mr-1" />`
- **Users** (line 300) - `users`
  - Context: `<Users className="h-3 w-3 mr-1" />`
- **Button** (line 307) - `button`
  - Context: `<Button variant="outline" size="sm" asChild>`
- **Link** (line 308) - `link`
  - Context: `<Link to={`/events/${event.id}`}>View</Link>`
- **Calendar** (line 314) - `calendar`
  - Context: `<Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />`
- **Button** (line 316) - `button`
  - Context: `<Button variant="outline" size="sm" className="mt-2" asChild>`
- **Link** (line 317) - `link`
  - Context: `<Link to="/events">Create the first one!</Link>`
- **Card** (line 326) - `card`
  - Context: `<Card>`
- **CardHeader** (line 327) - `cardheader`
  - Context: `<CardHeader className="flex flex-row items-center justify-between">`
- **CardTitle** (line 329) - `cardtitle`
  - Context: `<CardTitle>Recent Community Activity</CardTitle>`
- **CardDescription** (line 330) - `carddescription`
  - Context: `<CardDescription>`
- **Button** (line 334) - `button`
  - Context: `<Button variant="outline" asChild>`
- **Link** (line 335) - `link`
  - Context: `<Link to="/club-talk">`
- **ArrowRight** (line 337) - `arrowright`
  - Context: `<ArrowRight className="h-4 w-4 ml-2" />`
- **CardContent** (line 341) - `cardcontent`
  - Context: `<CardContent>`
- **Avatar** (line 349) - `avatar`
  - Context: `<Avatar className="h-8 w-8">`
- **AvatarFallback** (line 350) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Badge** (line 359) - `badge`
  - Context: `<Badge variant="secondary" className="text-xs">`
- **MessageSquare** (line 374) - `messagesquare`
  - Context: `<MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />`
- **Button** (line 376) - `button`
  - Context: `<Button variant="outline" size="sm" className="mt-2" asChild>`
- **Link** (line 377) - `link`
  - Context: `<Link to="/club-talk">Start a conversation!</Link>`

#### navigate
**File:** `src/pages/EventChat.tsx`
**Lines:** 561
**Last Modified:** 2025-07-08T18:54:22.720Z

**Key Elements:**
- **Event** (line 45) - `event`
  - Context: `const [event, setEvent] = useState<Event | null>(null);`
- **EventMessage** (line 46) - `eventmessage`
  - Context: `const [messages, setMessages] = useState<EventMessage[]>([]);`
- **HTMLDivElement** (line 53) - `htmldivelement`
  - Context: `const viewportRef = useRef<HTMLDivElement>(null);`
- **Card** (line 330) - `card`
  - Context: `<Card className="p-8">`
- **Card** (line 389) - `card`
  - Context: `<Card className="p-8 text-center">`
- **Button** (line 392) - `button`
  - Context: `<Button onClick={() => navigate('/events')}>Back to Events</Button>`
- **Button** (line 404) - `button`
  - Context: `<Button`
- **ArrowLeft** (line 412) - `arrowleft`
  - Context: `<ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />`
- **CalendarDays** (line 418) - `calendardays`
  - Context: `<CalendarDays className="h-4 w-4 mr-1" />`
- **MapPin** (line 422) - `mappin`
  - Context: `<MapPin className="h-4 w-4 mr-1" />`
- **Users** (line 426) - `users`
  - Context: `<Users className="h-4 w-4 mr-1" />`
- **Users** (line 433) - `users`
  - Context: `<Users className="h-3 w-3 mr-1" />`
- **Avatar** (line 474) - `avatar`
  - Context: `<Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">`
- **AvatarImage** (line 475) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 476) - `avatarfallback`
  - Context: `<AvatarFallback className="text-xs">`
- **Button** (line 493) - `button`
  - Context: `<Button`
- **X** (line 500) - `x`
  - Context: `<X className="h-3 w-3" />`
- **ChatActionsMenu** (line 530) - `chatactionsmenu`
  - Context: `<ChatActionsMenu onCreateEvent={handleCreateEvent} />`
- **Input** (line 532) - `input`
  - Context: `<Input`
- **EmojiPickerComponent** (line 540) - `emojipickercomponent`
  - Context: `<EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />`
- **Button** (line 543) - `button`
  - Context: `<Button`
- **Send** (line 549) - `send`
  - Context: `<Send className="h-4 w-4" />`
- **CreateEventModal** (line 554) - `createeventmodal`
  - Context: `<CreateEventModal`

#### navigate
**File:** `src/pages/Events.tsx`
**Lines:** 496
**Last Modified:** 2025-07-08T20:57:20.869Z

**Key Elements:**
- **Event** (line 34) - `event`
  - Context: `const [events, setEvents] = useState<Event[]>([]);`
- **Card** (line 268) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 269) - `cardcontent`
  - Context: `<CardContent>`
- **CalendarDays** (line 270) - `calendardays`
  - Context: `<CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Card** (line 313) - `card`
  - Context: `<Card`
- **CardHeader** (line 317) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 319) - `cardtitle`
  - Context: `<CardTitle className="text-lg">`
- **Badge** (line 322) - `badge`
  - Context: `<Badge variant="secondary" className="bg-green-100 text-green-800">`
- **CardDescription** (line 326) - `carddescription`
  - Context: `<CardDescription>{event.description}</CardDescription>`
- **CardContent** (line 328) - `cardcontent`
  - Context: `<CardContent className="space-y-4">`
- **CalendarDays** (line 331) - `calendardays`
  - Context: `<CalendarDays className="h-4 w-4 mr-2" />`
- **MapPin** (line 335) - `mappin`
  - Context: `<MapPin className="h-4 w-4 mr-2" />`
- **Users** (line 339) - `users`
  - Context: `<Users className="h-4 w-4 mr-2" />`
- **Button** (line 344) - `button`
  - Context: `<Button`
- **Link** (line 350) - `link`
  - Context: `<Link`
- **MessageSquare** (line 354) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4 mr-2" />`
- **Button** (line 358) - `button`
  - Context: `<Button`
- **Card** (line 378) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 379) - `cardcontent`
  - Context: `<CardContent>`
- **CalendarDays** (line 380) - `calendardays`
  - Context: `<CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Card** (line 388) - `card`
  - Context: `<Card`
- **CardHeader** (line 392) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 394) - `cardtitle`
  - Context: `<CardTitle className="text-lg flex items-center gap-2">`
- **Badge** (line 401) - `badge`
  - Context: `<Badge variant="secondary" className="bg-green-100 text-green-800">`
- **CardDescription** (line 406) - `carddescription`
  - Context: `<CardDescription>{event.description}</CardDescription>`
- **CardContent** (line 408) - `cardcontent`
  - Context: `<CardContent className="space-y-4">`
- **CalendarDays** (line 411) - `calendardays`
  - Context: `<CalendarDays className="h-4 w-4 mr-2" />`
- **MapPin** (line 415) - `mappin`
  - Context: `<MapPin className="h-4 w-4 mr-2" />`
- **Users** (line 419) - `users`
  - Context: `<Users className="h-4 w-4 mr-2" />`
- **Button** (line 425) - `button`
  - Context: `<Button`
- **Link** (line 431) - `link`
  - Context: `<Link`
- **MessageSquare** (line 435) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4 mr-2" />`
- **Button** (line 439) - `button`
  - Context: `<Button`
- **Button** (line 448) - `button`
  - Context: `<Button`
- **Loader2** (line 460) - `loader2`
  - Context: `<Loader2 className="h-4 w-4 mr-2 animate-spin" />`
- **Dialog** (line 475) - `dialog`
  - Context: `<Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>`
- **DialogContent** (line 476) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 477) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 478) - `dialogtitle`
  - Context: `<DialogTitle>Leave Event</DialogTitle>`
- **DialogDescription** (line 479) - `dialogdescription`
  - Context: `<DialogDescription>`
- **DialogFooter** (line 483) - `dialogfooter`
  - Context: `<DialogFooter>`
- **Button** (line 484) - `button`
  - Context: `<Button variant="outline" onClick={cancelLeave}>`
- **Button** (line 487) - `button`
  - Context: `<Button variant="destructive" onClick={confirmLeave}>`

#### location
**File:** `src/pages/GroupChat.tsx`
**Lines:** 18
**Last Modified:** 2025-07-08T18:09:40.020Z

**Key Elements:**
- **GroupChatComponent** (line 17) - `groupchatcomponent`
  - Context: `return <GroupChatComponent groupId={groupId} groupName={groupName} />;`

#### navigate
**File:** `src/pages/Groups.tsx`
**Lines:** 494
**Last Modified:** 2025-07-08T21:56:15.459Z

**Key Elements:**
- **Group** (line 26) - `group`
  - Context: `const [groups, setGroups] = useState<Group[]>([]);`
- **ContextPanel** (line 267) - `contextpanel`
  - Context: `<ContextPanel title="Group Stats">`
- **ActivityFeed** (line 284) - `activityfeed`
  - Context: `<ActivityFeed activities={recentActivities} />`
- **Search** (line 299) - `search`
  - Context: `<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 te...`
- **Input** (line 300) - `input`
  - Context: `<Input`
- **Card** (line 322) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 323) - `cardcontent`
  - Context: `<CardContent>`
- **Users** (line 324) - `users`
  - Context: `<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Card** (line 334) - `card`
  - Context: `<Card key={group.id} className="desktop-card-hover">`
- **CardContent** (line 335) - `cardcontent`
  - Context: `<CardContent className="p-6">`
- **Avatar** (line 339) - `avatar`
  - Context: `<Avatar className="h-16 w-16">`
- **AvatarImage** (line 340) - `avatarimage`
  - Context: `<AvatarImage src={group.avatar_url || undefined} />`
- **AvatarFallback** (line 341) - `avatarfallback`
  - Context: `<AvatarFallback className="text-lg">`
- **Badge** (line 350) - `badge`
  - Context: `<Badge variant="secondary">Member</Badge>`
- **Users** (line 359) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Button** (line 369) - `button`
  - Context: `<Button`
- **MessageSquare** (line 373) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4 mr-2" />`
- **Button** (line 376) - `button`
  - Context: `<Button`
- **Button** (line 385) - `button`
  - Context: `<Button`
- **ArrowRight** (line 390) - `arrowright`
  - Context: `<ArrowRight className="h-4 w-4 ml-2" />`
- **Card** (line 403) - `card`
  - Context: `<Card`
- **CardHeader** (line 407) - `cardheader`
  - Context: `<CardHeader>`
- **Avatar** (line 410) - `avatar`
  - Context: `<Avatar className="h-12 w-12">`
- **AvatarImage** (line 411) - `avatarimage`
  - Context: `<AvatarImage src={group.avatar_url || undefined} />`
- **AvatarFallback** (line 412) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **CardTitle** (line 417) - `cardtitle`
  - Context: `<CardTitle className="text-lg">`
- **Badge** (line 421) - `badge`
  - Context: `<Badge variant="secondary" className="mt-1">`
- **CardContent** (line 429) - `cardcontent`
  - Context: `<CardContent className="space-y-4">`
- **CardDescription** (line 430) - `carddescription`
  - Context: `<CardDescription>{group.description}</CardDescription>`
- **Users** (line 434) - `users`
  - Context: `<Users className="h-4 w-4" />`
- **Button** (line 442) - `button`
  - Context: `<Button`
- **MessageSquare** (line 446) - `messagesquare`
  - Context: `<MessageSquare className="h-4 w-4 mr-2" />`
- **Button** (line 449) - `button`
  - Context: `<Button`
- **Button** (line 457) - `button`
  - Context: `<Button`
- **ArrowRight** (line 462) - `arrowright`
  - Context: `<ArrowRight className="h-4 w-4 ml-2" />`
- **Dialog** (line 474) - `dialog`
  - Context: `<Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>`
- **DialogContent** (line 475) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 476) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 477) - `dialogtitle`
  - Context: `<DialogTitle>Leave Group</DialogTitle>`
- **DialogDescription** (line 478) - `dialogdescription`
  - Context: `<DialogDescription>`
- **DialogFooter** (line 482) - `dialogfooter`
  - Context: `<DialogFooter>`
- **Button** (line 483) - `button`
  - Context: `<Button variant="outline" onClick={cancelLeave}>`
- **Button** (line 486) - `button`
  - Context: `<Button variant="destructive" onClick={confirmLeave}>`

#### checkScreenSize
**File:** `src/pages/Home.tsx`
**Lines:** 142
**Last Modified:** 2025-07-08T21:25:30.172Z

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
- **Mountain** (line 101) - `mountain`
  - Context: `<Mountain className="h-16 w-16 text-green-600 mr-4" />`
- **Card** (line 109) - `card`
  - Context: `<Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() =...`
- **CardHeader** (line 110) - `cardheader`
  - Context: `<CardHeader>`
- **Users** (line 111) - `users`
  - Context: `<Users className="h-8 w-8 text-green-600 mb-2" />`
- **CardTitle** (line 112) - `cardtitle`
  - Context: `<CardTitle>Group Chats</CardTitle>`
- **CardDescription** (line 113) - `carddescription`
  - Context: `<CardDescription>`
- **Card** (line 118) - `card`
  - Context: `<Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() =...`
- **CardHeader** (line 119) - `cardheader`
  - Context: `<CardHeader>`
- **Calendar** (line 120) - `calendar`
  - Context: `<Calendar className="h-8 w-8 text-orange-600 mb-2" />`
- **CardTitle** (line 121) - `cardtitle`
  - Context: `<CardTitle>Climbing Events</CardTitle>`
- **CardDescription** (line 122) - `carddescription`
  - Context: `<CardDescription>`
- **Card** (line 127) - `card`
  - Context: `<Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() =...`
- **CardHeader** (line 128) - `cardheader`
  - Context: `<CardHeader>`
- **Users** (line 129) - `users`
  - Context: `<Users className="h-8 w-8 text-blue-600 mb-2" />`
- **CardTitle** (line 130) - `cardtitle`
  - Context: `<CardTitle>Community Chat</CardTitle>`
- **CardDescription** (line 131) - `carddescription`
  - Context: `<CardDescription>`

#### NotFound
**File:** `src/pages/NotFound.tsx`
**Lines:** 28
**Last Modified:** 2025-07-08T18:09:40.047Z

#### loadProfile
**File:** `src/pages/Profile.tsx`
**Lines:** 886
**Last Modified:** 2025-07-08T18:09:40.071Z

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
- **getLayoutClass**: `src/components/layout/MultiPanelLayout.tsx`

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
