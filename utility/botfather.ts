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
const TarifUser = db.tarifUser;
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
      const text = `Привет. <code>Мой ${kanal.type}</code> <code>${kanal.name}</code> ${kanal.type}i.<code>Подключиться к нашему ${kanal.name}</code > сделать следующее для`;
      const id = ctx.update.message.from.id;

      let connectUsers = await ConnectUser.findOne({
        where: {
          telegramId: id,
        },
      });
      const name =
        ctx.update.message.from.username || ctx.update.message.from.first_name;
      if (!connectUsers) {
        connectUsers = await ConnectUser.create({
          telegramId: id,
          name: name,
          proyektId: project.id,
          channelId: kanal.id,
        });
      }
      console.log(connectUsers);
      const tarifUse = await TarifUser.findAll({
        where: {
          connectUserId: connectUsers?.id,
          proyektId: project.id,
        },
      });

      if (tarifUse) {
        for (let i = 0; i < tarifUse.length; i++) {
          tarif = tarif.filter((item) => item.id !== tarifUse[i].tarifId);
        }
      }

      const arr: any[] = [];
      tarif.forEach((tarif) => {
        const obj: objects = {
          text: tarif.name,
          callback_data: String(tarif.id),
        };

        arr.push(obj);
      });

      ctx.telegram.sendMessage(id, text, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            arr,
            [{ text: "Отмена тарифа", callback_data: "cancel" }],
          ],
        },
      });
    });
    bot.action(/\bok/, async (ctx: any) => {
      const id = ctx.update.callback_query.from.id;
      const data = ctx.update.callback_query.data.split(":")[1];

      const connectUser = await ConnectUser.findOne({
        where: {
          telegramId: data,
        },
      });
      const tarifId = connectUser.editTarif.split(":")[1];
      const tarif = await Tarif.findOne({
        where: {
          id: tarifId,
        },
      });

      const expires = new Date().getTime() + tarif.expires * 60 * 60 * 1000;

      ConnectUser.update(
        {
          expiresDate: expires,
        },
        {
          where: {
            telegramId: data,
          },
        }
      );

      ctx.telegram.sendMessage(id, "Тариф успешно подключен");

      const tarifUsers = await TarifUser.create({
        connectUserId: connectUser.id,
        tarifId: tarif.id,
        proyektId: tarif.proyektId,
      });

      await ctx.telegram.sendMessage(
        data,
        "Вы были одобрены администратором. Пожалуйста, подождите несколько секунд, и мы вышлем вам необходимую информацию"
      );

      const chatLink = await this.fatherBot.telegram.createChatInviteLink(
        kanal.telegramId,
        {
          member_limit: 1,
        }
      );

      await ctx.telegram.sendMessage(data, `Ваша ссылка на ${kanal.name}`, {
        reply_markup: {
          inline_keyboard: [[{ text: "Перейти", url: chatLink.invite_link }]],
        },
      });

      await ctx.telegram.sendMessage(id, "Пользователь принят");
    });

    bot.action(/\bban/, async (ctx) => {
      const id = ctx.update.callback_query.from.id;
      const data = String(ctx.update.callback_query.data?.split(":")[1]);
      await ctx.telegram.sendMessage(
        data,
        `Ваша ссылка на ${kanal.name}.Is banned`,
        {}
      );
      await ctx.telegram.sendMessage(id, "Пользователь забанен");
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
      const tariflar = await Tarif.findOne({
        where: {
          id: data.split("-")[1],
        },
      });
      console.log(tariflar);

      if (!tariflar) {
        return await ctx.telegram.sendMessage(id, "Tarif topilmadi");
      }
      if (!payment) {
        return await ctx.telegram.sendMessage(id, "Payment qismini qo'shing");
      }

      let text = `Вы выбрали тариф <code>${tariflar.name}</code>. <code>${tariflar.name}</code>\n стоимость тарифа <code>${tariflar.price}</code> указана в сумах.\n <code>${tariflar.name}</code> . \nЗаполните информацию о карте, используя <i>${payment.tarif}</i>\n.\n CardNum <code>${payment.cardNum}</code>. Отправьте скриншот платежа. Мы отправим администратору и дождаться одобрения.`;
      ctx.telegram.editMessageText(id, messageId, updateId, text, {
        parse_mode: "HTML",
      });
    });
    bot.action("cancel", async (ctx) => {
      const id = ctx.update.callback_query.from.id;
      const name =
        ctx.update.callback_query.from.username ||
        ctx.update.callback_query.from.first_name;
      const text = `Подключение к вашему <b> <i>${kanal.name}</i></b> ${kanal.type} отменено`;
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

        ConnectUser.update(
          {
            editTarif: `tarifId:${tarif.id}`,
          },
          {
            where: {
              telegramId: id,
            },
          }
        );

        const text = `Ваш <b> <i>${kanal.name}</i></b> ${
          kanal.type
        }для подключения к вашему <b>${tarif.name}
        </b> вы выбрали тариф. Ваш <b>${tarif.name}
        </b> для подключения к вашему тарифу <b>${
          tarif.price
        } </b> сумов необходимо оплатить. Срок ${
          tarif.expires / 24
        } день. Нажмите кнопку ниже, чтобы оплатить:`;
        ctx.telegram.editMessageText(id, messageId, updateId, text, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "платить",
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
        caption: `Отправить информацию, которую ваш <b><i>${kanal.name}</i></b> заплатил за подключение к ${kanal.type} UserId <b>${id})</b>. Вы принять оплату.`,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Подтверждение", callback_data: `ok:${id}` }],
            [{ text: "Не подтверждать", callback_data: `ban:${id}` }],
          ],
        },
      });

      await ctx.telegram.sendMessage(
        id,
        "Платежная информация отправлена. Ожидает подтверждения"
      );
    });
    bot.catch((error: any) => {
      console.log(error);
      bot.telegram.sendMessage("1953925296", String(error.message));
    });
    bot.launch();
  }
}
// new botFather(
//   "5431137389:AAFraDHaa7CzCAwhj6z9z5sp9_PDtPc3q44",
//   botFather
// ).start();
module.exports = botFather;
