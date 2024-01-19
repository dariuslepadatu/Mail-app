import React, { useState } from 'react';
import axios from 'axios';
import {
  VStack,
  Input,
  Button,
  Link,
  HStack,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';

const ForgotPassword = () => {
  const [mail, setMail] = useState('');
  const [invalidInput, setinValidInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);


  const handleAlert = () => {
    
    // Show the alert when the component mounts
    setShowAlert(true);

    // Hide the alert after a certain duration (e.g., 3 seconds)
    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timeout);
  };

    const resetInputData = () => {
        setMail('');
        setinValidInput(false);
        setErrorMessage('');
    }

  const sendData = () => {
    console.log(mail);
    const jsonObject = JSON.parse(
      `{"mail": "${mail}"}`
    );
    axios.post('http://127.0.0.1:5000/forgot-password', jsonObject).then(response => {
      console.log('Forgot password: ' + response);
      if (response.data === 'nonvalid') {
        console.log('Mail does not have an account');
        setErrorMessage('Account does not exist');
        setinValidInput(true);
      } else {
        if (response.data === 'valid') {
          console.log('Mail sent succesfull! Check your inbox.');
          resetInputData();
          handleAlert();
        } else {
          console.log('Wrong credentials');
          setErrorMessage('Wrong credentials');
          setinValidInput(true);
        }
      }
    });
  };

  const textStyle = {
    fontFamily: 'Arial',
    fontSize: '30px',
    fontWeight: 'bold',
    color: 'black',
  };

  const errorMessageStyle = {
    fontFamily: 'Arial',
    fontSize: '20px',
    color: 'red',
  };

  return (
    <VStack spacing={5} padding={100}>
      <h1 style={textStyle}>Forgot password</h1>
      <h1 style={errorMessageStyle}>{errorMessage}</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Input
            isInvalid={invalidInput}
            style={{ flex: '1', marginRight: '10px' }}
            placeholder="Enter Mail"
            value={mail}
            onChange={e => setMail(e.target.value.trim())}
            />
        <Button onClick={sendData}>Submit</Button>
        </div>
    

      <HStack spacing={20}>
        <ReachLink to="/register">
          <Link>Register</Link>
        </ReachLink>
        <ReachLink to="/login">
          <Link>Login</Link>
        </ReachLink>
        <ReachLink to="/reset-password">
          <Link>Reset password</Link>
        </ReachLink>
      </HStack>
      
        {showAlert && (
            <Alert status="success" width={'40%'}>
                <AlertIcon />
                Recovery mail was sent!
            </Alert>
            )}

    </VStack>
  );
};
export default ForgotPassword;
