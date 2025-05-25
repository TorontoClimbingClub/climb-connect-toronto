
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Phone, Car, Package, Edit, Check, X, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { AddEquipmentDialog } from "@/components/gear/AddEquipmentDialog";
import { EditEquipmentDialog } from "@/components/gear/EditEquipmentDialog";

interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  is_carpool_driver: boolean;
  passenger_capacity?: number;
  climbing_description?: string;
}

interface UserEquipment {
  id: string;
  item_name: string;
  quantity: number;
  notes: string | null;
  category_id: string;
  equipment_categories: { name: string } | null;
}

interface EquipmentCategory {
  id: string;
  name: string;
  description: string | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [equipment, setEquipment] = useState<UserEquipment[]>([]);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<UserEquipment | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    full_name: '',
    phone: '',
    is_carpool_driver: false,
    passenger_capacity: 0,
    climbing_description: '',
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      console.log('User found, fetching profile for user ID:', user.id);
      fetchProfile();
      fetchEquipment();
      fetchCategories();
    } else {
      console.log('No user found');
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) {
      console.log('No user available for profile fetch');
      return;
    }

    console.log('Starting profile fetch for user:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Profile fetch response:', { data, error });

      if (error) {
        console.error('Profile fetch error:', error);
        
        // If no profile exists or there's a session issue, redirect to login
        if (error.code === 'PGRST116' || error.message?.includes('JWT') || error.message?.includes('session')) {
          console.log('Profile not found or session issue, redirecting to login...');
          toast({
            title: "Session Error",
            description: "Please log in again to access your profile",
            variant: "destructive",
          });
          window.location.href = '/auth';
          return;
        }
        
        throw error;
      }
      
      if (data) {
        console.log('Profile data loaded successfully:', data);
        setProfile(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try logging in again.",
        variant: "destructive",
      });
      // Redirect to login on any profile fetch error
      setTimeout(() => {
        window.location.href = '/auth';
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    console.log('Creating new profile for user:', user.id);
    
    try {
      const newProfile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New Member',
        phone: '',
        is_carpool_driver: false,
        passenger_capacity: 0,
        climbing_description: '',
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      console.log('Profile creation response:', { data, error });

      if (error) throw error;

      if (data) {
        console.log('New profile created successfully:', data);
        setProfile(data);
        setFormData(data);
        toast({
          title: "Welcome!",
          description: "Your profile has been created successfully",
        });
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment_categories')
        .select('id, name, description')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchEquipment = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_equipment')
        .select(`
          id,
          item_name,
          quantity,
          notes,
          category_id,
          equipment_categories(name)
        `)
        .eq('user_id', user.id)
        .order('item_name');

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          is_carpool_driver: formData.is_carpool_driver,
          passenger_capacity: formData.is_carpool_driver ? formData.passenger_capacity : null,
          climbing_description: formData.climbing_description,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(formData);
      setEditing(false);
      
      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(profile);
    }
    setEditing(false);
  };

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

  const addEquipment = async (equipment: {
    item_name: string;
    category_id: string;
    quantity: number;
    notes?: string;
  }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_equipment')
        .insert({
          ...equipment,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Equipment added successfully",
      });

      fetchEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment",
        variant: "destructive",
      });
    }
  };

  const deleteEquipment = async (equipmentId: string) => {
    try {
      const { error } = await supabase
        .from('user_equipment')
        .delete()
        .eq('id', equipmentId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Equipment deleted successfully",
      });

      fetchEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete equipment",
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

        {/* Profile Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your personal details and preferences</CardDescription>
              </div>
              {!editing ? (
                <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="bg-[#E55A2B] hover:bg-[#D14B20] text-white">
                    <Check className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                disabled={!editing}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="climbing_description">Describe your climbing style</Label>
              <Textarea
                id="climbing_description"
                placeholder="Tell other members about your climbing experience, preferred styles, goals, etc."
                value={formData.climbing_description || ''}
                onChange={(e) => setFormData({ ...formData, climbing_description: e.target.value })}
                disabled={!editing}
                rows={4}
              />
            </div>

            {/* Carpool Settings */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-[#E55A2B]" />
                  <div>
                    <Label htmlFor="is_carpool_driver">I can drive to events</Label>
                    <p className="text-sm text-stone-600">Offer rides to fellow climbers</p>
                  </div>
                </div>
                <Switch
                  id="is_carpool_driver"
                  checked={formData.is_carpool_driver}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_carpool_driver: checked })}
                  disabled={!editing}
                />
              </div>

              {formData.is_carpool_driver && (
                <div>
                  <Label htmlFor="passenger_capacity">Available Seats</Label>
                  <Input
                    id="passenger_capacity"
                    type="number"
                    min="1"
                    max="8"
                    value={formData.passenger_capacity || ''}
                    onChange={(e) => setFormData({ ...formData, passenger_capacity: parseInt(e.target.value) || 0 })}
                    disabled={!editing}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Equipment Inventory */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Equipment Inventory ({equipment.length} items)
                </CardTitle>
                <CardDescription>Manage your climbing gear collection</CardDescription>
              </div>
              <AddEquipmentDialog 
                categories={categories}
                onAdd={addEquipment}
              />
            </div>
          </CardHeader>
          <CardContent>
            {equipment.length > 0 ? (
              <div className="space-y-3">
                {equipment.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{item.item_name}</h4>
                        <span className="text-sm bg-stone-200 px-2 py-1 rounded">
                          {item.equipment_categories?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="text-sm text-stone-600">
                        Quantity: {item.quantity}
                        {item.notes && <span className="ml-2">• {item.notes}</span>}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEquipment(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-stone-600">
                <Package className="h-12 w-12 mx-auto mb-3 text-stone-400" />
                <p>No equipment added yet</p>
                <p className="text-sm">Add your climbing gear to share with the community</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {editingEquipment && (
        <EditEquipmentDialog
          equipment={editingEquipment}
          categories={categories}
          isOpen={!!editingEquipment}
          onClose={() => setEditingEquipment(null)}
          onSuccess={() => {
            fetchEquipment();
            setEditingEquipment(null);
          }}
        />
      )}

      <Navigation />
    </div>
  );
}
