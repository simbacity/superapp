import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(weekOfYear);

export default dayjs;
