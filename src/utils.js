import { Duration, SortTypes, SortingOptions } from './const';
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
  return secondPoint.price - firstPoint.price;
}

function sortPointsByEvent(firstPoint, secondPoint) {
  return (firstPoint.type.toLowerCase()).localeCompare(secondPoint.type.toLowerCase());
}

function sortPointsByOffers(firstPoint, secondPoint) {
  return firstPoint.offers.length - secondPoint.offers.length;
}

function isBigDifference(firstPoint, secondPoint) {
  return firstPoint.dateFrom !== secondPoint.dateFrom
    || firstPoint.basePrice !== secondPoint.basePrice
    || sortPointsByTime(firstPoint, secondPoint) !== 0;
}

function adaptToClient(point) {
  const adaptedPoint = {
    ...point,
    price: point['base_price'],
    dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
    dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
    isFavorite: point['is_favorite']
  };

  delete adaptedPoint['base_price'];
  delete adaptedPoint['date_from'];
  delete adaptedPoint['date_to'];
  delete adaptedPoint['is_favorite'];
  return adaptedPoint;
}

function adaptToServer(point) {
  const adaptedPoint = {
    ...point,
    ['base_price']: Number(point.price),
    ['date_from']: point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
    ['date_to']: point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
    ['is_favorite']: point.isFavorite
  };

  delete adaptedPoint.price;
  delete adaptedPoint.dateFrom;
  delete adaptedPoint.dateTo;
  delete adaptedPoint.isFavorite;
  return adaptedPoint;
}

function getTripInfoTitle(points = [], destinations = []) {
  const tripDestinations = SortingOptions[SortTypes.DAY]([...points])
    .map((point) => destinations.find((destination) => destination.id === point.destination).name);
  return tripDestinations.length <= 3 ? tripDestinations.join('&nbsp;&mdash;&nbsp;')
    : `${tripDestinations.at(0)}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${tripDestinations.at(-1)}`;
}

function getTripInfoDuration(points = []) {
  const sortedPoints = SortingOptions[SortTypes.DAY]([...points]);
  return (sortedPoints.length > 0)
    ? `${dayjs(sortedPoints.at(0).dateFrom).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(sortedPoints.at(-1).dateFrom).format('DD MMM')}`
    : '';
}

function getTripOffersCost(offerIds = [], offers = []) {
  return offerIds.reduce((cost, id) => cost + (offers.find((offer) => offer.id === id)?.price ?? 0), 0);
}

function getTripInfoCost(points = [], offers = []) {
  return points.reduce((cost, point) =>
    cost + point.price + getTripOffersCost(point.offers, offers.find((offer) => point.type === offer.type)?.offers), 0);
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
  sortPointsByOffers,
  isBigDifference,
  adaptToClient,
  adaptToServer,
  getTripInfoTitle,
  getTripInfoDuration,
  getTripInfoCost
};
