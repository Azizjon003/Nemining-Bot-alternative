const { Telegraf, Composer, Scenes, session, Context } = require("telegraf");
const dotnv = require("dotenv");
dotnv.config({ path: "config.env" });
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
// const start = require("./controller/start");
// const help = require("./controller/help");
const state = {};
const TOKEN = process.env.TOKEN;
// console.log(TOKEN);

const bot = new Telegraf(TOKEN);
// bot.setMyCommands([
//   { command: "/start", description: "botni ishga tushurish" },
// ]);
const startWiz = new Composer();
startWiz.on("text", async (msg) => {
  const about = await msg.update.message.from;
  // console.log(msg.update.message);
  const text = await msg.update.message.text;
  msg.telegram.sendMessage(
    about.id,
    `Salom qadrli ${about.first_name}  ☺️☺️☺️☺️ bizning tesb Botimizga xush kelibsiz  agar bizning botimizdan foydalanmoqchi bo'lsangiz ✅ yoki ❌ buyrug'idan foydalaning`,
    {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [[{ text: "Yes" }], [{ text: "No" }]],
        resize_keyboard: true,
        remove_keyboard: true,
      },
    }
  );
  return msg.wizard.next();
});
const fullName = new Composer();

fullName.on("text", async (msg) => {
  const about = await msg.update.message.from;
  const text = await msg.update.message.text;
  if (text === "Yes") {
    // console.log(msg);
    msg.telegram.sendMessage(about.id, "Ism familyangizni kiriting");
    return msg.wizard.next();
  } else if (text === "No") {
    msg.telegram.sendMessage(
      about.id,
      "Bizning botimizdan foydalaningiz uchun tashakkur"
    );
  }
});

const nameFull = new Composer();
nameFull.on("text", async (msg) => {
  const about = await msg.update.message.from;
  const text = await msg.update.message.text;
  if (!Number.isInteger(text) && text.length > 5) {
    msg.telegram.sendMessage(
      about.id,
      "Raxmat biz uchun raqamingiz ham kerak bo'ladi",
      {
        reply_markup: {
          remove_keyboard: true,
          one_time_keyboard: true,
          resize_keyboard: true,
          keyboard: [
            [{ text: "Telefon Raqamimni Ulash", request_contact: true }],
          ],
        },
      }
    );
    state.fullName = text;
    return msg.wizard.next();
  } else msg.telegram.sendMessage(about.id, "qayta uruning");
});

const number = new Composer();
number.on("contact", async (msg) => {
  const about = await msg.update.message.from;
  const number = await msg.update.message.contact.phone_number;
  state.number = number;
  await msg.telegram.sendMessage(about.id, "Sizning raqamingiz: " + number);
  msg.telegram.sendMessage(about.id, "Siz manzilingizni ham bizga yuboring", {
    reply_markup: {
      one_time_keyboard: true,
      remove_keyboard: true,
      resize_keyboard: true,
      keyboard: [[{ text: "Manzilimni ulash", request_location: true }]],
    },
  });
  // console.log(state);
  return msg.wizard.next();
});
const location = new Composer();
location.on("location", async (msg) => {
  const about = await msg.update.message.from;
  const location = await msg.update.message.location;
  state.location = location;
  await msg.telegram.sendMessage(about.id, "Sizning manzilingiz: " + location);
  msg.telegram.sendMessage(about.id, "Yoshiningizni ham bizga yuboring");
  return msg.wizard.next();
});

const age = new Composer();
age.on("text", async (msg) => {
  const about = await msg.update.message.from;
  const text = await msg.update.message.text;
  // console.log(text);
  if (isFinite(text) && text * 1 > 0 && text * 1 < 100) {
    state.age = text;
    await msg.telegram.sendMessage(about.id, "Sizning yoshiningiz: " + text);
    msg.telegram.sendMessage(about.id, "Dasturlash tillaridan birini tanlang", {
      reply_markup: {
        remove_keyboard: true,
        resize_keyboard: true,
        inline_keyboard: [
          [{ text: "JavaScript", callback_data: "Js" }],
          [{ text: "C++", callback_data: "c++" }],
          [{ text: "Python", callback_data: "py" }],
          [{ text: "Golang", callback_data: "go" }],
          [{ text: "Java", callback_data: "java" }],
          [{ text: "C#", callback_data: "c#" }],
          [{ text: "C", callback_data: "c" }],
          [{ text: "PHP", callback_data: "php" }],
          [{ text: "Ruby", callback_data: "ruby" }],
          [{ text: "Swift", callback_data: "swift" }],
          [{ text: "Kotlin", callback_data: "kotlin" }],
        ],
      },
    });

    // console.log(state);

    return msg.wizard.next();
  } else msg.telegram.sendMessage(about.id, "qayta uruning!!!");
});
const dasturlashTili = new Composer();
dasturlashTili.on("callback_query", async (msg) => {
  // console.log(state);
  // console.log(msg);
  const about = await msg.update.callback_query.from;
  const text = await msg.update.callback_query.data;
  state.dasturlashTili = text;
  await msg.telegram.sendMessage(
    about.id,
    `Sizning dasturlash tilini: ${text} tanladingiz`
  );

  await msg.telegram.sendMessage(about.id, "Sizning universitetingiz", {
    reply_markup: {
      resize_keyboard: true,
      inline_keyboard: [
        [{ text: "TATU", callback_data: "tatu" }],
        [{ text: "INHA", callback_data: "inha" }],
        [{ text: "O'zmu", callback_data: "o'zmu" }],
      ],
    },
  });

  msg.telegram.sendMessage(
    about.id,
    "Sizning Universitetingiz bu ro'yxatda bo'lmasa kiriting"
  );
  return msg.wizard.next();
});
const univers = new Composer();

univers.on("callback_query", async (msg) => {
  const about = await msg.update.callback_query.from;
  const text = await msg.update.callback_query.data;
  state.univers = text;

  msg.telegram.sendMessage(
    about.id,
    `Siz quyidagilarni kiritdingiz:\nFullname: ${state.fullName}\nRaqamingiz: ${state.number}\nYoshiningiz: ${state.age}\nDasturlash tilini: ${state.dasturlashTili}\nUniversitetingiz: ${state.univers}`,
    {
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        inline_keyboard: [[{ text: "Yuborish", callback_data: "yuborish" }]],
      },
    }
  );

  return msg.wizard.next();
});

univers.on("text", async (msg) => {
  const about = await msg.update.message.from;
  const text = await msg.update.message.text;

  state.univers = text;

  msg.telegram.sendMessage(
    about.id,
    `Siz quyidagilarni kiritdingiz:\nFullname: ${state.fullName}\nRaqamingiz: ${state.number}\nYoshiningiz: ${state.age}\nDasturlash tilini: ${state.dasturlashTili}\nUniversitetingiz: ${state.univers}`,
    {
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        inline_keyboard: [[{ text: "Yuborish", callback_data: "yuborish" }]],
      },
    }
  );

  state.univers = text;
  return msg.wizard.next();
});

const yuborish = new Composer();
yuborish.on("callback_query", async (msg) => {
  const about = await msg.update.callback_query.from;
  const text = await msg.update.callback_query.data;
  // console.log(about);
  const botSaqla = await require("./model/schema");

  state.telegramId = about.id;
  state.telegramUsername = about.username;

  const saqla = await botSaqla.create(state);

  msg.telegram.sendMessage(about.id, "Sizning Ma'lumotlaringiz saqlandi");
  return msg.wizard.next();
});
const menuScence = new Scenes.WizardScene(
  "sceneWizard",
  startWiz,
  fullName,
  nameFull,
  number,
  location,
  age,
  dasturlashTili,
  univers,
  yuborish
);
const stage = new Scenes.Stage([menuScence]);
bot.use(session());
bot.use(stage.middleware());

bot.command("start", (msg) => {
  msg.scene.enter("sceneWizard");
});

bot.launch();
