
import { CommunityMember } from "@/types/community";

export const createMockCommunityMember = (overrides: Partial<CommunityMember> = {}): CommunityMember => ({
  id: `user-${Math.random().toString(36).substr(2, 9)}`,
  full_name: 'Test User',
  phone: null,
  climbing_description: null,
  is_carpool_driver: false,
  passenger_capacity: 0,
  equipment_count: 0,
  events_count: 0,
  climbing_level: 'Beginner',
  climbing_experience: ['Top Rope'],
  bio: null,
  profile_photo_url: null,
  allow_profile_viewing: true,
  show_climbing_progress: true,
  show_completion_stats: true,
  show_climbing_level: true,
  show_trad_progress: true,
  show_sport_progress: true,
  show_top_rope_progress: true,
  ...overrides
});

export const createMockCommunityMembers = (count: number): CommunityMember[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockCommunityMember({
      full_name: `Test User ${index + 1}`,
      climbing_level: index % 2 === 0 ? 'Beginner' : 'Intermediate',
      equipment_count: Math.floor(Math.random() * 10),
      events_count: Math.floor(Math.random() * 5)
    })
  );
};

export const validateCommunityMember = (member: any): member is CommunityMember => {
  return (
    typeof member === 'object' &&
    typeof member.id === 'string' &&
    typeof member.full_name === 'string' &&
    (member.phone === null || typeof member.phone === 'string') &&
    typeof member.is_carpool_driver === 'boolean' &&
    typeof member.passenger_capacity === 'number' &&
    Array.isArray(member.climbing_experience)
  );
};

// Health check function for community data
export const performCommunityHealthCheck = (members: CommunityMember[]) => {
  const issues: string[] = [];
  
  // Check for invalid members
  const invalidMembers = members.filter(member => !validateCommunityMember(member));
  if (invalidMembers.length > 0) {
    issues.push(`${invalidMembers.length} invalid member objects found`);
  }
  
  // Check for duplicate members
  const uniqueIds = new Set(members.map(m => m.id));
  if (uniqueIds.size !== members.length) {
    issues.push('Duplicate member IDs detected');
  }
  
  // Check for members without names
  const membersWithoutNames = members.filter(m => !m.full_name || m.full_name.trim() === '');
  if (membersWithoutNames.length > 0) {
    issues.push(`${membersWithoutNames.length} members without valid names`);
  }
  
  return {
    isHealthy: issues.length === 0,
    issues,
    memberCount: members.length,
    validMembers: members.filter(validateCommunityMember).length
  };
};
