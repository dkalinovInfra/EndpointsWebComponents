import { RegionAndCity } from './region-and-city';

export interface Address {
	id: number;
	street: string;
	city: RegionAndCity;
}
