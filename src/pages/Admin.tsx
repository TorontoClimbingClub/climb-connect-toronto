
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { UsersTab } from "@/components/admin/UsersTab";
import { EventsTab } from "@/components/admin/EventsTab";
import { useAdminData } from "@/hooks/useAdminData";
import { useUserHandlers, useEventHandlers } from "@/utils/admin";

export default function Admin() {
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
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Admin Panel</h1>
          <p className="text-stone-600">Manage TCC users and events</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersTab 
              users={users}
              onUpdateUserRole={handleUpdateUserRole}
              onDeleteUser={handleDeleteUser}
              onResetPassword={handleResetPassword}
              onUpdateUser={handleUserUpdate}
            />
          </TabsContent>

          <TabsContent value="events">
            <EventsTab
              events={events}
              canCreateEvents={canCreateEvents}
              canManageUsers={canManageUsers}
              onDeleteEvent={handleDeleteEvent}
              onRefreshEvents={fetchEvents}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </div>
  );
}
