import { Telegraf } from "telegraf";
const db = require("../model/index");
const Project = db.proyekt;
const Tarif = db.tarif;
const Kanal = db.kanal;
class botFather {
  token: string;
  constructor(token: string) {
    this.token = token;
  }
  start() {
    const bot = new Telegraf(this.token);
    bot.start(async (ctx: any) => {
      console.log(ctx);
      const token = ctx.telegram.token;
      const project = await Project.findOne({
        where: {
          token: token,
        },
      });
      const tarif = await Tarif.findOne({
        where: {
          proyectId: project.id,
        },
      });
      const kanal = await Kanal.findOne({
        where: {
          proyectId: project.id,
        },
      });
      const text = `Assalomu alaykum Men quydagi ${tarif.name} tarifni ishlataman. ${kanal.type}im ${kanal.name} ${kanal.type}i.${kanal.name}imizga ulanish uchun qiyidagi ishlarni bajaring.`;
      const id = ctx.update.message.from.id;
      const name =
        ctx.update.message.from.username || ctx.update.message.from.first_name;
      ctx.telegram.sendMessage(id, text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: `Tarif: ${tarif.name}`, calback_data: `${tarif.name}` }],
            [{}],
          ],
        },
      });
    });
    bot.launch();
  }
}

module.exports = botFather;
