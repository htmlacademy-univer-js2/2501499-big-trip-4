import { getRandomValue } from '../utils';

export default class OffersModel {
  #service = null;
  #offers = null;

  constructor(service) {
    this.#service = service;
    this.#offers = this.#service.offers;
  }

  get offers() {
    return this.#offers;
  }

  getByType(type) {
    const offer = this.#offers.find((offer) => offer.type === type);
    console.log(offer);
    return offer;
  }

  getRandomOffer() {
    return getRandomValue(this.#offers);
  }
}
