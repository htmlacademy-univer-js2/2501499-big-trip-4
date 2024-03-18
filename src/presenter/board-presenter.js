import SortView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';

import { render } from '../render';

export default class BoardPresenter {
  sortView = new SortView();

  constructor({container, destinationsModel, offersModel, pointsModel}) {
    this.container = container;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.pointsModel = pointsModel;
    this.eventListView = new EventListView();
    this.points = [...pointsModel.get()];
  }

  init() {
    render(this.sortView, this.container);
    render(this.eventListView, this.container);

    render(
      new PointEditView({
        point: this.points[0],
        pointDestination: this.destinationsModel.getRandomDestination(),
        pointOffers: this.offersModel.getRandomOffer(),
      }),
      this.eventListView.getElement()
    );

    this.points.forEach((point) => {
      render(
        new PointView({
          point,
          pointDestination: this.destinationsModel.getById(point.destinationId),
          pointOffers: this.offersModel.getByType(point.offerType)
        }),
        this.eventListView.getElement()
      );
    });
  }
}
