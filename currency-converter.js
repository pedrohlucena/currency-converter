const axios = require('axios')

const apiLayerKey = '5yzFDHFZHmuaNZZTBC1KDneJyRdIR7bG'
const countryLayerKey = '7917520ab96a3849a53802a1033e239e'

const config = { headers: { apikey: apiLayerKey } }

const getExchangeRate = async (fromCurrency, toCurrency) => {
    const response = await axios.get(`https://api.apilayer.com/currency_data/convert?to=${toCurrency}&from=${fromCurrency}&amount=1`, config)
    const exchangeRate = response.data.result
    if(isNaN(exchangeRate)) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`)
    }
    return exchangeRate
}

const getCountries = async (toCurrency) => {
    try {
        const response = await axios.get(`http://api.countrylayer.com/v2/currency/${toCurrency}?access_key=${countryLayerKey}`)
        const completedCountriesArray = response.data
        const countryNamesArray = completedCountriesArray.map(country => ` ${country.name}`)
        return countryNamesArray
    } catch (error) {
        throw new Error(`Unable to get countries that use ${toCurrency} `)
    }
}

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const countries = await getCountries(toCurrency)
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency)
    const convertedAmount = (amount * exchangeRate).toFixed(2)

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}` +
            `\nYou can spent these in the following countries:${countries}`
}

convertCurrency('USD', 'CAD', 90)
    .then(message => console.log(message))
    .catch(error => console.log(error.message))