import express from "express";
import { validateJwt } from '../middlewares/validate-jws.js'
import { test, register, login, update } from './user.controller.js';
 
const api = express.Router();

api.get('/test', test)
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)

export default api