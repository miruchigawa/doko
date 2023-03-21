// Import the necessary libraries
import { NlpManager } from "node-nlp";

// Create an instance of the NlpManager and specify the languages to use and enable the Named Entity Recognition (NER) feature
const manager = new NlpManager({ 
  languages: ['en'], 
  forceNER: true 
});

// Add the utterances and intents for the NLP
manager.addDocument('en', 'goodbye for now', 'greetings.bye');
manager.addDocument('en', 'bye bye take care', 'greetings.bye');
manager.addDocument('en', 'okay see you later', 'greetings.bye');
manager.addDocument('en', 'bye for now', 'greetings.bye');
manager.addDocument('en', 'i must go', 'greetings.bye');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'howdy', 'greetings.hello');
manager.addDocument('en', 'what is your name', 'bot.identity');
manager.addDocument('en', 'who are you', 'bot.identity');
manager.addDocument('en', 'what can you do', 'bot.capabilities');
manager.addDocument('en', 'tell me a joke', 'bot.humor');
manager.addDocument('en', 'what time is it', 'bot.time');
manager.addDocument('en', 'what is the weather like today', 'bot.weather');
manager.addDocument('en', 'can you set a reminder for me', 'bot.reminder');
manager.addDocument('en', 'i love you', 'bot.feeling');
manager.addDocument('en', 'tell me a fun fact', 'bot.funfact');

// Train also the NLG
manager.addAnswer('en', 'greetings.bye', 'Till next time');
manager.addAnswer('en', 'greetings.bye', 'see you soon!');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Hello!!');
manager.addAnswer('en', 'greetings.hello', 'Hi, The weather is nice today');
manager.addAnswer('en', 'bot.identity', 'I am a chatbot created by Rexuint Inc.');
manager.addAnswer('en', 'bot.capabilities', 'I can answer your questions and help with tasks such as setting reminders, checking the weather, and more!');
manager.addAnswer('en', 'bot.humor', 'Why did the tomato turn red? Because it saw the salad dressing!');
manager.addAnswer('en', 'bot.time', `It's currently ${new Date().toLocaleTimeString()}`);
manager.addAnswer('en', 'bot.weather', 'The weather is currently sunny with a high of 75 degrees Fahrenheit');
manager.addAnswer('en', 'bot.reminder', 'Sure, what would you like me to remind you of and when?');
manager.addAnswer('en', 'bot.funfact', 'Did you know that a group of flamingos is called a flamboyance?');
manager.addAnswer('en', 'bot.feeling', 'I love you too muchhh');

// Train and save the model.
(async () => {
  await manager.train();
  manager.save();

  // Test the model with a sample input
  const response = await manager.process('en', 'What can you do?');
  console.log(response);
})();
