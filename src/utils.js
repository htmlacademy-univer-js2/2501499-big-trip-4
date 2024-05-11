import { Duration } from './const';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

function getRandomInteger(a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomValue(items) {
  return items[getRandomInteger(0, items.length - 1)];
}

function formatStringToDateTime(date) {
  return dayjs(date).format('YY/MM/DD HH:mm');
}

function formatStringToShortDate(date) {
  return dayjs(date).format('MMM DD');
}

function formatStringToTime(date) {
  return dayjs(date).format('HH:mm');
}

function getPointDuration(point) {
  const timeDiff = dayjs(point.dateTo).diff(dayjs(point.dateFrom));

  let pointDuration = 0;

  switch (true) {
    case (timeDiff >= MSEC_IN_DAY):
      pointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
      break;
    case (timeDiff >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }

  return pointDuration;
}

function getDate({ next }) {
  const minsGap = getRandomInteger(0, Duration.MINUTE);
  const hoursGap = getRandomInteger(1, Duration.HOUR);
  const daysGap = getRandomInteger(0, Duration.DAY);
  let dateToGet = dayjs().subtract(getRandomInteger(0, Duration.DAY), 'day').toDate();

  if (next) {
    dateToGet = dayjs(dateToGet)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }

  return dateToGet;
}

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo);
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}

function updatePoint(points, update) {
  return points.map((point) => point.id === update.id ? update : point);
}

function sortPointsByDay(firstPoint, secondPoint) {
  return new Date(firstPoint.dateFrom) - new Date(secondPoint.dateFrom);
}

function sortPointsByTime(firstPoint, secondPoint) {
  return dayjs(secondPoint.dateTo).diff(dayjs(secondPoint.dateFrom)) - dayjs(firstPoint.dateTo).diff(dayjs(firstPoint.dateFrom));
}

function sortPointsByPrice(firstPoint, secondPoint) {
  return firstPoint.basePrice - secondPoint.basePrice;
}

function sortPointsByEvent(firstPoint, secondPoint) {
  return (firstPoint.type.toLowerCase()).localeCompare(secondPoint.type.toLowerCase());
}

function sortPointsByOffers(firstPoint, secondPoint) {
  return firstPoint.offers.length - secondPoint.offers.length;
}

export {
  getRandomInteger,
  getRandomValue,
  formatStringToDateTime,
  formatStringToShortDate,
  formatStringToTime,
  getPointDuration,
  getDate,
  isPointFuture,
  isPointPresent,
  isPointPast,
  updatePoint,
  sortPointsByDay,
  sortPointsByTime,
  sortPointsByPrice,
  sortPointsByEvent,
  sortPointsByOffers
};
