import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";

const WEEKDAYS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const;

export type MonthDay = {
  date: string;        // YYYY-MM-DD
  dayLabel: string;    // "01"
  weekdayLabel: string;// "Пн"
};

export function getMonthDays(year: number, month1to12: number): MonthDay[] {
  const monthIndex = month1to12 - 1;
  const start = startOfMonth(new Date(year, monthIndex, 1));
  const end = endOfMonth(start);

  return eachDayOfInterval({ start, end }).map((d) => ({
    date: format(d, "yyyy-MM-dd"),
    dayLabel: format(d, "dd"),
    weekdayLabel: WEEKDAYS_RU[d.getDay()],
  }));
}
