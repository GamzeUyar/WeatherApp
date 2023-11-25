import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { BsSearch } from "react-icons/bs";

function App() {
  const [weather, setWeather] = useState(null);
  const [data, setData] = useState("");
  const [search, setSearch] = useState(false);
  const [cityChanged, setCityChanged] = useState(false);

  console.log("gelen data", data);
  console.log("hava durumu", weather);
  console.log ("şehir değişti", cityChanged)
  console.log ("arama yapıldı", search)

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${
          import.meta.env.VITE_WEATHER_API
        }&q=${data}&units=metric&lang=tr&days=5&aqi=yes&alerts=yes`
      );
      setWeather(response.data);
      console.log("data", response.data);
      setSearch(true); // Yeni şehir girişinde arama yapıldığını işaretle
      setCityChanged(false); // Şehir değişikliğini sıfırla
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (search && data && cityChanged) {
      fetchData();
      setCityChanged(false);
    }
  }, [search, data, cityChanged]);

  const handleLocationChange = (event) => {
    const newLocation = event.target.value;

    // Şehir input alanına yazıldığında ve değer değiştiyse hava durumu bilgisini getir
    if (newLocation !== data) {
      setData(newLocation);
      search ()
      
    }
  };

  const handleSearch = () => {
    if (data) {
      setSearch(true);
      setCityChanged(true); // Butona tıklanınca da durumu işaretle
      fetchData();
    } else {
      setSearch(false);
      alert("Lütfen bir şehir giriniz");
    }
  };

  return (
    <div className="container">
      <div className="app-container">
        <h1 className="app-title">Hava Durumu</h1>

        <div className="input-container">
          <input
            className="location-input"
            type="text"
            placeholder="Şehir Giriniz"
            value={data}
            onChange={handleLocationChange}
          />
          <button className="search-button" type="button" onClick={handleSearch}>
            <BsSearch size={18} />
          </button>
        </div>
      </div>
      {search && weather && (
        <div>
          <h2 className="daily">5 Günlük Tahmin</h2>
          <h2 className="location">
            {weather.location.name} / {weather.location.country}
          </h2>
        </div>
      )}

      {search && weather && (
        <div className="weather-container">
          {weather.forecast.forecastday.map((day) => (
            <div className="day-container" key={day.hour}>
              <h2 className="date"> {day.date} </h2>
              <img
                className="weather-icon"
                src={day.day.condition.icon}
                alt={day.day.condition.text}
              />
              <p className="temperature"> {day.day.avgtemp_c} C </p>
              <p className="temperature-text"> {day.day.condition.text} </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
