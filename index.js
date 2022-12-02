const {
  Telegraf
} = require('telegraf');
const {
  GetLastAdv
} = require('./function');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync("config.json"))



// create bot
const bot = new Telegraf(config.token);

// start command
bot.command('start', ctx => {
  // reply greet msg
  ctx.reply(
      `Salam, ${ctx.from.first_name} mən tap.az-dan yeni ev elanı olduqca onu sənə gondərəcəm.`
  );
  // recursion settime out every 1 min
  setTimeout(async function repeatFunc() {
      // await data from tap.az
      const advData = await GetLastAdv();
      // if new data avaliable send
      if (advData) {
          ctx.reply(`Adi: ${advData.advName} \nQiymet: ${advData.advPrice} \nTime: ${advData.advAddedTime} \n${advData.advLink}`);
      }
      // run func after 1 min
      setTimeout(repeatFunc, 10000);
      return;
  }, 10000);
});

// default hears reply
bot.hears(RegExp(/^.*/g), ctx => {
  ctx.reply(`Üzr istəyirəm ${ctx.from.first_name}, amma nəyi nəzərdə tutduğunuzu anlamıram hələki :(`);
});

// error handler
bot.catch(err => {
  console.log('Ooops ', err);
});

// start
bot.startPolling()