import { OpenAI } from "https://cdn.jsdelivr.net/npm/openai@4.68.4/+esm";

let running = false;
let data = []
let previousPrompt = "";
let story = "";

const openai = new OpenAI({
  apiKey:
    "API_KEY_HERE",
  dangerouslyAllowBrowser: true,
});

// Function to generate an image
async function generateImage(prompt) {
  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: `In a cohesive style of a cartoon draw this: ${prompt}`,
    n: 1,
    size: "256x256",
  });
  return response.data[0].url;
}

// Function to generate text
async function generateText(prompt) {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Finish each response in three paragraphs. End each paragraph with a new line character.",
      },
      {
        role: "user",
        content: `Continue this story: Once upon a time.... ${prompt}. The whole story should just be three paragraphs, make sure to split the pragraphs by a new line`,
      },
    ],
    model: "gpt-4o-mini",
  });
  console.log(response);
  return response.choices[0].message.content;
}

async function generateStory(prompt) {
  console.log(prompt);

  // Split the paragraph
  const lines = prompt.split("\n");
  data = [];

  for (const paragraph of lines) {
    if (paragraph) {
      console.log("generating", paragraph);
      let imageURL = await generateImage(paragraph);
      data.push({
        image: imageURL,
        text: paragraph
      }
      )
    }
  }


  render();
}


function render() {
    const messageImage = document.getElementById("messages");
    messageImage.replaceChildren();

 
  for (const paragraph of data) {
    if (paragraph) {
      console.log("generating", paragraph);
      const tagImage = document.createElement("img");
      const tagText = document.createElement("p");

      tagText.innerHTML = paragraph.text;
      messageImage.appendChild(tagText);
      tagImage.src = paragraph.image;
      messageImage.appendChild(tagImage);
    }
  }
}

document
  .getElementById("generateTextBtn")
  .addEventListener("click", async function () {


    if (!running) {
      running = true;
      const textPrompt = document.getElementById("textPromptInput").value;
      previousPrompt = document.getElementById("textPromptInput").value;

      document.getElementById("textPromptInput").value = "Generating...";
      const res = await generateText(textPrompt);
      story = res;
      await generateStory(res);
      running = false;
      document.getElementById("textPromptInput").value = "";
    }
  });




document
.getElementById("archiveButton")
.addEventListener("click", async function () {
    save();
});


function save() {
    localStorage.setItem(previousPrompt.slice(0,36), JSON.stringify(data));
    console.log(localStorage);
}


const urlParams = new URLSearchParams(window.location.search);
let myParam = urlParams.get("prompt");
if (myParam && !running) {
    running = true;
    myParam = decodeURI(myParam);
    console.log(myParam, localStorage);
    data = JSON.parse(localStorage.getItem(myParam));
    story  = data[0].text;
    render();
    running = false;
}

document
.getElementById("readButton")
.addEventListener("click", async function () {
  var msg = new SpeechSynthesisUtterance();
  console.log(msg, window.speechSynthesis);
  msg.text = story;
  window.speechSynthesis.speak(msg);

});

document
.getElementById("stopButton")
.addEventListener("click", async function () {
  window.speechSynthesis.cancel();
});