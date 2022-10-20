import { Telegraf } from "telegraf";
interface Kanal {
  id: number;
  name: string;
  telegramId: number;
  type: string;
  userId: number;
  proyektId: number;
  activ: boolean;
}
interface Tarif {
  id: number;
  name: string;
  userId: number;
  proyektId: number;
  activ: boolean;
}
const db = require("../model/index");
const Project = db.proyekt;
const Tarif = db.tarif;
const Kanal = db.channel;
class botFather {
  token: string;
  fatherBot: any;
  constructor(token: string, fatherBot: any) {
    this.token = token;
    this.fatherBot = fatherBot;
  }
  async start() {
    let kanal = {
      id: 1,
      name: "test",
      telegramId: 1,
      type: "channel",
      userId: 1,
      proyektId: 1,
      activ: true,
    } as Kanal;
    let tarif = {
      id: 1,
      name: "test",
      userId: 1,
      proyektId: 1,
      activ: true,
    } as Tarif;

    const bot = new Telegraf(this.token);
    bot.start(async (ctx: any) => {
      console.log(ctx);
      const token = ctx.telegram.token;
      const project = await Project.findOne({
        where: {
          token: token,
        },
      });
      tarif = await Tarif.findOne({
        where: {
          proyektId: project.id,
        },
      });
      kanal = await Kanal.findOne({
        where: {
          proyektId: project.id,
        },
      });
      const text = `Assalomu alaykum Men quydagi ${tarif.name} tarifni ishlataman. ${kanal.type}im ${kanal.name} ${kanal.type}i.${kanal.name}imizga ulanish uchun qiyidagi ishlarni bajaring.`;
      const id = ctx.update.message.from.id;
      const name =
        ctx.update.message.from.username || ctx.update.message.from.first_name;
      ctx.telegram.sendMessage(id, text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: `Tarif: ${tarif.name}`, callback_data: `${tarif.name}` }],
            [{ text: "Tarifni bekor qilish", callback_data: "cancel" }],
          ],
        },
      });
    });
    console.log(tarif);
    bot.action(`${tarif.name}`, async (ctx) => {
      console.log("e kalla");
      console.log(ctx);
    });
    bot.action("cancel", async (ctx) => {
      const id = ctx.update.callback_query.from.id;
      const name =
        ctx.update.callback_query.from.username ||
        ctx.update.callback_query.from.first_name;
      const text = `Sizning <b> <i>${kanal.name}</i></b> ${kanal.type}ingizga ulanish bekor qilindi`;
      ctx.telegram.sendMessage(id, text, {
        parse_mode: "HTML",
      });
    });
    bot.on("callback_query", async (ctx) => {
      const id = ctx.update.callback_query.from.id;
      const data = ctx.update.callback_query.data;

      const updateId = String(ctx.update.callback_query.id);
      const messageId: number = Number(
        ctx.update.callback_query.message?.message_id
      );
      if (data == tarif.name) {
        const link = await this.fatherBot.telegram.createChatInviteLink(
          kanal.telegramId,
          kanal.name,
          10000,
          1
        );
        const linl = await this.fatherBot.telegram.exportChatInviteLink(
          kanal.telegramId,
          kanal.name,
          10000,
          1
        );
        ctx.telegram.editMessageText(
          id,
          messageId,
          updateId,
          `Kanalga ulanishingiz mumkin!!!`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `Tarif: ${tarif.name}`,
                    url: `${linl}`,
                  },
                ],
                [{ text: "Tarifni bekor qilish", callback_data: "cancel" }],
              ],
            },
          }
        );
      }
    });

    bot.launch();
  }
}

module.exports = botFather;
