const express = require('express')
const app = express()
// path faz parte do core do node
const path = require('path')
// tratamento de informacao do formulario
const bodyParser = require('body-parser')
// metodo promisify: faz parte do core do node
// pegando somente promisify de dentro do util
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')
const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

// configuracoes
const docId = '1NLkjeuHLeCdSU7WxVww0zDuYY4GDDghQX-38a2dAw_4'
const worksheetIndex = 0

const sendGridKey = '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'

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))
// habilitacao de parser de vetores e objetos
app.use(bodyParser.urlencoded({extended: true}))

// caminho completo das views
console.log(path.resolve(__dirname, 'views')) 

app.get('/', (request, response) => {
    response.render('home')
})

app.post('/', async(request, response) => {
    try {
        const doc = new GoogleSpreadsheet(docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        console.log('planilha aberta')
        const info = await promisify(doc.getInfo)()
        // console.log(info)
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)({
            name: request.body.name, 
            email: request.body.email,
            issueType: request.body.issueType,
            howToReproduce: request.body.howToReproduce,
            expectedOutput: request.body.expectedOutput,
            receivedOutput: request.body.receivedOutput,
            userAgent: request.body.userAgent,
            userDate: request.body.userDate,
            source: request.query.source || 'direct'
        })

        // se o bug for critico
        if(request.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sendGridKey);
            const msg = {
                to: 'bjalvesb@gmail.com',
                from: 'bjalvesb@gmail.com',
                subject: 'BUG crítico reportado',
                text: `
                    O usuário ${request.body.name} reportou um problema.
                `,
                html: `O usuário ${request.body.name} reportou um problema.`,
            };
            await sgMail.send(msg);
        }

        response.render('sucesso')
    } catch(err) {
        response.send('Erro ao enviar formulário')
        // pega o erro no provedor depois de subir para o servidor
        console.log(err)
    }     
})

app.listen(3000, (err) => {
    if(err) {
        console.log('aconteceu um erro', err)
    } else {
        console.log('bugtracker rodando em http://localhost:3000')
    }
})