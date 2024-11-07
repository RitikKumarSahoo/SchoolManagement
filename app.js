const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const schema = require("./graphql/schemas/index");
const resolver = require("./graphql/resolvers/index");

require("dotenv").config();

const agenda = require("./agenda");
require("./agenda/agenda_jobs")(agenda);

const restRouter = require("./routes/rest");
const webRouter = require("./routes/web");

// Import GraphQL type definitions and resolvers

const app = express();
const port = process.env.PORT || 3000;

// Apply security-related middleware
if (process.env.NODE_ENV && process.env.NODE_ENV !== "development") {
  app.use(helmet());
}

app.use(cors());

// Database setup
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set up general middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up REST and web routes
app.use("/", webRouter);
app.use(`/api/v${process.env.API_VERSION}`, restRouter);

// Set up Apollo Server
const apolloServer = new ApolloServer({
  typeDefs: schema,
  resolvers: resolver,
});

async function startApolloServer() {
  await apolloServer.start();
  app.use("/graphql", expressMiddleware(apolloServer));

  // Start Agenda
  agenda.on("ready", async () => {
    console.log("Agenda starting...");
    await agenda.start();
    console.log("Agenda started.");
  });

  // Graceful shutdown
  async function gracefulShutdown() {
    await agenda.stop();
    console.log("Agenda stopped.");
    process.exit(0);
  }
  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);

  // Start HTTP server
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });
}

// Handle errors and start Apollo server
startApolloServer().catch((error) => {
  console.error("Error starting server:", error);
});
