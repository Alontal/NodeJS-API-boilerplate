const dotenv = require("dotenv");
const { logger } = require(".");
const path = require("path"),
  fs = require("fs");

// check what env needed to start app.
logger.warn(
  `loading settings for ${process.env.NODE_ENV ||
    "demo - (NO ENV FILE FOUND!, please create .env.debug && .env.production. (see .env.demo for example)"} `
);
if (!process.env.NODE_ENV || process.env.NODE_ENV === "debug") {
  // check if there is no '.debug.env' file then use demo one
  // demo file DO NOT includes in .gitignore therefore it must be replaced !
  const ENV_PATH = path.resolve(__dirname, "..", "..", ".env.debug");
  const isEnv = fs.existsSync(ENV_PATH);
  let env = dotenv.config({
    path: isEnv ? ENV_PATH : path.resolve(__dirname, "..", "..", ".env.demo")
  }); //load debug env
  if (env.error) {
    throw Error(env.error);
  }
}
