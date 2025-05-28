
export const sortGrades = (grades: string[]) => {
  return grades.sort((a, b) => {
    // Extract the base number (e.g., "5.10" from "5.10a")
    const getBaseGrade = (grade: string) => {
      const match = grade.match(/5\.(\d+)/);
      return match ? parseInt(match[1]) : 0;
    };

    // Extract the letter suffix for sport routes (a, b, c)
    const getLetterSuffix = (grade: string) => {
      const match = grade.match(/5\.\d+([abc])/);
      return match ? match[1] : '';
    };

    // Extract the +/- suffix for top rope routes
    const getPlusMinus = (grade: string) => {
      if (grade.includes('+')) return 1;
      if (grade.includes('-')) return -1;
      return 0;
    };

    const baseA = getBaseGrade(a);
    const baseB = getBaseGrade(b);

    // First sort by base grade number
    if (baseA !== baseB) {
      return baseA - baseB;
    }

    // If base grades are the same, sort by suffixes
    const letterA = getLetterSuffix(a);
    const letterB = getLetterSuffix(b);
    const plusMinusA = getPlusMinus(a);
    const plusMinusB = getPlusMinus(b);

    // Handle sport route letters (a < b < c)
    if (letterA && letterB) {
      return letterA.localeCompare(letterB);
    }

    // Handle top rope +/- (- < no suffix < +)
    if (plusMinusA !== plusMinusB) {
      return plusMinusA - plusMinusB;
    }

    // If one has letter and other has +/-, prioritize the one without suffix
    if (letterA && !letterB && plusMinusB === 0) return 1;
    if (letterB && !letterA && plusMinusA === 0) return -1;

    return 0;
  });
};
