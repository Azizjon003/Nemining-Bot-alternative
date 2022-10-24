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
interface Tarifs {
  id: number;
  name: string;
  userId: number;
  proyektId: number;
  activ: boolean;
}
interface objects {
  text: string;
  callback_data: string;
}
const db = require("../model/index");
const Project = db.proyekt;
const Tarif = db.tarif;
const Kanal = db.channel;
const Users = db.user;
const ConnectUser = db.connectUser;
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
    let tarif: Tarifs[] = [
      {
        id: 1,
        name: "test",
        userId: 1,
        proyektId: 1,
        activ: true,
      },
    ];

    const bot = new Telegraf(this.token);
    bot.start(async (ctx: any) => {
      console.log(ctx);
      const token = ctx.telegram.token;
      const project = await Project.findOne({
        where: {
          token: token,
        },
      });
      tarif = await Tarif.findAll({
        where: {
          proyektId: project.id,
        },
      });
      kanal = await Kanal.findOne({
        where: {
          proyektId: project.id,
        },
      });
      const text = `Assalomu alaykum. <code>${kanal.type}im</code> <code>${kanal.name}</code> ${kanal.type}i.<code>${kanal.name}imizga</code> ulanish uchun qiyidagi ishlarni bajaring.`;

      const arr: any[] = [];
      tarif.forEach((tarif) => {
        const obj: objects = {
          text: tarif.name,
          callback_data: String(tarif.id),
        };

        arr.push(obj);
      });

      const id = ctx.update.message.from.id;
      const name =
        ctx.update.message.from.username || ctx.update.message.from.first_name;
      const connectUsers = await ConnectUser.findOne({
        where: {
          telegramId: id,
        },
      });
      if (!connectUsers) {
        const connectUser = await ConnectUser.create({
          telegramId: id,
          name: name,
          proyektId: project.id,
          kanalId: kanal.id,
        });
      }
      ctx.telegram.sendMessage(id, text, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            arr,
            [{ text: "Tarifni bekor qilish", callback_data: "cancel" }],
          ],
        },
      });
    });
    bot.action(/\bok/, async (ctx: any) => {
      const id = ctx.update.callback_query.from.id;
      const data = ctx.update.callback_query.data;

      const connectUser = await ConnectUser.findOne({
        where: {
          telegramId: id,
        },
      });
    });
    bot.action(/\bpay/, async (ctx: any) => {
      const id = ctx.update.callback_query.from.id;
      const data = ctx.update.callback_query.data.split(":")[1];
      const updateId = String(ctx.update.callback_query.id);
      const messageId: number = Number(
        ctx.update.callback_query.message?.message_id
      );

      const user = await Users.findOne({
        where: {
          id: data.split("-")[0],
        },
      });
      const payment = await db.payment.findOne({
        where: {
          id: user.paymentId,
        },
      });
      const tarif = await Tarif.findOne({
        where: {
          id: data.split("-")[1],
        },
      });

      let text = `Siz <code>${tarif.name}</code> tarifini tanladingiz. <code>${tarif.name}</code>\n tarifining narxi <code>${tarif.price}</code> so'm.\n <code>${tarif.name}</code>.\nKarta ma'lumotlarini <i>${payment.tarif}</i>\n orqali to'ldiring.\n CardNum <code>${payment.cardNum}</code>.Qilgan to'lovingizni screenshot qilib yuboring.Biz adminga yuboramiz va tasdiqlanishi kutiladi.`;
      ctx.telegram.editMessageText(id, messageId, updateId, text, {
        parse_mode: "HTML",
      });
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
      if (Number(data)) {
        const tarifId = Number(data);
        const tarif = await Tarif.findOne({
          where: {
            id: tarifId,
          },
        });
        const text = `Sizning <b> <i>${kanal.name}</i></b> ${
          kanal.type
        }ingizga ulanish uchun <b>${
          tarif.name
        }</b> tarifni tanladingiz. Sizning <b>${
          tarif.name
        }</b> tarifingizga ulanish uchun <b>${
          tarif.price
        }</b> so'm pul to'lash kerak.Muddati ${
          tarif.expires / 24
        } kun.To'lash uchun quyidagi tugmani bosing.`;
        ctx.telegram.editMessageText(id, messageId, updateId, text, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "To'lash",
                  callback_data: `pay:${tarif.userId}-${tarif.id}`,
                },
              ],
            ],
          },
        });
      }
    });

    bot.on("photo", async (ctx) => {
      const id = ctx.update.message.from.id;
      console.log(ctx.update.message.photo);
      const photo = ctx.update.message.photo[2];
      const link = await ctx.telegram.getFileLink(photo.file_id);
      console.log(link.href);
      const userId = kanal.userId;
      const user = await Users.findOne({
        where: {
          id: userId,
        },
      });
      await ctx.telegram.sendPhoto(user.telegramId, photo.file_id, {
        caption: `Sizning <b> <i>${kanal.name}</i></b> ${kanal.type}ingizga ulanish uchun to'lov qilgani haqida ma'lumot yubordo UserId <b>${id})</b>.To'lovni qabul qilasizmi.`,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Tasdiqlash", callback_data: `ok:${id}` }],
            [{ text: "Tasdiqlanmasin", callback_data: `cancel:${id}` }],
          ],
        },
      });

      await ctx.telegram.sendMessage(
        id,
        "To'lov haqida ma'lumot yuborildi.Tasdiqlanishi kutilmoqda"
      );
    });
    bot.launch();
  }
}

new botFather(
  "5431137389:AAFraDHaa7CzCAwhj6z9z5sp9_PDtPc3q44",
  botFather
).start();
module.exports = botFather;
