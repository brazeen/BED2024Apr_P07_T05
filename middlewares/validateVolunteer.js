const Joi = require("joi");

const validateVolunteer = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    bio: Joi.string().max(255).required(),
    dateofbirth: Joi.date().less('now').required(),
    password: Joi.string().min(3).required(),
  }, { unknown: true });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    console.error(errors)
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateVolunteer;
