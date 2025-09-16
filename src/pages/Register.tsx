import StudentForm from "@/components/StudentForm";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Register = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            Student Registration
          </h1>
          <StudentForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
