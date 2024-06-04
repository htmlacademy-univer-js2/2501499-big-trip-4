import { isPointFuture, isPointPast, isPointPresent, sortPointsByDay, sortPointsByEvent, sortPointsByOffers, sortPointsByPrice, sortPointsByTime } from './utils';

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

const OFFER_COUNT = Math.floor(Math.random() * 4 + 1);
const DESTINATION_COUNT = 5;
const POINT_COUNT = 5;

const Duration = {
  HOUR: 5,
  DAY: 5,
  MINUTE: 59
};

const PointEmpty = {
  price: 0,
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

const FilterHasPoints = {
  [FilterTypes.EVERYTHING]: (points) => points.length,
  [FilterTypes.FUTURE]: (points) => points.some((point) => isPointFuture(point)),
  [FilterTypes.PRESENT]: (points) => points.some((point) => isPointPresent(point)),
  [FilterTypes.PAST]: (points) => points.some((point) => isPointPast(point))
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
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
  [FilterTypes.PAST]: 'There are no past events now'
};

const ButtonText = {
  SAVE: 'Save',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  LOAD_SAVE: 'Saving...',
  LOAD_DELETE: 'Deleting...'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export {
  Duration,
  TYPES,
  DEFAULT_TYPE,
  PointEmpty,
  OFFER_COUNT,
  DESTINATION_COUNT,
  POINT_COUNT,
  FilterTypes,
  FilterOptions,
  FilterHasPoints,
  SortTypes,
  SortingOptions,
  ACTIVE_SORT_TYPES,
  PointMode,
  UpdateType,
  UserAction,
  EmptyListText,
  ButtonText,
  TimeLimit
};
