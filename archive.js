function render() {
    const messageImage = document.getElementById("messages");
    messageImage.replaceChildren();

    let data = Object.keys(localStorage);
    console.log(data)

 
  for (const paragraph of data) {
    
    if (paragraph) {
      console.log("generating", paragraph);
      const tagText = document.createElement("p");

      tagText.addEventListener("click", async function () {
        window.location.href=`story.html?prompt=${paragraph}`;
      })

      tagText.innerHTML = paragraph;
      messageImage.appendChild(tagText);
    }
  }
}

render();
