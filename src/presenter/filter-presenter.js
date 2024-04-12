import { render } from '../framework/render';
import { generateFilters } from '../mock/filter';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filters = [];

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filters = generateFilters(this.#pointsModel.points);
  }

  init() {
    render(new FilterView(this.#filters), this.#container);
  }
}
