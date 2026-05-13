import { Navigate, useParams } from 'react-router-dom';

/** Legacy route: learning happens on CourseDetailPage only. */
export function LecturePage() {
  const { courseId = '' } = useParams<{ courseId: string }>();
  return <Navigate to={`/courses/${courseId}`} replace />;
}
