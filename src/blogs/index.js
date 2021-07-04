import express from "express";
import uniqid from "uniqid";
import multer from 'multer'
import { getAuthors, publicFolderPath, writeAuthors } from "../lib/fs-tools";

const router = express.Router();
const upload = multer()



export default router