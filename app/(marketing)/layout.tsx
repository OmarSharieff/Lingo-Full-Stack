import { Footer } from "./footer";
import { Header } from "./header";

// Adding childern props to make layout.tsx functional
type Props = {
  children: React.ReactNode;
}

const MarketingLayout = ({children}: Props)=> {
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
      <Footer/>
    </div>
  );
};
export default MarketingLayout;