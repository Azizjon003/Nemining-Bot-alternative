import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
const text = ``;
const TOKEN = String(process.env.TOKEN);
const bot = new Telegraf(TOKEN);
bot.start((ctx) => {
  const name = ctx.update.message.from.first_name;
  const id = ctx.update.message.from.id;
  ctx.telegram.sendMessage(
    id,
    `🖐 Xush kelibsiz, ${name}! Kanalni monetizatsiya qilish haqida o'ylab ko'rganmisiz? Yoki xayr-ehsonlarni ulashni xohlaysizmi? :)`,
    {
      reply_markup: {
        keyboard: [
          [{ text: "Proyektlar" }, { text: "To'lovlar" }],
          [{ text: "Sozlamalar" }, { text: "Yordam" }],
        ],
        resize_keyboard: true,
      },
    }
  );
});
bot.hears(/h|Hi/g, (ctx) => {
  const id = ctx.update.message.from.id;
  ctx.telegram.sendMessage(id, "Salom Senga Shahanshoh");
});
bot.launch();
