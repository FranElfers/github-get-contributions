const https = require('https')

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
	let total = 0
	
	for (let i = from; i <= to; i++) {
		let data = await getData(user, i)
		console.log(i, data || 0)
		total += data
	}
	return total
}

asyncCall('FranElfers', 2021, 2022).then(res => console.log('total',res))