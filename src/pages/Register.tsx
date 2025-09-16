import StudentForm from "@/components/StudentForm";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Register = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16 sm:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8">
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
