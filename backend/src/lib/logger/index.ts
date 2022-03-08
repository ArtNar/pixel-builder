import chalk from "chalk";
import { createSingleton } from "../../helpers/createSingleton";

type ErrorType = Error | unknown;

class Logger {
  getErrorMessage(value: ErrorType) {
    if (value && value instanceof Error) {
      return value?.message || value;
    }

    return value;
  }

  private log(message = "") {
    if (message) {
      console.log(`${message}`);
    }
  }

  info(message: ErrorType) {
    this.log(chalk.blue(this.getErrorMessage(message)));
  }

  success(message: ErrorType) {
    this.log(chalk.green(this.getErrorMessage(message)));
  }

  warn(message: ErrorType) {
    this.log(chalk.yellow(this.getErrorMessage(message)));
  }

  error(error: ErrorType) {
    this.log(chalk.red(this.getErrorMessage(error)));
  }
}

const LOGGER_KEY = "Logger";
export default createSingleton(global, LOGGER_KEY, () => {
  return new Logger();
});
