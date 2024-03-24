import { DESTINATION_COUNT, OFFER_COUNT, POINT_COUNT, TYPES } from '../const';
import { generateDestination } from '../mock/destination';
import { generateOffer } from '../mock/offer';
import { generatePoint } from '../mock/point';
import { getRandomInteger, getRandomValue } from '../utils';

export default class MockService {
  #destinations = [];
  #offers = [];
  #points = [];

  constructor() {
    this.#destinations = this.#generateDestinations();
    this.#offers = this.#generateOffers();
    this.#points = this.#generatePoints();
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get points() {
    return this.#points;
  }

  #generateDestinations() {
    return Array.from(
      {length: DESTINATION_COUNT},
      () => generateDestination()
    );
  }

  #generateOffers() {
    return TYPES.map((type) => ({
      type,
      offers: Array.from({
        length:getRandomInteger(0, OFFER_COUNT)
      }, () => generateOffer(type))
    }));
  }

  #generatePoints() {
    return Array.from({length: POINT_COUNT}, () => {
      const type = getRandomValue(TYPES);
      const destination = getRandomValue(this.#destinations);

      const hasOffers = getRandomInteger(0, 1);
      const offersByType = this.#offers.find((offerByType) => offerByType.type === type);

      const offerIds = (hasOffers)
        ? offersByType.offers
          .slice(0, getRandomInteger(0, OFFER_COUNT))
          .map((offer) => offer.id)
        : [];
      console.log(destination.id);
      return generatePoint();
    });
  }
}
