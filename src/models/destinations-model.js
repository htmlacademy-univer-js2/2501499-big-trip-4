export default class DestinationsModel {
  #apiService = null;
  #destinations = null;

  constructor(apiService) {
    this.#apiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#apiService.destinations;
    }
    catch (err) {
      throw new Error(err);
    }
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
