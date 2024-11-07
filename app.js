const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const http = require("http");

const typeDefs = require("./graphql/schemas/index");
const resolvers = require("./graphql/resolvers/index");

const agenda = require("./agenda");
require("./agenda/agenda_jobs")(agenda);

const restRouter = require("./routes/rest");
const webRouter = require("./routes/web");

const app = express(); // Ensure Express app is created here
const port = process.env.PORT || 3000;

// Apply security-related middleware
if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV !== "development"
) {
  app.use(helmet());
}

app.use(cors());

// Database setup
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Apply general middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up routes for REST and web
app.use("/", webRouter);
app.use(`/api/v${process.env.API_VERSION}`, restRouter);

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();
  app.use("/graphql", expressMiddleware(server));

  // Start the Agenda scheduler
  agenda.on("ready", async () => {
    console.log("Agenda starting -_-");
    await agenda.start();
    console.log("Agenda started ^_^");

    const cronJobs = require("./agenda/cron-jobs");
    await cronJobs(agenda);
  });

  // Handle server shutdown gracefully
  async function graceful() {
    await agenda.stop();
    console.log("\nAgenda stopped ^o^");
    process.exit(0);
  }

  process.on("SIGTERM", graceful);
  process.on("SIGINT", graceful);

  // Set up the error handling for unknown routes
  app.use((req, res, next) => {
    next(createError(404));
  });

  // Error handler
  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
  });

  // Create and start the HTTP server
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
}

// Start Apollo Server and Express app together
startServer().catch((err) => {
  console.error("Error starting server:", err);
});
