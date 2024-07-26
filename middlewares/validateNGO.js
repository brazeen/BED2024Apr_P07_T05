const Joi = require("joi");

const validateNGO = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    description: Joi.string().max(255).required(),
    contactperson: Joi.string().min(3).max(100).required(),
    contactnumber: Joi.string().pattern(/^[0-9]{7,15}$/).required(), //between 7 to 15 digit
    address: Joi.string().max(255).required()
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateNGO;
