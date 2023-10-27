import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import AUTHCSS from "./auth.module.css";

export const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleAuthMode = () => {
    setIsRegistering((prev) => !prev);
  };
  return (
    <div className={AUTHCSS.authContainer}>
      <div className={AUTHCSS.loginChange}>
        {isRegistering ? (
          <Register toggleAuthMode={toggleAuthMode} />
        ) : (
          <Login toggleAuthMode={toggleAuthMode} />
        )}
        <div className={AUTHCSS.authToggle}>
          {isRegistering ? (
            <p className={AUTHCSS.para}>
              Already have an account?{" "}
              <span onClick={toggleAuthMode} className={AUTHCSS.toggl}>
                Login
              </span>
            </p>
          ) : (
            <p className={AUTHCSS.para}>
              Don't have an account?{" "}
              <span onClick={toggleAuthMode} className={AUTHCSS.toggl}>
                Register
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [_, setCookies] = useCookies(["access_token"]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Please fill in both fields.");
      return;
    }
    try {
      const response = await axios.post(
        "https://kitchenkonnect.onrender.com/auth/login",
        {
          username: username.toLowerCase(),
          password,
        }
      );

      setCookies("access_token", response.data.token);
      window.localStorage.setItem("userID", response.data.userID);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Login"
      onSubmit={onSubmit}
    />
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    } else if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post("https://kitchenkonnect.onrender.com/auth/register", {
        username,
        password,
      });
      alert("Registration Complete!");

      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      label="Register"
      onSubmit={onSubmit}
    />
  );
};

const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  label,
  onSubmit,
}) => {
  return (
    <div className={AUTHCSS.authContainer}>
      <form onSubmit={onSubmit}>
        <h2 className={AUTHCSS.head}>{label}</h2>
        <div className={AUTHCSS.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className={AUTHCSS.Input}
          />
        </div>
        <div className={AUTHCSS.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={AUTHCSS.Input}
          />
        </div>
        {label === "Register" && (
          <div className={AUTHCSS.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={AUTHCSS.Input}
            />
          </div>
        )}
        <button type="submit" className={AUTHCSS.btn}>
          {label}
        </button>
      </form>
    </div>
  );
};
