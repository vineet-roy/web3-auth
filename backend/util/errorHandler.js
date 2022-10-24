class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

const handleError = (err, res) => {
    const { message } = err;
    res.json({
        error: true,
        message,
        data: null
    });
};

module.exports = {
    ErrorHandler,
    handleError
  }