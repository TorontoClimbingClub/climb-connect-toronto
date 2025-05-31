import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { UsersTab } from "@/components/admin/UsersTab";
import { CombinedEventsAttendanceTab } from "@/components/admin/CombinedEventsAttendanceTab";
import { RouteManagementTab } from "@/components/admin/RouteManagementTab";
import { ConsoleLogTab } from "@/components/admin/ConsoleLogTab";
import { useAdminData } from "@/hooks/useAdminData";
import { useUserHandlers, useEventHandlers } from "@/utils/admin";
import { useResponsiveContainer } from "@/hooks/useResponsiveContainer";

export default function Admin() {
  const { containerClass, paddingClass } = useResponsiveContainer('full');

  const {
    users,
    events,
    loading,
    canCreateEvents,
    canManageUsers,
    fetchUsers,
    fetchEvents
  } = useAdminData();

  const {
    handleUpdateUserRole,
    handleDeleteUser,
    handleResetPassword,
    handleUpdateUser
  } = useUserHandlers(fetchUsers);

  const { handleDeleteEvent } = useEventHandlers(fetchEvents);

  // Wrapper function to match expected signature
  const handleUserUpdate = (user: any) => {
    const { id, ...updates } = user;
    handleUpdateUser(id, updates);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className={`${containerClass} ${paddingClass}`}>
        <div className="mb-4 sm:mb-6 px-2 sm:px-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#E55A2B] mb-2">Admin Panel</h1>
          <p className="text-stone-600 text-sm sm:text-base">Manage TCC users, events, attendance, routes, and view console logs</p>
        </div>

        <Tabs defaultValue="events" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            <TabsTrigger value="events" className="text-xs sm:text-sm py-2">Events & Attendance</TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm py-2">Users</TabsTrigger>
            <TabsTrigger value="routes" className="text-xs sm:text-sm py-2">Routes</TabsTrigger>
            <TabsTrigger value="console" className="text-xs sm:text-sm py-2">Console</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <CombinedEventsAttendanceTab
              events={events}
              canCreateEvents={canCreateEvents}
              canManageUsers={canManageUsers}
              onDeleteEvent={handleDeleteEvent}
              onRefreshEvents={fetchEvents}
            />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab 
              users={users}
              onUpdateUserRole={handleUpdateUserRole}
              onDeleteUser={handleDeleteUser}
              onResetPassword={handleResetPassword}
              onUpdateUser={handleUserUpdate}
            />
          </TabsContent>

          <TabsContent value="routes">
            <RouteManagementTab />
          </TabsContent>

          <TabsContent value="console">
            <ConsoleLogTab />
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </div>
  );
}
