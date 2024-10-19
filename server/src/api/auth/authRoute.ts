import { request, Router } from "express";
import authController from "./authService";

const auth_router = Router()

auth_router.post('/register',(req,res) => authController.register(req,res))
auth_router.post('/login',(req,res) => authController.login(req,res))
auth_router.post('/refresh',(req,res) => authController.refreshT(req,res))
auth_router.post('/logout',(req,res)=> authController.logout(req,res))

export default auth_router