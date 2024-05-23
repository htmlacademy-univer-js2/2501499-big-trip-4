import { isPointFuture, isPointPast, isPointPresent, sortPointsByDay, sortPointsByEvent, sortPointsByOffers, sortPointsByPrice, sortPointsByTime } from './utils';

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

const FilterOptions = {
  [FilterTypes.EVERYTHING]: (points) => [...points],
  [FilterTypes.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterTypes.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterTypes.PAST]: (points) => points.filter((point) => isPointPast(point))
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

const UpdateType = {
  PATCH: 'patch',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const UserAction = {
  UPDATE_POINT: 'update-point',
  ADD_POINT: 'add-point',
  DELETE_POINT: 'delete-point'
};

const EmptyListText = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events',
  [FilterTypes.PRESENT]: 'There are no present events',
  [FilterTypes.PAST]: 'There are no past events'
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
  FilterOptions,
  SortTypes,
  SortingOptions,
  ACTIVE_SORT_TYPES,
  PointMode,
  UpdateType,
  UserAction,
  EmptyListText
};
