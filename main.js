// select elements
let cntQs = document.querySelector(".count span");
let bulletsContainer = document.querySelector(".bullets .spans");
let currentIndexQ = 0;
let numOfCorectAnswer = 0;
let questionTitle = document.querySelector(".quiz-area h2");
let answersArea = document.querySelector(".answer-area");
let btnCheck = document.querySelector(".submit-ans");
let resultDiv = document.querySelector(".results");
let answredValue = "";
let value;
let countDownInterval;
let minuitsSpan = document.querySelector(".minutes") 
let secondsSpan = document.querySelector(".seconds") 


// Get Data From JSON
function getQuestions() {
  return new Promise((resolv, reject) => {
    let myRequest = new XMLHttpRequest();
    myRequest.onload = function () {
      if (myRequest.readyState === 4 && myRequest.status === 200) {
        resolv(JSON.parse(myRequest.responseText));
      } else {
        reject(Error("API is not correct"));
      }
    };
    myRequest.open("GET", "./questions.json");
    myRequest.send();
  });
}

getQuestions()
  .then((data) => {
    // add random questions from 50 question
    let arr = []
    for(let i = 0; i < 10; i++){
      let randomIndex = Math.floor(Math.random() * 49);
      arr.push(data[randomIndex]);
    }
    data = arr;
    return data;
  })
  .then((data) => {
    // Creats the bullets of the questions
    creatBullets(data.length);  // 10

    // add data to page
    addDataToPage(data[currentIndexQ], data.length);

    // add timer for each question
    countDown(10,data.length);

    // handle questons and submit button
    btnCheck.onclick = function () {
      if (currentIndexQ < data.length) {
        // handle correct answer
        let rightAnswer = data[currentIndexQ].correct_answer;
        chechAnswer(rightAnswer);
        // change question to next
        currentIndexQ++;
        // Empty Questions area
        answersArea.innerHTML = "";
        questionTitle.innerHTML = "";
        addDataToPage(data[currentIndexQ], data.length);
        // number of correct answer after current++ to make active class in the next queston
        creatBullets(data.length,data);
        
        // handle timer for new questions
        clearInterval(countDownInterval)
        countDown(10,data.length)

        // show results
        showResults(data.length);
      }
    };
  });

function creatBullets(num,data) {
  cntQs.innerHTML = num;
  bulletsContainer.innerHTML = "";
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    if (i === currentIndexQ) {
      span.classList.add("active");
    }
    bulletsContainer.append(span);
  }
}

function addDataToPage(data, count) {
  if (currentIndexQ < count) {
    questionTitle.innerHTML = data.question;
    answersArea.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      let answeContainer = document.createElement("div");
      answeContainer.classList.add("answer");
      let input = document.createElement("input");
      let label = document.createElement("label");
      input.type = "radio";
      input.dataset.answer = data["answers"][i];
      input.setAttribute("id", `answer-${i + 1}`);
      input.name = "questions";
      label.setAttribute("for", `answer-${i + 1}`);
      label.innerHTML = data.answers[i];
      answeContainer.append(input, label);
      answersArea.append(answeContainer);
    }
  }
}

function  chechAnswer(correctAnswer) {
  let allInputs = document.getElementsByName("questions");
  for (let i = 0; i < allInputs.length; i++) {
    if (allInputs[i].checked) {
      value = allInputs[i].dataset.answer;
    }
  }
  if (correctAnswer === value) {
    numOfCorectAnswer++;
  }
}

function showResults (count) {
  let theResults;
  if(currentIndexQ === count){
    questionTitle.remove()
    answersArea.remove()
    document.querySelector(".bullets").remove()
    btnCheck.remove();
    document.querySelector(".quiz-area").remove()
    // resultDiv.style.fontSize = "50px"
    resultDiv.innerHTML = (`You Answer <span>${numOfCorectAnswer}</span> from <span> 10 </span>`)
  }
  // resultDiv.innerHTML = numOfCorectAnswer;
}

function countDown(duration, count) {
  if(currentIndexQ < count) {
    let minuits, seconds;
    countDownInterval = setInterval(()=> {
      minuits = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minuitsSpan.innerHTML = (minuits < 10) ? `0${minuits}`:minuits;
      secondsSpan.innerHTML = (seconds < 10) ? `0${seconds}`:seconds;;
      if(--duration < 0) {
        clearInterval(countDownInterval);
        btnCheck.click()
      }
    }, 1000)
  }
}