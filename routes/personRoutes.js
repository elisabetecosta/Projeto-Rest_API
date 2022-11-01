const router = require('express').Router()      //router - é um recurso do express que me permite criar um ficheiro de rotas, podendo eu explorar e importar a aplicação
const Person = require('../models/Person')

// ====== ROTAS DA API ======================================
// Aqui vamos construir a estrutura CRUD adaptada ao nosso projecto

// CREATE - criação de dados (POST)
router.post('/', async (req, res) => {  //não preciso de definir /person porque estou a fazê-lo no index.js com app.use('/person', personRoutes)

    //req.body
    const { name, salary, approved } = req.body //{name: "Rayana", salary: 5000, approved: false}

    if(!name) {                                 //validação para obrigar que pelo menos o campo "nome" seja preenchido
        res.status(422).json({error: 'O nome é obrigatório!'}) //422 - erros de sistema quando o recurso não é processado com sucesso
        return                                  //convém adicionar isto para a função parar por aqui
    }

    const person = {                            //estrutura
        name,
        salary,
        approved,
    }

    try {                                       // try - só cria se não der erro
        await Person.create(person)             // create - método do mongoose para criarmos dados no sistema)
                                                //ao contrário do modelo relacional de base de dados, não preciso de definir colunas aqui

        res.status(201).json({message: 'Pessoa inserida no sistema com sucesso'})
                                                //quero que devolva uma mensagem para saber que os dados foram inseridos
                                                //201 - dado enviado com sucesso (código de status de respostas HTTP: estes códigos são os definidos por padrão)

    } catch (error) {                           //catch - se falhar
        res.status(500).json({error: error})    //erro de servidor que estamos a enviar só mesmo para testar
    }
})

// READ - leitura de dados (GET)                
                                                // Função que lê todos os registos Person (People) =====================
router.get('/', async(req, res) =>{             //mesma estrutura do (POST), mas muda o verbo para (GET)
    try{
        const people = await Person.find()      //método usado para garantir que encontro todos os lados da colection (people - plural de person)
        res.status(200).json(people)            //200 - pedido executado com sucesso (people vai mostrar todos os dados)
    } catch (error){
        res.status(500).json({error: error}) 
    }
})
                                                // Função que lê apenas um registo Person, através do id ================
router.get('/:id', async(req, res) =>{          // lê apenas um registo Person, através do id
    console.log(req)                            //mostra na consola     

    const id = req.params.id                    //extrair um único dado do requisição, pela url = req.params
    try{
        const person = await Person.findOne({ _id: id }) //findOne - especifica que só quero um dado 

        if(!person){                            //vamos validar a tentativa de leitura e devolver o tipo de erro 422
            res.status(422).json({message: 'Este utilizador não foi encontrado'})  // Se não encontrar nada, devolve uma mensagem
            return                              //não executa mais nenhuma linha
        }

        res.status(200).json(person)            //reparar que usamos person para o nome da variável porque só queremos um, não todos
    } catch (error){
       res.status(500).json({error: error}) 
    }
})

// UPDATE - actualização de dados (PUT, PATCH)  // PUT - Espera que se mande o objecto completo, para fazer a actualização do sistema
                                                // PATCH - É mais usado porque permite fazer uma actualização parcial (um dado específico)

router.patch('/:id', async (req, res) => {         // Função para actualizar através do ID //vai ser muito parecido com o que fizemos para ler através do parâmetro id (preciso de ler para actualizar osdados)
    const id = req.params.id                    // Recebe o parâmetro ID
    const { name, salary, approved } = req.body // a URL vai chegar com o nome do utilizador e com os dados que precisam de ser actualizados

    const person = {                             //vamos criar o nosso objecto novamente
        name,
        salary,
        approved,
    }

    try {                                       //await - porque é uma função assíncrona  // updateOne - é um método típico do mongoose e mongoDB
        const updatedPerson = await Person.updateOne({ _id : id}, person)  //passo o id como 1º parâmetro, mas agora também tenho que enviar o novo dado

        console.log(updatedPerson)

        if(updatedPerson.matchedCount === 0) {  //se houve 0 registos actualizados é porque o ID não foi encontrado (pois o ID é o parametro de busca da função)
            res.status(422).json({message: 'Este utilizador não foi encontrado'})
            return                              //não executa mais nenhuma linha
        }

        res.status(200).json(person)
    } catch (error){
        res.status(500).json({error: error}) 
    }
})

// DELETE - apagar dados (DELETE) 
router.delete('/:id', async (req, res) => {

    const id = req.params.id
    
    const person = await Person.findOne({ _id: id }) //findOne - especifica que só quero um dado 

    if(!person){                                    //vamos validar a tentativa de leitura e devolver o tipo de erro 422
        res.status(422).json({message: 'Este utilizador não foi encontrado'})  // Se não encontrar nada, devolve uma mensagem
        return                                      //não executa mais nenhuma linha
    }

    try{
        await Person.deleteOne({_id: id})           //é aqui que efectivamente se processa o delete
        res.status(200).json({mensagem: 'Utilizador removido com sucesso'})

    } catch (error){
        res.status(500).json({error: error}) 
    }

})

module.exports = router                             //exporto para poder usar isto no index.js