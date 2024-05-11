import { PointMode } from '../const';
import { remove, render, replace } from '../framework/render';
import PointEditView from '../view/point-edit-view';
import PointView from '../view/point-view';

export default class PointPresenter {
  #container = null;

  #offersModel = null;
  #pointsModel = null;
  #destinationsModel = null;

  #onDataChange = null;
  #onModeChange = null;

  #point = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #mode = PointMode.DEFAULT;

  constructor({ container, offersModel, pointsModel, destinationsModel, onDataChange, onModeChange }) {
    this.#container = container;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
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
      destinations: this.#destinationsModel.destinations,
      onRollUpPointClick: this.#formRollUpClickHandler,
      onSubmitForm: this.#formSubmitHandler,
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
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onFormKeyDown);
    this.#onModeChange(this.#point.id, this.#mode);
    this.#mode = PointMode.EDIT;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onFormKeyDown);
    this.#mode = PointMode.DEFAULT;
  };

  #onFormKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #pointEditClickHandler = () => {
    this.#replacePointToForm();
  };

  #formRollUpClickHandler = () => {
    this.#replaceFormToPoint();
  };

  #formSubmitHandler = () => {
    this.#replaceFormToPoint();
  };

  #cancelClickHandler = () => {
    this.#replaceFormToPoint();
    this.#pointEditComponent.reset(this.#point);
  };

  #favoritePointClickHandler = () => {
    this.#onDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };
}
