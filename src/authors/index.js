import express from 'express'
import uniqid from 'uniqid'

import { getAuthors, publicfolderPath, writeAuthors } from '../lib/fs-tools.js'

const router = express.Router()
const isProduction = process.env.NODE_ENV === "production"

// GET ALL
router.get("/", async (req, res, next) => {
  try {
    const authors = await getAuthors()
    res.send(authors)
  } catch (error) {
    res.status(500).send({message: error.message})
  }
})

// GET SINGLE
router.get("/:id", async (req, res, next) => {
  try {
    const array = await getAuthors()
    const author = array.find(author => author.id === req.params.id)
    res.send(authors)
  } catch (error) {
    res.status(500).send({message: error.message})
  }
})
