import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const processDate = (date: Date) => {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) return "Invalid date";

  const formattedTime = parsedDate.format("h:ma");
  if (parsedDate.isToday()) {
    return `Today at ${formattedTime}`;
  }

  if (parsedDate.isYesterday()) {
    return `Yesterday at ${formattedTime}`;
  }

  if (parsedDate.year() === dayjs().year()) {
    return parsedDate.format(`MMM D at ${formattedTime}`);
  }

  return parsedDate.format(`MMM D YYYY, ${formattedTime}`);
};

export default dayjs;
