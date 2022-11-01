import { Telegraf, Composer, session, Scenes } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";
import cli, { xterm } from "cli-color";
import cron from "node-cron";
import fs from "fs";
const botFather = require("./utility/botfather");
const db = require("./model/index");
const User = db.user;
const proyekt = db.proyekt;
const Tarif = db.tarif;
const Payment = db.payment;
const Channel = db.channel;
const connectUser = db.connectUser;
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

// ...

// Backup a database at 11:59 PM every day.

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
newWizart.action("admin", async (ctx: any) => {
  await newProyekts.Admin(ctx, User);
});
newWizart.hears(/\b(?!start)\w+\b/, async (ctx: any) => {
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
tarif.on("text", async (ctx: any) => {
  const messageId: number = Number(ctx.message.message_id);
  await ctx.deleteMessage(messageId);
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
description.on("text", async (ctx: any) => {
  const messageId: number = Number(ctx.message.message_id);
  await ctx.deleteMessage(messageId);
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
botConfirm.on("text", async (ctx: any) => {
  const messageId: number = Number(ctx.message.message_id);
  await ctx.deleteMessage(messageId);
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
        inline_keyboard: [[{ text: "Otmena", callback_data: "cancel" }]],
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

      await ctx.telegram.sendMessage(id, "Введите номер карты", {
        remove_keyboard: true,
      });
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
    const url = `https://api.telegram.org/bot${message}/getMe`;
    const res = await axios.get(url);
    const data = res.data.ok;
    if (!data) {
      return await ctx.telegram.sendMessage(id, "Токен бота поддельный");
    }
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
      "Создан новый бот.\nИз этого бота вы можете поделиться с пользователями которые хотят присоединиться к вашему каналу.\nНажимаете запустить бота.\nИ вы увидите остальные",
      {}
    );
  } catch (e) {
    return await ctx.telegram.sendMessage(id, "Bot tokeni noto'g'ri kiritildi");
  }

  return ctx.wizard.selectStep(0);
});

const admin = new Composer();
admin.action("back", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  const text =
    "Использовать права администратора Просматривать пользователей Отключать или включать пользователей Просматривать статистику";
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
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Просмотр пользователей", callback_data: "users" }],
        [{ text: "Просмотр статистики", callback_data: "stat" }],
        [{ text: "Заблокировать пользователя", callback_data: "banuser" }],
      ],
    },
  });
});
admin.action("users", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );

  const usersData = await User.findAll({
    order: [["createdAt", "DESC"]],
  });
  let kattaTxt = `Foydalanuvchilar ro'yhati:`;
  usersData.forEach(
    (el: {
      id: string;
      username: string;
      telegramId: string;
      role: string;
      activ: boolean;
    }) => {
      let txt = `Id : <code>${el.id}</code>\t Name:<code>${
        el.username
      }</code>\t TelegramId:<code>${el.telegramId}</code> \t role :<i>${
        el.role
      }</i>\t activ:<b>${String(el.activ)}</b>`;
      console.log(txt);
      kattaTxt = kattaTxt + "\n" + txt + "\n";
    }
  );

  await ctx.telegram.sendMessage(id, kattaTxt, {
    parse_mode: "HTML",
  });
});
admin.action("stat", async (ctx: any) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );

  const dateToday = new Date().getTime() - 86400 * 1000;
  console.log(dateToday);
  const projectStat = await proyekt.findAll({
    where: {
      createdAt: { [db.Op.gte]: dateToday },
    },
  });
  console.log(projectStat);
  const users = await User.findAll();
  const kanal = await Channel.findAll();

  const txt = `Statistikalar:\nOxirgi yaratilgan proyektlar Soni:<i>${projectStat.length}</i>\n,Foydalanuvchilar Soni: <i>${users.length}</i>.\nBot ulangan Kanallar: <i>${kanal.length}</i>\n `;

  await ctx.telegram.sendMessage(id, txt, {
    parse_mode: "HTML",
  });
});

admin.action("banuser", async (ctx) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  await User.update(
    {
      editTarif: `banUser`,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );

  await ctx.telegram.sendMessage(id, "Введите идентификатор пользователя", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Назад",
            callback_data: "back",
          },
        ],
      ],
    },
  });
});

admin.action("adduser", async (ctx) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  await User.update(
    {
      editTarif: `addUser`,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );

  await ctx.telegram.sendMessage(id, "Введите идентификатор пользователя", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Назад",
            callback_data: "back",
          },
        ],
      ],
    },
  });
});

admin.action("addAdmin", async (ctx) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  await User.update(
    {
      editTarif: `addadmin`,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );

  await ctx.telegram.sendMessage(id, "Введите идентификатор пользователя", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Назад",
            callback_data: "back",
          },
        ],
      ],
    },
  });
});
admin.action("banAdmin", async (ctx) => {
  const id = ctx.update.callback_query.from.id;
  const updateId = String(ctx.update.callback_query.id);
  const messageId: number = Number(
    ctx.update.callback_query.message?.message_id
  );
  await User.update(
    {
      editTarif: `banadmin`,
    },
    {
      where: {
        telegramId: id,
      },
    }
  );

  await ctx.telegram.sendMessage(id, "Введите идентификатор пользователя", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Назад",
            callback_data: "back",
          },
        ],
      ],
    },
  });
});
admin.on("text", async (ctx: any) => {
  const id = ctx.update.message.from.id;

  const user = await User.findOne({
    where: {
      telegramId: id,
    },
  });

  const message = await ctx.message.text;
  const data = user.editTarif;
  if (data == "banUser") {
    if (Number(message)) {
      const user = await User.findOne({
        where: {
          id: message,
        },
      });

      if (!user) {
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
        await ctx.telegram.sendMessage(
          id,
          "Пользователь активен, вы находитесь на главной странице"
        );
        return;
      }

      await User.update(
        {
          activ: false,
        },
        {
          where: {
            id: message,
          },
        }
      );

      await ctx.telegram.sendMessage(
        id,
        "Пользователь заблокирован Вы находитесь в главном меню"
      );
      return ctx.scene.leave();
    }
    await ctx.telegram.sendMessage(id, "Введите число");
    return;
  }

  if (data == "addUser") {
    if (Number(message)) {
      const user = await User.findOne({
        where: {
          id: message,
        },
      });
      if (!user) {
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
        await ctx.telegram.sendMessage(
          id,
          "Пользователь активен, вы находитесь на главной странице"
        );
        return;
      }

      await User.update(
        {
          activ: true,
        },
        {
          where: {
            id: message,
          },
        }
      );

      await ctx.telegram.sendMessage(
        id,
        "Пользователь активен, вы находитесь на главной странице"
      );
      return ctx.scene.leave();
    }
    await ctx.telegram.sendMessage(id, "Введите число");
    return;
  }

  if (data == "addadmin") {
    if (Number(message)) {
      const user = await User.findOne({
        where: {
          id: message,
        },
      });
      if (!user) {
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
        await ctx.telegram.sendMessage(
          id,
          "Этот пользователь не существует. Повторите попытку. Нажмите Запретить пользователя еще раз."
        );
        return;
      }

      await User.update(
        {
          role: "admin",
        },
        {
          where: {
            id: message,
          },
        }
      );

      await ctx.telegram.sendMessage(
        id,
        "Пользователь активен, вы находитесь на главной странице"
      );
      return ctx.scene.leave();
    }
    await ctx.telegram.sendMessage(id, "Введите число");
    return;
  }

  if (data == "banadmin") {
    if (Number(message)) {
      const user = await User.findOne({
        where: {
          id: message,
        },
      });
      if (!user) {
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
        await ctx.telegram.sendMessage(
          id,
          "Этот пользователь не существует. Повторите попытку. Нажмите Запретить пользователя еще раз."
        );
        return;
      }

      await User.update(
        {
          role: "user",
        },
        {
          where: {
            id: message,
          },
        }
      );

      await ctx.telegram.sendMessage(
        id,
        "Пользователь активен, вы находитесь на главной странице"
      );
      return ctx.scene.leave();
    }
    await ctx.telegram.sendMessage(id, "Введите число");
    return;
  }
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
  botAdd,
  admin
);

const stage: any = new Scenes.Stage([menuSchema]);
bot.use(session());
bot.use(stage.middleware());
const start = require("./controller/start");
bot.start(async (ctx: any) => {
  await start.start(ctx, User);
});
const mychat = require("./controller/mychat");

cron.schedule("59 23 * * *", async function () {
  const Nowdate = new Date().getTime();
  const connectUsers = await connectUser.findAll({
    where: {
      activ: true,
      expiresDate: { [db.Op.lte]: Nowdate },
    },
    inlude: [
      {
        model: db.channel,
      },
    ],
  });

  for (let i = 0; i < connectUsers.length; i++) {
    const element = connectUsers[i].dataValues;
    const id = element.channel.dataValues.telegramId;
    const KanalId = element.channel.dataValues.telegramId;

    const shart1 = await bot.telegram.banChatMember(id, KanalId);
    if (shart1) {
      await connectUser.update({ activ: false }, { where: { id: element.id } });
      const shart2 = await bot.telegram.unbanChatMember(id, KanalId);
    }
  }
});
bot.on("my_chat_member", async (ctx: any) => {
  await mychat.mychat(ctx, User, Channel);
});
bot.catch((error: any) => {
  console.log(cli.red(error.stack));
  bot.telegram.sendMessage("1953925296", String(error.message));
});
// zerikkanFunksiya();
console.log("Bot is running");
bot.launch();
