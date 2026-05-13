export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Lecture {
  id: string;
  title: string;
  description: string;
  duration: string;
  driveFileId: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: CourseLevel;
  duration: string;
  totalLectures: number;
  instructor: string;
  tags: string[];
  lectures: Lecture[];
  quiz: Quiz;
}

export interface EnrollmentForm {
  name: string;
  email: string;
  phone: string;
  city: string;
  occupation: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
}

export interface LocalProgress {
  courseId: string;
  enrolledUserEmail: string;
  completedLectures: string[];
  quizScore?: number;
  quizPassed?: boolean;
  certificateIssued?: boolean;
  enrolledAt: string;
}
