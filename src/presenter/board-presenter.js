import SortView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import { render } from '../framework/render';
import EmptyListView from '../view/empty-list-view';
import PointPresenter from './point-presenter';
import { updatePoint } from '../utils';


export default class BoardPresenter {
  #sortView = new SortView();

  #container = null;
  #offersModel = null;
  #pointsModel = null;
  #points = [];

  #pointPresenters = new Map();

  constructor({container, offersModel, pointsModel}) {
    this.#container = container;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
  }

  #eventListView = new EventListView();

  init() {
    this.#points = [...this.#pointsModel.points];

    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#container);
      return;
    }

    render(this.#sortView, this.#container);
    render(this.#eventListView, this.#container);

    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#eventListView.element,
      offersModel: this.#offersModel,
      pointsModel: this.#pointsModel,
      onDataChange: this.#onPointDataChange,
      onModeChange: this.#onModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #onPointDataChange = (updatedPoint, offer) => {
    this.#points = updatePoint(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, offer);
  };

  #onModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };
}
