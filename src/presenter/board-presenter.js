import SortView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';

import { render } from '../render';

export default class BoardPresenter {
  sortView = new SortView();
  eventListView = new EventListView();

  constructor({container}) {
    this.container = container;
  }

  init() {
    render(this.sortView, this.container);
    render(this.eventListView, this.container);

    render(new PointEditView(), this.eventListView.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.eventListView.getElement());
    }
  }
}
