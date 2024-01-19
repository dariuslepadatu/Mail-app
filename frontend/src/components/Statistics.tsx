import { Center, VStack, Heading, Box, Flex, Input, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import MainMenu from "./MainMenu";
import React, { useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { ListItem, UnorderedList, } from '@chakra-ui/react';


interface Metrics {
  blocks: number;
  bounce_drops: number;
  bounces: number;
  clicks: number;
  deferred: number;
  delivered: number;
  invalid_emails: number;
  opens: number;
  processed: number;
  requests: number;
  spam_report_drops: number;
  spam_reports: number;
  unique_clicks: number;
  unique_opens: number;
  unsubscribe_drops: number;
  unsubscribes: number;
}

interface Stat {
  metrics: Metrics;
}

export interface Data {
  date: string;
  stats: Stat[];
}


const Statistics = () => {
  let blocks = 0, bounce_drops = 0, bounces = 0, clicks = 0, deferred = 0, delivered = 0;
  let invalid_emails = 0, opens = 0, processed = 0, requests = 0, spam_report_drops = 0;
  let spam_reports = 0, unique_clicks = 0, unique_opens = 0, unsubscribe_drops = 0, unsubscribes = 0;
  const [dataList, setDataList] = useState<Array<Data>>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [selectedChart, setSelectedChart] = useState("");

  const handleStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    const currentDate = new Date();
    const valueDate = new Date(value);

    if (valueDate > currentDate) {
      setStartDate('');
      setErrorMessage("Please insert a valid start date");
    } else {
      setStartDate(value);
      setErrorMessage('');

    }
  };

  const handleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    const currentDate = new Date();
    const valueDate = new Date(value);

    if (valueDate > currentDate) {
      setEndDate('');
      setErrorMessage("Please insert a valid end date");
    } else {
      setEndDate(value);
      setErrorMessage('');
    }

  };

  const handleSubmit = () => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj > endDateObj) {
      setErrorMessage("End date cannot be sooner than start date");
      setStartDate('');
      setEndDate('');
    } else if (startDate === '') {
      setErrorMessage("Date cannot be empty. Please insert a valid date");
      setStartDate('');
      setEndDate('');
    } else {
      const jsonObject = JSON.parse(
        `{"startDate": "${startDate}", "endDate": "${endDate}"}`
      );
      axios.post('http://127.0.0.1:5000/main-menu/statistics', jsonObject).then(async response => {
        const tmpList: Array<Data> = [];
        response.data
          .map((data: any) => {
            tmpList.push(data);
          });
        setDataList(tmpList);
      });
      setShowContent(true);
    }

  };

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

  const errorMessageStyle = {
    fontFamily: 'Arial',
    fontSize: '20px',
    color: 'red',
  };


  const allDataMap: { [key: string]: number } = {};

  const allData = () => {
    dataList?.forEach((data) => {
      blocks += data.stats[0].metrics.blocks;
      bounce_drops += data.stats[0].metrics.bounce_drops;
      bounces += data.stats[0].metrics.bounces;
      clicks += data.stats[0].metrics.clicks;
      deferred += data.stats[0].metrics.deferred;
      delivered += data.stats[0].metrics.delivered;
      invalid_emails += data.stats[0].metrics.invalid_emails;
      opens += data.stats[0].metrics.opens;
      processed += data.stats[0].metrics.processed;
      requests += data.stats[0].metrics.requests;
      spam_report_drops += data.stats[0].metrics.spam_report_drops;
      spam_reports += data.stats[0].metrics.spam_reports;
      unique_clicks += data.stats[0].metrics.unique_clicks;
      unique_opens += data.stats[0].metrics.unique_opens;
      unsubscribe_drops += data.stats[0].metrics.unsubscribe_drops;
      unsubscribes += data.stats[0].metrics.unsubscribes;
    });

    allDataMap['blocks'] = blocks;
    allDataMap['bounce_drops'] = bounce_drops;
    allDataMap['bounces'] = bounces;
    allDataMap['clicks'] = clicks;
    allDataMap['deferred'] = deferred;
    allDataMap['delivered'] = delivered;
    allDataMap['invalid_emails'] = invalid_emails;
    allDataMap['opens'] = opens;
    allDataMap['processed'] = processed;
    allDataMap['requests'] = requests;
    allDataMap['spam_report_drops'] = spam_report_drops;
    allDataMap['spam_reports'] = spam_reports;
    allDataMap['unique_clicks'] = unique_clicks;
    allDataMap['unique_opens'] = unique_opens;
    allDataMap['unsubscribe_drops'] = unsubscribe_drops;
    allDataMap['unsubscribes'] = unsubscribes;
  };

  allData();

  const DataList: React.FC<{ dataMap: { [key: string]: number } }> = ({ dataMap }) => {
    return (
      <UnorderedList>
        {Object.keys(dataMap).map((key) => (
          <ListItem key={key} fontSize="20px">
            {key}: {dataMap[key]}
          </ListItem>
        ))}
      </UnorderedList>
    );
  };


  const renderBarChart = () => {
    const data = Object.entries(allDataMap)
      .filter(([key, value]) => value !== 0)
      .map(([key, value]) => ({
        name: `${key}`,
        value: value,
      }));

    return (
      <BarChart
        width={1100}
        height={600}
        data={data}
        margin={{
          top: 100,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#319795" />
      </BarChart>
    );
  };


  const renderLineChart = () => {

    const transformedData = dataList?.map((data) => ({
      name: data.date,
      opens: data.stats[0].metrics.opens,
      delivered: data.stats[0].metrics.delivered,
      unique_opens: data.stats[0].metrics.unique_opens,
    }));

    return (
      <LineChart
        width={1100}
        height={600}
        data={transformedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="opens" stroke="#0080FF" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="delivered" stroke="#FF0000" />
        <Line type="monotone" dataKey="unique_opens" stroke="#319795" />
      </LineChart>
    );
  }
  const renderSelectedChart = () => {
    if (selectedChart === 'line') {
      return renderLineChart();
    } else if (selectedChart === 'bar') {
      return renderBarChart();
    } else {
      return renderLineChart();
    }
  };


  return (
    <MainMenu >
      <VStack spacing={3} p={50} align="stretch">
        <Center>
        <h1 style={textStyle}>Statistics</h1>
        </Center>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={dateStyle}>Start date</h1>
          <Input
            width={"10%"}
            size="md"
            type="date"
            value={startDate}
            onChange={handleStartDate}
          />

          <h1 style={dateStyle}>End date</h1>
          <Input
            width={"10%"}
            size="md"
            type="date"
            value={endDate}
            onChange={handleEndDate}

          />
          <Button onClick={handleSubmit} colorScheme="teal">Submit</Button>

          {showContent && (
            <Menu>
              <MenuButton as={Button} marginLeft="400" colorScheme="teal">
                View
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setSelectedChart('line')}>Line chart</MenuItem>
                <MenuItem onClick={() => setSelectedChart('bar')}>Bar chart</MenuItem>
              </MenuList>
            </Menu>
          )}

        </div>
        <h1 style={errorMessageStyle}>{errorMessage}</h1>

        {showContent && (
          <Flex justifyContent="space-between" alignItems="flex-start">
            <Box mt={20} >
              <DataList dataMap={allDataMap} />
            </Box>
            {renderSelectedChart()}
          </Flex>
        )}

      </VStack>
    </MainMenu>
  );
};

export default Statistics;