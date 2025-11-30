import { useState } from 'react'
import { 
  ArrowLeftRight, 
  Thermometer, 
  Droplets, 
  Wind,
  TrendingUp,
  TrendingDown,
  Minus,
  X
} from 'lucide-react'

const API_URL = '/api'

function CityComparison({ history, onClose }) {
  const [city1, setCity1] = useState('')
  const [city2, setCity2] = useState('')
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCompare = async () => {
    if (!city1 || !city2) {
      setError('Selecione duas cidades para comparar')
      return
    }

    if (city1 === city2) {
      setError('Selecione cidades diferentes')
      return
    }

    setLoading(true)
    setError('')

    try {
      const city1Data = history.find(item => 
        item.city.toLowerCase() === city1.toLowerCase()
      )
      const city2Data = history.find(item => 
        item.city.toLowerCase() === city2.toLowerCase()
      )

      const city1CacheAge = city1Data ? new Date() - new Date(city1Data.created_at) : Infinity
      const city2CacheAge = city2Data ? new Date() - new Date(city2Data.created_at) : Infinity
      const fiveHoursInMs = 5 * 60 * 60 * 1000

      const useCity1Cache = city1Data && city1CacheAge < fiveHoursInMs
      const useCity2Cache = city2Data && city2CacheAge < fiveHoursInMs

      if (useCity1Cache && useCity2Cache) {
        const comparisonData = {
          success: true,
          city1: {
            city: city1Data.city,
            country: city1Data.country,
            temperature: city1Data.temperature,
            humidity: city1Data.humidity,
            wind_speed: city1Data.wind_speed,
            feelslike: city1Data.feelslike,
            description: city1Data.description,
            icon: city1Data.icon
          },
          city2: {
            city: city2Data.city,
            country: city2Data.country,
            temperature: city2Data.temperature,
            humidity: city2Data.humidity,
            wind_speed: city2Data.wind_speed,
            feelslike: city2Data.feelslike,
            description: city2Data.description,
            icon: city2Data.icon
          },
          comparison: {
            temperature_diff: (city1Data.temperature || 0) - (city2Data.temperature || 0),
            humidity_diff: (city1Data.humidity || 0) - (city2Data.humidity || 0),
            wind_speed_diff: (city1Data.wind_speed || 0) - (city2Data.wind_speed || 0)
          }
        }

        setComparison(comparisonData)
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/weather/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city1, city2 })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        const message = data.message || data.error || 'Erro ao comparar cidades'
        setError(message)
        setLoading(false)
        return
      }

      // garantir valores numéricos para diffs
      data.comparison.temperature_diff = Number(data.comparison.temperature_diff || 0)
      data.comparison.humidity_diff = Number(data.comparison.humidity_diff || 0)
      data.comparison.wind_speed_diff = Number(data.comparison.wind_speed_diff || 0)

      setComparison(data)
      setLoading(false)
    } catch (err) {
      setError('Erro ao comparar cidades')
      setLoading(false)
    }
  }

  const getComparisonIcon = (diff) => {
    if (diff > 0) return <TrendingUp className="w-5 h-5 text-red-500" />
    if (diff < 0) return <TrendingDown className="w-5 h-5 text-blue-500" />
    return <Minus className="w-5 h-5 text-gray-500" />
  }

  const getComparisonText = (value, unit, metric) => {
    const absValue = Math.abs(value)
    if (value > 0) {
      return `${absValue.toFixed(1)}${unit} ${metric === 'temperature' ? 'mais quente' : metric === 'humidity' ? 'mais úmido' : 'mais ventoso'}`
    } else if (value < 0) {
      return `${absValue.toFixed(1)}${unit} ${metric === 'temperature' ? 'mais frio' : metric === 'humidity' ? 'mais seco' : 'menos ventoso'}`
    }
    return `Igual`
  }

  const getWinner = () => {
    if (!comparison) return null
    
    const scores = {
      city1: 0,
      city2: 0
    }

    const idealTemp = 22
    if (Math.abs(comparison.city1.temperature - idealTemp) < Math.abs(comparison.city2.temperature - idealTemp)) {
      scores.city1++
    } else {
      scores.city2++
    }

    const idealHumidity = 50
    if (Math.abs(comparison.city1.humidity - idealHumidity) < Math.abs(comparison.city2.humidity - idealHumidity)) {
      scores.city1++
    } else {
      scores.city2++
    }

    if (comparison.city1.wind_speed < comparison.city2.wind_speed) {
      scores.city1++
    } else {
      scores.city2++
    }

    if (scores.city1 > scores.city2) return 'city1'
    if (scores.city2 > scores.city1) return 'city2'
    return 'tie'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Comparação de Cidades</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {history.length < 2 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="font-bold">⚠️ Atenção!</p>
              <p className="text-sm mt-1">
                Você precisa salvar pelo menos 2 cidades diferentes antes de fazer comparações.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primeira Cidade
              </label>
              <select
                value={city1}
                onChange={(e) => setCity1(e.target.value)}
                disabled={history.length < 2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Selecione uma cidade</option>
                {history.map((item, index) => (
                  <option key={index} value={item.city}>
                    {item.city} - {item.temperature}°C
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segunda Cidade
              </label>
              <select
                value={city2}
                onChange={(e) => setCity2(e.target.value)}
                disabled={history.length < 2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Selecione uma cidade</option>
                {history.map((item, index) => (
                  <option key={index} value={item.city}>
                    {item.city} - {item.temperature}°C
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={loading || !city1 || !city2 || history.length < 2}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition font-bold text-lg shadow-lg"
          >
            {loading ? 'Comparando...' : 'Comparar Cidades'}
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {comparison && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-xl border-4 ${getWinner() === 'city1' ? 'border-green-500 bg-green-50' : 'border-blue-300 bg-blue-50'} relative`}>
                  {getWinner() === 'city1' && (
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      🏆 Melhor Clima
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {comparison.city1?.city || 'Cidade 1'}
                  </h3>
                  {comparison.city1?.icon && (
                    <img 
                      src={comparison.city1.icon} 
                      alt={comparison.city1.description || 'Clima'}
                      className="w-20 h-20 mx-auto mb-4"
                    />
                  )}
                  <p className="text-center text-gray-600 capitalize mb-4">
                    {comparison.city1?.description || 'Sem descrição'}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-red-500" />
                        <span className="font-medium">Temperatura</span>
                      </div>
                      <span className="text-xl font-bold">
                        {comparison.city1?.temperature ?? 'N/A'}°C
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Umidade</span>
                      </div>
                      <span className="text-xl font-bold">
                        {comparison.city1?.humidity ?? 'N/A'}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Vento</span>
                      </div>
                      <span className="text-xl font-bold">
                        {comparison.city1?.wind_speed ?? 'N/A'} km/h
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-600">Sensação térmica:</span>
                      <span className="text-lg font-bold ml-2">
                        {comparison.city1?.feelslike ?? 'N/A'}°C
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border-4 ${getWinner() === 'city2' ? 'border-green-500 bg-green-50' : 'border-purple-300 bg-purple-50'} relative`}>
                  {getWinner() === 'city2' && (
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      🏆 Melhor Clima
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {comparison.city2?.city || 'Cidade 2'}
                  </h3>
                  {comparison.city2?.icon && (
                    <img 
                      src={comparison.city2.icon} 
                      alt={comparison.city2.description || 'Clima'}
                      className="w-20 h-20 mx-auto mb-4"
                    />
                  )}
                  <p className="text-center text-gray-600 capitalize mb-4">
                    {comparison.city2?.description || 'Sem descrição'}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-red-500" />
                        <span className="font-medium">Temperatura</span>
                      </div>
                      <span className="text-xl font-bold">
                        {comparison.city2?.temperature ?? 'N/A'}°C
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Umidade</span>
                      </div>
                      <span className="text-xl font-bold">
                        {comparison.city2?.humidity ?? 'N/A'}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Vento</span>
                      </div>
                      <span className="text-xl font-bold">
                        {comparison.city2?.wind_speed ?? 'N/A'} km/h
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg">
                      <span className="text-sm text-gray-600">Sensação térmica:</span>
                      <span className="text-lg font-bold ml-2">
                        {comparison.city2?.feelslike ?? 'N/A'}°C
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border-2 border-orange-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ArrowLeftRight className="w-6 h-6" />
                  Análise Comparativa
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-red-500" />
                        <span className="font-medium">Temperatura</span>
                      </div>
                      {getComparisonIcon(comparison.comparison.temperature_diff)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {comparison.city1.city} está{' '}
                      <strong className="text-gray-900">
                        {getComparisonText(comparison.comparison.temperature_diff || 0, '°C', 'temperature')}
                      </strong>
                      {' '}que {comparison.city2.city}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Umidade</span>
                      </div>
                      {getComparisonIcon(comparison.comparison.humidity_diff)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {comparison.city1.city} está{' '}
                      <strong className="text-gray-900">
                        {getComparisonText(comparison.comparison.humidity_diff || 0, '%', 'humidity')}
                      </strong>
                      {' '}que {comparison.city2.city}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Vento</span>
                      </div>
                      {getComparisonIcon(comparison.comparison.wind_speed_diff)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {comparison.city1.city} está{' '}
                      <strong className="text-gray-900">
                        {getComparisonText(comparison.comparison.wind_speed_diff || 0, ' km/h', 'wind')}
                      </strong>
                      {' '}que {comparison.city2.city}
                    </p>
                  </div>
                </div>
              </div>

              {getWinner() === 'tie' ? (
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-xl text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    🤝 Empate! Ambas as cidades têm condições climáticas similares
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl text-center border-2 border-green-300">
                  <p className="text-2xl font-bold text-gray-800 mb-2">
                    🏆 {getWinner() === 'city1' ? comparison.city1.city : comparison.city2.city} tem o clima mais agradável!
                  </p>
                  <p className="text-gray-600">
                    Baseado em temperatura, umidade e vento ideais
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CityComparison