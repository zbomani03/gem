import bodyParser from "body-parser";
import express from 'express';
import env from "dotenv";
import cors from 'cors';
import PDFService from "./services/PDFService";

// Constants
const PORT = 8080;
const HOST = '127.0.0.1';

env.config();

// App
const app: express.Application = express();
app.use(bodyParser.json());

// Enable CORS only in development
if (process.env.NODE_ENV === "development") {
    app.use(cors());
    app.options('http://localhost:30', cors());
}

app.get('/status', async (req, res) => {
    return res.status(200).sendStatus(200);
});

app.post('/export-pdf', async (req, res) => {
    return PDFService.create(req.body, req.headers.authorization).then(pdfResult => {
        res.set('Content-disposition', 'attachment');
        res.set('Content-Type', 'application/pdf');
        pdfResult.pipe(res);
    }).catch(error => {
        console.error("APPA PDF API Error: " + error.message);
        res.status(400).send({ error: error.message });
        if(req !== undefined && req.body !== undefined)
            console.error("APPA PDF API Body: " + req.body);
    });
});

app.listen(PORT, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});

export default app;
