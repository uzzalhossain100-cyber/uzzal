import { MadeWithDyad } from "@/components/made-with-dyad";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const IndexLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/* This is where nested routes will render */}
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default IndexLayout;