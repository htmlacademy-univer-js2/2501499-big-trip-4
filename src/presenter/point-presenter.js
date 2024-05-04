import { PointMode } from '../const';
import { remove, render, replace } from '../framework/render';
import PointEditView from '../view/point-edit-view';
import PointView from '../view/point-view';

export default class PointPresenter {
  #container = null;

  #offersModel = null;
  #pointsModel = null;

  #onDataChange = null;
  #onModeChange = null;

  #point = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #mode = PointMode.DEFAULT;

  constructor({ container, offersModel, pointsModel, onDataChange, onModeChange }) {
    this.#container = container;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    const previousPointComponent = this.#pointComponent;
    const previousPointEditComponent = this.#pointEditComponent;
    this.#point = point;
    this.#pointComponent = new PointView({
      point: point,
      onEditPointClick: this.#pointEditClickHandler,
      onFavoritePointClick: this.#favoritePointClickHandler
    });

    this.#pointEditComponent = new PointEditView({
      point: point,
      pointDestination: point.destination,
      onRollUpPointClick: this.#formRollUpClickHandler,
      onFormSubmit: this.#formSubmitHandler,
      onCancelFormClick: this.#cancelClickHandler
    });

    if (previousPointComponent === null || previousPointEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === PointMode.DEFAULT) {
      replace(this.#pointComponent, previousPointComponent);
    }
    if (this.#mode === PointMode.EDIT) {
      replace(this.#pointEditComponent, previousPointEditComponent);
    }

    remove(previousPointComponent);
    remove(previousPointEditComponent);
  }

  reset() {
    if (this.#mode !== PointMode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#onModeChange(this.#point.id, this.#mode);
    this.#mode = PointMode.EDIT;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = PointMode.DEFAULT;
  };

  #onFormKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#replaceFormToPoint();
      document.addEventListener('keydown', this.#onFormKeyDown);
    }
  };

  #pointEditClickHandler = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#onFormKeyDown);
  };

  #formRollUpClickHandler = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#onFormKeyDown);
  };

  #formSubmitHandler = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#onFormKeyDown);
  };

  #cancelClickHandler = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#onFormKeyDown);
  };

  #favoritePointClickHandler = () => {
    this.#onDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };
}
