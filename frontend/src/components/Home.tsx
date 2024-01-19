import { Box, Center, HStack, VStack } from "@chakra-ui/react";
import MainMenu from "./MainMenu";
import { useEffect, useState } from "react";
import {Data} from "./Statistics"
import axios from "axios";
import { formatDate } from "../utils/utils";
import CountUp from "react-countup";
import Wave from "react-wavify";
import Skeleton from "react-loading-skeleton";
import logo from "../assets/SendMail-1.png"
import "react-loading-skeleton/dist/skeleton.css";


const textStyle = {
  fontFamily: "Arial",
  fontSize: "30px",
  color: "black",
};

interface StatisticsData {
  stat: number;
  text: String;
}

const Home = () => {
  const [statisticsData, setStatisticsData] = useState<Array<Data>>();
  const [data, setData] = useState<Array<StatisticsData>>();
  const [loading, setLoading] = useState(true);

  const processStatisticsData = () => {
    let delivered = 0,
      uniqueOpened = 0,
      blocks = 0,
      clicks = 0;
    statisticsData?.forEach((data) => {
      delivered += data.stats[0].metrics.delivered;
      uniqueOpened += data.stats[0].metrics.unique_opens;
      blocks += data.stats[0].metrics.blocks;
      clicks += data.stats[0].metrics.clicks;
    });
    let dataArray: Array<StatisticsData> = [];
    dataArray.push({ stat: clicks, text: "Clicks" });
    dataArray.push({ stat: delivered, text: "Delivers" });
    dataArray.push({ stat: uniqueOpened, text: "Opens" });
    dataArray.push({ stat: blocks, text: "Blocks" });
    setData(dataArray);
  };

  const fetchDataStatistics = () => {
    const today = new Date();
    const past = new Date();
    past.setMonth(new Date().getMonth() - 1);
    const jsonObject = JSON.parse(
      `{"startDate": "${formatDate(past, "")}", "endDate": "${formatDate(
        today,
        ""
      )}"}`
    );
    axios
      .post("http://127.0.0.1:5000/main-menu/statistics", jsonObject)
      .then((response) => {
        const tmpList: Array<Data> = [];
        response.data.map((data: any) => {
          tmpList.push(data);
        });
        setStatisticsData(tmpList);
      });
  };

  useEffect(() => {
    fetchDataStatistics();
  }, []);

  useEffect(() => {
    if (data) setLoading(false);
  }, [data]);

  useEffect(() => {
    if (statisticsData) processStatisticsData();
  }, [statisticsData]);

  const renderData = () => {
    return data?.map((data, index) => (
      <StatisticsDataCard
        key={"@id" + index}
        data={data.stat}
        text={data.text}
      />
    ));
  };
  const renderSkeletons = () => {
    return (
      <div
        style={{
          display: "flex",
        }}
      >
        <div style={{ padding: "5px" }}>
          <Skeleton width={"168px"} height={"168px"} />
        </div>
        <div style={{ padding: "5px" }}>
          <Skeleton width={"168px"} height={"168px"} />
        </div>

        <div style={{ padding: "5px" }}>
          <Skeleton width={"168px"} height={"168px"} />
        </div>
        <div style={{ padding: "5px" }}>
          <Skeleton width={"168px"} height={"168px"} />
        </div>
      </div>
    );
  };

  return (
    <MainMenu>
      <VStack spacing={5} padding={100}>
      <img src={logo} style={{ maxWidth: '30%', maxHeight: '30%' }} />
        <HStack>
          {loading && renderSkeletons()}
          {!loading && renderData()}
        </HStack>
      </VStack>
      {!loading && (
        <Wave
          fill="url(#gradient)"
          options={{ height: 40, speed: 0.1, amplitude: 80, points: 4 }}
          style={{
            width: "100%",
            height: "544px",
          }}
        >
          <defs>
            <linearGradient id="gradient" gradientTransform="rotate(80)">
              <stop offset="30%" stopColor="#d4af37" />
              <stop offset="90%" stopColor="#008080" />
            </linearGradient>
          </defs>
        </Wave>
      )}
    </MainMenu>
  );
};

const StatisticsDataCard = (props: { data: number; text: String }) => {
  return (
    <VStack
      bg={"teal.400"}
      rounded={"md"}
      boxShadow={"2xl"}
      padding={5}
      w={"50%"}
      h={"50%"}
    >
      <CountUp
        end={props.data}
        duration={5}
        style={{ ...textStyle, fontSize: "50px" }}
      />
      <Center style={textStyle}>{props.text}</Center>
    </VStack>
  );
};

export default Home;