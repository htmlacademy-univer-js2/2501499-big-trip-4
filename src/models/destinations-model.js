import { getRandomValue } from '../utils';

export default class DestinationsModel {
  #service = null;
  #destinations = null;

  constructor(service) {
    this.#service = service;
    this.#destinations = this.#service.destinations;
  }

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getRandomDestination() {
    return getRandomValue(this.#destinations);
  }
}
