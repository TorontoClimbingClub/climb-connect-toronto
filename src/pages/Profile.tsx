
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { useProfileManagement } from "@/hooks/useProfileManagement";
import { useEquipmentProfile } from "@/hooks/useEquipmentProfile";
import { ProfileInformation } from "@/components/profile/ProfileInformation";
import { EquipmentInventory } from "@/components/profile/EquipmentInventory";

export default function Profile() {
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

  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any local storage if needed
      localStorage.clear();
      
      // Redirect to auth page
      window.location.href = '/auth';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    }
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
      <div className="max-w-2xl mx-auto p-4">
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
          onFormDataChange={setFormData}
        />

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
