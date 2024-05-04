import { sortPointsByDay, sortPointsByEvent, sortPointsByOffers, sortPointsByPrice, sortPointsByTime } from './utils';

const CITIES = [
  'Chamonix',
  'Geneva',
  'Amsterdam',
  'Helsinki',
  'Oslo',
  'Kopenhagen',
  'Den Haag',
  'Rotterdam',
  'Saint Petersburg',
  'Moscow',
  'Sochi',
  'Tokio',
];

const OFFERS = [
  'Order Uber',
  'Add luggage',
  'Switch to comfort',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city',
  'Upgrade to a business class'
];

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const DEFAULT_TYPE = 'flight';

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.';

const OFFER_COUNT = Math.floor(Math.random() * 4 + 1);
const DESTINATION_COUNT = 5;
const POINT_COUNT = 5;

const Price = {
  MIN: 1,
  MAX: 1000
};

const Duration = {
  HOUR: 5,
  DAY: 5,
  MINUTE: 59
};

const PointEmpty = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const SortingOptions = {
  [SortTypes.DAY]: (points) => [...points].sort(sortPointsByDay),
  [SortTypes.EVENT]: (points) => [...points].sort(sortPointsByEvent),
  [SortTypes.TIME]: (points) => [...points].sort(sortPointsByTime),
  [SortTypes.PRICE]: (points) => [...points].sort(sortPointsByPrice),
  [SortTypes.OFFERS]: (points) => [...points].sort(sortPointsByOffers)
};

const ACTIVE_SORT_TYPES = [
  SortTypes.DAY,
  SortTypes.TIME,
  SortTypes.PRICE
];

const PointMode = {
  DEFAULT: 'default',
  EDIT: 'edit'
};

export {
  Duration,
  CITIES,
  OFFERS,
  DESCRIPTION,
  Price,
  TYPES,
  DEFAULT_TYPE,
  PointEmpty,
  OFFER_COUNT,
  DESTINATION_COUNT,
  POINT_COUNT,
  FilterTypes,
  SortTypes,
  SortingOptions,
  ACTIVE_SORT_TYPES,
  PointMode
};
