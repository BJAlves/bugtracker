const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

const doc = new GoogleSpreadsheet('1NLkjeuHLeCdSU7WxVww0zDuYY4GDDghQX-38a2dAw_4')
doc.useServiceAccountAuth(credentials, (err) => {
    if(err) {
        console.log('nao foi possivel abrir a planilha')
    } else {
        console.log('planilha aberta')
        doc.getInfo((err, info) => {
            // console.log(info)
            const worksheet = info.worksheets[0]
            worksheet.addRow({name: 'Bruno', email: 'test'}, err => {
                console.log('linha inserida')
            })
        })
    }
})