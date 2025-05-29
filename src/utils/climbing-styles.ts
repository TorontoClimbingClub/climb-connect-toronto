
export const getStyleColor = (style: string): string => {
  switch (style) {
    case 'Trad':
      return 'bg-orange-100 text-orange-800';
    case 'Sport':
      return 'bg-blue-100 text-blue-800';
    case 'Top Rope':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getDifficultyColor = (grade: string): string => {
  if (grade.includes('5.1') && (grade.includes('0') || grade.includes('1') || grade.includes('2'))) {
    return 'text-red-600 font-bold';
  }
  if (grade.includes('5.9') || grade.includes('5.10')) {
    return 'text-orange-600 font-semibold';
  }
  if (grade.includes('5.7') || grade.includes('5.8')) {
    return 'text-yellow-600 font-medium';
  }
  return 'text-green-600';
};
