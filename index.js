// ====== CONFIGURAÇÃO INICIAL DA API ========
require('dotenv').config()
const express = require('express')          //vai importar o que está na pasta express para o nosso projecto
const app = express()                       //vai executar o express como uma função (importamos e depois executamos)
const mongoose = require('mongoose')
const cors = require('cors');
//const fetch = require("node-fetch");
                                            //const Person = require('./models/Person')   -não preciso de adicionar a extensão do ficheiro
                                            //apagamos isto aqui no index.js e colamos em personRouters.js pois agora é usado lá


app.use(cors({
    origin: '*'
})); 

app.use(                                    //middlewares
    express.urlencoded({
        extended: true,
    }),
)
app.use(express.json())                     // Forma de ler JSON. Tenho de configurar isto no express.

                        

// ====== ROTAS DA API ======================================
const personRoutes = require('./routes/personRoutes') //importação do ficheiro personRoutes armazenado na pasta routes
app.use('/person', personRoutes)                      //configuração do que importei

// ====== ROTA INICIAL ======================================
                                            // Rota inicial /endpoint - para poder acessar ao postman e começar a testar coisas no projecto
app.get('/', (req, res) => {                //estou a dar possibilidade a express de ler tudo o que vem na requisição
                                            //(req - se o utilizador enviar algum dado, vou conseguir extrair algo disso) e estou a dar uma resposta (res)
    res.json({message: 'Hello Express!'})   //mostra req (só para experimentar)
})

// ====== ACESSO À BASE DE DADOS REMOTA [PORTA 3000] ========

const DB_USER = process.env.DB_USER         //colocamos as password no ficheiro .env
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD) 

mongoose
    .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@clusterapi.nrqlgbu.mongodb.net/?retryWrites=true&w=majority`,
    )
    .then(() =>{                                //quando funciona
        console.log('Conectamos ao MongoDB')
        app.listen(3000)                        //temos de dar uma porta para o express saber onde vai buscar o projecto
    })  
    .catch((err) => console.log(err))           //quando dá algum erro


    //CTRL C no terminal para sair 
    //Instalamos  o pacote dotenv para criar variáveis seguras para o sistema
