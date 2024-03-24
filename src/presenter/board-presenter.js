import SortView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';
import { render, replace } from '../framework/render';
import { isEscape } from '../utils';


export default class BoardPresenter {
  #sortView = new SortView();

  #container = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #points = [];

  constructor({container, destinationsModel, offersModel, pointsModel}) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
  }

  #eventListView = new EventListView();

  init() {
    this.#points = [...this.#pointsModel.points];

    render(this.#sortView, this.#container);
    render(this.#eventListView, this.#container);

    this.#points.forEach((point) => {
      const offer = this.#offersModel.getByType(point.type);
      this.#renderPoint(point, offer);
    });
  }

  #renderPoint = (point, offer) => {
    const pointComponent = new PointView({
      point,
      offer,
      onROllUpClick: pointRollUpClickHandler
    });


    const pointEditComponent = new PointEditView({
      point: point,
      pointDestination: point.destination,
      pointOffers: offer,
      onRollUpClick: formRollUpClickHandler,
      onSubmitForm: submitFormHandler,
      onDeleteClick: deleteClickHandler
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    function onFormKeyDown(event) {
      if (isEscape(event)) {
        event.preventDefault();
        replaceFormToPoint();
      }
    }

    function pointRollUpClickHandler() {
      replacePointToForm();
      document.addEventListener('keydown', onFormKeyDown);
    }

    function formRollUpClickHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', onFormKeyDown);
    }

    function submitFormHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', onFormKeyDown);
    }

    function deleteClickHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', onFormKeyDown);
    }

    render(pointComponent, this.#eventListView.element)
  };
}
