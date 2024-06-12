import { ButtonText, PointEmpty } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import he from 'he';
import { formatStringToDateTime } from '../utils.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createPointCitiesOptionsTemplate(destinations) {
  return ( `${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')} `);
}

function createPointPhotosTemplate(destination) {
  return (
    `${destination.pictures.length ? `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.pictures.map((picture) =>
      `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>` : ''}`
  );
}

function createPointTypesTemplate(pointId, pointOffers, currentType, isActive) {
  return pointOffers.map((offer) =>
    `<div class="event__type-item">
          <input id="event-type-${offer.type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${currentType === offer.type ? 'checked' : ''} ${isActive ? '' : 'disabled'}>
          <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-${pointId}" ${currentType === offer.type ? 'checked' : ''}>${offer.type[0].toUpperCase() + offer.type.slice(1)}</label>
      </div>`).join('');
}

function createPointOffersTemplate(offers, selectedOffers, isActive) {
  const offerItems = offers.offers.map((offer) => {
    const offerName = offer.title.replace(' ', '').toLowerCase();
    return (`<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${offerName}" ${selectedOffers?.includes(offer.id) ? 'checked' : ''} ${isActive ? '' : 'disabled'}>
                <label class="event__offer-label" for="${offer.id}">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                </label>
            </div>`);
  }).join('');

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">${offerItems}</div>
    </section>`;
}

function createDestinationTemplate( destination ) {
  return destination.description.length && destination.pictures.length ? `
  <section class="event__section  event__section--destination" >
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${destination.description.length ? `<p class="event__destination-description">${destination.description}</p>` : 'No pictures destination description'}
    ${destination.pictures.length ? createPointPhotosTemplate(destination) : ''}
  </section>` : '';
}

function createButtonTemplate(isCreating, isActive, isDeleting) {
  let text;
  if (isCreating) {
    text = ButtonText.CANCEL;
  }
  else {
    text = isDeleting ? ButtonText.LOAD_DELETE : ButtonText.DELETE;
  }
  return `<button class="event__reset-btn" type="reset" ${isActive ? '' : 'disabled'}>${text}</button>`;
}

function createPointEditTemplate({ state, destinations, pointOffers, isCreating }) {
  const { point, isActive, isSaving, isDeleting } = state;
  const { id, price, dateFrom, dateTo, offers, type } = point;
  const currentDestination = destinations.find((destination) => destination.id === point.destination);
  const currentOffers = pointOffers.find((offer) => offer.type === type);
  const destinationName = (currentDestination) ? currentDestination.name : '';

  return (`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${createPointTypesTemplate(id, pointOffers, type, isActive)}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type[0].toUpperCase() + type.slice(1)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(destinationName)}" list="destination-list-${id}" ${isActive ? '' : 'disabled'}>
          <datalist id="destination-list-${id}"/>
            ${createPointCitiesOptionsTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" ${point.dateFrom ? formatStringToDateTime(dateFrom) : ''} ${isActive ? '' : 'disabled'}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" ${point.dateTo ? formatStringToDateTime(dateTo) : ''} ${isActive ? '' : 'disabled'}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${he.encode(String(price))}" ${isActive ? '' : 'disabled'}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isActive ? '' : 'disabled'}>${isSaving ? ButtonText.LOAD_SAVE : ButtonText.SAVE}</button>
        ${createButtonTemplate(isCreating, isActive, isDeleting)}
        ${isCreating ? '' : `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>`}
      </header>
      ${currentOffers || (currentDestination && (currentDestination.description.length || currentDestination.pictures.length)) ?
      `<section class="event__details">
        ${currentOffers.offers.length !== 0 ? createPointOffersTemplate(currentOffers, offers, isActive) : ''}

        ${currentDestination ? createDestinationTemplate(currentDestination) : ''}
      </section>` : ''}

    </form>
  </li>`);
}

export default class PointEditView extends AbstractStatefulView {
  #point = null;
  #destinations = null;
  #pointOffers = null;
  #onRollUpPointClick = null;
  #isCreating = null;
  #onSubmitForm = null;
  #onCancelFormClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point = PointEmpty, destinations, pointOffers, isCreating = false, onRollUpPointClick, onSubmitForm, onCancelFormClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#pointOffers = pointOffers;
    this.#isCreating = isCreating;
    this.#onRollUpPointClick = onRollUpPointClick;
    this.#onSubmitForm = onSubmitForm;
    this.#onCancelFormClick = onCancelFormClick;

    this._setState(PointEditView.parsePointToState({point}));
    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      state: this._state,
      destinations: this.#destinations,
      pointOffers: this.#pointOffers,
      isCreating: this.#isCreating,
    });
  }

  #rollUpPointClickHandler = (event) => {
    event.preventDefault();
    this.#onRollUpPointClick();
  };

  #submitFormHandler = (event) => {
    event.preventDefault();
    this.#onSubmitForm(this._state.point);
  };

  #cancelClickHandler = (event) => {
    event.preventDefault();
    this.#onCancelFormClick(PointEditView.parseStateToPoint(this._state.point));
  };

  static parsePointToState(point) {
    return { ...point,
      isActive: true,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isActive;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  reset = (point) => this.updateElement({point});

  _restoreHandlers() {
    this.#setDatepicker();
    if (!this._state.isActive) {
      return;
    }
    if (!this.#isCreating) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpPointClickHandler);
    }
    this.element.querySelector('form').addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#changePriceHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#changeOffersHandler);
  }

  #changeTypeHandler = (event) => {
    event.preventDefault();
    this.updateElement({
      point: {
        ...this._state.point,
        type: event.target.value,
        offers: []
      }
    });
  };

  #changeDestinationHandler = (event) => {
    const currentDestination = this.#destinations.find((destination) => destination.name === event.target.value);
    this.updateElement({
      point: {
        ...this._state.point,
        destination: currentDestination.id
      }
    });
  };

  #changePriceHandler = (event) => {
    this._setState({
      point: {
        ...this._state.point,
        price: event.target.valueAsNumber
      }
    });
  };

  #changeOffersHandler = () => {
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      point: {
        ...this._state.point,
        offers: checkedOffers.map((offer) => offer.id)
      }
    });
  };

  #setDatepicker = () => {
    const [dateFromElement, deteToElement] = this.element.querySelectorAll('.event__input--time');
    const dateConfig = {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      locale: {
        firstDayOfWeek: 1
      },
      'time_24hr': true
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...dateConfig,
        defaultDate: this._state.point.dateFrom,
        maxDate: this._state.point.dateTo,
        onClose: this.#closeDateFromHandler
      }
    );

    this.#datepickerTo = flatpickr(
      deteToElement,
      {
        ...dateConfig,
        defaultDate: this._state.point.dateTo,
        minDate: this._state.point.dateFrom,
        onClose: this.#closeDateToHandler
      }
    );
  };

  #closeDateFromHandler = ([date]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: date
      }
    });
    this.#datepickerTo.set('minDate', this._state.point.dateFrom);
  };

  #closeDateToHandler = ([date]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: date
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.point.dateFrom);
  };

  removeElement = () => {
    super.removeElement();
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };
}
