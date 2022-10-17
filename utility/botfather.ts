import { Telegraf } from "telegraf";
class botFather {
  token: string;
  constructor(token: string) {
    this.token = token;
  }
  start() {
    const bot = new Telegraf(this.token);
    bot.start((ctx) => ctx.reply("Welcome E kalla"));
    bot.launch();
  }
}

module.exports = botFather;
