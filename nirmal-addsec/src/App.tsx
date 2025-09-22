import { MarksManagement } from "./components/MarksManagement";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <>
      <MarksManagement />
      <Toaster position="top-right" />
    </>
  );
}