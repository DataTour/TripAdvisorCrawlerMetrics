const express = require('express')

const app = express()

const cheeiro = require('cheerio')

const rp = require('request-promise')

const cors = require('cors')

const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).json({ success: 'Booking Api online' })
})

app.get('/v1', async(req, res) => {
    const url = req.query.url 

    try {

        const config = {
            uri: url,
            transform: async function(body) {
                return await cheeiro.load(body)
            }
        } 

        rp(config).then($ => {
            const name = $('._1mTlpMC3').text()
            const address = $('span').find('.jke2_wbp').first().text()
            const rating = parseFloat($('._3cjYfwwQ').text().replace(',', '.')) * 2
            const votes = []

            $('._3gEj_Jb5').each((i, item) => {
                const vote = $(item).find('._3fVK8yi6').text()
                votes.push(vote)
            })



            res.status(200).json({
                name,
                address,
                rating,
                votes: {
                    fantastic: parseFloat(votes[0]),
                    good: parseFloat(votes[1]),
                    ok: parseFloat(votes[2]),
                    bad: parseFloat(votes[3]),
                    very_bad: parseFloat(votes[4])
                }
                
            })
        })

    } catch (error) {
        res.status(400).json({ error })
    }

})

app.listen(3003)