import { Component, ElementRef, ViewChild } from '@angular/core';
import WeatherInfo from '../../models/Weather';
import { OldWeatherModeService } from '../../services/old-weather-mode.service';

@Component({
  selector: 'app-weather-old-mode',
  templateUrl: './weather-old-mode.component.html',
  styleUrl: './weather-old-mode.component.css'
})
export class WeatherOldModeComponent {
  @ViewChild('cityInput') cityInput!: ElementRef<HTMLInputElement>;
  @ViewChild('countryInput') countryInput!: ElementRef<HTMLInputElement>;
  // @ViewChild('getWeatherBtn') getWeatherBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('weatherInfo') weatherInfo!: ElementRef<HTMLDivElement>;

  constructor(public oldWeatherService: OldWeatherModeService) {}

  // ngAfterViewInit() {
  //   this.cityInput.nativeElement.addEventListener('input', () => {
  //     // console.log(this.cityInput.nativeElement.value);
  //   });

  //   this.countryInput.nativeElement.addEventListener('input', () => {
  //     // console.log(this.countryInput.nativeElement.value);
  //   });

  //   this.getWeatherBtn.nativeElement.addEventListener('click', async () => {
  //     // console.log('Funciona ✅');
  //     const city = this.cityInput.nativeElement.value;
  //     const country = this.countryInput.nativeElement.value;

  //     if (city === '') {
  //       alert('Por favor, ingrese el nombre de una ciudad 😥');
  //       return;
  //     }

  //     this.oldWeatherService.weather = await this.oldWeatherService.searchWeather(city, country);

  //     this.displayWeather(this.oldWeatherService.weather);
  //   });

  //   if (this.weatherInfo.nativeElement) {
  //     // console.log('Funciona ✅');
  //   }
  // }

  displayWeather(data: WeatherInfo) {
    console.log(data);

    const cityName: string = data.name;
    const temp: number = data.main.temp;
    const description: string = data.weather[0].description;
    const humidity: number = data.main.humidity;
    const windSpeed: number = data.wind.speed;

    this.weatherInfo.nativeElement.innerHTML = `
    <h2>Clima en ${cityName} 📍</h2>
    <p>Temperatura: ${temp} 🌡️</p>
    <p>Descripción: ${description} 📌</p>
    <p>Humedad: ${humidity}% 💧</p>
    <p>Velocidad: ${windSpeed} m/s 🍃</p>
    `;

    this.weatherInfo.nativeElement.style.display = 'flex';
  }

  async loadWeatherResults() {
    const city = this.cityInput.nativeElement.value;
    const country = this.countryInput.nativeElement.value;

    if (city === '') {
      alert('Por favor, ingrese el nombre de una ciudad 😥');
      return;
    }

    this.oldWeatherService.weather = await this.oldWeatherService.searchWeather(city, country);

    this.displayWeather(this.oldWeatherService.weather);
  }
}
