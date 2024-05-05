import { lessons, units } from "@/db/schema";
import { UnitBanner } from "./unit-banner";
import { LessonButton } from "./lesson-button";

type Props = {
  id: number;
  order: number;
  description: string;
  title: string;
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean; //because lessons are normalized, it will consist of completed
  })[];
  activeLesson: typeof lessons.$inferSelect & {
    unit: typeof units.$inferSelect;
  } | undefined;
  activeLessonPercentage: number;
}
export const Unit = ({
  id,
  order,
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage  
}:Props)=> {
  return (
    <>
      <UnitBanner title={title} description={description}/>
      <div className="flex items-center flex-col relative">
        {lessons.map((lesson, index)=>{
          const isCurrent = lesson.id === activeLesson?.id;
          
          //To not allow user to select a lesson in future
          const isLocked = !lesson.completed && !isCurrent;
          
          return(
            <LessonButton 
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrent} 
              locked={isLocked}
              percentage={activeLessonPercentage}
            />
          );
        })}
      </div>
    </>
  );
};
