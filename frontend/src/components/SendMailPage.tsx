import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  Input,
  Switch,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import MainMenu from "./MainMenu";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, { modules, formats } from "./../utils/TextEditor";

const SendMailPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [invalidMails, setInvalidMails] = useState<string[]>([]);
  const [showInvalidMails, setShowInvalidMails] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [htmlMode, setHtmlMode] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const invalidEmailStyle: React.CSSProperties = {
    color: "red",
    fontFamily: "Arial",
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "left",
  };

  const textStyle = {
    fontFamily: "Arial",
    fontSize: "30px",
    fontWeight: "bold",
    color: "black",
  };

  const handleAlertSuccess = () => {
    setShowAlertSuccess(true);

    const timeout = setTimeout(() => {
      setShowAlertSuccess(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  const handleALertError = () => {
    setShowAlertError(true);

    const timeout = setTimeout(() => {
      setShowAlertError(false);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  const resetInputData = () => {
    setTitle("");
    setMessage("");
  };

  /**
   * Sends CSV file to backend.
   * Checks file extension and existence.
   *
   */
  const onFileUpload = () => {
    const formData = new FormData();
    if (file) {
      formData.append("MailListFile", file, file?.name);
    } else {
      setErrorMessage("Please select a CSV file!");
      handleALertError();
      return;
    }

    if (file?.type != "text/csv") {
      setErrorMessage("File must be CSV type!");
      handleALertError();
      return;
    }
    axios
      .post("http://127.0.0.1:5000/main-menu/send-mail/file", formData)
      .then((response) => {
        if (response.data === "success") {
          handleAlertSuccess();
          setShowInvalidMails(false);
        } else {
          setInvalidMails(response.data);
          setShowInvalidMails(true);
        }
      });
  };

  const onFilesUpload = () => {
    const formData = new FormData();

    if (selectedFiles.length === 0) {
      setErrorMessage("Please select files to upload!");
      handleALertError();
      return;
    }

    selectedFiles.forEach((file) => {
      formData.append("file", file, file.name);
    });

    axios
      .post("http://127.0.0.1:5000/main-menu/send-mail/files", formData)
      .then((response) => {
        if (response.data === "success") {
          handleAlertSuccess();
          setShowInvalidMails(false);
        } else {
          setErrorMessage("Please select files to upload!");
          handleALertError();
          return;
        }
      });
  };

  /**
   * Sends mail data to backend (title, message, CSV file name).
   */
  const onMailSend = () => {
    if (!title && !file) {
      setErrorMessage(
        "Add a title and receivers' CSV file in order to send a mail!"
      );
      handleALertError();
      return;
    } else if (!title) {
      setErrorMessage("Add a title in order to send a mail!");
      handleALertError();
      return;
    } else if (!file) {
      setErrorMessage("Add a receivers' CSV file in order to send a mail!");
      handleALertError();
      return;
    }

    const attachedFiles = selectedFiles.map((file) => file.name);
    const jsonObject = {
      title: title,
      message: message,
      filename: file?.name,
      attachedFiles: attachedFiles,
    };
    axios
      .post("http://127.0.0.1:5000/main-menu/send-mail", jsonObject)
      .then((response) => {
        if (response.data === "success") {
          console.log("Mail sent successfully!");
          resetInputData();
        } else {
          setErrorMessage(response.data);
          handleALertError();
        }
      });
  };
   const switchMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHtmlMode(event.target.checked);
    setMessage("");
  };

  return (
    //@ts-ignore
    <MainMenu>
      <VStack spacing={3} padding={50}>
        <h1 style={textStyle}>Send new mail</h1>
        <HStack w={"100%"} spacing={5}>
          <Box fontSize={"20px"} fontWeight={"bold"}>
            HTML Mode
          </Box>
          <Switch size={"lg"} onChange={switchMode} colorScheme="teal" />
        </HStack>
        <Input
          placeholder="Title"
          bg="white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></Input>
        {htmlMode && (
          <Textarea
            placeholder="Write your HTML code here..."
            bg="white"
            rows={10}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></Textarea>
        )}
        {!htmlMode && (
          <Fragment>
            <EditorToolbar />
            <ReactQuill
              value={message}
              placeholder="Write the message here..."
              style={{ width: "100%", height: "400px", paddingBottom: "20px" }}
              onChange={(value) => setMessage(value)}
              theme="snow"
              modules={modules}
              formats={formats}
            />
            <style>{`
            .ql-container {
              font-size: inherit !important
          }

            .ql-editor {
              background-color: white;
          }
          `}</style>
          </Fragment>
        )}
        <HStack w="100%">
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button bg="#D3D3D3" onClick={onFileUpload}>
            Upload CSV
          </Button>
        </HStack>

        <HStack w="100%">
          <Input type="file" multiple onChange={handleFileChange} />
          <Button bg="#D3D3D3" onClick={onFilesUpload}>
            Attach files
          </Button>
        </HStack>

        {showAlertError && (
          <Alert status="error" width={"100%"}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
        {showAlertSuccess && (
          <Alert status="success" width={"100%"}>
            <AlertIcon />
            File uploaded successfully!
          </Alert>
        )}
        {showInvalidMails && (
          <Box w={"100%"}>
            <Box
              w={"100%"}
              fontSize={"20px"}
              fontFamily={"Arial"}
              fontWeight={"bold"}
            >
              Please update your CSV file. The following email addresses are
              wrong:{" "}
            </Box>

            {invalidMails.map((email, index) => (
              <p key={index} style={invalidEmailStyle}>
                {email}
              </p>
            ))}
          </Box>
        )}

        {!showInvalidMails && !showAlertError && (
          <Button colorScheme="teal" w={"150px"} onClick={onMailSend}>
            Send
          </Button>
        )}
      </VStack>
    </MainMenu>
  );
};

export default SendMailPage;
