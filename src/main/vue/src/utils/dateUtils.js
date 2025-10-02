import moment from 'moment';

/**
 * 날짜와 시간을 배열로 반환하는 함수
 */
export function getDateAndTimeArray(dateInput = moment()) {
  const date = moment(dateInput);

  if (!date.isValid()) {
    throw new Error('Invalid date format');
  }

  return [
    date.format('YYYY-MM-DD'), // 날짜
    date.format('HH:mm:ss'), // 시간
  ];
}

export function getDateAndTimeArray1(dateInput = moment()) {
  const date = moment(dateInput);

  if (!date.isValid()) {
    throw new Error('Invalid date format');
  }

  return [
    date.format('YYYYMMDD'), // 날짜
    date.format('HHmmss'), // 시간
  ];
}

export function getTodayDate(separator = '-') {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}${separator}${month}${separator}${day}`;
}

export function getTodayDateTime(separator = '-') {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');
  const seconds = String(today.getSeconds()).padStart(2, '0');

  return `${year}${separator}${month}${separator}${day} ${hours}:${minutes}:${seconds}`;
}

export function rgDisplayDate(grid, index, dateStr) {
  if (_.isEmpty(dateStr)) {
    return '';
  }
  const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  return formattedDate;
}

export function rgDisplayTime(grid, index, timeStr) {
  if (_.isEmpty(timeStr)) {
    return '';
  }
  // const formattedTime = `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:${timeStr.slice(4, 6)}`;
  const formattedTime = `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
  return formattedTime;
}

export function rgDisplayTime2(grid, index, timeStr) {
  if (_.isEmpty(timeStr) || timeStr.length !== 6) {
    return timeStr;
  }
  const hours = timeStr.slice(0, 2);
  const minutes = timeStr.slice(2, 4);
  return `${hours}:${minutes}`;
}

export function rgDisplayTime3(grid, index, timeStr) {
  if (_.isEmpty(timeStr)  || timeStr.length !== 6) {
    return '';
  }
  const formattedTime = `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:${timeStr.slice(4, 6)}`;
  return formattedTime;
}


export function getNumberOfDays(yyyymmdd) {
  if (_.isEmpty(yyyymmdd) || yyyymmdd.length < 8) {
    return '';
  }

  const fmDt = yyyymmdd.substring(0, 4) + '-' + yyyymmdd.substring(4, 6) + '-' + yyyymmdd.substring(6, 8);
  const startDate = new Date(fmDt);
  // 현재 날짜
  const currentDate = new Date(getTodayDate('-'));
  // 두 날짜의 차이를 밀리초 단위로 계산
  const timeDifference = currentDate - startDate;

  return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
}

export function getWorkDate(separator = '') {
    const now = new Date();
    const currentHour = now.getHours();

    // 기준 시간: 00:00 ~ 08:00 → 전날로 조정
    if (currentHour < 8) {
      now.setDate(now.getDate() - 1);
    }

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}${separator}${month}${separator}${day}`;
}

export function getSomedayDate(days = 0, separator = '-') {
  const tmpDay = new Date();
  tmpDay.setDate(tmpDay.getDate() + days);
  const year = tmpDay.getFullYear();
  const month = String(tmpDay.getMonth() + 1).padStart(2, '0');
  const day = String(tmpDay.getDate()).padStart(2, '0');

  return `${year}${separator}${month}${separator}${day}`;
}

export function getSomeMonthDate(months = 0, separator = '-') {
  const curDate = new Date();
  curDate.setMonth(curDate.getMonth() + months);
  const year = curDate.getFullYear();
  const month = String(curDate.getMonth() + 1).padStart(2, '0');
  const day = String(curDate.getDate()).padStart(2, '0');

  return `${year}${separator}${month}${separator}${day}`;
}

export function rgDisplayDateTime(grid, index, dateStr) {
  if (_.isEmpty(dateStr)) {
    return '';
  }
  const formattedDate = `${dateStr.slice(2, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)} ${dateStr.slice(9, 11)}:${dateStr.slice(11, 13)}:${dateStr.slice(13, 15)}`;
  return formattedDate;
}

export function rgDisplayDateTime1(grid, index, dateStr) {
  if (_.isEmpty(dateStr)) {
    return '';
  }
  const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)} ${dateStr.slice(9, 11)}:${dateStr.slice(11, 13)}:${dateStr.slice(13, 15)}`;
  return formattedDate;
}

export function rgDisplayDateTime2(grid, index, dateStr) {
  if (_.isEmpty(dateStr)) {
    return '';
  }
  const formattedDate = `${dateStr.slice(9, 11)}:${dateStr.slice(11, 13)}:${dateStr.slice(13, 15)}`;
  return formattedDate;
}

export function rgDisplayDateTime3(grid, index, dateStr) {
  if (_.isEmpty(dateStr)) {
    return '';
  }
  const formattedDate = `${dateStr.slice(2, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)} ${dateStr.slice(9, 11)}:${dateStr.slice(11, 13)}`;
  return formattedDate;
}

export function getDatesInMonth(yearMonth) {
  const year = parseInt(yearMonth.slice(0, 4), 10);
  const month = parseInt(yearMonth.slice(4), 10);

  // 해당 월의 첫날과 마지막 날 계산
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  let currentDay = new Date(firstDay);
  let dates = [];

  while (currentDay <= lastDay) {
    const year = currentDay.getFullYear();
    const month = String(currentDay.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
    const day = String(currentDay.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;
    dates.push({ day: formattedDate });

    currentDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() + 1);
  }
  return dates;
}

export function rgDisplayTimeFromSecondNum(grid, index, secondNum) {
  if (_.isEmpty(secondNum)) {
    return '';
  }

  const hours = String(Math.floor(secondNum / 60 / 60)).padStart(2, '0');
  const minutes = String(Math.floor(secondNum / 60)).padStart(2, '0');
  const second = String(Math.floor(secondNum)).padStart(2, '0');
  return `${hours}:${minutes}:${second}`;
}

export function getTimeDifference(date1, time1, date2, time2) {
  // Date 객체 생성
  if (!date1 || !time1 || !date2 || !time2) {
    return null;
  }
  let d1 = new Date(`${date1.substring(0, 4)}-${date1.substring(4, 6)}-${date1.substring(6, 8)}T${time1.substring(0, 2)}:${time1.substring(2, 4)}:${time1.substring(4, 6)}`);
  let d2 = new Date(`${date2.substring(0, 4)}-${date2.substring(4, 6)}-${date2.substring(6, 8)}T${time2.substring(0, 2)}:${time2.substring(2, 4)}:${time2.substring(4, 6)}`);

  // 시간 차이 계산 (밀리초 → 분 변환)
  let diffMin = Math.floor((d2 - d1) / 60000);
  let hours = Math.floor(diffMin / 60);
  let minutes = diffMin % 60;

  return `${hours}시${minutes}분`;
}

//당월 시작 연월일
export function getCurMonthStartDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줍니다.

  return `${year}-${month}-01`;
}

//당월 종료 연월일
export function getCurMonthEndDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더해줍니다.
  const lastDate = new Date(year, today.getMonth()+1, 0);
  console.log(lastDate);
  const lasyDay = lastDate.getDate();

  return `${year}-${month}-${lasyDay}`;
}

export function formatDate(yyyymmdd, seperator) {

  const formattedDate = `${yyyymmdd.slice(0, 4)}${seperator}${yyyymmdd.slice(4, 6)}${seperator}${yyyymmdd.slice(6, 8)}`;
  return formattedDate;
}

export function getShiftCode() {
    const now = new Date();
    const hour = now.getHours();

    let shiftCode = "";

    if (hour >= 8 && hour < 20) {
        shiftCode = 'D';
    } else {
       shiftCode = 'N';
    }  
    
    return shiftCode;
}

export function getNowFormatYYYYMMDDHHMM() {

      const now = new Date();
      const yyyy = now.getFullYear();
      const MM = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const HH = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');

      return `${yyyy}-${MM}-${dd} ${HH}:${mm}`;
}

export function getFormatYYYYMMDDHHMM(str) {
  
    if (!str || str.length !== 12) return str;

    const year = str.substring(0, 4);
    const month = str.substring(4, 6);
    const day = str.substring(6, 8);
    const hour = str.substring(8, 10);
    const minute = str.substring(10, 12);

    return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function getNextDay(yyyymmdd, seperator="-") {

  let year, month, day;


  if ( seperator === "" ) {
     year = parseInt(yyyymmdd.substring(0, 4), 10);
     month = parseInt(yyyymmdd.substring(4, 6), 10) - 1; 
     day = parseInt(yyyymmdd.substring(6, 8), 10);
  }
  else {
    year = parseInt(yyyymmdd.substring(0, 4), 10);
    month = parseInt(yyyymmdd.substring(5, 7), 10) - 1; 
    day = parseInt(yyyymmdd.substring(8, 10), 10);    
  }

  const date = new Date(year, month, day);
  date.setDate(date.getDate() + 1); // 다음날로 이동

  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  const nextDate = String(date.getDate()).padStart(2, '0');

  return `${nextYear}${seperator}${nextMonth}${seperator}${nextDate}`;
}

export function getDateRange(fromDateStr, toDateStr, seperator="-") {
    const dates = [];
    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);

    // 날짜 유효성 검사
    if (isNaN(fromDate) || isNaN(toDate) || fromDate > toDate) {
      return dates; // 잘못된 입력일 경우 빈 배열 반환
    }

    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}${seperator}${mm}${seperator}${dd}`;
    };

    let currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      dates.push({ day: formatDate(currentDate), column:formatDate(currentDate).replace(/-/g, "")});
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}
