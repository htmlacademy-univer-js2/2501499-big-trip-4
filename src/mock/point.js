import { OFFER_COUNT, Price, TYPES } from '../const';
import { getDate, getRandomInteger, getRandomValue } from '../utils';
import { generateOffer } from './offer';

function generatePoint(destinations) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: getDate({ next: false }),
    dateTo: getDate({ next: true }),
    destination: getRandomValue(destinations),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: Array.from({ length: OFFER_COUNT }, () => generateOffer()),
    type: getRandomValue(TYPES)
  };
}

export { generatePoint };
