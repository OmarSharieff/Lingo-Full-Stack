"use client"
import { useRouter } from "next/navigation";
import { courses, userProgress } from "@/db/schema"
import { upsertUserProgress } from "@/actions/user-progress";
import { Card } from "./card";
import { useTransition } from "react";
import { toast } from "sonner";


type Props = {
  courses: typeof courses.$inferSelect[];
  activeCourseId?: typeof userProgress.$inferInsert.activeCourseId;
};

export const List = ({courses,activeCourseId}:Props)=> {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number)=> {
    if (pending) return;

    //if user clicks on the course which has already been activated then no need to create a new database.
    if(id === activeCourseId) {
      //redirecting the user to '/learn' route.
      return router.push("/learn");
    }

    //If user is selecting a new course we have to call server action.
    startTransition(()=> {
      upsertUserProgress(id)
      .catch(()=> toast.error("Something went wrong!"))
    });
  }

  return(
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {courses.map(course=> (
        <Card 
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  );
}