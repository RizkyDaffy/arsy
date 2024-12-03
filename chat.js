document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector("#user-input");
  const sendButton = document.querySelector("#send-button");
  const chatContent = document.querySelector(".chat-content");

  async function fetchData() {
    const files = ["matematika.json", "k3lh.json", "jpn.json"];
    let allData = [];
    for (const file of files) {
      const response = await fetch(`./data/${file}`);
      const data = await response.json();
      allData = allData.concat(data);
    }
    return allData;
  }

  function findMatches(query, data) {
    return data.filter((item) =>
      item.soal.toLowerCase().includes(query.toLowerCase())
    );
  }

  function displayResults(query, results) {
    const chatContent = document.querySelector(".flex-1");
    chatContent.innerHTML = ""; 
  
    const userQueryDiv = document.createElement("div");
    userQueryDiv.className =
      "bg-pink-400 text-white font-bold p-2 rounded-lg mb-4 max-w-xs ml-auto";
    userQueryDiv.textContent = query;
    chatContent.appendChild(userQueryDiv);
  
    results.forEach((item) => {
      
      const answerDiv = document.createElement("div");
      answerDiv.className =
  "bg-white p-4 rounded-lg shadow-md max-w-xs mb-4";
answerDiv.innerHTML = `
  <p class="text-gray-700 font-bold">Soal:</p>
  <p class="text-gray-900 font-semibold mb-2">${item.soal}</p>
  <p class="text-blue-600 font-bold">${item.jawaban.replace(/\n/g, "<br>")}</p>
`;
      chatContent.appendChild(answerDiv);
  
      if (item.gambar) {
        const imageDiv = document.createElement("div");
        imageDiv.className =
          "bg-white p-4 rounded-lg shadow-md max-w-xs mt-4 mb-4 hover:shadow-lg transition-shadow";
        imageDiv.innerHTML = `<img src="${item.gambar}" alt="Image" class="rounded-lg"/>`;
        chatContent.appendChild(imageDiv);
      }
    });
  }

  
  function showLoadingMessage() {
    chatContent.innerHTML = ""; 
    const loadingDiv = document.createElement("div");
    loadingDiv.className =
      "bg-white text-black font-bold p-2 rounded-lg mb-4 max-w-xs ml-auto hover:bg-yellow-500 transition-colors";
    loadingDiv.textContent = "SEARCHING DATA...";
    chatContent.appendChild(loadingDiv);
  }

  function showNoDataMessage(query) {
    const noDataDiv = document.createElement("div");
    noDataDiv.className =
      "bg-red-500 text-white font-bold p-2 rounded-lg mb-4 max-w-xs ml-auto hover:bg-red-600 transition-colors";
    noDataDiv.textContent = `Data tidak ditemukan untuk "${query}".`;
    chatContent.appendChild(noDataDiv);
  }

  sendButton.addEventListener("click", async () => {
    const query = input.value.trim();
    if (!query) return;

    showLoadingMessage(); 

    const data = await fetchData();
    const results = findMatches(query, data);

    setTimeout(() => {
      if (results.length > 0) {
        displayResults(query, results);
      } else {
        chatContent.innerHTML = ""; 
        showNoDataMessage(query);
      }
    }, 1000);
  });
});
