import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { defineComponents, IgcButtonComponent, IgcCardComponent, IgcIconButtonComponent, IgcIconComponent, IgcRippleComponent } from 'igniteui-webcomponents';
import { Subject, takeUntil } from 'rxjs';
import '@infragistics/igniteui-webcomponents-grids/grids/combined.js';
import { WeatherForecast } from '../models/WeatherAPI/weather-forecast';
import { WeatherSummary } from '../models/WeatherAPI/weather-summary';
import { weatherAPIService } from '../services/WeatherAPI-service';

defineComponents(IgcCardComponent, IgcButtonComponent, IgcRippleComponent, IgcIconButtonComponent, IgcIconComponent);

@customElement('app-master-view')
export default class MasterView extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
    }
    .column-layout {
      display: flex;
      flex-direction: column;
    }
    .group {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 50px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .row-layout {
      display: flex;
    }
    .group_1 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .card {
      width: 320px;
      height: max-content;
      min-width: 320px;
      max-width: 320px;
      flex-shrink: 0;
    }
    .grid {
      min-width: 600px;
      min-height: 300px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .actions-content {
      min-width: 50px;
      min-height: 40px;
    }
    .button {
      height: max-content;
    }
  `;

  constructor() {
    super();
    weatherAPIService.getWeatherForecastList().then(data => this.localVar = data);
    weatherAPIService.getWeatherForecastList().then(data => this.weatherAPIWeatherForecast = data);
    weatherAPIService.getWeatherSummaryList().then(data => this.weatherAPIWeatherSummary = data);
    weatherAPIService.globalVar.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.localVar = [];
    });
  }

  @state()
  private localVar: WeatherForecast[] = [];

  @state()
  private weatherAPIWeatherForecast: WeatherForecast[] = [];

  @state()
  private weatherAPIWeatherSummary: WeatherSummary[] = [];

  @state()
  private destroy$: Subject<void> = new Subject<void>();

  private weatherForecastRowAdded(args: CustomEvent<any>) {
    weatherAPIService.postWeatherForecast(args.detail.data).then( _ =>
      weatherAPIService.getWeatherForecastList().then(data => this.localVar = data)
    );
  }

  private weatherForecastRowEditDone(args: CustomEvent<any>) {
    if (!args.detail.isAddRow) {
      weatherAPIService.putWeatherForecast(args.detail.rowData).then( _ =>
        weatherAPIService.getWeatherForecastList().then(data => this.localVar = data)
      );
    }
  }

  private weatherForecastRowDeleted(args: CustomEvent<any>) {
    weatherAPIService.deleteWeatherForecast(args.detail.primaryKey).then(_ =>
      weatherAPIService.getWeatherForecastList().then(data => this.localVar = data)
    );
  }

  disconnectedCallback() {
    this.destroy$.next();
    this.destroy$.complete();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'>
      <link rel='stylesheet' href='../../ig-theme.css'>
      <link rel='stylesheet' href='node_modules/@infragistics/igniteui-webcomponents-grids/grids/themes/light/material.css'>
      <div class="column-layout group">
        <div class="row-layout group_1">
          <igc-grid .data="${this.weatherAPIWeatherForecast}" primary-key="id" display-density="cosy" ?row-editable="${true}" ?allow-filtering="${true}" filter-mode="excelStyleFilter" @rowAdded="${this.weatherForecastRowAdded}" @rowEditDone="${this.weatherForecastRowEditDone}" @rowDeleted="${this.weatherForecastRowDeleted}" class="ig-typography ig-scrollbar grid">
            <igc-column field="id" data-type="number" header="id" ?sortable="${true}" selectable="false"></igc-column>
            <igc-column field="date" data-type="date" header="date" ?sortable="${true}" selectable="false"></igc-column>
            <igc-column field="temperatureC" data-type="number" header="temperatureC" ?sortable="${true}" selectable="false"></igc-column>
            <igc-column field="rating" data-type="number" header="rating" ?sortable="${true}" selectable="false"></igc-column>
            <igc-column field="image" data-type="string" header="image" ?sortable="${true}" selectable="false"></igc-column>
            <igc-column field="temperatureF" data-type="number" header="temperatureF" ?sortable="${true}" selectable="false"></igc-column>
            <igc-column field="summary" data-type="string" header="summary" ?sortable="${true}" selectable="false"></igc-column>
            <igc-column field="currentAddress.id" data-type="number" header="currentAddress id" ?sortable="${true}" selectable="false"></igc-column>
            <igc-column field="currentAddress.street" data-type="string" header="currentAddress street" ?sortable="${true}" selectable="false"></igc-column>
            <igc-column field="currentAddress.city.id" data-type="number" header="currentAddress city id" ?sortable="${true}" selectable="false"></igc-column>
            <igc-column field="currentAddress.city.city" data-type="string" header="currentAddress city city" ?sortable="${true}" selectable="false"></igc-column>
            <igc-column field="currentAddress.city.region" data-type="string" header="currentAddress city region" ?sortable="${true}" selectable="false"></igc-column>
            <igc-action-strip>
              <igc-grid-pinning-actions></igc-grid-pinning-actions>
              <igc-grid-editing-actions ?add-row="${true}"></igc-grid-editing-actions>
            </igc-action-strip>
          </igc-grid>
        </div>
        <div class="row-layout group_1">
          ${this.weatherAPIWeatherSummary?.map((item) => html`
            <igc-card class="card">
              <igc-card-header>
                <h3 slot="title">
                  ${item.name}
                </h3>
                <h5 slot="subtitle">
                  ${item.id}
                </h5>
              </igc-card-header>
              <igc-card-actions class="actions-content">
                <igc-button variant="flat" slot="start" size="large" class="button">
                  Button
                  <igc-ripple></igc-ripple>
                </igc-button>
                <igc-icon-button slot="end" variant="flat">
                  <span class="material-icons">
                    favorite
                  </span>
                  <igc-ripple></igc-ripple>
                </igc-icon-button>
                <igc-icon-button slot="end" variant="flat">
                  <span class="material-icons">
                    bookmark
                  </span>
                  <igc-ripple></igc-ripple>
                </igc-icon-button>
                <igc-icon-button slot="end" variant="flat">
                  <span class="material-icons">
                    share
                  </span>
                  <igc-ripple></igc-ripple>
                </igc-icon-button>
              </igc-card-actions>
            </igc-card>
          `)}
        </div>
      </div>
    `;
  }
}
