import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Resources", href: "#resources" },
  { label: "Contact", href: "#contact" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Handle automatic scrolling when coming from register page
    if (location.state && "scrollTo" in location.state && !isRegisterPage) {
      const element = document.querySelector(location.state.scrollTo as string);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      // Clear the state after scrolling
      navigate("/", { replace: true });
    }
  }, [location.state, isRegisterPage, navigate]);

  const handleNavClick = (href: string) => {
    if (isRegisterPage) {
      // If on register page, navigate to home first with scroll target
      navigate("/", { state: { scrollTo: href } });
    } else {
      // If on home page, scroll directly
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isRegisterPage
          ? "bg-background/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div
          className={`flex items-center ${
            isRegisterPage ? "justify-center" : "justify-between"
          } h-16`}
        >
          {/* Logo */}
          {!isRegisterPage && (
            <div className="flex-shrink-0">
              <h1
                className={`text-2xl font-bold ${
                  isScrolled
                    ? "bg-gradient-hero bg-clip-text text-transparent"
                    : "text-slate-100"
                }`}
              >
                KESS INSPIRE
              </h1>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className={`${
                    isRegisterPage
                      ? "text-foreground"
                      : isScrolled
                      ? "text-foreground"
                      : "text-slate-100"
                  } hover:text-primary transition-colors duration-200 font-medium`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Button - Desktop */}
          {!isRegisterPage && (
            <div className="hidden md:block">
              <Button
                onClick={() => navigate("/register")}
                className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300"
              >
                Register Now
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md rounded-lg mt-2 shadow-card">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className={`block px-3 py-2 text-base font-medium ${
                    isRegisterPage
                      ? "text-foreground"
                      : isScrolled
                      ? "text-foreground"
                      : "text-slate-100"
                  } hover:text-primary hover:bg-muted rounded-md transition-colors duration-200 w-full text-left`}
                >
                  {item.label}
                </button>
              ))}
              {!isRegisterPage && (
                <div className="px-3 pt-2">
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/register");
                    }}
                    className={`w-full ${
                      isScrolled
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-accent hover:bg-accent/90"
                    } text-white transition-all duration-300`}
                  >
                    Register Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
