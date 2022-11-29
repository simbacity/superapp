import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatDate = (date: Dayjs | Date | string) => {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) return "Invalid date";

  return dayjs(parsedDate).fromNow();
};

export default dayjs;
