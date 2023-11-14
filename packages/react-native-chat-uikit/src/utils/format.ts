export function getDateMeta() {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();
  const yesterdayEnd = new Date(year, month, day, 0);
  const yesterMonthEnd = new Date(year, month, 1);
  const yesterYearEnd = new Date(year, 0);
  return {
    now: now,
    yesterday: yesterdayEnd,
    yesterMonth: yesterMonthEnd,
    yesterYear: yesterYearEnd,
  };
}

export function formatTs(date: Date | number): string {
  const align = (c: number) => {
    if (c < 10) {
      return `0${c}`;
    }
    return c.toString();
  };
  let _date: Date;
  if (typeof date === 'number') {
    _date = new Date(date);
  } else {
    _date = date;
  }
  return `${align(_date.getHours())}:${align(_date.getMinutes())}`;
}
