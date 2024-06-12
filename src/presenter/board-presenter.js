import SortView from '../view/sort-view';
import EventListView from '../view/event-list-view';
import { RenderPosition, remove, render } from '../framework/render';
import EmptyListView from '../view/empty-list-view';
import PointPresenter from './point-presenter';
import { ACTIVE_SORT_TYPES, FilterOptions, FilterTypes, SortTypes, SortingOptions, TimeLimit, UpdateType, UserAction } from '../const';
import NewPointPresenter from './new-point-presenter';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import TripInfoPresenter from './trip-info-presenter';


export default class BoardPresenter {
  #container = null;
  #tripInfoContainer = null;
  #offersModel = null;
  #pointsModel = null;
  #destinationsModel = null;
  #filtersModel = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #tripInfoPresenter = null;

  #sortComponent = null;
  #emptyListComponent = null;
  #eventListComponent = new EventListView();
  #newPointButtonComponent = null;

  #currentSortType = SortTypes.DAY;
  #filterType = FilterTypes.EVERYTHING;

  #isLoading = true;
  #isLoadingError = false;
  #isCreating = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({container, tripInfoContainer, offersModel, pointsModel, destinationsModel, filtersModel, newPointButtonComponent}) {
    this.#container = container;
    this.#tripInfoContainer = tripInfoContainer;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#filtersModel = filtersModel;
    this.#newPointButtonComponent = newPointButtonComponent;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#actionViewChangeHandler,
      onDestroy: this.#newPointDestroyHandler
    });

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filtersModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = FilterOptions[this.#filterType](points);

    return SortingOptions[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip() {
    if (this.#isLoading) {
      this.#renderEmptyListView({isLoading: true});
      this.#newPointButtonComponent.element.disabled = true;
      return;
    }

    if (this.#isLoadingError) {
      this.#renderEmptyListView({isLoadingError: true});
      this.#newPointButtonComponent.element.disabled = true;
      return;
    }

    this.#newPointButtonComponent.element.disabled = false;

    if (this.points.length === 0 && !this.#isCreating) {
      this.#renderEmptyListView();
      return;
    }

    if (this.points.length !== 0 && this.#tripInfoPresenter === null) {
      this.#renderTripinfo();
    }
    this.#renderSort();
    render(this.#eventListComponent, this.#container);
    this.#renderPoints();
  }

  #renderTripinfo = () => {
    this.#tripInfoPresenter = new TripInfoPresenter({
      container: this.#tripInfoContainer,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
    const sortedPoints = SortingOptions[SortTypes.DAY](this.points);
    this.#tripInfoPresenter.init(sortedPoints);
  };

  #clearTripInfo = () => {
    if (this.#tripInfoPresenter !== null) {
      this.#tripInfoPresenter.destroy();
    }
  };

  #renderSort = () => {
    const sortTypes = Object.values(SortTypes).map((sortType) => ({
      type: sortType,
      active: ACTIVE_SORT_TYPES.indexOf(sortType)
    }));


    this.#sortComponent = new SortView({
      sortTypes: sortTypes,
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    this.#clearTripInfo();
    this.#renderTripinfo();

    render(this.#sortComponent, this.#container);
  };

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#actionViewChangeHandler,
      onModeChange: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderEmptyListView = ({isLoading = false, isLoadingError = false} = {}) => {
    this.#emptyListComponent = new EmptyListView({
      filterType: this.#filterType,
      isLoading,
      isLoadingError
    });

    render(this.#emptyListComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  createPoint = () => {
    this.#isCreating = true;
    this.#currentSortType = SortTypes.DAY;
    this.#filtersModel.set(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newPointPresenter.init();
    this.#isCreating = false;
  };

  #clearTrip = ({ resetSort = false } = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);

    remove(this.#emptyListComponent);

    if (resetSort) {
      this.#currentSortType = SortTypes.DAY;
    }
  };

  #modeChangeHandler = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #actionViewChangeHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.update(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.remove(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSort: true});
        this.#renderTrip();
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        this.#clearTripInfo();
        this.#renderTripinfo();
        break;
      case UpdateType.INIT:
        this.#isLoadingError = data.isError;
        this.#isLoading = false;
        this.#clearTrip();
        this.#renderTrip();
        break;
    }
  };

  #newPointDestroyHandler = () => {
    this.#isCreating = false;
    if (this.points.length === 0) {
      this.#modelEventHandler(UpdateType.MINOR);
    }

    this.#newPointButtonComponent.element.disabled = false;
  };
}
