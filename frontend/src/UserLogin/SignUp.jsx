import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const RegistrationPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  // const [success, setSuccess] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Validate form fields
  useEffect(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 6;
    const isUsernameValid = username.trim().length > 0;

    setIsFormValid(isEmailValid && isPasswordValid && isUsernameValid);
  }, [username, email, password]);

  const handleSubmit = async (e) => {
 
    e.preventDefault();

    const userData = { username, email, password };
    console.log(userData)
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/signup`, userData);

    //   const data = await response.json();

      if (response.status === 201) {
        setSuccess('User registered successfully!');
        setError('');
        navigate('/login'); // Redirect to login page
      } else {
        setError(data.message || 'Failed to register user');
        setSuccess('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSuccess('');
      console.log(err)
    }
  };

  return (
    <RegistrationPageWrapper>
      <LeftContainer>
        <Logo  alt="" />
        <DownloadButton>
          For Better Experience
          <br />
          Download 98fastbet App
        </DownloadButton>

        <SubHeading>Create your account</SubHeading>
        <FormContainer onSubmit={handleSubmit}>
          <Label>UserName</Label>
          <Input type="text" name="username" placeholder="Enter Your Name" value={username}
            onChange={(e) => setUsername(e.target.value)} />

          <Label>Email</Label>
          <Input type="email" name="email" placeholder="Enter Your Email" value={email}
            onChange={(e) => setEmail(e.target.value)} />

          <Label>Password</Label>
          <Input type="password" name="password" placeholder="Min 6 Digit Password" value={password}
            onChange={(e) => setPassword(e.target.value)} />

          <SignUpButton type="submit" disabled={!isFormValid}>Sign Up</SignUpButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <p>Already have an account?</p>
          <Link to="/login"><SignUpButton>Login</SignUpButton></Link>
        </FormContainer>
      </LeftContainer>

      <RightContainer />

      <FloatingWhatsappIcon href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" />
    </RegistrationPageWrapper>
  );
};

export default RegistrationPage;



// Styled components
const RegistrationPageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  background: linear-gradient(#0B66FF, #0057D9); /* Overall page background */
`;

const LeftContainer = styled.div`
  width: 30%;
  min-width: 320px;
  background-color: #003C7B;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  color: #fff;
    @media (max-width: 1024px) {
    width: 100%;
  }
`;

const RightContainer = styled.div`
  flex: 1;
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  background: yellow;
  height: 100px;
  width: 100px;
`;

// const Heading = styled.h2`
//   font-size: 2rem;
//   margin-bottom: 1.5rem;
//   text-transform: uppercase;
// `;

const DownloadButton = styled.button`
  background-color: transparent;
  color: #fff;
  border: 2px solid white;
  padding: 0.2rem 2rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: 1px;
  font-size: 1rem;
  animation: changeBgColor 1.5s infinite;

  @keyframes changeBgColor {
    0% { background-color: #e53935; }
    50% { background-color: #003C7B; }
    100% { background-color: #e53935; }
  }
`;

const SubHeading = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FormContainer = styled.form`
  width: 100%;
  max-width: 80%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  text-align: left;
  margin-bottom: 0.25rem;
  font-weight: bold;
  color: #fff;
`;

const Input = styled.input`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  text-align: left;

  &:focus {
    outline: none;
    border-color: #0B66FF;
  }
`;

const SignUpButton = styled.button`
  background-color: #007BFF;
  color: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  &:hover {
    background-color: #005ce6;
  }
`;

const FloatingWhatsappIcon = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: url('https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg')
    no-repeat center center;
  background-size: cover;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
`;

const SuccessMessage = styled.p`
  color: green;
  font-weight: bold;
  text-align: center;
`;