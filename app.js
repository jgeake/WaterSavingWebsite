
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
