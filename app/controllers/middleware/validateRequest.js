import { validate } from 'joi';

const validator = (joiSchema, validationType) => (req, res, next) => {
  // validation type must be body, query or params
  // if validation type is not spesified, set body as default type
  const type = validationType || 'body';
  // get the requst object that will be validated
  const data = req[type];

  validate(
    data,
    joiSchema,
    // stripUnknown is removing extra fields from request data
    // in other words, stripUnknown normalizes request data
    { abortEarly: false, stripUnknown: true },
    (err, normalizedData) => {
      // if validation fails
      if (err) {
        // send a 422 error response
        res.status(422).json({
          status: 'error',
          message: 'Invalid request data',
          // map details array to collect error messages
          errors: err.details.map(e => e.message)
        });
      } else {
        // replace request data with normalized data
        req[type] = normalizedData;
        next();
      }
    }
  );
};

export default validator;
