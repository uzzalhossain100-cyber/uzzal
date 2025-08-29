import { MadeWithDyad } from "@/components/made-with-dyad";
import Dashboard from "./Dashboard"; // Import the Dashboard component

const Index = () => {
  // The root path "/" is now handled by the Dashboard component directly in App.tsx
  // This Index.tsx file can now simply render the Dashboard or be removed if not needed for other purposes.
  return <Dashboard />;
};

export default Index;