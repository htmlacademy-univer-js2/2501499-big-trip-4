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
    console.log(id);
    const destination = this.#destinations.find((destination) => destination.id === id);
    console.log(this.#destinations.find((destination) => destination.id === id));
    return destination;
  }

  getRandomDestination() {
    return getRandomValue(this.#destinations);
  }
}
