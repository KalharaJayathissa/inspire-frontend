import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2, Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import "./login.css";

function Login() {
  console.log("Rendering Login component");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Sign in user
    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );
    if (signInError || !data.user) {
      setError(signInError?.message || "Login failed");
      setLoading(false);
      return;
    }

    //printing the access token to console
    console.log("Access Token:", data.session?.access_token);

    // Get user id from token
    const userId = data.user.id;
    // Fetch role from user_role table
    console.log("Fetching role for user ID:", userId);

    //*******USED FOR TESTING PURPOSES *********//
    //     const { data: allRoles, error } = await supabase
    //   .from('user_role')
    //   .select('*'); // select all columns for all rows

    // if (error) {
    //   console.error('Error fetching all roles:', error);
    // } else {
    //   console.log('All user_role data:', allRoles);
    // }
    // console.log("ahhh");

    const { data: roleData, error: roleError } = await supabase
      .from("user_role")
      .select("role")
      .eq("user_id", userId)
      .single();

    console.log("error:", roleError, "roleData:", roleData);
    if (roleError || !roleData) {
      setError("Could not fetch user role");
      setLoading(false);
      return;
    }
    // Redirect based on role

    if (roleData.role === "admin") {
      navigate("/admin/");
    } else if (roleData.role === "marker") {
      navigate("/marker");
    } else if (roleData.role === "invigilator") {
      navigate("/invigilator");
    } else {
      setError("Unauthorized role");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="background-overlay"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="login-content">
        {/* Logo Section */}
        <div className="logo-section">
          <img
            src="/src/assets/kess-logo-removebg-preview.png"
            alt="KESS Logo"
            className="logo-image"
          />
          <h1 className="logo-text">KESS INSPIRE</h1>
          <p className="logo-subtitle">Staff Login</p>
        </div>

        {/* Login Form */}
        <Card className="login-card">
          <CardHeader className="login-card-header">
            <CardTitle className="login-card-title">
              <LogIn className="w-6 h-6 mr-2" />
              Welcome Back
            </CardTitle>
            <CardDescription className="login-card-description">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="login-card-content">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="error-alert">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="login-button"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">
            Secure access to your platform
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
