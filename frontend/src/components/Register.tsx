import React, { useState } from "react";
import axios from "axios";
import {
  VStack,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const Register = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [invalidInput, setInvalidInput] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);


  /**
   * Sends user info to backend.
   *  
   */
  const sendData = () => {
    if (!checkPasswordMatch() || !checkInputsFill()) return;

    const jsonObject = JSON.parse(
      `{"mail": "${mail}", "password": "${password}"}`
    );
    axios
      .post("http://127.0.0.1:5000/register", jsonObject)
      .then((response) => {
        console.log("Register: " + response);
        if (response.data === "error:used-mail") {
          setErrorMessage("Mail already used");
          setInvalidInput(true);
          handleAlertError();
        } else if (response.data === "success") {
          handleAlertSuccess();
          resetInputData();
        }
      });
  };

  const resetInputData = () => {
    setErrorMessage("");
    setInvalidPassword(false);
    setInvalidInput(false);
    setPassword("");
    setConfirmedPassword("");
    setMail("");
  };

  const handleAlertError = () => {
    setShowAlertError(true);

    const timeout = setTimeout(() => {
      setShowAlertError(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  const handleAlertSuccess = () => {
    setShowAlertSuccess(true);

    const timeout = setTimeout(() => {
      setShowAlertSuccess(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  const checkPasswordMatch = () => {
    if (password !== confirmedPassword) {
      setInvalidPassword(true);
      setErrorMessage("Passwords does not match!");
      handleAlertError();
      return false;
    }
    return true;
  };

  const checkInputsFill = () => {
    if (mail == "" || password == "" || confirmedPassword == "") {
      setErrorMessage("Complete all fields!");
      handleAlertError();
      setInvalidPassword(true);
      setInvalidInput(true);
      return false;
    }
    return true;
  };

  const textStyle = {
    fontFamily: "Arial",
    fontSize: "30px",
    fontWeight: "bold",
    color: "black",
  };

  return (
    <VStack spacing={5} padding={100}>
      <h1 style={textStyle}>Register</h1>
      <Input
        isInvalid={invalidInput}
        width={"30%"}
        placeholder="Enter Mail"
        value={mail}
        onChange={(e) => setMail(e.target.value.trim())}
      ></Input>
      <InputGroup size="md" width={"30%"}>
        <Input
          width={"85%"}
          isInvalid={invalidPassword}
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
        />
        <InputRightElement width={"15%"}>
          <Button size="sm" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      <InputGroup size="md" width={"30%"}>
        <Input
          width={"85%"}
          isInvalid={invalidPassword}
          type={showConfirmedPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value.trim())}
        />
        <InputRightElement width={"15%"}>
          <Button
            size="sm"
            onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
          >
            {showConfirmedPassword ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
      <Button onClick={sendData}>Submit</Button>
      {showAlertError && (
        <Alert status="error" width={"40%"}>
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}
      {showAlertSuccess && (
        <Alert status="success" width={"40%"}>
          <AlertIcon />
          Account created successfully!
        </Alert>
      )}
    </VStack>
  );
};
export default Register;
