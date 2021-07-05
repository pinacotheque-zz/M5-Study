import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'


const server = express()

const port = process.env.PORT

// server.use
server.use(express.static(publicfolderPath))
server.use(cors())
server.use(express.json())


console.table(listEndpoints(server))


server.listen(port, () => console.log("Server is running on port: ", port))
server.on("error", (error) => console.log(` Server is not running due to : ${error}`))