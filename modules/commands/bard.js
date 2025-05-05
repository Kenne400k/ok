module.exports.config = {
  name: "gpt",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Fumio",
  description: "GPT4",
  commandCategory: "group",
  usages: "[Script]",
  cooldowns: 5,
  usePrefix: false,
};
var axios = require("axios");
var api_key = "";
async function chat(messages) {
 // console.log(messages)
  var apikey = require("./data/apikey.json");
  var token = apikey[Math.floor(Math.random()*apikey.length)];
  var key = token.token[Math.floor(Math.random()*token.token.length)];
 // console.log(key)


  const options = {
    method: 'POST',
    url: 'https://chatgpt-api8.p.rapidapi.com/',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key':key,
    'X-RapidAPI-Host': 'chatgpt-api8.p.rapidapi.com'
  },
    data:messages
  };

  try {
    const response = await axios.request(options);  
   // console.log(response.data);
    return response
  } catch (error) {
    console.error(error);
  }
}
module.exports.run = async function ({
  api,
  event: e,
  args,
  Threads,
  Users,
  Currencies,
  models,
}) {
  try{
  var query =
    e.type === "message_reply"
      ? args.join(" ") + ' "' + e.messageReply.body + '"'
      : args.join(" ");

  var encodedQuery = encodeURIComponent(query);

  let messages = [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: query },
  ];

  var response = await chat(messages);

  let message = { role: "assistant",
                 content: response.data.text}

  var result = response.data.text;

  try {
    return api.sendMessage(
      result,
      e.threadID,
      (err, res) => (
        messages.push(message),
        (res.name = exports.config.name),
        (res.messages = messages),
        global.client.handleReply.push(res)
      ),
    );
  } catch (error) {
    console.error(error);

    api.sendMessage(result, e.threadID);
  }
  } catch(e) {console.log(e)}
};

module.exports.handleReply = async (o) => {
  let messages = o.handleReply.messages;

  messages.push({ role: "user", content: o.event.body });
//console.log(messages)
  let res = await chat(messages);

  let message = { role: "assistant",
       content: res.data.text}
;

  o.api.sendMessage(
    res.data.text,
    o.event.threadID,
    (err, res) => (
      messages.push(message),
      (res.name = exports.config.name),
      (res.messages = messages),
      global.client.handleReply.push(res)
    ),
    o.event.messageID,
  );

  // console.log(message.content)
};
