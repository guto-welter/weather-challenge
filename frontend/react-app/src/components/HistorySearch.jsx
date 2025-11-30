import { useState } from 'react'
import { Search, X, Calendar, MapPin, Hash } from 'lucide-react'
import { normalizeString } from '../utils/normalizeString'

function HistorySearch({ history, onSelectCity }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('city') // 'city', 'cep', 'date'
  const [filteredHistory, setFilteredHistory] = useState([])
  const [showResults, setShowResults] = useState(false)

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredHistory([])
      setShowResults(false)
      return
    }

    // Filtrar apenas registros válidos (com temperatura)
    const validHistory = history.filter(item => 
      item.temperature !== null && 
      item.temperature !== undefined &&
      item.city
    )

    let results = []

    if (searchType === 'city') {
      const normalizedSearch = normalizeString(searchTerm)
      results = validHistory.filter(item =>
        normalizeString(item.city).includes(normalizedSearch)
      )
    } else if (searchType === 'cep') {
      results = validHistory.filter(item =>
        item.cep && item.cep.includes(searchTerm.replace(/\D/g, ''))
      )
    } else if (searchType === 'date') {
      results = validHistory.filter(item => {
        const itemDate = new Date(item.created_at).toLocaleDateString('pt-BR')
        return itemDate.includes(searchTerm)
      })
    }

    // Remover duplicatas por cidade (manter apenas a mais recente)
    const uniqueResults = results.reduce((acc, item) => {
      const exists = acc.find(city => 
        normalizeString(city.city) === normalizeString(item.city)
      )
      if (!exists) {
        acc.push(item)
      }
      return acc
    }, [])

    setFilteredHistory(uniqueResults)
    setShowResults(true)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setFilteredHistory([])
    setShowResults(false)
  }

  const getPlaceholder = () => {
    switch (searchType) {
      case 'city':
        return 'Digite o nome da cidade...'
      case 'cep':
        return 'Digite o CEP...'
      case 'date':
        return 'Digite a data (dd/mm/aaaa)...'
      default:
        return 'Buscar...'
    }
  }

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setSearchType('city')}
          className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition ${
            searchType === 'city'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-1" />
          Cidade
        </button>
        <button
          onClick={() => setSearchType('cep')}
          className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition ${
            searchType === 'cep'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Hash className="w-4 h-4 inline mr-1" />
          CEP
        </button>
        <button
          onClick={() => setSearchType('date')}
          className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition ${
            searchType === 'date'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-1" />
          Data
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholder()}
            className="w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {showResults && (
        <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
          {filteredHistory.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-2">
              Nenhum resultado encontrado
            </p>
          ) : (
            <>
              <p className="text-xs text-gray-600 mb-2 font-medium">
                {filteredHistory.length} resultado(s) encontrado(s)
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredHistory.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      onSelectCity(item)
                      clearSearch()
                    }}
                    className="p-3 bg-white rounded-lg hover:bg-blue-50 cursor-pointer transition border border-gray-200 hover:border-blue-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3" />
                          {item.city}
                        </p>
                        {item.cep && (
                          <p className="text-xs text-gray-500">CEP: {item.cep}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          {item.temperature}°C - {item.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.created_at).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {item.icon && (
                        <img 
                          src={item.icon} 
                          alt={item.description}
                          className="w-8 h-8"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default HistorySearch