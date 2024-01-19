import Login from "./components/Login";
import Register from "./components/Register";
import { ChakraProvider } from "@chakra-ui/react";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import SendMailPage from "./components/SendMailPage";
import History from "./components/History";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import AuthContext from "./context/auth-context";
import { useEffect, useState } from "react";
import Statistics from "./components/Statistics";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log("logging status: " + isLoggedIn)
  },[isLoggedIn]);

  return (
    //@ts-ignore
    <ChakraProvider>
      <AuthContext.Provider value={{ isLoggedIn: isLoggedIn }}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Navigate replace to={"/login"} />} />
            <Route path="/login" element={<Login onLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/main-menu" element={<Home />} />
            <Route path="/main-menu/send-mail" element={<SendMailPage />} />
            <Route path="/main-menu/history" element={<History />} />
            <Route path='/main-menu/statistics' element={<Statistics/>}/>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </ChakraProvider>
  );
};
export default App;
