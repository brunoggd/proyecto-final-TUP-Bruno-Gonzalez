import { Injectable } from '@angular/core';
import WeatherInfo from '../models/Weather';
import WeatherDescription from '../models/WeatherDescription';

@Injectable({
  providedIn: 'root'
})
export class OldWeatherModeService {
  weather: WeatherInfo;

  API_KEY: string = '1c641bc2e00b384fd91767599435d7b7';

  constructor() {
    this.weather = {
      name: '',
      main: {
        humidity: 0,
        temp: 0,
        temp_max: 0,
        temp_min: 0,
      },
      weather: [{ description: '' }],
      wind: {
        speed: 0,
      }
    };
  }

  setWeather(apiResponse: WeatherInfo): WeatherInfo {
    return {
      name: apiResponse.name,
      main: {
        humidity: apiResponse.main.humidity,
        temp: apiResponse.main.temp,
        temp_max: apiResponse.main.temp_max,
        temp_min: apiResponse.main.temp_min
      },
      weather: apiResponse.weather.map((w: WeatherDescription) => ({
        description: w.description,
      })),
      wind: {
        speed: apiResponse.wind.speed,
      }
    }
  }

  async searchWeather(city: string, country: string): Promise<WeatherInfo> {
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${this.API_KEY}&units=metric&lang=es`;

    try {
      const response: Response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const apiResponse: WeatherInfo = await response.json();

      const data: WeatherInfo = this.setWeather(apiResponse);

      return data;

    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      }

      throw error;
    }
  }
}
