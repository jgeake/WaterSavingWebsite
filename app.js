// Initialize Firebase (using modular SDK)
const app = initializeApp(firebaseConfig);

// Get Firestore reference
const db = getFirestore(app);

// Firestore collection reference
const messagesCollection = collection(db, "forumMessages");

// Add a new message to Firestore
async function addMessage(message) {
  try {
    // Add the message to Firestore collection "forumMessages"
    await addDoc(messagesCollection, {
      message: message,
      timestamp: new Date()
    });
    console.log("Message successfully added to Firestore!");
  } catch (e) {
    console.error("Error adding message: ", e);
  }
}

// Event listener for post message button
document.getElementById('postMessageButton').addEventListener('click', function () {
  const forumMessage = document.getElementById('forumMessage').value.trim();

  if (forumMessage === '') {
    alert('Please enter a message before posting.');
    return;
  }

  // Add the message to Firestore
  addMessage(forumMessage);

  // Clear the input field after posting
  document.getElementById('forumMessage').value = '';
});

// Real-time listener for Firestore updates
onSnapshot(messagesCollection, (snapshot) => {
  const forumDiscussion = document.getElementById('forumDiscussion');
  forumDiscussion.innerHTML = ""; // Clear existing messages

  snapshot.forEach((doc) => {
    addPostToDiscussion(doc.data().message);
  });
});

// Function to add a post to the discussion area in the DOM
function addPostToDiscussion(post) {
  const forumDiscussion = document.getElementById('forumDiscussion');
  const postDiv = document.createElement('div');
  postDiv.className = 'forumPost';
  postDiv.textContent = post;
  forumDiscussion.appendChild(postDiv);
}
