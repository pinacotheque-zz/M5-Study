import express from "express";
import fs from "fs";
import uniqid from "uniqid";
import path, { dirname, extname } from "path";
import { fileURLToPath } from "url";
import multer from 'multer'

import { getAuthors, publicFolderPath, writeAuthors } from "../lib/fs-tools.js";
import { generatePDFReadableStream } from "../lib/pdf.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const authorsFilePath = path.join(__dirname, "authors.json");

const router = express.Router();

const upload = multer()

// production check, for deploy or localhost
const isProduction = process.env.NODE_ENV === "production"

// GET all 
router.get("/", async (req, res, next) => {
  try {
    const authors = await getAuthors()
    res.send(authors);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// CREATE author
router.post("/", async (req, res, next) => {
  try {
    const { name, surname, email, dateOfBirth } = req.body;

    const author = {
      id: uniqid(),
      name,
      surname,
      email,
      dateOfBirth,
      avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // getiriyoruz ekliyoruz sonra yaziyoruz ve send atıyoruz
    const authors = await getAuthors()
    authors.push(author);

    await writeAuthors(authors)
    res.send(author);

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET SINGLE 
router.get("/:id", async (req, res, next) => {
  try {
    const array = await getAuthors()

    const author = array.find(
      (author) => author.id === req.params.id
    );
    if (!author) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` })
    }
    res.send(author);

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// GET PDF 
router.get("/:id/pdf", async (req, res, next) => {
  try {
    const array = await getAuthors()

    const author = array.find(
      (author) => author.id === req.params.id
    );
    if (!author) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` })
    }
    const pdfStream = await generatePDFReadableStream(Object.values(author))
    pdfStream.pipe(res);

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    let array = await getAuthors()

    const author = array.find(
      (author) => author.id === req.params.id
    );
    if (!author) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }
    array = array.filter(
      (author) => author.id !== req.params.id
    );
    await writeAuthors(array)
    res.status(204).send();
  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

//  UPDATE 
router.put("/:id/avatar", async (req, res, next) => {
  try {
    let array = await getAuthors()

    const authorIndex = array.findIndex(
      (author) => author.id === req.params.id
    );
    if (!authorIndex == -1) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }

    const previousAuthorData = array[authorIndex];
    const changedAuthor = {
      ...previousAuthorData,
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    array[authorIndex] = changedAuthor;
    await writeAuthors(array)
    res.send(changedAuthor);

  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});

// PUT AVATAR
router.put("/:id", upload.single("avatar"), async (req, res, next) => {
  try {

    const fileName = `${req.params.id} ${extname(req.file.originalname)}`
    await fs.writeFile(path.join(publicFolderPath,fileName), req.file.buffer)
    // const url = `${req.protocol}:// ${req.hostname}`
    let array = await getAuthors()

    const authorIndex = array.findIndex(
      (author) => author.id === req.params.id
    );
    if (!authorIndex == -1) {
      res
        .status(404)
        .send({ message: `Author with ${req.params.id} is not found!` });
    }

    const previousAuthorData = array[authorIndex];
    const changedAuthor = {
      ...previousAuthorData,
      ...req.body,
      updatedAt: new Date(),
      id: req.params.id,
    };
    array[authorIndex] = changedAuthor;
    await writeAuthors(array)
    res.send(changedAuthor);

  } catch (error) {
    res.send(500).send({ message: error.message });
  }
});



export default router;
