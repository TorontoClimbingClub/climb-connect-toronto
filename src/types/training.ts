
export interface ActiveSessionData {
  sessionDate: string;
  sessionGoal?: string;
  customGoal?: string;
  warmUpDone: boolean;
  feltAfterSession?: string;
  feltTiredAtEnd: boolean;
  wouldChangeNextTime?: string;
  newTechniquesTried: boolean;
  gearUsed: boolean;
  climbs: any[];
  techniques: string[];
  gear: string[];
}
