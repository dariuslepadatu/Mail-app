import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Center,
  HStack,
} from "@chakra-ui/react";

interface MailProps {
  title: String;
  message: String;
  date: String;
}
const textStyle = {
  fontFamily: "Arial",
  fontWeight: "bold",
  color: "black",
};

/**
 *
 * @param string string that want to display a preview of
 * @param maxLength number of characters that want to be previewed
 * @returns a modified string that matches the character limit impose
 */
const showRestrictedString = (string: String, maxLength: number) => {
  return string.length > maxLength
    ? string.slice(0, maxLength) + "..."
    : string;
};

const Mail = (props: MailProps) => {
  // limits for preview
  const maxLengthTitle = 15;
  const maxLengthMessage = 70;

  return (
    <AccordionItem rounded="md" width="100%">
      <AccordionButton>
        <HStack w={"100%"}>
          <Center bg={"white"} rounded="md" w="20%" h="30px" fontSize={"xl"}>
            {" "}
            {showRestrictedString(props.title, maxLengthTitle)}
          </Center>
          <Center bg={"white"} rounded="md" w={"70%"} h="30px">
            {showRestrictedString(
              props.message.replace(/<[^>]+>/g, ""),
              maxLengthMessage
            )}
          </Center>
          <Center bg={"white"} rounded="md" w="20%" h="30px">
            {props.date}
          </Center>
        </HStack>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel bg="white" w={"100%"} rounded={"md"} pb={4}>
        <h1 style={textStyle}>{"Title: " + props.title}</h1>
        <h1>{"Message: " + props.message.replace(/<[^>]+>/g, "")}</h1>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default Mail;