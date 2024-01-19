import { Alert, AlertIcon, AlertStatus } from "@chakra-ui/react";
import { CSSProperties, useState, Fragment, useEffect } from "react";

export interface PropsInterface {
  status: AlertStatus;
  message: String;
  timer: Boolean;
  trigger: Boolean;
  timerDuration?: number;
  style?: CSSProperties;
}

/**
 * trigger - triggers a reset to the timer and display of the alert
 * @param props status - AlertStatus
 * message - String
 * timer - Boolean
 * trigger - Boolean
 * timerDuration? - number
 * style? - CSSProperties
 * @returns an alert when only if the message is set
 */
const AlertCustom = (props: PropsInterface) => {
  const [showAlert, setShowAlert] = useState<Boolean>(false);

  useEffect(() => {
    if (props.message) setShowAlert(true);
    if (props.timer) {
      const identifier = setTimeout(
        () => {
          setShowAlert(false);
        },
        props.timerDuration ? props.timerDuration : 3000
      );
      return () => {
        clearTimeout(identifier);
      };
    }
  }, [props.trigger]);

  return (
    <Fragment>
      {showAlert && (
        <Alert status={props.status} style={props.style}>
          <AlertIcon />
          {props.message}
        </Alert>
      )}
    </Fragment>
  );
};

export default AlertCustom;
