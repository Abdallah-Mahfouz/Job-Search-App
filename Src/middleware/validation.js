const dataMethod = ["body", "query", "params", "headers", "file", "files"];
//!================================================
export const validation = (schema) => {
  return (req, res, next) => {
    // Initialize an empty array to collect validation errors
    let arrayError = [];

    dataMethod.forEach((Key) => {
      // Check if the schema for the current key exists
      if (schema[Key]) {
        const data = schema[Key].validate(req[Key], {
          abortEarly: false,
        });
        // If there are validation errors,collect them and push them to the array
        if (data.error) {
          data.error.details.forEach((err) => {
            arrayError.push(err.message);
          });
        }
      }
    });
    //===============
    // If there are any collected errors, respond with a status and the error messages
    if (arrayError.length) {
      return res
        .status(400)
        .json({ msg: "validation error", errors: arrayError });
    }
    //===============
    next();
  };
};
