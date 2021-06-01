const TestController = (req, res) => {
	return res.status(200).json('Test Controller succesful!');
};

module.exports = { TestController };
