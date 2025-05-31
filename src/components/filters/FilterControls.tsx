
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterControlsProps {
  grades: string[];
  styles: string[];
  areas: string[];
  sectors: string[];
  selectedGrade: string;
  gradeDirection: 'exact' | 'above' | 'below';
  selectedStyles: string[];
  selectedArea: string;
  selectedSector: string;
  onGradeChange: (grade: string) => void;
  onGradeDirectionChange: (direction: 'exact' | 'above' | 'below') => void;
  onStyleChange: (style: string, checked: boolean) => void;
  onAreaChange: (area: string) => void;
  onSectorChange: (sector: string) => void;
}

/**
 * Component for individual filter controls
 */
export const FilterControls = ({
  grades,
  styles,
  areas,
  sectors,
  selectedGrade,
  gradeDirection,
  selectedStyles,
  selectedArea,
  selectedSector,
  onGradeChange,
  onGradeDirectionChange,
  onStyleChange,
  onAreaChange,
  onSectorChange
}: FilterControlsProps) => {
  return (
    <div className="space-y-4">
      {/* Grade Filter */}
      <div className="space-y-2">
        <Label>Grade</Label>
        <div className="flex gap-2">
          <Select value={selectedGrade} onValueChange={onGradeChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Any grade" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedGrade && (
            <Select value={gradeDirection} onValueChange={onGradeDirectionChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exact">Exact</SelectItem>
                <SelectItem value="above">& Above</SelectItem>
                <SelectItem value="below">& Below</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Style Filter */}
      <div className="space-y-2">
        <Label>Styles (select multiple)</Label>
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => (
            <div key={style} className="flex items-center space-x-2">
              <Checkbox
                id={style}
                checked={selectedStyles.includes(style)}
                onCheckedChange={(checked) => onStyleChange(style, checked as boolean)}
              />
              <Label htmlFor={style} className="text-sm cursor-pointer">
                {style}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Area and Sector Filters */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Area</Label>
          <Select value={selectedArea} onValueChange={onAreaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Any area" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Sector</Label>
          <Select value={selectedSector} onValueChange={onSectorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Any sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
