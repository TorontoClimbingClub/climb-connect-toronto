import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { useProfileManagement } from "@/hooks/useProfileManagement";
import { useEquipmentProfile } from "@/hooks/useEquipmentProfile";
import { ProfileInformation } from "@/components/profile/ProfileInformation";
import { EquipmentInventory } from "@/components/profile/EquipmentInventory";
import { CompletedRoutesList } from "@/components/profile/CompletedRoutesList";
import { forceLogoutAndRedirect } from "@/utils/auth";
import { UserProfile } from "@/types";
import { CompletionProgressBars } from "@/components/CompletionProgressBars";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { useAuth } from "@/contexts/AuthContext";
import { useResponsiveContainer } from "@/hooks/useResponsiveContainer";

export default function Profile() {
  const { user } = useAuth();
  const { containerClass, paddingClass } = useResponsiveContainer('medium');

  const {
    profile,
    loading,
    editing,
    formData,
    setEditing,
    setFormData,
    handleSave,
    handleCancel,
  } = useProfileManagement();

  const {
    equipment,
    categories,
    editingEquipment,
    setEditingEquipment,
    addEquipment,
    fetchEquipment,
  } = useEquipmentProfile();

  const { completions } = useClimbCompletions();

  const { toast } = useToast();

  // Filter completions for the current user
  const userCompletions = user ? completions.filter(c => c.user_id === user.id) : [];

  console.log('Profile - user:', user);
  console.log('Profile - all completions:', completions);
  console.log('Profile - user completions:', userCompletions);

  const handleLogout = async () => {
    try {
      toast({
        title: "Logging out...",
        description: "Clearing session data",
      });
      
      // Use the comprehensive logout function
      await forceLogoutAndRedirect();
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Logout failed, but redirecting to login anyway",
        variant: "destructive",
      });
      // Force redirect even if logout fails
      window.location.href = '/auth';
    }
  };

  // Create a wrapper function to handle the form data change
  const handleFormDataChange = (data: UserProfile) => {
    setFormData(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className={`${containerClass} ${paddingClass}`}>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">My Profile</h1>
            <p className="text-stone-600">Manage your climbing profile and equipment</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <ProfileInformation
          profile={profile}
          editing={editing}
          formData={formData}
          onEdit={() => setEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
          onFormDataChange={handleFormDataChange}
          completions={userCompletions}
        />

        <div className="mb-6">
          <CompletionProgressBars completions={userCompletions} />
        </div>

        <div className="mb-6">
          <CompletedRoutesList completions={userCompletions} userId={user?.id} />
        </div>

        <EquipmentInventory
          equipment={equipment}
          categories={categories}
          editingEquipment={editingEquipment}
          onAddEquipment={addEquipment}
          onEditEquipment={setEditingEquipment}
          onCloseEditDialog={() => setEditingEquipment(null)}
          onEquipmentSuccess={() => {
            fetchEquipment();
            setEditingEquipment(null);
          }}
        />
      </div>

      <Navigation />
    </div>
  );
}
