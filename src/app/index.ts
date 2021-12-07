import express = require('express');
const app: express.Application = express();

const cors = require('cors');

const port = process.env.PORT || 3100;

//middlewares
app.use(cors());
app.use(express.json({limit : "50mb"}))

//rutas

app.use("/api", require("./routes/routes"));


app.listen(port, function(){
    console.log(`Interprete escuchando el el puerto ${port}`)
});

app.get('/express_backend',(req,res) =>{
    res.send({express: 'YOUR EXPRESS BACKEND IS CONECTED TO REACT'})
});

