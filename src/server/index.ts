import express from 'express';
import { api } from './api';
import { expressjwt } from 'express-jwt';

const app = express();

app.use(expressjwt({
    secret: process.env['JWT_SECRET'] || "my secret",
    credentialsRequired: false,
    algorithms: ['HS256']
}));

app.use(api);

app.listen(3002, () => console.log("Server started"));
