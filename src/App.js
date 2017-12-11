import React, { Component } from 'react'
import './App.css'
import Forecast from './Forecast'

import config from './config'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loadingLatlng: false,
      hasLatlng: false,
      latlng: {},
      loadingWeather: false,
      hasWeather: false,
      searchCity: '',
      searchValue: '',
      currentWeather: [],
      weatherForecast: [],
      userLocation: {}
    }

    this.getLatLng = this.getLatLng.bind(this)
    this.renderMsg = this.renderMsg.bind(this)
    this.getWeather = this.getWeather.bind(this)
    this.getTimezone = this.getTimezone.bind(this)
    this.getUserLocation = this.getUserLocation.bind(this)

    this.handleSearchBar = this.handleSearchBar.bind(this)
    this.handleSearchButton = this.handleSearchButton.bind(this)
  }

  getWeather(result) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${result.lat}&lon=${result.lng}&units=metric&APPID=${config.weatherApiKey}`)
      .then(response => response.json())
      .then(data => {
        //console.log(data)
        this.setState({
          currentWeather: {
            main: data.weather[0].main,
            description: data.weather[0].description,
            temp: data.main.temp
          }
        })

      })
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${result.lat}&lon=${result.lng}&units=metric&APPID=72af66db614bf9fd03583352142dd7a7`)
      .then(response => response.json())
      .then(data => {
        //console.log(data)
        const weatherData = data.list.map(forecast => {
          return (
            {
              time: forecast.dt,
              time_text: forecast.dt_txt,
              temp: forecast.main.temp,
              humidity: forecast.main.humidity,
              cloudiness: forecast.clouds.all,
              icon: forecast.weather.map(data => data.icon),
            }
          )
        })
        this.setState({
          loadingWeather: false,
          hasWeather: true,
          weatherForecast: weatherData
        })
        //console.log(weatherData)
        //console.log(data.list[0])
        //var date = new Date(data.list[0].dt * 1000).toISOString()


        //var date2 = Date.UTC(date.getYear(), date.getMonth(), date.getDay())

        //console.log((date))
        //console.log(date2)

      })

      //this.getTimezone(result)

  }

  getTimezone(result) {
    return fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${result.lat},${result.lng}&timestamp=1510657192&key=AIzaSyDvsE0DwTXOK2tcgX0rC3X13gn9ObApUs4`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const offset = data.dstOffset + data.rawOffset
        return offset
      })

  }

  getUserLocation() {

    if (!navigator.geolocation){
    console.log('no geolocation ability')
    return
    }
    console.log('getting users location')
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        userLocation: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      }, () => {
        console.log(this.getTimezone(this.state.userLocation))
      })
    })
  }

  getLatLng(city) {
    this.setState({
      loadingLatlng: true
    })

    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}`)
    .then(response => response.json())
    .then(data => {
      if(data.status !== "OK"){
        this.setState({
          loadingLatlng: false,
          hasLatlng: false
        })

        throw new Error('Did not get lat lng')
      } else {
        this.setState({
          loadingLatlng: false,
          hasLatlng: true,
          latlng: data.results[0].geometry.location,
          searchCity: data.results[0].formatted_address
        })
        return data.results[0].geometry.location
      }
    })
  }

  componentDidMount() {

  }

  handleSearchButton() {
    this.getUserLocation()

      this.getLatLng(this.state.searchValue)
        .then(result => this.getTimezone(result))
        .catch(err => console.log('Error', err))

      this.getLatLng(this.state.searchValue)
        .then(result => this.getWeather(result))
        .catch(err => console.log('Error', err))

  }

  handleSearchBar(e) {
    this.setState({
      searchValue: e.target.value
    })
  }

  renderMsg() {
    if (this.state.loadingLatlng) {
      return (
        <div>
          Loading...
        </div>
      )
    }

    if (!this.state.loadingLatlng && this.state.hasLatlng) {
      return (
        <div>
          The weather in {this.state.searchCity} is:
          <div>Weather: {this.state.currentWeather.main}</div>
          <div>Weather2: {this.state.currentWeather.description}</div>
          <div>Temp: {this.state.currentWeather.temp}</div>
          <div></div>
          <div>
            {this.state.weatherForecast.map(forecast => {
              return (
                <Forecast
                  time={forecast.time}
                  temp={forecast.temp}
                  icon={forecast.icon}
                />
              )
              })
            }
          </div>
        </div>
      )
    }

    return <div>Somethings gone wrong...</div>
  }

  render() {
    return (
      <div className="App">
        <h1>Weather App</h1>
        <input
          id="search"
          placeholder="City..."
          type="text"
          value={this.state.searchValue}
          onChange={this.handleSearchBar}>
        </input>
        <button onClick={this.handleSearchButton}>Search</button>
        {this.renderMsg()}
      </div>
    );
  }
}


export default App;
