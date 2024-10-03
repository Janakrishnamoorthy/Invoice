import React, { useState, useEffect } from 'react';
import Input from '../input/input';
import Button from '../button/button';
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate} from 'react-router-dom';
import axios from 'axios'; // Add axios for making HTTP requests


const Login = () => {
  const navigate = useNavigate(); // Initialize navigate function instead of useHistory
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Disable button initially

  useEffect(() => {
    // Enable button if both fields are filled
    setIsButtonDisabled(email === '' || password === '');
  }, [email, password]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });

      if (response.data.success) {
        // Store the token in localStorage
        localStorage.setItem('authToken', response.data.token);

        // Redirect to a protected page after login (e.g., /add-invoice)
        navigate('/view-invoice');
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message); // Show error message
      } else {
        setError('Something went wrong, please try again.');
      }
    }
  };

  return (
    <div className='login-wrapper'>
    <div className="login-container">
      <img src="/path-to-your-logo/logo.png" alt="Company Logo" className="login-logo" />
      <h2 className="login-title">Login to Tax Invoice</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="error-message">{error}</p>}
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          required
          className="login-input"
        />
        <div className="password-field">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            className="login-input"
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          />
        </div>
        <Button name="Login" type="submit" className="login-btn" disabled={isButtonDisabled} />
      </form>
    </div>
    </div>
  );
};

export default Login;
