import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, MapPin, Clock, Loader2, Lock, Globe } from 'lucide-react';
import { ClimbingType, BelayGroupPrivacy, CLIMBING_TYPE_LABELS, CLIMBING_TYPE_ICONS } from '@/types/belayGroup';
import { formatBelayGroupMessage } from '@/utils/belayGroupUtils';

interface CreateBelayGroupModalProps {
  open: boolean;
  onClose: () => void;
  gymId: string;
  gymName: string;
}

export const CreateBelayGroupModal: React.FC<CreateBelayGroupModalProps> = ({
  open,
  onClose,
  gymId,
  gymName
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [climbingType, setClimbingType] = useState<ClimbingType>('mixed');
  const [location, setLocation] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [capacity, setCapacity] = useState('2');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const privacy: BelayGroupPrivacy = isPrivate ? 'private' : 'public';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsCreating(true);
    try {
      // Create the belay group
      const { data: belayGroup, error: belayGroupError } = await supabase
        .from('belay_groups')
        .insert([
          {
            gym_id: gymId,
            creator_id: user.id,
            name,
            description: description || null,
            climbing_type: climbingType,
            location,
            session_date: sessionDate,
            privacy,
            capacity: parseInt(capacity),
            status: 'active'
          },
        ])
        .select()
        .single();

      if (belayGroupError) throw belayGroupError;

      // Automatically add creator as first participant
      const { error: participantError } = await supabase
        .from('belay_group_participants')
        .insert([
          {
            belay_group_id: belayGroup.id,
            user_id: user.id,
          },
        ]);

      if (participantError) throw participantError;

      // Post belay group creation message to gym chat
      const belayGroupMessage = formatBelayGroupMessage(
        name,
        climbingType,
        location,
        sessionDate,
        parseInt(capacity),
        privacy,
        belayGroup.id
      );

      const { error: messageError } = await supabase
        .from('group_messages')
        .insert([
          {
            content: belayGroupMessage,
            user_id: user.id,
            group_id: gymId
          }
        ]);

      if (messageError) throw messageError;

      toast({
        title: 'Belay group created successfully',
        description: `${name} has been created for ${gymName}. Partners can now join!`,
      });

      // Reset form
      setName('');
      setDescription('');
      setClimbingType('mixed');
      setLocation('');
      setSessionDate('');
      setCapacity('2');
      setIsPrivate(false);
      onClose();
    } catch (error) {
      console.error('Error creating belay group:', error);
      toast({
        title: 'Error creating belay group',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Generate default session name based on climbing type
  const generateDefaultName = () => {
    if (!climbingType || climbingType === 'mixed') return '';
    return `${CLIMBING_TYPE_LABELS[climbingType]} Session`;
  };

  // Auto-populate name when climbing type changes if name is empty or was auto-generated
  React.useEffect(() => {
    if (!name || Object.values(CLIMBING_TYPE_LABELS).some(label => name === `${label} Session`)) {
      setName(generateDefaultName());
    }
  }, [climbingType]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Find Belay Partners
          </DialogTitle>
          <DialogDescription>
            Create a belay group to find climbing partners at {gymName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="climbingType" className="flex items-center gap-2">
              🎯 Climbing Style
            </Label>
            <Select value={climbingType} onValueChange={(value) => setClimbingType(value as ClimbingType)}>
              <SelectTrigger id="climbingType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CLIMBING_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span>{CLIMBING_TYPE_ICONS[key as ClimbingType]}</span>
                      <span>{label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Session Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Bouldering Session"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Session details, skill level, specific plans..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Specific Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Bouldering area, Main wall, Specific route section"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionDate" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Session Date & Time
            </Label>
            <Input
              id="sessionDate"
              type="datetime-local"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Group Size
            </Label>
            <Select value={capacity} onValueChange={setCapacity}>
              <SelectTrigger id="capacity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 6, 8, 10].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} climbers {size === 2 ? '(you + 1 partner)' : `(you + ${size - 1} partners)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              {isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              <div>
                <Label className="text-sm font-medium">
                  {isPrivate ? 'Private Group' : 'Public Group'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isPrivate 
                    ? 'Only visible to people who join through this gym chat' 
                    : 'Visible on the public belay groups page'
                  }
                </p>
              </div>
            </div>
            <Switch id="privacy" checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Belay Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};