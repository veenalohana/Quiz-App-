const originalQuestions = [ 
        {
           question: "What is the purpose of HTML?",
              answer: [
                  {text: "For Object Oriented programming", correct: false},
                  {text: "For Building Webpages", correct: true},
                  {text: "For Coding Webpages", correct: false},
                  {text: "For Styling Webpages", correct: false},
              ]
        },
        {
           question: "What is the purpose of CSS?",
              answer: [
                  {text: "For Object Oriented programming", correct: false},
                  {text: "For Building Webpages", correct: false},
                  {text: "For Coding Webpages", correct: false},
                  {text: "For Styling Webpages", correct: true},
              ]
        },
        {
                question: "What is the purpose of JS?",
                answer: [
                    {text: "For Object Oriented programming", correct: false},
                    {text: "For Building Webpages", correct: false},
                    {text: "For Coding Webpages", correct: true},
                    {text: "For Styling Webpages", correct: false},
                ]
            },
            {
                question: "What does HTML stand for?",
                answer: [
                    {text: "Hypertext Marked Language", correct: false},
                    {text: "Hypertext Markup Language", correct: true},
                    {text: "Hypertest Markup Language", correct: false},
                    {text: "Hypertext Markup Langcode", correct: false},
                ]
            },
             {
                question: "What does CSS stand for?",
                answer: [
                    {text: "Casding sheets", correct: false},
                    {text: "Cascading Sheets", correct: false},
                    {text: "Style Sheets", correct: false},
                    {text: "Cascading Style Sheets", correct: true},
                ]
            }
        ];

        let questions = []; 

        const startScreen = document.getElementById("start-screen");
        const quizContainer = document.getElementById("quiz-container");
        const startQuizBtn = document.getElementById("start-quiz-btn");
        const questionElement = document.getElementById("question");
        const answerButtons = document.getElementById("answer-buttons");
        const nextButton = document.getElementById("next-btn");
        const timerElement = document.getElementById("timer"); 

        let currentQuestionIndex = 0;
        let score = 0;
        let timerInterval; 
        const QUIZ_DURATION_PER_QUESTION = 10; 
        let timeRemaining = QUIZ_DURATION_PER_QUESTION;


        const correctSynth = new Tone.Synth().toDestination();
        const incorrectNoise = new Tone.NoiseSynth({
            noise: {
                type: "white"
            },
            envelope: {
                attack: 0.005,
                decay: 0.1,
                sustain: 0.05,
                release: 0.2
            }
        }).toDestination();

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; 
            }
            return array;
        }

        function showStartScreen() {
            startScreen.classList.remove("hidden");
            quizContainer.classList.add("hidden");
           
            timerElement.classList.add("hidden");
        }

        function startQuiz() {

            questions = shuffleArray([...originalQuestions]); 

            startScreen.classList.add("hidden"); 
            quizContainer.classList.remove("hidden");
            timerElement.classList.remove("hidden"); 

            currentQuestionIndex = 0;
            score = 0;
            nextButton.innerHTML = "Next";
            showQuestion();
        }

        function startTimer() {
            clearInterval(timerInterval); 
            timeRemaining = QUIZ_DURATION_PER_QUESTION; 
            timerElement.innerHTML = timeRemaining; 

            timerInterval = setInterval(() => {
                timeRemaining--;
                timerElement.innerHTML = timeRemaining;

                if (timeRemaining <= 0) {
                    clearInterval(timerInterval); 
                    handleTimeUp(); 
                }
            }, 1000); 
        }

        function showQuestion() {
            resetState(); 
            startTimer(); 

            let currentQuestion = questions[currentQuestionIndex];
            let questionNo = currentQuestionIndex + 1;
            questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

            currentQuestion.answer.forEach(answer => {
                const button = document.createElement("button");
                button.innerHTML = answer.text;
                button.classList.add("btn");
                answerButtons.appendChild(button);
                if (answer.correct) {
                    button.dataset.correct = answer.correct;
                }
                button.addEventListener("click", selectAnswer);
            });
        }

        function resetState() {
            clearInterval(timerInterval); 
            nextButton.classList.add("hidden");
            while (answerButtons.firstChild) {
                answerButtons.removeChild(answerButtons.firstChild);
            }
        }

        function selectAnswer(e) {
            clearInterval(timerInterval); 

            const selectedBtn = e.target;
            const isCorrect = selectedBtn.dataset.correct === "true";
            if (isCorrect) {
                selectedBtn.classList.add("correct");
                score++;
                correctSynth.triggerAttackRelease("C5", "8n"); 
            } else {
                selectedBtn.classList.add("incorrect");
                incorrectNoise.triggerAttackRelease("8n"); 
            }

            Array.from(answerButtons.children).forEach(button => {
                if (button.dataset.correct === "true") {
                    button.classList.add("correct"); 
                }
                button.disabled = true;
            });
            nextButton.classList.remove("hidden"); 
        }

       
        function handleTimeUp() {
            
            Array.from(answerButtons.children).forEach(button => {
                if (button.dataset.correct === "true") {
                    button.classList.add("correct"); 
                }
                button.disabled = true;
            });
            nextButton.classList.remove("hidden"); 
            setTimeout(handleNextButton, 1500); 
        }


        function showScore() {
            resetState(); 
            timerElement.classList.add("hidden"); 
            questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
            nextButton.innerHTML = "Play Again";
            nextButton.classList.remove("hidden"); 
        }

        function handleNextButton() {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                showScore();
            }
        }

        nextButton.addEventListener("click", () => {
            if (currentQuestionIndex < questions.length) {
                handleNextButton();
            } else {
                startQuiz(); 
            }
        });

        startQuizBtn.addEventListener("click", startQuiz);

        document.addEventListener("DOMContentLoaded", showStartScreen);