import mongoose, { connection } from "mongoose";
import { connect } from "mongoose";
import { config } from "dotenv";
import express from 'express';

connect(process.env.MONGO_URI || '')
.then(()=>{
    console.log("Connection success")
})
.catch((err: Error)=>{
    console.log(err)
})

const app = express();

