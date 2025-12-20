import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-placeholder">
            <div className="logo-icon"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <h3 className="text-center">Login</h3>
            <label className="form-label mt-4">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
              <span>Password</span>
              <a
                href="#"
                className="forgot-link text-nowrap"
                onClick={(e) => e.preventDefault()}
              >
                Forgot Password?
              </a>
            </label>

            <div className="input-wrapper position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input pe-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />

              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* <div className="divider">
            <span>or</span>
          </div> */}

          {/* <button
            type="button"
            className="guest-btn"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Continue as Guest
          </button> */}
        </form>

        <div className="login-footer">
          {/* <p>
            Don't have an account?
             <a href="/register" className="register-link">Sign up</a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
