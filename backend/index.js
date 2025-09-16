import express from 'express'
import cors from 'cors'
import scoresRoutes from './routes/scores.js'

const app = express()

app.use(cors())
app.use(express.json())


app.use('/', scoresRoutes)

app.get('/', (req, res) => {
  res.send('Servidor 1942 funcionando 🚀');
});


app.listen(4000, ()=> 
    console.log('Servidor corriendo en http://localhost:4000'))