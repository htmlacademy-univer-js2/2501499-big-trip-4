export default class OffersModel {
  #apiService = null;
  #offers = null;

  constructor(apiService) {
    this.#apiService = apiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#apiService.offers;
    }
    catch (err) {
      throw new Error(err);
    }
  }

  getByType(type) {
    return this.#offers.find((offer) => offer.type === type);
  }
}
