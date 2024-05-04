import { CITIES, PointEmpty, TYPES } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { formatStringToDateTime } from '../utils.js';

function createPointCitiesOptionsTemplate() {
  return (
    `<datalist id="destination-list-1">
          ${CITIES.map((city) => `<option value="${city}"></option>`).join('')}
      </div>`
  );
}

function createPointPhotosTemplate(pointDestination) {
  return (
    `<div class="event__photos-tape">
          ${pointDestination?.pictures.map((picture) =>
      `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>`
  );
}

function createPointTypesTemplate(currentType) {
  return TYPES.map((type) =>
    `<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" ${currentType === type ? 'checked' : ''}>${type[0].toUpperCase() + type.slice(1)}</label>
      </div>`).join('');
}

function createPointOffersTemplate (offers) {
  const offerItems = offers.map((offer) => {
    const offerName = offer.title.replace(' ', '').toLowerCase();

    return (`<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerName}-1" type="checkbox" name="event-offer-${offerName}" checked>
                <label class="event__offer-label" for="event-offer-${offerName}-1">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                </label>
            </div>`);
  }).join('');

  return `<div class="event__available-offers">${offerItems}</div>`;
}

function createPointEditTemplate({point, pointDestination }) {
  const { basePrice, dateFrom, dateTo, offers, type } = point;

  return (`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${createPointTypesTemplate(type)}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type[0].toUpperCase() + type.slice(1)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-1">
          ${createPointCitiesOptionsTemplate()}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatStringToDateTime(dateFrom)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatStringToDateTime(dateTo)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          ${createPointOffersTemplate(offers)}
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestination.description}</p>

          <div class="event__photos-container">
            ${createPointPhotosTemplate(pointDestination)}
          </div>
        </section>
      </section>
    </form>
  </li>`);
}

export default class PointEditView extends AbstractView {
  #point = null;
  #pointDestination = null;
  #onRollUpPointClick = null;
  #onSubmitForm = null;
  #onCancelFormClick = null;

  constructor({point = PointEmpty, pointDestination, onRollUpPointClick, onSubmitForm, onCancelFormClick}) {
    super();
    this.#point = point;
    this.#pointDestination = pointDestination;
    this.#onRollUpPointClick = onRollUpPointClick;
    this.#onSubmitForm = onSubmitForm;
    this.#onCancelFormClick = onCancelFormClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpPointClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);
  }

  get template() {
    return createPointEditTemplate({
      point: this.#point,
      pointDestination: this.#pointDestination,
    });
  }

  #rollUpPointClickHandler = (event) => {
    event.preventDefault();
    this.#onRollUpPointClick();
  };

  #submitFormHandler = (event) => {
    event.preventDefault();
    this.#onSubmitForm();
  };

  #cancelClickHandler = (event) => {
    event.preventDefault();
    this.#onCancelFormClick();
  };
}
