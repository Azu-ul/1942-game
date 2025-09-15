import { URL_BASE_API } from '../constants/constantesJuego'

export const apiPuntajes = {
  async obtenerTodos() {
    try {
      const response = await fetch(`${URL_BASE_API}/scores`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching scores:', error)
      throw error
    }
  },

  async crear(iniciales, puntaje) {
    try {
      const response = await fetch(`${URL_BASE_API}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initials: iniciales, score: puntaje }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error saving score:', error)
      throw error
    }
  }
}