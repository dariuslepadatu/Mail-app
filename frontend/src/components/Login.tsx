import { useEffect, useState } from "react";
import axios from "axios";
import {
  VStack,
  Input,
  Button,
  Link,
  HStack,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Link as ReachLink, useNavigate } from "react-router-dom";

/**
 *
 * @param props onLoggedIn: function
 * @returns
 */
const App = (props: any) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidInput, setInValidInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlertWrongCredentials, setShowAlertWrongCredentials] =
    useState(false);

  // to reset login status every time user lands on this page
  props.onLoggedIn(false);
  const navigate = useNavigate();

  /**
   * Sends user data to backend.
   *
   */
  const sendData = () => {
    const jsonObject = JSON.parse(
      `{"mail": "${mail}", "password": "${password}"}`
    );
    axios.post("http://127.0.0.1:5000/login", jsonObject).then((response) => {
      console.log(response.data);
      if (response.data === "no-mail") {
        console.log("Mail does not have an account");
        setInValidInput(true);
      } else {
        if (response.data === "valid") {
          console.log("Login succesfull! Navigate to main menu");
          props.onLoggedIn(true);
          navigate("/main-menu");
        } else {
          console.log("Wrong credentials");
          handleAlertWrongCredentials();
          setInValidInput(true);
          resetInputData();
        }
      }
    });
  };

  const handleAlertWrongCredentials = () => {
    setShowAlertWrongCredentials(true);

    const timeout = setTimeout(() => {
      setShowAlertWrongCredentials(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  const resetInputData = () => {
    setPassword("");
    setMail("");
  };

  const textStyle = {
    fontFamily: "Arial",
    fontSize: "30px",
    fontWeight: "bold",
    color: "black",
  };

  return (
    <VStack spacing={5} padding={100}>
      <h1 style={textStyle}>Login</h1>
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
          type={showPassword ? "text" : "password"}
          isInvalid={invalidInput}
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
      <HStack spacing={10}>
        <ReachLink to="/register">
          <Link>Register</Link>
        </ReachLink>
        <ReachLink to="/forgot-password">
          <Link>Forgot Password</Link>
        </ReachLink>
      </HStack>
      <Button onClick={sendData}>Submit</Button>
      {showAlertWrongCredentials && (
        <Alert status="error" width={"40%"}>
          <AlertIcon />
          Wrong credentials!
        </Alert>
      )}
    </VStack>
  );
};
export default App;
