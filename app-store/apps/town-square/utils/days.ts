import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const formatDate = (date: Date | string) => {
  const parsedDate = dayjs(date);

  if (!parsedDate.isValid()) return "Invalid date";

  const hourAndMinute = parsedDate.format("h:ma");

  if (parsedDate.isToday()) {
    return `Today at ${hourAndMinute}`;
  }

  if (parsedDate.isYesterday()) {
    return `Yesterday at ${hourAndMinute}`;
  }

  if (parsedDate.year() === dayjs().year()) {
    return parsedDate.format(`MMM D`) + ` at ${hourAndMinute}`;
  }

  return parsedDate.format("MMM D YYYY") + `, ${hourAndMinute}`;
};

export default dayjs;
