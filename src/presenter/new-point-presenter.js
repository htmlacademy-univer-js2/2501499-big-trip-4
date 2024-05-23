import { UpdateType, UserAction } from '../const';
import { RenderPosition, remove, render } from '../framework/render';
import PointEditView from '../view/point-edit-view';

export default class NewPointPresenter {
  #container = null;

  #destinationsModel = null;
  #offersModel = null;

  #pointEditComponent = null;

  #onDataChange = null;
  #onDestroy = null;

  constructor({ container, destinationsModel, offersModel, onDataChange, onDestroy }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#pointEditComponent = new PointEditView({
      destinations: this.#destinationsModel.destinations,
      pointOffers: this.#offersModel.offers,
      isCreating: true,
      onRollUpPointClick: this.#cancelClickHandler,
      onSubmitForm: this.#formSubmitHandler,
    });
    render(this.#pointEditComponent, this.#container.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#onDestroy();
  }

  #formSubmitHandler = (point) => {
    this.#onDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: crypto.randomUUID(), ...point}
    );
    this.destroy();
  };

  #cancelClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.destroy();
    }
  };
}
