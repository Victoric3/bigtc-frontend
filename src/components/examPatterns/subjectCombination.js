const subjectCombinations = [
    "Medicine and Surgery and other Medical Related Courses: English, Biology, Physics, Chemistry",
    "Engineering (e.g., Mechanical, Electrical, Civil, etc.): Physics, Chemistry, Mathematics, Use of English",
    "Computer Science: Physics, Mathematics, Use of English, One other science or social science subject",
    "Law: Use of English, Literature in English, Government or History, Any other subject from Arts or Social Sciences",
    "Pharmacy: Physics, Chemistry, Biology, Use of English",
    "Accounting: Use of English, Mathematics, Economics, Any one of Government, History, Commerce, Literature, Geography",
    "Economics: Use of English, Mathematics, Economics, Any one of Government, History, Geography, Literature, and French",
    "Mass Communication: Use of English, Literature in English, Economics or Government or History or Geography, Any one of Biology, Physics, Chemistry, Geography, and Economics",
    "Biochemistry: Physics, Chemistry, Biology, Use of English",
    "Agriculture: Use of English, Chemistry, Biology or Agricultural Science, Any one of Physics, Geography, and Economics",
    "Geology: Physics, Chemistry, Geography, Use of English",
  ];

  const availableSubjects = [
    'English',
    'Mathematics',
    "Biology",
    'Chemistry',
    'Physics',
    'Christian Religious Studies',
    // Add more subjects here
  ];
  const availableExams = [
    'joint admissions and matriculation exam',
    // Add more exams here
  ];

module.exports = {subjectCombinations, availableSubjects, availableExams}