const quizQuestions = [
    {
        question: "How many glasses of water do you drink daily?",
        waterUsage: (answer) => answer < 5 ? 2 : (answer <= 10 ? 4 : 6) // Liters
    },
    {
        question: "How many times do you shower in a day?",
        waterUsage: (answer) => answer * 60 // Liters per shower
    },
    {
        question: "How often do you use a dishwasher daily?",
        waterUsage: (answer) => answer * 15 // Liters per use
    },
    {
        question: "How often do you do laundry weekly?",
        waterUsage: (answer) => answer < 3 ? 20 : (answer <= 5 ? 50 : 70) // Average liters per day
    },
    {
        question: "Do you leave the water running while brushing your teeth?",
        waterUsage: (answer) => answer === 'yes' ? 5 : 0 // Liters
    },
    {
        question: "How often do you water your garden/yard per week?",
        waterUsage: (answer) => answer < 3 ? (answer * 50) : 200 // Liters
    },
    {
        question: "How often do you flush the toilet daily?",
        waterUsage: (answer) => answer * 12 // Liters per flush on average
    },
    {
        question: "Do you have a pool, and how often do you refill it?",
        waterUsage: (answer) => answer === 'seasonally' ? 2000 : (answer === 'monthly' ? 3000 : 0) // Liters
    },
    {
        question: "How many people are there in your household?",
        waterUsage: () => 0 // No additional water usage calculated here
    },
    {
        question: "Do you have a water-saving showerhead installed?",
        waterUsage: (answer) => answer === 'yes' ? -20 : 0 // Liters saved per shower
    },
    {
        question: "Do you use a water-efficient toilet?",
        waterUsage: (answer) => answer === 'yes' ? -3 : 0 // Liters saved per flush
    },
    {
        question: "How often do you clean your car at home?",
        waterUsage: (answer) => answer === 'monthly' ? 150 : (answer === 'weekly' ? 600 : 0) // Liters per wash
    },
    {
        question: "How many baths do you take weekly?",
        waterUsage: (answer) => answer * 150 // Liters per bath
    }
];

function buildQuiz() {
    const output = [];
    quizQuestions.forEach((currentQuestion, questionNumber) => {
        output.push(
            `<div class="question">${currentQuestion.question}</div>
            <div class="answers">
                <input type="text" name="question${questionNumber}" placeholder="Enter your answer">
            </div>`
        );
    });
    document.getElementById('quiz').innerHTML = output.join('');
}

function calculateWaterUsage() {
    const shareButton = document.getElementById('shareButton');
    shareButton.style.display = 'inline'; // Make the button visible

    const answerContainers = document.querySelectorAll('.answers');
    let totalWaterUsage = 0;
    const worldPopulation = 8e9; // 8 billion people
    const sustainableWaterUsage = 4e15; // 4 quadrillion liters annually
    const globalWaterReserves = 1.4e18; // Estimated total water reserves in liters

    quizQuestions.forEach((currentQuestion, questionNumber) => {
        const answerContainer = answerContainers[questionNumber];
        const userAnswer = answerContainer.querySelector(`input[name=question${questionNumber}]`).value;
        const numericAnswer = parseFloat(userAnswer);

        // Check if the answer is a valid number and not empty
        if (!isNaN(numericAnswer) && userAnswer.trim() !== '') {
            totalWaterUsage += currentQuestion.waterUsage(numericAnswer);
        }
    });

    // Calculate global water usage
    const totalGlobalWaterUsage = totalWaterUsage * worldPopulation;

    // Determine if the global water usage is sustainable
    const isSustainable = totalGlobalWaterUsage <= sustainableWaterUsage;
    const yearsToDepletion = (globalWaterReserves / totalGlobalWaterUsage).toFixed(2);

    // Store results in a global object
    window.calculatedResults = {
        totalWaterUsage: totalWaterUsage.toFixed(2),
        totalGlobalWaterUsage: totalGlobalWaterUsage.toFixed(2),
        isSustainable,
        yearsToDepletion,
    };

    // Hide the results initially
    document.getElementById('results').style.display = 'none';

    // Show the guess buttons and prompt user to guess
    document.getElementById('guessHeader').style.display = 'block';
    document.getElementById('guessBelow').style.display = 'inline';
    document.getElementById('guessAbove').style.display = 'inline';
}

function checkGuess(guess) {
    const results = window.calculatedResults;
    if (!results) {
        alert("Please calculate your water usage first.");
        return;
    }

    // Check if the user's guess is correct
    const correct = results.isSustainable;
    if ((guess === 'below' && correct) || (guess === 'above' && !correct)) {
        alert("Correct! Your guess was right.");
    } else {
        alert("Oops! Your guess was wrong.");
    }

    // Display the results after the guess
    const resultsContainer = document.getElementById('results');
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML =
        `Your estimated daily water usage is <strong>${results.totalWaterUsage}</strong> liters. ` +
        `If everyone used your amount of water, the world would use <strong>${results.totalGlobalWaterUsage}</strong> liters annually.<br>` +
        `Is this sustainable? <strong>${results.isSustainable ? 'Yes' : 'No'}</strong><br>` +
        `Years to depletion: <strong>${results.yearsToDepletion}</strong>`;

    // Hide the guess buttons after the results are shown
    document.getElementById('guessHeader').style.display = 'none';
    document.getElementById('guessBelow').style.display = 'none';
    document.getElementById('guessAbove').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', buildQuiz);

document.getElementById('submit').addEventListener('click', () => {
    calculateWaterUsage();

    // Remove any old results from the DOM to prevent duplication
    const resultsContainer = document.getElementById('results');
    resultsContainer.style.display = 'none';
    resultsContainer.innerHTML = '';
});



function sendEmail() {
    const recipient = "jgeake15@icloud.com"; // Replace with your email address
    const subject = encodeURIComponent("Question About the Water Usage Quiz");
    const body = encodeURIComponent(
        "Hello,\n\nI have a question about the water usage quiz. Could you please assist me with the following?\n\n[Write your question here]\n\nThank you!"
    );

    const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
}

function setupShareButton(totalWaterUsage, yourGlobalWaterUsage) {
    const shareButton = document.getElementById('shareButton');
    const text = `I just completed a water usage quiz! My daily water usage is ${totalWaterUsage.toFixed(2)} liters. If everyone used the same, the world would use ${yourGlobalWaterUsage.toFixed(2)} liters annually. Take the quiz here: https://jgeake.github.io/WaterSavingWebsite/index.html`;

    // LinkedIn Share URL
    const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://jgeake.github.io/WaterSavingWebsite/index.html')}&title=Water Usage Quiz&summary=${encodeURIComponent(text)}&source=WaterSavingWebsite`;

    // WhatsApp Share URL
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

    // Update button event listener
    shareButton.addEventListener('click', () => {
        // Prompt user to choose where to share
        const platform = confirm("Click OK to share on WhatsApp, or Cancel to share on LinkedIn.") 
            ? whatsappShareUrl 
            : linkedinShareUrl;
        
        window.open(platform, '_blank');
    });

    shareButton.style.display = 'inline'; // Show the button after results are displayed
}

// Call this function in your `calculateWaterUsage` function after displaying results
setupShareButton(totalWaterUsage, yourGlobalWaterUsage);


function submitSuggestion() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const questionSuggestion = document.getElementById('questionSuggestion').value.trim();

    // Check if the suggestion field is empty
    if (!questionSuggestion) {
        document.getElementById('formMessage').innerHTML = `<span style="color: red;">Please enter a question suggestion before submitting.</span>`;
        return;
    }

    // Store the suggestion locally (browser console for now)
    const formData = {
        name: name || 'Anonymous',
        email: email || 'Not provided',
        questionSuggestion
    };

    console.log("Suggestion submitted:", formData);

    // Display a confirmation message to the user
    document.getElementById('formMessage').innerHTML = `<span style="color: green;">Thank you for your suggestion! We'll review it shortly.</span>`;

    // Clear the form fields
    document.getElementById('suggestionForm').reset();
}


document.addEventListener('DOMContentLoaded', () => {
    const forumForm = document.getElementById('forumForm');
    const forumMessage = document.getElementById('forumMessage');
    const forumDiscussion = document.getElementById('forumDiscussion');

    // Load saved posts from localStorage
    function loadPosts() {
        const savedPosts = JSON.parse(localStorage.getItem('waterForumPosts')) || [];
        savedPosts.forEach(post => {
            addPostToDiscussion(post);
        });
    }

    // Save posts to localStorage
    function savePost(post) {
        const savedPosts = JSON.parse(localStorage.getItem('waterForumPosts')) || [];
        savedPosts.push(post);
        localStorage.setItem('waterForumPosts', JSON.stringify(savedPosts));
    }

    // Add a post to the discussion area
    function addPostToDiscussion(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'forumPost';
        postDiv.textContent = post;
        forumDiscussion.appendChild(postDiv);
    }

    // Handle posting a new message
    document.getElementById('postMessageButton').addEventListener('click', () => {
        const message = forumMessage.value.trim();
        if (message) {
            addPostToDiscussion(message);
            savePost(message);
            forumMessage.value = ''; // Clear the input field
        } else {
            alert('Please type a message before posting.');
        }
    });

    // Load existing posts when the page loads
    loadPosts();
});
