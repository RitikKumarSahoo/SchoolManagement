require("dotenv").config();
const express = require("express");
const axios = require("axios");

module.exports = {
  async profile(req, res) {
    try {
      const response = await axios.get("https://api.linkedin.com/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        },
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching profile data from LinkedIn",
        Error: error.message,
      });
    }
  },
};
