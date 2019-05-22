function send(response) {
	return response
		? { status: 'success', data: response }
		: { status: 'failed', data: null };
}


module.exports = {
	send  
};