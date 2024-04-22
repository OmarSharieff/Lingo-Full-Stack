import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

type Props = {
  children: React.ReactNode;
}

const MainLayout = ({children}:Props)=> {
  return (
    <>
      <MobileHeader/>
      {/* Sidebar is only visible in desktop screens */}
      {/* We can easily pass tailwind classes as props to our Sidebar component */}
      <Sidebar className="hidden lg:flex"/>
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className="bg-red-500 h-full">
          {children}
        </div>
      </main>
    </>
  )
}
export default MainLayout
