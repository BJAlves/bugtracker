const express = require('express')
const app = express()
// path faz parte do core do node
const path = require('path')
// tratamento de informacao do formulario
const bodyParser = require('body-parser')

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

// configuracoes
const docId = '1NLkjeuHLeCdSU7WxVww0zDuYY4GDDghQX-38a2dAw_4'
const worksheetIndex = 0

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))
// habilitacao de parser de vetores e objetos
app.use(bodyParser.urlencoded({extended: true}))

// caminho completo das views
console.log(path.resolve(__dirname, 'views')) 

app.get('/', (request, response) => {
    response.render('home')
})

app.post('/', (request, response) => {
    const doc = new GoogleSpreadsheet(docId)
    doc.useServiceAccountAuth(credentials, (err) => {
        if(err) {
            console.log('nao foi possivel abrir a planilha')
        } else {
            console.log('planilha aberta')
            doc.getInfo((err, info) => {
                // console.log(info)
                const worksheet = info.worksheets[worksheetIndex]
                worksheet.addRow({
                    nome: request.body.name, 
                    email: request.body.email,
                    classificacao: request.body.issueType,
                    reproducao: request.body.howToReproduce,
                    saida_esperada: request.body.expectedOutput,
                    saida_recebida: request.body.receivedOutput
                }, err => {
                    response.send('bug reportado com sucesso!')
                    console.log('linha inserida')
                })
            })
        }
    })   
})

app.get('/soma', (request, response) => {
    const a = parseInt(request.query.a)
    const b = parseInt(request.query.b)
    const soma = a + b
    response.send('<h1>A soma é: ' + soma + '</h1>')
})

app.listen(3000, (err) => {
    if(err) {
        console.log('aconteceu um erro', err)
    } else {
        console.log('bugtracker rodando em http://localhost:3000')
    }
})