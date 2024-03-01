import express from "express";
import { validateJwt } from '../middlewares/validate-jws.js'
import { newPublication, updatePublication, deletePublication } from './publication.controller.js';
 
const api = express.Router();

api.post('/newPublication', [validateJwt], newPublication)
api.put('/updatePublication/:id', [validateJwt], updatePublication)
api.delete('/deletePublication/:id', [validateJwt],deletePublication)

export default api