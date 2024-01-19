import React, { useState } from 'react';
import axios from 'axios';
import {
  VStack,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

const ResetPassword = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [invalidInput, setinValidInput] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const sendData = () => {
    if (!checkPasswordMatch()) return;
  
    const jsonObject = {
      mail,
      otpCode,
      password,
    };
  
    axios.post('http://127.0.0.1:5000/reset-password', jsonObject).then(response => {
      console.log('Reset password: ' + response.data);
  
      if (response.data === 'nonvalid') {
        setErrorMessage('Wrong mail or wrong code');
        setinValidInput(true);
        setShowAlert(false); // Hide the alert
      } else if (response.data === 'valid') {
        resetInputData();
        handleAlert(); // Show the alert
      }
    });
  };
  

  const resetInputData = () => {
    setErrorMessage('');
    setInvalidPassword(false);
    setinValidInput(false);
    setPassword('');
    setOtpCode('');
    setConfirmedPassword('');
    setMail('');
  };

  const handleAlert = () => {
    
    setShowAlert(true);

    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };


  const checkPasswordMatch = () => {
    if (password !== confirmedPassword) {
      setInvalidPassword(true);
      setErrorMessage('Passwords do not match');
      return false;
    }
    return true;
  };

  return (
    <VStack spacing={5} padding={100}>
      <h1 style={{ fontFamily: 'Arial', fontSize: '30px', fontWeight: 'bold', color: 'black' }}>
        Reset password
      </h1>
      <h1 style={{ fontFamily: 'Arial', fontSize: '20px', color: 'red' }}>{errorMessage}</h1>
      <Input
        isInvalid={invalidInput}
        width="30%"
        placeholder="Enter your mail"
        value={mail}
        onChange={e => setMail(e.target.value.trim())}
      />
      <Input
        isInvalid={invalidInput}
        width="30%"
        placeholder="Enter OTP code"
        value={otpCode}
        onChange={e => setOtpCode(e.target.value.trim())}
      />
      <InputGroup size="md" width="30%">
        <Input
          width="85%"
          isInvalid={invalidPassword}
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter new password"
          value={password}
          onChange={e => setPassword(e.target.value.trim())}
        />
        <InputRightElement width="15%">
          <Button size="sm" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
      <InputGroup size="md" width="30%">
        <Input
          width="85%"
          isInvalid={invalidPassword}
          type={showConfirmedPassword ? 'text' : 'password'}
          placeholder="Confirm new password"
          value={confirmedPassword}
          onChange={e => setConfirmedPassword(e.target.value.trim())}
        />
        <InputRightElement width="15%">
          <Button
            size="sm"
            onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
          >
            {showConfirmedPassword ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>

      <Button onClick={sendData}>Submit</Button>

      {showAlert && (
        <Alert status="success" width="40%">
          <AlertIcon />
          Password changed successfully!
        </Alert>
      )}

    </VStack>
  );
};

export default ResetPassword;
