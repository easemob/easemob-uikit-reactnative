import format from 'date-fns/format';

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

export function formatTs2(
  date: Date | number,
  anchor?: Date | number,
  locale?: Locale
): string {
  let d: number = typeof date === 'number' ? date : date.getTime();
  const n =
    anchor === undefined
      ? new Date().getTime()
      : typeof anchor === 'number'
      ? anchor
      : anchor.getTime();
  const oneDayBefore = n - 24 * 60 * 60 * 1000;
  const todayYear = new Date(n).getFullYear();
  const oneYearBefore = new Date(todayYear, 0).getTime();
  if (d < oneYearBefore) {
    return format(date, 'yyyy/MM/dd', { locale });
  } else if (oneYearBefore <= d && d < oneDayBefore) {
    return format(date, 'MM/dd', { locale });
  } else {
    return format(date, 'HH:mm', { locale });
  }
}

export function formatTsForConvList(
  date: Date | number,
  anchor?: Date | number,
  locale?: Locale
): string {
  let d: number = typeof date === 'number' ? date : date.getTime();
  const n =
    anchor === undefined
      ? new Date().getTime()
      : typeof anchor === 'number'
      ? anchor
      : anchor.getTime();
  const oneDayBefore = n - 24 * 60 * 60 * 1000;
  if (d < oneDayBefore) {
    return format(date, 'MMM dd', { locale });
  } else {
    return format(date, 'HH:mm', { locale });
  }
}
export function formatTsForConvDetail(
  date: Date | number,
  anchor?: Date | number,
  locale?: Locale
): string {
  let d: number = typeof date === 'number' ? date : date.getTime();
  const n =
    anchor === undefined
      ? new Date().getTime()
      : typeof anchor === 'number'
      ? anchor
      : anchor.getTime();
  const oneDayBefore = n - 24 * 60 * 60 * 1000;
  if (d < oneDayBefore) {
    return format(date, 'MMM dd HH:mm', { locale });
  } else {
    return format(date, 'HH:mm', { locale });
  }
}
