/**
*
* @param date date to be formated
* @param hour hour of the date, can be ''
* @returns string date as YYYY-MM-DD hh:mm:ss
if hour is "" then it returns YYYY-MM-DD
*/
export const formatDate = (date: Date | undefined, hour: String) => {
    return (
      date?.getFullYear().toString() +
      "-" +
      (date?.getMonth()! + 1 < 10 ? "0" : "") +
      (date?.getMonth()! + 1).toString() +
      "-" +
      (date?.getDate()! < 10 ? "0" : "") +
      date?.getDate().toString() +
      (hour === "" ? "" : " " + hour)
    );
   };