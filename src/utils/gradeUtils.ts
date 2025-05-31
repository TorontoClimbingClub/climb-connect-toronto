
// Grade conversion utilities for different climbing styles

export const gradeOptions = {
  'Sport': ['5.5', '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d', '5.13a', '5.13b', '5.13c', '5.13d', '5.14a', '5.14b', '5.14c', '5.14d', '5.15a', '5.15b', '5.15c', '5.15d'],
  'Trad': ['5.5', '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d', '5.13a', '5.13b', '5.13c', '5.13d'],
  'Top Rope': ['5.5', '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b', '5.12c', '5.12d']
};

// Convert YDS grade to numerical value for comparison
export const gradeToNumber = (grade: string, style: 'Sport' | 'Trad' | 'Top Rope'): number => {
  const options = gradeOptions[style] || gradeOptions['Sport'];
  const index = options.indexOf(grade);
  return index >= 0 ? index : 0;
};

// Convert numerical value back to grade string
export const numberToGrade = (num: number, style: 'Sport' | 'Trad' | 'Top Rope'): string => {
  const options = gradeOptions[style] || gradeOptions['Sport'];
  return options[num] || options[0];
};

// Calculate grade difficulty relative to a base grade
export const getGradeDifficulty = (grade: string, baseGrade: string, style: 'Sport' | 'Trad' | 'Top Rope'): number => {
  return gradeToNumber(grade, style) - gradeToNumber(baseGrade, style);
};

// Get color coding for grade difficulty
export const getGradeDifficultyColor = (difficulty: number): string => {
  if (difficulty > 2) return 'text-red-600';
  if (difficulty > 0) return 'text-orange-600';
  if (difficulty < -2) return 'text-green-600';
  if (difficulty < 0) return 'text-green-500';
  return 'text-blue-600';
};

// Format grade with style-specific conventions
export const formatGrade = (grade: string, style: 'Sport' | 'Trad' | 'Top Rope'): string => {
  return grade; // For now, return as-is. Could add style-specific formatting later
};
