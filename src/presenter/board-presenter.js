import SortView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import { remove, render, replace } from '../framework/render';
import EmptyListView from '../view/empty-list-view';
import PointPresenter from './point-presenter';
import { updatePoint } from '../utils';
import { ACTIVE_SORT_TYPES, SortTypes, SortingOptions } from '../const';


export default class BoardPresenter {
  #container = null;
  #offersModel = null;
  #pointsModel = null;
  #destinationsModel = null;
  #points = [];

  #pointPresenters = new Map();

  #sortComponent = null;
  #currentSortType = SortTypes.DAY;

  constructor({container, offersModel, pointsModel, destinationsModel}) {
    this.#container = container;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
  }

  #eventListView = new EventListView();

  init() {
    this.#points = SortingOptions[this.#currentSortType]([...this.#pointsModel.points]);

    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#container);
      return;
    }

    this.#renderSort();
    render(this.#eventListView, this.#container);

    this.#renderPoints();
  }

  #renderSort = () => {
    const previousSortView = this.#sortComponent;

    const sortTypes = Object.values(SortTypes).map((sortType) => ({
      type: sortType,
      active: ACTIVE_SORT_TYPES.indexOf(sortType)
    }));

    this.#sortComponent = new SortView({
      sortTypes: sortTypes,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    if (previousSortView) {
      replace(this.#sortComponent, previousSortView);
      remove(previousSortView);
    }
    else {
      render(this.#sortComponent, this.#container);
    }
  };

  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = SortingOptions[this.#currentSortType](this.#points);
  };

  #renderPoints = () => {
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#eventListView.element,
      offersModel: this.#offersModel,
      pointsModel: this.#pointsModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#pointDataChangeHandler,
      onModeChange: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #clearPointsList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #pointDataChangeHandler = (updatedPoint) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderSort();
    this.#points.forEach((point) => this.#renderPoint(point));
  };
}
