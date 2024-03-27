import { OFFER_COUNT, PRICE, TYPES } from '../const';
import { getDate, getRandomInteger, getRandomValue } from '../utils';
import { generateDestination } from './destination';
import { generateOffer } from './offer';

function generatePoint() {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(PRICE.MIN, PRICE.MAX),
    dateFrom: getDate({ next: false }),
    dateTo: getDate({ next: true }),
    destination: generateDestination(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: Array.from({ length: OFFER_COUNT }, () => generateOffer()),
    type: getRandomValue(TYPES)
  };
}

export { generatePoint };
