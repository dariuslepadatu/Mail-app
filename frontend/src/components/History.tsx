import {
  Accordion,
  Box,
  Button,
  Center,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Switch,
  VStack,
} from "@chakra-ui/react";
import MainMenu from "./MainMenu";
import AlertCustom, { PropsInterface } from "../utils/AlertCustom";
import { useEffect, useState } from "react";
import axios from "axios";
import Mail from "./Mail";

interface MailProps {
  title: String;
  message: String;
  date: String;
}
const textStyle = {
  fontFamily: "Arial",
  fontSize: "30px",
  fontWeight: "bold",
  color: "black",
};

const dateStyle = {
  fontFamily: "Arial",
  fontSize: "20px",
  fontWeight: "bold",
  color: "black",
  marginRight: "10px",
  marginLeft: "10px",
};

const History = () => {
  const startHour = "00:00:00";
  const endHour = "23:59:59";

  const [mailList, setMailList] = useState<Array<MailProps>>();
  const [customTimePeriod, setCustomTimePeriod] = useState<Boolean>(false);
  // for default options
  const [timePeriod, setTimePeriod] = useState("");
  // for custom time period
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [fetchDataTrigger, setFetchDataTrigger] = useState(false);
  // alert states
  const [showAlertTrigger, setShowAlertTrigger] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  //searchbar
  const [query, setQuery] = useState("");

  /**
   *
   * Fetches data, stores it in mailList.
   */


  
  const fetchData = () => {
    console.log(startDate);
    console.log(endDate);
    //-----------------------------
    // check if date is null
    // required for first render of the page
    // setStartDate(String(new Date()))
    // setEndDate(String(new Date()))
    if (endDate === "" || startDate === "") return;
    const jsonObject = JSON.parse(
      `{"start_date": "${startDate}", "end_date": "${endDate}"}`
    );
    axios
      .post("http://127.0.0.1:5000/main-menu/history", jsonObject)
      .then((response) => {
        const tmpList: Array<MailProps> = [];
        response.data.map((mail: MailProps) => {
          tmpList.push(mail);
        });
        setMailList(tmpList);
      });
  };

  useEffect(() => {
    fetchData();
  }, [fetchDataTrigger]);

  /**
   *
   * @param date date to be formated
   * @param hour hour of the date, can be ''
   * @returns string date as YYYY-MM-DD hh:mm:ss
   */
  const formatDate = (date: Date | undefined, hour: String) => {
    return (
      date?.getFullYear().toString() +
      "-" +
      (date?.getMonth()! + 1 < 10 ? "0" : "") +
      (date?.getMonth()! + 1).toString() +
      "-" +
      (date?.getDate()! + 1 < 10 ? "0" : "") +
      date?.getDate().toString() +
      (hour === "" ? "" : " " + hour)
    );
  };

  /**
   * converts html text to simple text by removing every \
   * html like syntax: < any text >
   * @returns based on mailList, renders every entry of its content
   */
  const renderMails = () => {
    const filteredMails: Array<MailProps> | undefined = filterMails();
    return filteredMails?.map((mail, index) => (
      <Mail
        key={"@id" + index}
        title={mail.title}
        message={mail.message}
        date={mail.date}
      />
    ));
  };

  useEffect(() => {
    filterMails();
  }, [query]);

  /**
   * filters mailList by query
   * @returns Array<MailProps>
   */
  const filterMails = () => {
    if (query) {
      return mailList?.filter((mail) => {
        const searchTerm = query.toLowerCase();
        const titleContainsQuery = mail.title
          .toLowerCase()
          .includes(searchTerm);
        const messageContainsQuery = mail.message
          .toLowerCase()
          .includes(searchTerm);
        return titleContainsQuery || messageContainsQuery;
      });
    }
    return mailList;
  };

  /**
   *
   * updates the filters based on user input
   * triggers a refetch of data through
   */
  const applyFilters = () => {
    if (customTimePeriod) {
      if (startDate === "" || endDate === "") {
        setAlertMessage("Please insert a start date and an end date");
        setShowAlertTrigger((prevState) => !prevState);
        return;
      }
      if (startDate > endDate) {
        setAlertMessage("Select a valid date");
        setShowAlertTrigger((prevState) => !prevState);
        return;
      }
      setStartDate((prevState) => prevState + " " + startHour);
      setEndDate((prevState) => prevState + " " + endHour);
    } else {
      if (timePeriod === "") {
        setAlertMessage("Select a date");
        setShowAlertTrigger((prevState) => !prevState);
        return;
      }

      let date = new Date();
      // check if timePeriod is all or 1 / 2 / 3
      const period = timePeriod === "all" ? 12 : parseInt(timePeriod);
      date.setMonth(date.getMonth() - period);
      setStartDate(formatDate(date, startHour));
      setEndDate(formatDate(new Date(), endHour));
    }
    setFetchDataTrigger((prevState) => !prevState);
  };

  /**
   * resets: startDate, endDate, timePeriod
   * sets: customTimePeriod
   * @param event event from Switch component
   */
  const switchMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTimePeriod(event.target.checked);
    setStartDate("");
    setEndDate("");
    setTimePeriod("");
  };

  return (
    <MainMenu>
      <VStack spacing={3} padding={50}>
        <h1 style={textStyle}>History</h1>

        <HStack w="100%" spacing={5} marginLeft="5%">
          <Box fontSize="20px" fontWeight="bold">
            Select custom dates
          </Box>
          <Switch size="lg" onChange={switchMode} colorScheme="teal" />

          {!customTimePeriod && (
            <Menu >
              <MenuButton as={Button} marginLeft="5%" marginRight="35%"colorScheme="teal">
                Select time period
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setTimePeriod('1')}>Last 30 days</MenuItem>
                <MenuItem onClick={() => setTimePeriod('2')}>Last 60 days</MenuItem>
                <MenuItem onClick={() => setTimePeriod('3')}>Last 90 days</MenuItem>
                <MenuItem onClick={() => setTimePeriod('all')}>All days</MenuItem>
              </MenuList>
            </Menu>
          )}
          {customTimePeriod && (
            <HStack w="50%" spacing={2}>
              <Box style={dateStyle}>Start date</Box>
              <Input
                type="date"
                size="md"
                w="20%"
                value={startDate === "" ? "" : startDate.substring(0, 10)}
                onChange={(event) => setStartDate(event.target.value)}
              />
              <Box style={dateStyle}>End date</Box>
              <Input
                type="date"
                size="md"
                w="20%"
                value={endDate === "" ? "" : endDate.substring(0, 10)}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </HStack>
          )}

          <Button colorScheme="teal" onClick={applyFilters}>
            Apply
          </Button>
        </HStack>

        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a mail or a title"
          w = "95%"
          size="md"
          color="black"
          borderRadius="10px"
          marginLeft="35%"
          marginRight="35%"
        />



        <AlertCustom
          status={"error"}
          message={alertMessage}
          timer={true}
          trigger={showAlertTrigger}
          style={{ width: "90%" }}
        />
        <Accordion w={"100%"} allowMultiple>
          {renderMails()}
        </Accordion>
      </VStack>
    </MainMenu>
  );
};

export default History;
