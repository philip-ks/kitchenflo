import express from "express";
import cors from "cors";

import routes from "./routes";

import analyticsRoutes
from "./modules/analytics/analytics.routes";

import {
  notFound,
  errorHandler,
} from "./middleware/error";

const app = express();

//
// CORS
//

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://kitchenflo-pi.vercel.app",
    ],

    credentials: true,
  })
);

//
// BODY PARSER
//

app.use(express.json());

//
// MAIN API ROUTES
//

app.use("/api", routes);

//
// ANALYTICS ROUTES
//

app.use(
  "/api/analytics",
  analyticsRoutes
);

//
// ERROR HANDLERS
//

app.use(notFound);

app.use(errorHandler);

export default app;