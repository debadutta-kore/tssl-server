module.exports = (schema) => {
  return (req, res, next) => {
    try {
      schema.validateSync(req.body, { abortEarly: true });
      next();
    } catch (err) {
      res.status(400).send({message: err.message});
    }
  }
}