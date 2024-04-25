import { FilterTypes } from '../const';
import { isPointFuture, isPointPast, isPointPresent } from '../utils';

const filter = {
  [FilterTypes.EVERYTHING]: (points) => [...points],
  [FilterTypes.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterTypes.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterTypes.PAST]: (points) => points.filter((point) => isPointPast(point))
};

function generateFilters(points) {
  return Object.entries(filter).map(([filterType, filterPoints]) => ({
    type: filterType,
    hasPoints: filterPoints(points).length > 0,
    defaultFilterType: filterType === FilterTypes.EVERYTHING
  }));
}

export { generateFilters };
