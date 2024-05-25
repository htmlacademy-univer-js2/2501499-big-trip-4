import AbstractView from '../framework/view/abstract-view';
import { getTripInfoCost, getTripInfoDuration, getTripInfoTitle } from '../utils';

function createTripInfoTemplate({isEmpty, title, duration, cost}) {
  return `${isEmpty ? '' : `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>

        <p class="trip-info__dates">${duration}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`}`;
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate({
      isEmpty: this.#points.length === 0,
      title: getTripInfoTitle(this.#points, this.#destinations),
      duration: getTripInfoDuration(this.#points),
      cost: getTripInfoCost(this.#points, this.#offers)
    });
  }
}
