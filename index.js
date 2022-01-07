const fetch = require("node-fetch")
const fs = require("fs")
const prompt = require("prompt-sync")()
const downloadBeatmap = async (urls) => {
	console.log("downloading beatmaps ...")
	for (let i = 0; i < urls.length; i++) {
		console.log("downloading "+urls[i])
		const beatmap = await fetch("https://beatconnect.io/b/"+urls[i]+"", {
			"headers": {
				"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"accept-language": "en-US,en;q=0.9,fr;q=0.8,it;q=0.7",
				"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": "\"Windows\"",
				"sec-fetch-dest": "document",
				"sec-fetch-mode": "navigate",
				"sec-fetch-site": "same-origin",
				"sec-fetch-user": "?1",
				"upgrade-insecure-requests": "1",
				"Referrer-Policy": "strict-origin-when-cross-origin"
			},
			"body": null,
			"method": "GET"
		});
		console.log(beatmap.status)
		const beatmapFile = fs.createWriteStream(`./beatmaps/${urls[i]}.osz`)
		beatmap.body.pipe(beatmapFile)
	}
}


const extractBeatmaps = async (obj) => {
	const beatmaps = []
	for (let i = 0; i < obj["beatmapsets"].length; i++) {
		beatmaps.push(obj["beatmapsets"][i]["id"])
	}
	console.log("extracting beatmaps ...")
	downloadBeatmap(beatmaps)
}


const getcollection = async (n) => {
	const test = fetch("https://osucollector.com/api/collections/"+n, {
		"headers": {
			"accept": "application/json, text/plain, */*",
			"accept-language": "en-US,en;q=0.9,fr;q=0.8,it;q=0.7",
			"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"Referer": "https://osucollector.com/collections/1838",
			"Referrer-Policy": "strict-origin-when-cross-origin"
		},
		"body": null,
		"method": "GET"
	})
	
		.then(res => res.text())
		.then(text => {
			try {
				
				console.log("map list downloaded")
				extractBeatmaps(JSON.parse(text))
			} catch (e) {
				console.log(text)
			}
		})
	
}

(async() => {
	const collections = await getcollection(prompt("collection id: "))
})()