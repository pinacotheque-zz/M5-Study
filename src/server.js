import express from 'express'
import cors from 'cors'
import listEndpoints from "express-list-endpoints";


import authorsRouter from './authors/index.js'
import blogsRouter from './blogs/index.js'
import { publicFolderPath } from "./lib/fs-tools.js";

import {notFound, forbidden, catchAllErrorHandler} from './errorHandlers.js'

const server = express()
const port = process.env.PORT

import { getCurrentFolderPath } from "./lib/fs-tools.js"


//******* MIDDLEWARES ********//

server.use(cors())
server.use(express.json())
server.use(express.static(publicFolderPath))

server.use(notFound)
server.use(forbidden)
server.use(catchAllErrorHandler)

//*** ENDPOINTS ***//
server.use("/blogs", blogsRouter)
server.use("/authors", authorsRouter)




console.table(listEndpoints(server))

server.listen(port, () => console.log(" Server is running on port : ", port));

server.on("error", (error) =>
  console.log(` Server is not running due to : ${error}`)
);
