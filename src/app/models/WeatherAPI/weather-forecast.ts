import { Address } from './address';

export interface WeatherForecast {
	id: number;
	date: string;
	temperatureC: number;
	rating: number;
	image: string;
	temperatureF: number;
	summary: string;
	currentAddress: Address;
	addresses: Address[];
}
