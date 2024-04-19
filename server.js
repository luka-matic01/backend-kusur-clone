const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tenantRoutes = require("./routes/tenantRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/tenant", tenantRoutes);

// Define routes here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
