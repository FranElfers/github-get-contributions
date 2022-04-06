const https = require('https')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const serverLog = t => console.log("[server]: " + t)

const getData = (user, year) => {
	let data = undefined
	
	const options = {
		"method": "GET",
		"hostname": "github.com",
		"path": `/users/${user}/contributions?from=${year}-01-01&to=${year}-12-30`,
		"headers": ""
	}

	return new Promise(resolve => {
		const request = https.request(options, response => {
			response.on("data", chunk => {
				if (data === undefined) {
					chunk = chunk
						.toString()
						.split('<h2 class="f4 text-normal mb-2">')[1]
						.split('contributions')[0]
						.trim()
					data = parseInt(chunk)
					resolve(data)
				}
			})
		})
		request.end()
	}) 
}

const asyncCall = async function(user, from, to) {
	let totalContributions = 0
	let years = {}
	
	for (let i = from; i <= to; i++) {
		let data = await getData(user, i)
		years[i] = data || 0
		totalContributions += data
	}
	return {
		totalContributions,
		...years
	}
}

app.get('/', (req,res) => {
	let error = '', message = 'no errors'
	const currentYear = (new Date()).getFullYear()
	let from = parseInt(req.query.from)
	let to = parseInt(req.query.to)
	const user = req.query.user
	
	if (!from || !to || !user) {
		error = 'Queries missing, format: ?user=<user>&from=<startingYear>&to=<endingYear>'
	}
	
	if (from > to) {
		messaje = `${from} is not bigger than ${to}, doing instead ${to} to ${from}`
	}

	if (from < 2010) {
		from = 2010
		message = `"from" must be > 2010, doing instead ${currentYear}`
	}

	if (to > currentYear) {
		to = currentYear
		message = `"to" must be < ${currentYear}, doing instead ${currentYear}`
	}

	if (error) return res.send({error})

	asyncCall(user, Math.min(from,to), Math.max(from,to)).then(data => {
		serverLog('total', data.totalContributions)
		res.send({ message, ...data })
	})

})


app.listen(PORT, () => {
	serverLog('Running on ' + PORT)
})
