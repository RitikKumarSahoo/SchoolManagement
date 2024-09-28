const School = require("../../models/school");

module.exports = {
  async Post(req, res) {
    try {
      const response = await School.create(req.body);

      res.status(201).json({
        message: "School created successfully",
        response,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error creating school",
        error: error.message,
      });
    }
  },
};
