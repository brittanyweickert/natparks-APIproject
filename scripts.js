const API_KEY = 'b6QiTCrcVkGQsPjHDXCwpnLLbHS6t8jCKTvO11V2'
const baseURL = 'https://developer.nps.gov/api/v1'

// WHY NOT WORKING!!???
// const options = {
// 	headers: new Headers({
// 		'X-Api-Key': API_KEY,
// 		Host: 'developer.nps.gov'
// 	})
// }

function getParksHTML(parks) {
	return parks.map((park, index) => {
		return `<article id="park-${index}">
			<h2>${park.fullName}</h2>
			<p>${park.description}<br><a href="${park.url}" target="_blank">${park.url}</a></p>
		</article>`
	})
}

function getParkResults(states, maxResults) {
	let params = {
		stateCode: states,
		limit: maxResults,
		api_key: API_KEY
	}

	const url = `${baseURL}/parks?${$.param(params)}`

	fetch(url)
		.then(response => {
			// the new code starts here
			if (response.ok) {
				return response.json()
			}

			throw new Error(response.statusText)
		})
		.then(parks => {
			console.log(parks)

			// clear the error
			$('#js-error-message').text('')

			// if repos is empty
			if (parks.data.length < 1) {
				console.log('empty repo')
				$('#js-error-message').text(`no parks!`)
			} else {
				const parksHTML = getParksHTML(parks.data)

				// unhide results section & render HTML
				$('#results').show()
				$('#results-list').html(parksHTML)
			}
		})
		.catch(err => {
			console.log('err!')
			$('#js-error-message').text(`Something went wrong: ${err.message}`)
		})
}

function handleSubmit() {
	$('.user-form').submit(function(event) {
		event.preventDefault()

		// clear results list.
		$('#results-list').empty()
		$('#results').hide()

		const states = $(this)
			.find('#states')
			.val()
			.replace(' ', '')

		const maxResults = $(this)
			.find('#max')
			.val()

		getParkResults(states, maxResults)
	})
}

$(() => {
	handleSubmit()
})
