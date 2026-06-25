const express = require('express');
const cors  = require('cors')
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});

