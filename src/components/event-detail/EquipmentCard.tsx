
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Equipment {
  id: string;
  item_name: string;
  brand: string | null;
  notes: string | null;
  user_id: string;
  owner_name: string;
  category_name: string;
}

interface UserEquipment {
  id: string;
  item_name: string;
  brand: string | null;
  notes: string | null;
  category_name: string;
  is_assigned?: boolean;
  assigned_event?: string;
}

interface EquipmentCardProps {
  equipment: Equipment[];
  userEquipment: UserEquipment[];
  currentUserId?: string;
  onAddEquipment: (equipmentIds: string[]) => void;
}

export function EquipmentCard({ 
  equipment, 
  userEquipment, 
  currentUserId,
  onAddEquipment 
}: EquipmentCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const { toast } = useToast();

  const availableEquipment = userEquipment.filter(item => !item.is_assigned);

  const handleEquipmentSelection = (equipmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedEquipment(prev => [...prev, equipmentId]);
    } else {
      setSelectedEquipment(prev => prev.filter(id => id !== equipmentId));
    }
  };

  const handleAddSelected = () => {
    if (selectedEquipment.length > 0) {
      onAddEquipment(selectedEquipment);
      setSelectedEquipment([]);
      setIsDialogOpen(false);
    }
  };

  const handleRemoveEquipment = async (equipmentId: string) => {
    try {
      const { error } = await supabase
        .from('event_equipment')
        .delete()
        .eq('user_equipment_id', equipmentId)
        .eq('user_id', currentUserId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Equipment removed from event",
      });

      // Refresh the page to update the equipment list
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove equipment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Equipment Available ({equipment.length} items)
            </CardTitle>
            <CardDescription>
              Gear that participants are bringing to share
            </CardDescription>
          </div>
          
          {currentUserId && availableEquipment.length > 0 && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Share Gear
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Share Your Equipment</DialogTitle>
                  <DialogDescription>
                    Select equipment from your inventory to share with this event
                  </DialogDescription>
                </DialogHeader>
                
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Share</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Brand</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableEquipment.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedEquipment.includes(item.id)}
                              onCheckedChange={(checked) => 
                                handleEquipmentSelection(item.id, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.item_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category_name}</Badge>
                          </TableCell>
                          <TableCell>{item.brand || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddSelected}
                    disabled={selectedEquipment.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Share Selected ({selectedEquipment.length})
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {equipment.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Notes</TableHead>
                {currentUserId && <TableHead className="w-12">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.category_name}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.brand || 'N/A'}</TableCell>
                  <TableCell>{item.owner_name}</TableCell>
                  <TableCell className="max-w-xs">
                    {item.notes ? (
                      <span className="text-sm text-stone-600">{item.notes}</span>
                    ) : (
                      <span className="text-stone-400">No notes</span>
                    )}
                  </TableCell>
                  {currentUserId && (
                    <TableCell>
                      {item.user_id === currentUserId && (
                        <Button
                          onClick={() => handleRemoveEquipment(item.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-stone-600">
            No equipment shared yet. Participants can add gear from their profile.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
