import { useState, useEffect } from 'react'
import './App.css'
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Eye, 
  Gauge, 
  MapPin,
  Search,
  History,
  Thermometer,
  ArrowLeftRight,
  Save
} from 'lucide-react'
import CityComparison from './components/CityComparison'

const API_URL = 'http://localhost:8000/api'

function App() {
  const [cep, setCep] = useState('')
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [theme, setTheme] = useState('default')
  const [showComparison, setShowComparison] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isFromCache, setIsFromCache] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history`)
      const data = await response.json()
      setHistory(data)
    } catch (err) {
      console.error('Erro ao buscar histórico:', err)
    }
  }

  const handleCepSearch = async () => {
    if (!cep || cep.length !== 8) {
      setError('CEP inválido. Digite 8 dígitos.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setError('CEP não encontrado.')
        setLoading(false)
        return
      }

      setCity(data.localidade)
      setLoading(false)
    } catch (err) {
      setError('Erro ao buscar CEP.')
      setLoading(false)
    }
  }

  const handleWeatherSearch = async () => {
    if (!city) {
      setError('Informe uma cidade.')
      setErrorModalMessage('Por favor, informe uma cidade.')
      setShowErrorModal(true)
      return
    }

    setLoading(true)
    setError('')
    setSaveSuccess(false)

    try {
      const cachedCity = history.find(item => 
        item.city.toLowerCase() === city.toLowerCase() &&
        item.temperature !== null
      )

      if (cachedCity) {
        const cacheAge = new Date() - new Date(cachedCity.created_at)
        const fiveHoursInMs = 5 * 60 * 60 * 1000

        if (cacheAge < fiveHoursInMs) {
          const weatherData = {
            location: {
              name: cachedCity.city,
              country: cachedCity.country,
              region: cachedCity.region || '',
              localtime: cachedCity.created_at
            },
            current: {
              temperature: cachedCity.temperature,
              weather_descriptions: [cachedCity.description],
              weather_icons: [cachedCity.icon],
              humidity: cachedCity.humidity,
              wind_speed: cachedCity.wind_speed,
              wind_dir: cachedCity.raw_data?.current?.wind_dir || 'N/A',
              pressure: cachedCity.raw_data?.current?.pressure || 0,
              precip: cachedCity.raw_data?.current?.precip || 0,
              feelslike: cachedCity.feelslike,
              uv_index: cachedCity.raw_data?.current?.uv_index || 0,
              visibility: cachedCity.raw_data?.current?.visibility || 0
            }
          }

          setWeather(weatherData)
          updateTheme(weatherData)
          setIsFromCache(true)
          setLoading(false)
          return
        }
      }

      const response = await fetch(`${API_URL}/weather/${city}`)
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        const message = data.message || data.error || 'Cidade não encontrada. Verifique o nome e tente novamente.'
        setErrorModalMessage(message)
        setShowErrorModal(true)
        setLoading(false)
        return
      }

      const data = await response.json()

      if (!data || data.temperature === null || data.temperature === undefined) {
        const message = 'Dados de clima não disponíveis para a cidade informada.'
        setErrorModalMessage(message)
        setShowErrorModal(true)
        setLoading(false)
        return
      }

      const weatherData = {
        location: {
          name: data.city,
          country: data.country,
          region: data.region,
          localtime: data.localtime
        },
        current: {
          temperature: data.temperature,
          weather_descriptions: [data.description],
          weather_icons: [data.icon],
          humidity: data.humidity,
          wind_speed: data.wind_speed,
          wind_dir: data.raw_data?.current?.wind_dir || 'N/A',
          pressure: data.raw_data?.current?.pressure || 0,
          precip: data.raw_data?.current?.precip || 0,
          feelslike: data.feelslike,
          uv_index: data.raw_data?.current?.uv_index || 0,
          visibility: data.raw_data?.current?.visibility || 0
        }
      }

      setWeather(weatherData)
      updateTheme(weatherData)
      setIsFromCache(false)
      setLoading(false)
    } catch (err) {
      console.error('Erro ao buscar clima:', err)
      const msg = 'Erro ao buscar clima. Verifique sua conexão e tente novamente.'
      setErrorModalMessage(msg)
      setShowErrorModal(true)
      setLoading(false)
    }
  }

  const handleSaveSearch = async () => {
    if (!weather) {
      setError('Faça uma busca primeiro.')
      return
    }

    setLoading(true)
    setSaveSuccess(false)

    try {
      const historyPayload = {
        city: weather.location.name,
        country: weather.location.country,
        temperature: weather.current.temperature,
        humidity: weather.current.humidity,
        wind_speed: weather.current.wind_speed,
        feelslike: weather.current.feelslike,
        description: weather.current.weather_descriptions[0],
        icon: weather.current.weather_icons[0],
        cep: cep || null,
        raw_data: weather
      }

      await fetch(`${API_URL}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyPayload)
      })

      setSaveSuccess(true)
      fetchHistory()
      setLoading(false)

      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError('Erro ao salvar pesquisa.')
      setLoading(false)
    }
  }

  const updateTheme = (weatherData) => {
    const condition = weatherData.current?.weather_descriptions?.[0]?.toLowerCase() || ''
    const localtime = weatherData.location?.localtime || new Date().toISOString()
    const hour = new Date(localtime).getHours()
    const isNight = hour < 6 || hour >= 20
    
    if (isNight) {
      if (condition.includes('clear')) {
        setTheme('night-clear')
      } else if (condition.includes('rain')) {
        setTheme('night-rainy')
      } else if (condition.includes('cloud')) {
        setTheme('night-cloudy')
      } else {
        setTheme('night')
      }
    } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('storm')) {
      setTheme('rainy')
    } else if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('fog') || condition.includes('mist')) {
      setTheme('cloudy')
    } else if (condition.includes('snow')) {
      setTheme('snowy')
    } else if (condition.includes('clear') || condition.includes('sunny')) {
      setTheme('sunny')
    } else {
      setTheme('default')
    }
  }

  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || ''
    if (desc.includes('rain')) return <CloudRain className="w-16 h-16" />
    if (desc.includes('cloud')) return <Cloud className="w-16 h-16" />
    if (desc.includes('snow')) return <CloudSnow className="w-16 h-16" />
    if (desc.includes('clear') || desc.includes('sunny')) return <Sun className="w-16 h-16" />
    return <Cloud className="w-16 h-16" />
  }

  const uniqueHistoryCities = history.reduce((acc, item) => {
    if (item.temperature !== null && item.temperature !== undefined) {
      const exists = acc.find(city => 
        city.city.toLowerCase() === item.city.toLowerCase()
      )
      if (!exists) {
        acc.push(item)
      }
    }
    return acc
  }, [])

  const handleHistoryClick = (item) => {
    const weatherData = {
      location: {
        name: item.city,
        country: item.country,
        region: item.region || '',
        localtime: item.created_at
      },
      current: {
        temperature: item.temperature,
        weather_descriptions: [item.description],
        weather_icons: [item.icon],
        humidity: item.humidity,
        wind_speed: item.wind_speed,
        wind_dir: item.raw_data?.current?.wind_dir || 'N/A',
        pressure: item.raw_data?.current?.pressure || 0,
        precip: item.raw_data?.current?.precip || 0,
        feelslike: item.feelslike,
        uv_index: item.raw_data?.current?.uv_index || 0,
        visibility: item.raw_data?.current?.visibility || 0
      }
    }

    setCity(item.city)
    setCep(item.cep || '')
    setWeather(weatherData)
    updateTheme(weatherData)
    setIsFromCache(true)
  }

  const canCompare = uniqueHistoryCities.length >= 2

  return (
    <div className={`min-h-screen transition-all duration-1000 theme-${theme}`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 relative z-10">
          <h1 className="text-5xl font-bold mb-3 text-white drop-shadow-lg flex items-center justify-center gap-3">
            <Sun className="w-12 h-12" />
            Previsão do Tempo
          </h1>
          <p className="text-white/90 text-lg">Consulte o clima de qualquer cidade do Brasil</p>
          
          <div className="mt-4 flex justify-center">
            {canCompare && (
              <button
                onClick={() => setShowComparison(true)}
                type="button"
                className="px-6 py-3 bg-white/90 hover:bg-white text-gray-800 rounded-lg font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2 cursor-pointer relative z-20"
              >
                <ArrowLeftRight className="w-5 h-5" />
                Comparar Cidades
              </button>
            )}
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Search className="w-6 h-6" />
                Buscar Previsão
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                      placeholder="Digite o CEP (somente números)"
                      maxLength={8}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                    <button
                      onClick={handleCepSearch}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
                    >
                      Buscar CEP
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Nome da cidade"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <button
                  onClick={handleWeatherSearch}
                  disabled={loading || !city}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 transition font-bold text-lg shadow-lg"
                >
                  {loading ? 'Carregando...' : 'Consultar Clima'}
                </button>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {saveSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    ✅ Pesquisa salva com sucesso!
                  </div>
                )}
              </div>

              {weather?.location?.name && weather?.current?.temperature !== null && weather?.current?.temperature !== undefined && (
                <div className="mt-8 space-y-6">
                  <div className="text-center py-6 border-t-2 border-gray-200">
                    <div className="flex items-center justify-center mb-4 text-blue-600">
                      {getWeatherIcon(weather.current.weather_descriptions?.[0])}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                      {weather.location.name}
                    </h3>
                    <p className="text-6xl font-bold text-gray-900 mb-2">
                      {weather.current.temperature}°C
                    </p>
                    <p className="text-xl text-gray-600 capitalize">
                      {weather.current.weather_descriptions?.[0]}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Sensação térmica: {weather.current.feelslike}°C
                    </p>

                    {!isFromCache && (
                      <button
                        onClick={handleSaveSearch}
                        disabled={loading}
                        className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-bold shadow-lg flex items-center gap-2 mx-auto"
                      >
                        <Save className="w-5 h-5" />
                        Salvar Pesquisa
                      </button>
                    )}

                    {isFromCache && (
                      <div className="mt-4 px-6 py-3 bg-blue-100 text-blue-800 rounded-lg inline-flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Dados salvos anteriormente
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-blue-700 mb-1">
                        <Droplets className="w-5 h-5" />
                        <span className="text-sm font-medium">Umidade</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{weather.current.humidity}%</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-green-700 mb-1">
                        <Wind className="w-5 h-5" />
                        <span className="text-sm font-medium">Vento</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">{weather.current.wind_speed} km/h</p>
                      <p className="text-xs text-green-700">{weather.current.wind_dir}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-purple-700 mb-1">
                        <Gauge className="w-5 h-5" />
                        <span className="text-sm font-medium">Pressão</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900">{weather.current.pressure} mb</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-orange-700 mb-1">
                        <Eye className="w-5 h-5" />
                        <span className="text-sm font-medium">Visibilidade</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-900">{weather.current.visibility} km</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-indigo-700 mb-1">
                        <CloudRain className="w-5 h-5" />
                        <span className="text-sm font-medium">Precipitação</span>
                      </div>
                      <p className="text-2xl font-bold text-indigo-900">{weather.current.precip} mm</p>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-pink-700 mb-1">
                        <Thermometer className="w-5 h-5" />
                        <span className="text-sm font-medium">Índice UV</span>
                      </div>
                      <p className="text-2xl font-bold text-pink-900">{weather.current.uv_index}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <History className="w-5 h-5" />
                Pesquisas Salvas
              </h2>
              
              {uniqueHistoryCities.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  Nenhuma pesquisa salva ainda
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {uniqueHistoryCities.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleHistoryClick(item)}
                      className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-blue-100 cursor-pointer transition border border-gray-200 hover:border-blue-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {item.city}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.temperature}°C
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(item.created_at).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {item.icon && (
                          <img 
                            src={item.icon} 
                            alt={item.description}
                            className="w-10 h-10"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showComparison && (
        <CityComparison 
          history={uniqueHistoryCities} 
          onClose={() => setShowComparison(false)} 
        />
      )}

     {showErrorModal && (
       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowErrorModal(false)} />
         <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 z-10 animate-fadeIn">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
               <span className="text-2xl">⚠️</span>
             </div>
             <h3 className="text-xl font-bold text-gray-900">Cidade não encontrada</h3>
           </div>
           <p className="text-gray-700 mb-6">{errorModalMessage}</p>
           <div className="flex justify-end">
             <button
               onClick={() => { setShowErrorModal(false); setError('') }}
               className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
             >
               Fechar
             </button>
           </div>
         </div>
       </div>
     )}
    </div>
  )
}

export default App