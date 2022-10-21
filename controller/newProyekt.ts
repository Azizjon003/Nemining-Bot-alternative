const newProject = async (ctx: any) => {
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;

  const id = ctx.update.callback_query.from.id;

  const text = `💁🏻‍♂️ Siz qanday loyiha yaratmoqchisiz?\n- Pulli obuna: shaxsiy kanal yoki guruhingizga pullik obunani tashkil qilish\n- Donat: Donat qabul qilishni tashkil etish`;

  ctx.telegram.callB;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Pulli obuna", callback_data: "money" },
          { text: "Donat", callback_data: "donat" },
        ],
        [{ text: "Obunani Bekor qilish", callback_data: "cancel" }],
      ],
    },
  });
  return ctx.wizard.next();
};

const xatolar = async (ctx: any) => {
  const id = ctx.update.message.from.id;
  const txt = ctx.update.message.text;
  if (txt == "/start") {
    return ctx.scene.leave();
  }
  const text = `Bunaqa buyruq mavjud emas!.Loyiha yaratish uchun /start ni bosing`;
  await ctx.telegram.sendMessage(id, text, {});
};

const editProyekt = async (ctx: any, User: any, proyekt: any) => {
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  const id = ctx.update.callback_query.from.id;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const proyekts = await proyekt.findAll({
    where: { userId: user.id },
  });
  console.log(proyekts);

  let arr: {
    text: string;
    callback_data: string;
  }[][] = [];
  proyekts.forEach((item: any) => {
    let son = 0;
    let arrcha: {
      text: string;
      callback_data: string;
    }[] = [];
    if (son < 3) {
      arrcha.push({
        text: `${item.name}`,
        callback_data: `${item.id}`,
      });

      arr.push(arrcha);
      arrcha = [];
    } else {
      son = 0;
    }
    son++;
  });
  console.log(arr);

  const text = `O'zgartirmoqchi bo'lgan loyihangizni kiriting`;
  ctx.telegram.editMessageText(id, messageId, updateId, text, {
    reply_markup: {
      inline_keyboard: arr,
    },
  });
};
const callBackFunc = async (ctx: any, User: any, proyekt: any) => {
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  const id = ctx.update.callback_query.from.id;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const data = ctx.update.callback_query.data;
  if (Number(data)) {
    const proyekts = await proyekt.findOne({
      where: {
        id: data,
      },
    });

    let txt = `Proyekt nomi <b><i>${proyekts.name}</i></b>\n Qaysi qismini o'zgartirmoqchisiz?`;
    ctx.telegram.editMessageText(id, messageId, updateId, txt, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Proyekt nomi", callback_data: `name:${proyekts.id}` },
            { text: "Holati", callback_data: `status:${proyekts.id}` },
            {
              text: "Tariflarni ko'rish",
              callback_data: `tarif:${proyekts.id}`,
            },
          ],
        ],
      },
    });
  }

  if (data.includes("name")) {
    const proyektId = data.split(":")[1];
    const proyekts = await proyekt.findOne({
      where: {
        id: proyektId,
      },
    });

    let txt = `Proyekt nomini kiriting Hozirgi nomi ${proyekts.name}.Proyekt Nomini quyidagi holatda kiriting\n<b><i>Proyektnomi:Proyektyanginomi</i></b>`;

    ctx.telegram.editMessageText(id, messageId, updateId, txt, {
      parse_mode: "HTML",
    });

    return ctx.wizard.next();
  }
  if (data.includes("status")) {
    const proyektId = data.split(":")[1];
    const proyekts = await proyekt.findOne({
      where: {
        id: proyektId,
      },
    });

    let txt = `Proyekt statusini kiriting Hozirgi status ${proyekts.activ}`;

    ctx.telegram.editMessageText(id, messageId, updateId, txt, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Faol", callback_data: `true:${proyekts.id}` },
            { text: "Faol emas", callback_data: `false:${proyekts.id}` },
          ],
        ],
      },
    });
  }
  if (data.includes("true")) {
    const proyektId = data.split(":")[1];
    const proyekts = await proyekt.update(
      { activ: true },
      {
        where: {
          id: proyektId,
        },
      }
    );
    await ctx.telegram.editMessageText(
      id,
      messageId,
      updateId,
      "Status o'zgartirildi"
    );
    return ctx.scene.leave();
  }
  if (data.includes("false")) {
    const proyektId = data.split(":")[1];
    const proyekts = await proyekt.update(
      { activ: false },
      {
        where: {
          id: proyektId,
        },
      }
    );
    await ctx.telegram.editMessageText(
      id,
      messageId,
      updateId,
      "Status o'zgartirildi"
    );
    return ctx.scene.leave();
  }
};
const editName = async (ctx: any, User: any, proyekt: any) => {
  const id = ctx.update.message.from.id;
  const txt = ctx.update.message.text;
  console.log(txt);
  const name = txt.split(":")[0];
  const newName = txt.split(":")[1];
  const pro = await proyekt.findOne({
    where: {
      name: name,
    },
  });
  if (!pro) {
    await ctx.telegram.sendMessage(
      id,
      "Bunday proyekt mavjud emas,/start buyrug'ini bosing"
    );
    return ctx.scene.leave();
  }
  console.log(pro, newName);
  const newpro = await proyekt.update(
    {
      name: newName,
    },
    {
      where: {
        name: name,
      },
    }
  );

  ctx.telegram.sendMessage(id, "Proyekt nomi o'zgartirildi");
  return ctx.scene.leave();
};
const tarifEdit = async (ctx: any, User: any, proyekt: any, Tarif: any) => {
  const updateId = ctx.update.callback_query.id;
  const messageId = ctx.update.callback_query.message?.message_id;
  const id = ctx.update.callback_query.from.id;
  const user = await User.findOne({ where: { telegramId: id, activ: true } });
  const data = ctx.update.callback_query.data;
  const proyektId = data.split(":")[1];
  console.log(proyektId);
  const tarifs = await Tarif.findAll({
    where: {
      proyektId: proyektId,
    },
  });
  console.log(tarifs);
  let arr: {
    text: string;
    callback_data: string;
  }[][] = [];
  tarifs.forEach((item: any) => {
    let arrcha: { text: string; callback_data: string }[] = [];
    let son = 0;

    if (son < 3) {
      arrcha.push({
        text: String(item.name),
        callback_data: String(item.id),
      });

      arr.push(arrcha);
      arrcha = [];
    } else {
      son = 0;
      arrcha = [];
    }
    son++;
  });

  let txt = `Tariflarni tanlang: `;
  ctx.telegram.editMessageText(id, messageId, updateId, txt, {
    reply_markup: {
      inline_keyboard: arr,
    },
  });
  return ctx.wizard.next();
};
module.exports = {
  newProject,
  xatolar,
  editProyekt,
  callBackFunc,
  editName,
  tarifEdit,
};
