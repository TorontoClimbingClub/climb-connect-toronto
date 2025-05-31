
export interface ActiveSessionData {
  sessionDate: string;
  sessionGoal?: string;
  customGoal?: string;
  warmUpDone: boolean;
  feltAfterSession?: string;
  feltTiredAtEnd: boolean;
  wouldChangeNextTime?: string;
  newTechniquesTried: boolean;
  climbs: any[];
  techniques: string[];
}
