import { getCourses, getUserProgress } from "@/db/queries"
import { List } from "./list";

const CoursesPage = async()=> {
  const coursesData = getCourses();
  const userProgressData = getUserProgress();
  
  //The “waterfall issue” in a server component refers to a situation where multiple API calls are made sequentially, causing a delay in the rendering of the component.
  // Promise.all helps to resolve waterfall issue
  const [
    courses,
    userProgress,
  ] = await Promise.all([
    coursesData,
    userProgressData,
  ]);

  return(
    <div className="h-full max-w-[912px] px-3 mx-auto ">
      <h1 className="text-2xl font-bold text-neutral-700 ">
        Language Courses
      </h1>
      <List 
        courses={courses}
        activeCourseId={userProgress?.activeCourseId}
      />
    </div>
  )
}
export default CoursesPage;