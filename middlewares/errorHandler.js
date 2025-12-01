const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    const status = err.statusCode || 500;

    res.status(status).json({
        status: "error",
        message:
          status === 500 && process.env.NODE_ENV === "production"
            ? "Internal server"
            : err.message
    })
}

export default errorHandler;