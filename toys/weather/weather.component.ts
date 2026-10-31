import { Component, ElementRef, ViewChild } from '@angular/core';
import WeatherInfo from '../../models/Weather';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent {
  @ViewChild('cityInput') cityInput!: ElementRef<HTMLInputElement>;
  @ViewChild('countryInput') countryInput!: ElementRef<HTMLInputElement>;
  @ViewChild('weatherInfo') weatherInfo!: ElementRef<HTMLDivElement>;

  constructor(public weatherService: WeatherService) {}

  displayWeather(data: WeatherInfo) {
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

    this.weatherService.getWeatherInfo(city, country).subscribe({
      next: (data) => {
        this.weatherService.weather = data;

        console.log(this.weatherService.weather);

        this.displayWeather(this.weatherService.weather);
      },
      error: (e) => {
        console.log(e);
      }
    });
  }
}
