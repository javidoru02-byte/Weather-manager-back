module.exports.validate = (schema) => async (req, res, next) => {
    const { body } = req;
    try {
        const validated = await schema.validate(body, { abortEarly: false });
        req.body = validated;
        next();
    } catch (error) {
        next(error);
    }
}
