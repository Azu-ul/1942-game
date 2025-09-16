import { URL_BASE_API } from '../constants/constantesJuego'

export const apiPuntajes = {
  // Puntajes individuales
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
  },

  // Puntajes de parejas
  async obtenerParejas() {
    try {
      const response = await fetch(`${URL_BASE_API}/couples`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching couples scores:', error)
      // Si no existe el endpoint, devolver array vacío
      if (error.message.includes('404')) {
        return []
      }
      throw error
    }
  },

  async crearPareja(inicialesJ1, puntajeJ1, inicialesJ2, puntajeJ2) {
    try {
      const response = await fetch(`${URL_BASE_API}/couples`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          player1_initials: inicialesJ1,
          player1_score: puntajeJ1,
          player2_initials: inicialesJ2,
          player2_score: puntajeJ2,
          total_score: puntajeJ1 + puntajeJ2
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error saving couples score:', error)
      throw error
    }
  }
}