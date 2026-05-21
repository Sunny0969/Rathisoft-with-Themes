import { Navigate, useParams } from 'react-router-dom';
import { coursePath } from '../utils/routes';

/** Legacy route: learning happens on CourseDetailPage only. */
export function LecturePage() {
  const { courseId = '' } = useParams<{ courseId: string }>();
  return <Navigate to={coursePath(courseId)} replace />;
}
