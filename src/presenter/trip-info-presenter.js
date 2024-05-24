import { RenderPosition, remove, render } from '../framework/render';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  #container = null;

  #points = null;
  #destinations = null;
  #offers = null;

  #destinationsModel = null;
  #offersModel = null;

  #tripInfoComponent = null;

  constructor({ container, destinationsModel, offersModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init(points) {
    this.#points = points;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#tripInfoComponent = new TripInfoView({
      destinations: this.#destinations,
      offers: this.#offers,
      points: this.#points
    });

    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    remove(this.#tripInfoComponent);
  }
}
