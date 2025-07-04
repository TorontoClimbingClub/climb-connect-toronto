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

**Last Updated:** 2025-07-04T20:20:48.907Z
**Project:** climb-connect-toronto
**Components Scanned:** 60
**Total Files:** 60
**Latest File Modified:** Fri Jul 04 2025 16:15:59 GMT-0400 (Eastern Daylight Time)

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

#### loadMessages
**File:** `src/components/enhanced-realtime-chat.tsx`
**Lines:** 280
**Last Modified:** 2025-07-04T20:06:27.476Z

**Key Elements:**
- **ChatMessage** (line 29) - `chatmessage`
  - Context: `const [messages, setMessages] = useState<ChatMessage[]>([]);`
- **HTMLDivElement** (line 34) - `htmldivelement`
  - Context: `const scrollAreaRef = useRef<HTMLDivElement>(null);`
- **Card** (line 174) - `card`
  - Context: `<Card className="h-full flex items-center justify-center">`
- **Card** (line 181) - `card`
  - Context: `<Card className="h-full w-full flex flex-col border-0 rounded-none bg-white">`
- **Input** (line 190) - `input`
  - Context: `<Input`
- **Button** (line 197) - `button`
  - Context: `<Button`
- **Search** (line 205) - `search`
  - Context: `<Search className="h-4 w-4" />`
- **ScrollArea** (line 211) - `scrollarea`
  - Context: `<ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>`
- **Avatar** (line 221) - `avatar`
  - Context: `<Avatar className="h-8 w-8 flex-shrink-0">`
- **AvatarImage** (line 222) - `avatarimage`
  - Context: `<AvatarImage src={message.profiles?.avatar_url} />`
- **AvatarFallback** (line 223) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Input** (line 257) - `input`
  - Context: `<Input`
- **Button** (line 269) - `button`
  - Context: `<Button`
- **Send** (line 274) - `send`
  - Context: `<Send className="h-4 w-4" />`

### 📁 src/components/layout/

#### Layout
**File:** `src/components/layout/Layout.tsx`
**Lines:** 26
**Last Modified:** 2025-07-04T20:06:37.128Z

**Key Elements:**
- **NavBar** (line 13) - `navbar`
  - Context: `<NavBar />`

#### location
**File:** `src/components/layout/NavBar.tsx`
**Lines:** 134
**Last Modified:** 2025-07-03T21:42:28.156Z

**Key Elements:**
- **Link** (line 28) - `link`
  - Context: `<Link to="/" className="flex items-center space-x-2">`
- **Mountain** (line 29) - `mountain`
  - Context: `<Mountain className="h-8 w-8 text-green-600" />`
- **Link** (line 44) - `link`
  - Context: `<Link`
- **Icon** (line 53) - `icon`
  - Context: `<Icon className="h-4 w-4" />`
- **Avatar** (line 59) - `avatar`
  - Context: `<Avatar className="h-8 w-8">`
- **AvatarImage** (line 60) - `avatarimage`
  - Context: `<AvatarImage src={user?.user_metadata?.avatar_url} />`
- **AvatarFallback** (line 61) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Button** (line 65) - `button`
  - Context: `<Button variant="ghost" size="sm" onClick={signOut}>`
- **LogOut** (line 66) - `logout`
  - Context: `<LogOut className="h-4 w-4" />`
- **Sheet** (line 73) - `sheet`
  - Context: `<Sheet open={isOpen} onOpenChange={setIsOpen}>`
- **SheetTrigger** (line 74) - `sheettrigger`
  - Context: `<SheetTrigger asChild>`
- **Button** (line 75) - `button`
  - Context: `<Button variant="ghost" size="sm">`
- **Menu** (line 76) - `menu`
  - Context: `<Menu className="h-6 w-6" />`
- **SheetContent** (line 79) - `sheetcontent`
  - Context: `<SheetContent side="right" className="w-64">`
- **Avatar** (line 82) - `avatar`
  - Context: `<Avatar className="h-10 w-10">`
- **AvatarImage** (line 83) - `avatarimage`
  - Context: `<AvatarImage src={user?.user_metadata?.avatar_url} />`
- **AvatarFallback** (line 84) - `avatarfallback`
  - Context: `<AvatarFallback>`
- **Link** (line 98) - `link`
  - Context: `<Link`
- **Icon** (line 108) - `icon`
  - Context: `<Icon className="h-5 w-5" />`
- **Button** (line 114) - `button`
  - Context: `<Button`
- **LogOut** (line 122) - `logout`
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
**Last Modified:** 2025-07-03T21:42:28.356Z

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
**Last Modified:** 2025-07-04T17:59:11.542Z

**Key Elements:**
- **ToastProvider** (line 15) - `toastprovider`
  - Context: `<ToastProvider>`
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

#### Chat
**File:** `src/pages/Chat.tsx`
**Lines:** 30
**Last Modified:** 2025-07-04T20:06:18.642Z

**Key Elements:**
- **EnhancedRealtimeChat** (line 20) - `enhancedrealtimechat`
  - Context: `<EnhancedRealtimeChat`

#### loadEvents
**File:** `src/pages/Events.tsx`
**Lines:** 378
**Last Modified:** 2025-07-04T20:15:59.338Z

**Key Elements:**
- **Event** (line 34) - `event`
  - Context: `const [events, setEvents] = useState<Event[]>([]);`
- **Card** (line 218) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 219) - `cardcontent`
  - Context: `<CardContent>`
- **CalendarDays** (line 220) - `calendardays`
  - Context: `<CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Card** (line 237) - `card`
  - Context: `<Card key={i} className="animate-pulse">`
- **CardContent** (line 239) - `cardcontent`
  - Context: `<CardContent className="p-4 space-y-2">`
- **Dialog** (line 254) - `dialog`
  - Context: `<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>`
- **DialogTrigger** (line 255) - `dialogtrigger`
  - Context: `<DialogTrigger asChild>`
- **Button** (line 256) - `button`
  - Context: `<Button className="bg-green-600 hover:bg-green-700">`
- **Plus** (line 257) - `plus`
  - Context: `<Plus className="h-4 w-4 mr-2" />`
- **DialogContent** (line 261) - `dialogcontent`
  - Context: `<DialogContent className="sm:max-w-[425px]">`
- **DialogHeader** (line 262) - `dialogheader`
  - Context: `<DialogHeader>`
- **DialogTitle** (line 263) - `dialogtitle`
  - Context: `<DialogTitle>Create New Event</DialogTitle>`
- **Label** (line 267) - `label`
  - Context: `<Label htmlFor="title">Event Title</Label>`
- **Input** (line 268) - `input`
  - Context: `<Input`
- **Label** (line 276) - `label`
  - Context: `<Label htmlFor="description">Description</Label>`
- **Textarea** (line 277) - `textarea`
  - Context: `<Textarea`
- **Label** (line 285) - `label`
  - Context: `<Label htmlFor="location">Location</Label>`
- **Input** (line 286) - `input`
  - Context: `<Input`
- **Label** (line 294) - `label`
  - Context: `<Label htmlFor="event_date">Date & Time</Label>`
- **Input** (line 295) - `input`
  - Context: `<Input`
- **Label** (line 304) - `label`
  - Context: `<Label htmlFor="max_participants">Max Participants (optional)</Label>`
- **Input** (line 305) - `input`
  - Context: `<Input`
- **Button** (line 313) - `button`
  - Context: `<Button type="submit" className="w-full">Create Event</Button>`
- **Card** (line 320) - `card`
  - Context: `<Card className="text-center p-8">`
- **CardContent** (line 321) - `cardcontent`
  - Context: `<CardContent>`
- **CalendarDays** (line 322) - `calendardays`
  - Context: `<CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Card** (line 330) - `card`
  - Context: `<Card key={event.id} className="hover:shadow-lg transition-shadow">`
- **CardHeader** (line 331) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 333) - `cardtitle`
  - Context: `<CardTitle className="text-lg">{event.title}</CardTitle>`
- **Badge** (line 335) - `badge`
  - Context: `<Badge variant="secondary" className="bg-green-100 text-green-800">`
- **CardDescription** (line 340) - `carddescription`
  - Context: `<CardDescription>{event.description}</CardDescription>`
- **CardContent** (line 342) - `cardcontent`
  - Context: `<CardContent className="space-y-4">`
- **CalendarDays** (line 345) - `calendardays`
  - Context: `<CalendarDays className="h-4 w-4 mr-2" />`
- **MapPin** (line 349) - `mappin`
  - Context: `<MapPin className="h-4 w-4 mr-2" />`
- **Users** (line 353) - `users`
  - Context: `<Users className="h-4 w-4 mr-2" />`
- **Button** (line 358) - `button`
  - Context: `<Button`
- **Button** (line 366) - `button`
  - Context: `<Button variant="outline" size="sm" asChild>`
- **Link** (line 367) - `link`
  - Context: `<Link to={`/events/${event.id}`}>View Details</Link>`

#### Home
**File:** `src/pages/Home.tsx`
**Lines:** 137
**Last Modified:** 2025-07-03T21:42:28.444Z

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
- **MessageCircle** (line 34) - `messagecircle`
  - Context: `<MessageCircle className="h-8 w-8 text-green-600 mb-2" />`
- **CardTitle** (line 35) - `cardtitle`
  - Context: `<CardTitle>Community Chat</CardTitle>`
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
- **MessageCircle** (line 91) - `messagecircle`
  - Context: `<MessageCircle className="h-8 w-8 text-green-600 mb-2" />`
- **CardTitle** (line 92) - `cardtitle`
  - Context: `<CardTitle>Join the Chat</CardTitle>`
- **CardDescription** (line 93) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 97) - `cardcontent`
  - Context: `<CardContent>`
- **Button** (line 98) - `button`
  - Context: `<Button asChild className="w-full">`
- **Link** (line 99) - `link`
  - Context: `<Link to="/chat">Open Chat</Link>`
- **Card** (line 104) - `card`
  - Context: `<Card className="hover:shadow-lg transition-shadow">`
- **CardHeader** (line 105) - `cardheader`
  - Context: `<CardHeader>`
- **Calendar** (line 106) - `calendar`
  - Context: `<Calendar className="h-8 w-8 text-orange-600 mb-2" />`
- **CardTitle** (line 107) - `cardtitle`
  - Context: `<CardTitle>Upcoming Events</CardTitle>`
- **CardDescription** (line 108) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 112) - `cardcontent`
  - Context: `<CardContent>`
- **Button** (line 113) - `button`
  - Context: `<Button asChild variant="outline" className="w-full">`
- **Link** (line 114) - `link`
  - Context: `<Link to="/events">View Events</Link>`
- **Card** (line 119) - `card`
  - Context: `<Card className="hover:shadow-lg transition-shadow">`
- **CardHeader** (line 120) - `cardheader`
  - Context: `<CardHeader>`
- **Users** (line 121) - `users`
  - Context: `<Users className="h-8 w-8 text-blue-600 mb-2" />`
- **CardTitle** (line 122) - `cardtitle`
  - Context: `<CardTitle>Your Profile</CardTitle>`
- **CardDescription** (line 123) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 127) - `cardcontent`
  - Context: `<CardContent>`
- **Button** (line 128) - `button`
  - Context: `<Button asChild variant="outline" className="w-full">`
- **Link** (line 129) - `link`
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
**Lines:** 276
**Last Modified:** 2025-07-03T21:42:28.457Z

**Key Elements:**
- **Profile** (line 24) - `profile`
  - Context: `const [profile, setProfile] = useState<Profile | null>(null);`
- **HTMLInputElement** (line 89) - `htmlinputelement`
  - Context: `const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {`
- **Card** (line 149) - `card`
  - Context: `<Card>`
- **CardHeader** (line 150) - `cardheader`
  - Context: `<CardHeader>`
- **CardContent** (line 156) - `cardcontent`
  - Context: `<CardContent>`
- **Card** (line 171) - `card`
  - Context: `<Card>`
- **CardContent** (line 172) - `cardcontent`
  - Context: `<CardContent className="text-center p-8">`
- **User** (line 173) - `user`
  - Context: `<User className="h-12 w-12 text-gray-400 mx-auto mb-4" />`
- **Card** (line 184) - `card`
  - Context: `<Card>`
- **CardHeader** (line 185) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 186) - `cardtitle`
  - Context: `<CardTitle className="flex items-center space-x-2">`
- **Badge** (line 189) - `badge`
  - Context: `<Badge variant="secondary" className="bg-orange-100 text-orange-800">`
- **CardDescription** (line 194) - `carddescription`
  - Context: `<CardDescription>`
- **CardContent** (line 198) - `cardcontent`
  - Context: `<CardContent className="space-y-6">`
- **Avatar** (line 200) - `avatar`
  - Context: `<Avatar className="w-20 h-20">`
- **AvatarImage** (line 201) - `avatarimage`
  - Context: `<AvatarImage src={profile.avatar_url} />`
- **AvatarFallback** (line 202) - `avatarfallback`
  - Context: `<AvatarFallback className="text-lg">`
- **Label** (line 207) - `label`
  - Context: `<Label htmlFor="avatar-upload" className="cursor-pointer">`
- **Button** (line 208) - `button`
  - Context: `<Button variant="outline" size="sm" disabled={uploading} asChild>`
- **Upload** (line 210) - `upload`
  - Context: `<Upload className="h-4 w-4 mr-2" />`
- **Label** (line 231) - `label`
  - Context: `<Label htmlFor="display-name">Display Name</Label>`
- **Input** (line 232) - `input`
  - Context: `<Input`
- **Label** (line 240) - `label`
  - Context: `<Label>Email</Label>`
- **Input** (line 241) - `input`
  - Context: `<Input value={user?.email || ''} disabled />`
- **Button** (line 246) - `button`
  - Context: `<Button type="submit" disabled={updating || displayName === profile.display_name...`
- **Card** (line 253) - `card`
  - Context: `<Card>`
- **CardHeader** (line 254) - `cardheader`
  - Context: `<CardHeader>`
- **CardTitle** (line 255) - `cardtitle`
  - Context: `<CardTitle className="flex items-center space-x-2">`
- **Calendar** (line 256) - `calendar`
  - Context: `<Calendar className="h-5 w-5" />`
- **CardContent** (line 260) - `cardcontent`
  - Context: `<CardContent>`

## 🎯 QUICK REFERENCE

### Main Components
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
