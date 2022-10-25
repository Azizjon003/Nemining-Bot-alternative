import { Telegraf, Composer, session, Scenes } from "telegraf";
import dotenv from "dotenv";
import cli, { xterm } from "cli-color";
import fs from "fs";
import { userInfo } from "os";
const botFather = require("./utility/botfather");
const db = require("./model/index");
const User = db.user;
const proyekt = db.proyekt;
const Tarif = db.tarif;
const Payment = db.payment;
const Channel = db.channel;
const xato = require("./utility/kerakli");
interface forward_from {
  id: bigint;
  title: string;
  is_bot: boolean;
  username: string;
  first_name: string;
}

/** Composerlarni FUnksiya Funksiya qilib Olayapman*/
const newPro = require("./controller/newProyekt");
const newProyekts = require("./controller/newWizart");
const proyektOptions = require("./controller/proyektOption");
const Options = require("./controller/option");
const Connections = require("./controller/Connection");
const Tarifs = require("./controller/tarif");
const tarifNames = require("./controller/tarifName");

dotenv.config({ path: ".env" });
require("./model");

const TOKEN = String(process.env.TOKEN);

const bot = new Telegraf(TOKEN);

const newWizart = new Composer();

newWizart.action("cancel", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  await ctx.deleteMessage(messageId);
  await ctx.telegram.sendMessage(id, "ты в главном меню");
  return ctx.wizard.selectStep(0);
});
newWizart.hears("Помощь", async (ctx: any) => {
  await newProyekts.Yordam(ctx);
});
newWizart.hears("Проекты", async (ctx) => {
  await newProyekts.Proyektlar(ctx, User, proyekt);
});
newWizart.hears("Платежи", async (ctx: any) => {
  await newProyekts.Tolovlar(ctx, User, Payment);
});
newWizart.hears("Настройки", async (ctx) => {
  await newProyekts.Sozlamalar(ctx);
});
newWizart.hears(/\b[a-zA-Z0-9]/, async (ctx: any) => {
  await xato(ctx);
});
const newProyekt = new Composer();
newProyekt.action("cancel", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  await ctx.deleteMessage(messageId);
  await ctx.telegram.sendMessage(id, "ты в главном меню");
  return ctx.wizard.selectStep(0);
});
newProyekt.action("newproyekt", async (ctx: any) => {
  await newPro.newProject(ctx);
});
newProyekt.action("editproyekt", async (ctx: any) => {
  await newPro.editProyekt(ctx, User, proyekt);
});
newProyekt.action(/\btarif/, async (ctx: any) => {
  await newPro.tarifEdit(ctx, User, proyekt, Tarif);
});
newProyekt.on("callback_query", async (ctx: any) => {
  await newPro.callBackFunc(ctx, User, proyekt);
});
newProyekt.hears(/\b[a-zA-Z0-9]/gu, async (ctx: any) => {
  await newPro.xatolar(ctx);
});
const proyektOption = new Composer();
proyektOption.action("money", async (ctx: any) => {
  await proyektOptions.Money(ctx);
});
proyektOption.action("donat", async (ctx: any) => {
  await proyektOptions.Donat(ctx);
});
proyektOption.action("cancel", async (ctx: any) => {
  await proyektOptions.Cancels(ctx, User);
});
proyektOption.action(/\btarif/, async (ctx: any) => {
  await proyektOptions.editTarifOption(ctx, User, proyekt, Tarif);
});
proyektOption.action(/\bname/, async (ctx: any) => {
  await proyektOptions.editTarifName(ctx, Tarif, User);
});
proyektOption.action(/\bprice/, async (ctx: any) => {
  await proyektOptions.editTarifPrice(ctx, Tarif, User);
});
proyektOption.action(/\btime/, async (ctx: any) => {
  await proyektOptions.editTarifTime(ctx, Tarif, User);
});

proyektOption.on("text", async (ctx: any) => {
  await newPro.editName(ctx, User, proyekt);
});

proyektOption.hears(/\b[a-zA-Z0-9]+/gu, async (ctx: any) => {
  await newPro.xatolar(ctx);
});
const option = new Composer();
option.on("text", async (ctx: any) => {
  await Options.TextFunction(ctx, User, proyekt);
});
option.action("cancel", async (ctx: any) => {
  await Options.Cancel(ctx, User);
});
option.action("channel", async (ctx: any) => {
  await Options.Channel(ctx, User);
});

option.action("group", async (ctx: any) => {
  await Options.Group(ctx, User);
});
option.action("back", async (ctx: any, User) => {
  await Options.Back(ctx);
});

const Connection = new Composer();

Connection.on("text", async (ctx: any) => {
  Connections.TextFunc(ctx, User, proyekt, Channel);
});

Connection.action("newTarif", async (ctx: any) => {
  await Connections.newTarif(ctx);
});
Connection.action("cancel", async (ctx: any) => {
  await Connections.Cancel(ctx);
});

const tarif = new Composer();
tarif.on("callback_query", async (ctx: any) => {
  await Tarifs.calBack(ctx, User, proyekt, Tarif);
});

const tarifName = new Composer();
tarifName.on("text", async (ctx: any) => {
  await tarifNames.textFunc(ctx, User, Tarif);
});

const currency = new Composer();
const currencys = require("./controller/currency.ts");
currency.action("cancel", async (ctx: any) => {
  await currencys.Cancel(ctx);
});
currency.on("text", async (ctx: any) => {
  await currencys.textFunc(ctx, User, Tarif);
});

const description = new Composer();
const descript = require("./controller/description.ts");
description.on("callback_query", async (ctx: any) => {
  await descript.callBack(ctx, User, Tarif, Channel);
});

const botConfirm = new Composer();
const botConfirms = require("./controller/botConfirm");
botConfirm.action("newtarif", async (ctx: any) => {
  await botConfirms.newTarif(ctx);
});
botConfirm.action("cancel", async (ctx: any) => {
  await Connections.Cancel(ctx);
});
botConfirm.on("callback_query", async (ctx: any) => {
  await botConfirms.callBack(ctx);
});

const editTarifOption = new Composer();
editTarifOption.action("cancel", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  await ctx.telegram.sendMessage(id, "Siz bosh menyudasiz");
  await User.update(
    {
      editTarif: null,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );
  ctx.wizard.selectStep(0);
});
editTarifOption.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const message = ctx.update.message.text;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const shart = user.editTarif.split(":")[0];
  if (shart == "name") {
    const tarifId = user.editTarif.split(":")[1];
    const tarifUpdate = await Tarif.update(
      {
        name: message,
      },
      {
        where: {
          id: tarifId,
        },
      }
    );

    await User.update(
      {
        editTarif: null,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    await ctx.telegram.sendMessage(
      id,
      "Название тарифа успешно изменено Вы находитесь в главном меню"
    );

    return ctx.wizard.selectStep(0);
  }
  if (shart == "price") {
    const tarifId = user.editTarif.split(":")[1];
    if (!Number(message)) {
      return ctx.telegram.sendMessage(id, "Введено неверное значение");
    }
    const tarifUpdate = await Tarif.update(
      {
        price: message,
      },
      {
        where: {
          id: tarifId,
        },
      }
    );

    await User.update(
      {
        editTarif: null,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    await ctx.telegram.sendMessage(
      id,
      "Стоимость тарифа успешно изменена Вы находитесь в главном меню"
    );
    return ctx.wizard.selectStep(0);
  }
  if (shart == "time") {
    const tarifId = user.editTarif.split(":")[1];
    if (!Number(message)) {
      return ctx.telegram.sendMessage(id, "Введено неверное значение");
    }
    const tarifUpdate = await Tarif.update(
      {
        expires: message,
      },
      {
        where: {
          id: tarifId,
        },
      }
    );

    await User.update(
      {
        editTarif: null,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    await ctx.telegram.sendMessage(
      id,
      "Тарифное время успешно изменено Вы находитесь в главном меню"
    );
    return ctx.wizard.selectStep(0);
  }
});
const editProjectName = new Composer();
editProjectName.action("cancel", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  await ctx.telegram.sendMessage(id, "Вы находитесь в главном меню");
  await User.update(
    {
      editTarif: null,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );
  ctx.wizard.selectStep(0);
});
editProjectName.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const message = ctx.update.message.text;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const proyektId = user.editTarif;
  console.log(user);
  const projectUpdate = await proyekt.update(
    {
      name: message,
    },
    {
      where: {
        id: proyektId,
      },
    }
  );

  await ctx.telegram.sendMessage(
    id,
    "Название проекта успешно изменено. Вы находитесь в главном меню."
  );
  return ctx.wizard.selectStep(0);
});
const tolov = new Composer();
tolov.action("cancel", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  await ctx.telegram.sendMessage(id, "Вы находитесь в главном меню");
  await User.update(
    {
      editTarif: null,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );
  ctx.wizard.selectStep(0);
});
tolov.action("kartatarif", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    "Введите номер карты",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Отмена", callback_data: "cancel" }]],
      },
    }
  );
  User.update(
    {
      editTarif: `payment:name`,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );
});

tolov.action("kartaraqam", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    "Введите номер карты",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "bekor Qilish", callback_data: "cancel" }]],
      },
    }
  );
  User.update(
    {
      editTarif: `payment:cardNum`,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );
});

tolov.action("email", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  await ctx.telegram.editMessageText(
    id,
    messageId,
    updateId,
    " Введите адрес электронной почты",
    {
      reply_markup: {
        inline_keyboard: [[{ text: "Отмена", callback_data: "cancel" }]],
      },
    }
  );
  User.update(
    {
      editTarif: "payment:email",
    },
    {
      where: {
        telegramId: id,
      },
    }
  );
});
tolov.action(/\bupdate/, async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const text = `Какую часть вы меняете:`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Изменение тарифа карты", callback_data: "kartatarif" }],
        [{ text: "Изменить номер карты", callback_data: "kartaraqam" }],
        [
          {
            text: "Измените свой адрес электронной почты",
            callback_data: "email",
          },
        ],
        [{ text: "Отмена", callback_data: "cancel" }],
      ],
    },
  });
});

tolov.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const message = ctx.update.message.text;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const shart = user.editTarif?.split(":")[0];
  if (!shart) {
    await ctx.telegram.sendMessage(
      id,
      "Что-то пошло не так Вы находитесь в главном меню"
    );
    return ctx.wizard.selectStep(0);
  }
  if (shart == "payment") {
    const pay = await Payment.findOne({
      where: {
        id: user.paymentId,
      },
    });
    const shart1 = user.editTarif.split(":")[1];
    if (shart1 == "name") {
      if (pay) {
        Payment.update(
          {
            tarif: message,
          },
          {
            where: {
              id: user.paymentId,
            },
          }
        );
        await ctx.telegram.sendMessage(
          id,
          "изменения сохранены. Вы находитесь в главном меню"
        );
        await User.update(
          {
            editTarif: null,
          },
          {
            where: {
              telegramId: id,
            },
          }
        );
        return ctx.wizard.selectStep(0);
      }
      let payment = await Payment.create({
        tarif: message,
      });
      let upt = await User.update(
        {
          paymentId: payment.id,
          editTarif: "payment:cardNum",
        },
        {
          where: {
            telegramId: id,
          },
        }
      );

      await ctx.telegram.sendMessage(
        id,
        "изменения сохранены. Вы находитесь в главном меню",
        {
          remove_keyboard: true,
        }
      );
    }

    if (shart1 == "cardNum") {
      if (pay) {
        Payment.update(
          {
            cardNum: message,
          },
          {
            where: {
              id: user.paymentId,
            },
          }
        );
        await ctx.telegram.sendMessage(
          id,
          "изменения сохранены. Вы находитесь в главном меню"
        );
        await User.update(
          {
            editTarif: null,
          },
          {
            where: {
              telegramId: id,
            },
          }
        );
        return ctx.wizard.selectStep(0);
      }
      let payment = await Payment.update(
        {
          cardNum: message,
        },
        {
          where: {
            id: user.paymentId,
          },
        }
      );
      let upt = await User.update(
        {
          editTarif: "payment:email",
        },
        {
          where: {
            telegramId: id,
          },
        }
      );

      await ctx.telegram.sendMessage(
        id,
        "Изменения сохранены Теперь вам нужно ввести свой адрес электронной почты"
      );
    }

    if (shart1 == "email") {
      if (pay) {
        Payment.update(
          {
            email: message,
          },
          {
            where: {
              id: user.paymentId,
            },
          }
        );
        await ctx.telegram.sendMessage(
          id,
          "Изменения сохранены, вы находитесь в главном меню"
        );

        await User.update(
          {
            editTarif: null,
          },
          {
            where: {
              telegramId: id,
            },
          }
        );
        return ctx.wizard.selectStep(0);
      }
      let payment = await Payment.update(
        {
          email: message,
        },
        {
          where: {
            id: user.paymentId,
          },
        }
      );
      let upt = await User.update(
        {
          editTarif: "payment:email",
        },
        {
          where: {
            telegramId: id,
          },
        }
      );
      const users = await Payment.findOne({
        where: { id: user.paymentId },
      });

      await ctx.telegram.sendMessage(
        id,
        `Изменения сохранены\n 1. О тарифе ${users.tarif} \n 2. Номер карты ${users.cardNum} \n 3. Ваш адрес электронной почты ${users.email}`
      );
      await ctx.telegram.sendMessage(id, "Вы находитесь в главном меню");
      return ctx.wizard.selectStep(0);
    }
  }
});
const botAdd = new Composer();
botAdd.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const message = ctx.update.message.text;
  try {
    // console.log(message);
    const botullo = new botFather(message, bot);
    botullo.start();

    const user = await User.findOne({ where: { telegramId: id, activ: true } });
    console.log(user);
    const project = await proyekt.findAll({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });
    console.log(project);

    const projectId = project[0].dataValues.id;
    const projectUpdate = await proyekt.update(
      {
        token: message,
      },
      {
        where: {
          id: projectId,
        },
      }
    );

    await ctx.telegram.sendMessage(
      id,
      "Bot tokeni muvaffaqiyatli saqlandi",
      {}
    );
  } catch (e) {
    return await ctx.telegram.sendMessage(id, "Bot tokeni noto'g'ri kiritildi");
  }

  return ctx.scene.enter("sceneWizard");
});
const menuSchema: any = new Scenes.WizardScene(
  "sceneWizard",
  newWizart,
  newProyekt,
  proyektOption,
  option,
  Connection,
  tarif,
  tarifName,
  currency,
  description,
  botConfirm,
  editTarifOption,
  editProjectName,
  tolov,
  botAdd
);

const stage: any = new Scenes.Stage([menuSchema]);
bot.use(session());
bot.use(stage.middleware());
const start = require("./controller/start");
bot.start(async (ctx: any) => {
  await start.start(ctx, User);
});
const mychat = require("./controller/mychat");

bot.on("my_chat_member", async (ctx: any) => {
  await mychat.mychat(ctx, User, Channel);
});
bot.catch((error: any) => {
  console.log(cli.red(error.stack));
  bot.telegram.sendMessage("1953925296", String(error.message));
});
console.log("Bot is running");
bot.launch();
