import express from "express";
import { validateJwt } from '../middlewares/validate-jws.js'
import { newComment , updateComment, deleteComment } from './comment.controller.js';
 
const api = express.Router();

api.post('/newComment', [validateJwt], newComment)
api.put('/updateComment/:id', [validateJwt], updateComment)
api.delete('/deleteComment/:id', [validateJwt],deleteComment)

export default api