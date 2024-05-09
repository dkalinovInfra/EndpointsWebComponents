import { weatherAPIService } from './WeatherAPI-service';
import { BehaviorSubject } from 'rxjs';

class StateService {
	private _id$!: BehaviorSubject<number | undefined>;

	public get id(): BehaviorSubject<number | undefined> {
		if (!this._id$) {
			this._id$ = new BehaviorSubject<number | undefined>(5);
			this._id$.subscribe(() => weatherAPIService.globalVar.next(undefined));
		}
		return this._id$;
	}
}
export const stateService: StateService = new StateService();
