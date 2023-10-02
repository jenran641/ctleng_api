const isEmplty = (data) => {
    return data === undefined || data === null || (typeof(data) === 'string' && data.length === 0 ) || (typeof(data) === 'object' && Object.keys(data) === 0)
}

module.exports = {
    isEmplty
}