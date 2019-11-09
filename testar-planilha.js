const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const {promisify} = require('util')

// Transformar metodos assincronos em promise

const addRowToSheet = async() => {
    const doc = new GoogleSpreadsheet('1NLkjeuHLeCdSU7WxVww0zDuYY4GDDghQX-38a2dAw_4')
    // retorno da promise seguido da sua execucao
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('planilha aberta')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)
    ({
        nome: 'Bruno', 
        email: 'bruno@bruno.com',
        classificacao: '0',
        reproducao: '0',
        saida_esperada: '0',
        saida_recebida: '0'
    })
}

addRowToSheet()

// const doc = new GoogleSpreadsheet('1NLkjeuHLeCdSU7WxVww0zDuYY4GDDghQX-38a2dAw_4')
// doc.useServiceAccountAuth(credentials, (err) => {
//     if(err) {
//         console.log('nao foi possivel abrir a planilha')
//     } else {
//         console.log('planilha aberta')
//         doc.getInfo((err, info) => {
//             // console.log(info)
//             const worksheet = info.worksheets[0]
//             worksheet.addRow({name: 'Bruno', email: 'test'}, err => {
//                 console.log('linha inserida')
//             })
//         })
//     }
// })

