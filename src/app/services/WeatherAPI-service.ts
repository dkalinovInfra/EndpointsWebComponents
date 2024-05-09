import { stateService } from './State-service';
import { WeatherForecast } from '../models/WeatherAPI/weather-forecast';
import { WeatherSummary } from '../models/WeatherAPI/weather-summary';
import { BehaviorSubject, concatMap } from 'rxjs';

const API_ENDPOINT = 'https://fee8-92-247-13-237.ngrok-free.app';

class WeatherAPIService {
	private _globalVar$!: BehaviorSubject<WeatherForecast | undefined>;

	public get globalVar(): BehaviorSubject<WeatherForecast | undefined> {
		if (!this._globalVar$) {
			this._globalVar$ = new BehaviorSubject<WeatherForecast | undefined>(undefined);
			stateService.id.pipe(
				concatMap(() => this.getWeatherForecast(stateService.id.value as any))
			).subscribe(v => this._globalVar$.next(v));
		}
		return this._globalVar$;
	}

	private _masterVar$!: BehaviorSubject<WeatherForecast | undefined>;

	public get masterVar(): BehaviorSubject<WeatherForecast | undefined> {
		if (!this._masterVar$) {
			this._masterVar$ = new BehaviorSubject<WeatherForecast | undefined>(undefined);
			this._masterVar$.subscribe(() => this.globalVar.next(undefined));
			this.getWeatherForecast(1).then(v => this._masterVar$.next(v));
		}
		return this._masterVar$;
	}


  public fetchApiResponse = async (url: string, method: string = "GET", body?: string, headers?: Record<string, string>): Promise<any> => {
    const options = {
        method,
        body,
        headers,
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
          console.error(response.statusText);
          return Promise.resolve(undefined);
      }

      return response.json();
    }
    catch (error) {
      console.error(error);
    }
  }

  public getWeatherForecastList = async (): Promise<WeatherForecast[]> => {
      return await this.fetchApiResponse(`${API_ENDPOINT}/WeatherForecast`);
  }

  public postWeatherForecast = async (data: any): Promise<WeatherForecast | undefined> => {
      if (!data) {
          return Promise.resolve(undefined);
      }

      const body = JSON.stringify(data);
      const headers = {
          'Content-Type': 'application/json; charset=utf-8'
      };

      return await this.fetchApiResponse(`${API_ENDPOINT}/WeatherForecast`, "POST", body, headers);
  }

  public putWeatherForecast = async (data: any): Promise<WeatherForecast | undefined> => {
      if (!data) {
          return Promise.resolve(undefined);
      }

      const body = JSON.stringify(data);
      const headers = {
          'Content-Type': 'application/json; charset=utf-8'
      };

      return await this.fetchApiResponse(`${API_ENDPOINT}/WeatherForecast`, "PUT", body, headers);
  }

  public deleteWeatherForecast = async (id: number): Promise<WeatherForecast | undefined> => {
      if (!id) {
          return Promise.resolve(undefined);
      }

      return await this.fetchApiResponse(`${API_ENDPOINT}/WeatherForecast/${id}`, "DELETE");
  }

  public getWeatherSummaryList = async (): Promise<WeatherSummary[]> => {
      return await this.fetchApiResponse(`${API_ENDPOINT}/WeatherSummary`);
  }

  public getWeatherForecast = async (id: number): Promise<WeatherForecast | undefined> => {
      if (!id) {
          return Promise.resolve(undefined);
      }

      return await this.fetchApiResponse(`${API_ENDPOINT}/WeatherForecast/${id}`);
  }
}
export const weatherAPIService: WeatherAPIService = new WeatherAPIService();
