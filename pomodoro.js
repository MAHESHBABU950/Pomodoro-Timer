const timerElement = document.getElementById('timer');
const alarmSound = document.getElementById('alarm');
const backgroundMusic = document.getElementById('background-music');
const appleContainer = document.getElementById('apple-container');


const collapseBtn = document.getElementById('collapse-btn');
const pomodoroContainer = document.getElementById('pomodoro-container');
const videoContainer = document.getElementById('video-container');
const video = document.getElementById('video');

const taskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');

let timeLeft = 3600; // Default 60 minutes (in seconds)
let timer;
let isRunning = false;



// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDg448ePRFahLSH-ih3pCakwBhS_1nhZjE",
    authDomain: "pomodoro-c0284.firebaseapp.com",
    projectId: "pomodoro-c0284",
    storageBucket: "pomodoro-c0284.firebasestorage.app",
    messagingSenderId: "142985028927",
    appId: "1:142985028927:web:d593f4b80761f9fd441f8a",
    measurementId: "G-T2TWS6EK7K"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = firebase.firestore(app);

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
      alert('Please enter a task.');
      return;
    }
  
    // Save task to Firestore
    db.collection('tasks').add({
      text: taskText,
      completed: false
    })
    .then(() => {
      // Add task to the UI
      const li = document.createElement('li');
      li.textContent = taskText;
  
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('task-buttons');
  
      const completeButton = document.createElement('button');
      completeButton.innerHTML = '✔️';
      completeButton.onclick = () => toggleTaskCompletion(li);
  
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '❌';
      deleteButton.onclick = () => removeTask(li);
  
      buttonContainer.appendChild(completeButton);
      buttonContainer.appendChild(deleteButton);
      li.appendChild(buttonContainer);
      taskList.appendChild(li);
  
      taskInput.value = '';
    })
    .catch((error) => {
      console.error('Error adding task: ', error);
    });
  }
  

// Function to toggle task completion
function toggleTaskCompletion(taskItem) {
    taskItem.classList.toggle('completed');
}

// Function to remove a task
function removeTask(taskItem) {
    taskList.removeChild(taskItem);
}

function generateReport() {
    // Fetch tasks from Firestore
    db.collection('tasks').get()
      .then((querySnapshot) => {
        let completedCount = 0;
        let incompleteCount = 0;
  
        querySnapshot.forEach((doc) => {
          const task = doc.data();
          if (task.completed) {
            completedCount++;
          } else {
            incompleteCount++;
          }
        });
  
        // Prepare data for the chart
        const data = {
          labels: ['Completed', 'Incomplete'],
          datasets: [{
            label: 'Task Completion Status',
            data: [completedCount, incompleteCount],
            backgroundColor: ['#4CAF50', '#FF5733'],
            borderColor: ['#388E3C', '#C62828'],
            borderWidth: 1
          }]
        };
  
        // Create the chart
        const ctx = document.getElementById('task-report').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching tasks: ', error);
      });
  }

  function generateReport() {
    // Show the report container
    document.querySelector('.report-container').style.display = 'block';
  
    // Fetch tasks from Firestore and generate the chart
    // (Include the code from step 4 here)
  }
  
  function closeReport() {
    // Hide the report container
    document.querySelector('.report-container').style.display = 'none';
  }

  function toggleTaskCompletion(taskItem) {
    const taskText = taskItem.textContent.replace('✔️❌', '').trim();
  
    // Update task completion status in Firestore
    db.collection('tasks').where('text', '==', taskText).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const taskRef = doc.ref;
          const currentStatus = doc.data().completed;
          taskRef.update({ completed: !currentStatus })
            .then(() => {
              taskItem.classList.toggle('completed');
            })
            .catch((error) => {
              console.error('Error updating task: ', error);
            });
        });
      })
      .catch((error) => {
        console.error('Error fetching task: ', error);
      });
  }

  // Function to fetch and display tasks
function fetchTasks() {
    db.collection('tasks').onSnapshot((querySnapshot) => {
      taskList.innerHTML = ''; // Clear existing tasks
      querySnapshot.forEach((doc) => {
        const task = doc.data();
        const li = document.createElement('li');
        li.textContent = task.text;
        // Add buttons and event listeners as needed
        taskList.appendChild(li);
      });
    });
  }
  
  // Call fetchTasks to initialize the task list
  fetchTasks();
  
  


// Update the display with the current time
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Start the Pomodoro timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        backgroundMusic.play();
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                isRunning = false;
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
                alarmSound.play();
                // Automatically start a break or reset the timer here if desired
            }
        }, 1000);
    }
}

// Pause the timer
function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        backgroundMusic.pause();
    }
}

// Reset the timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 3600;
    updateDisplay();
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

// Set the Pomodoro timer to 25 minutes
function setPomodoro() {
    timeLeft = 1500; // 25 minutes
    updateDisplay();
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

// Set the Break timer to 5 minutes
function setBreak() {
    timeLeft = 300; // 5 minutes
    updateDisplay();
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

// Set the Long Break timer to 15 minutes
function setLongBreak() {
    timeLeft = 900; // 15 minutes
    updateDisplay();
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}


// Collapse functionality: show the video
function collapseApple() {
    console.log("Collapse button clicked"); // Debugging line

    // Hide Pomodoro layout and show the collapse video
    pomodoroContainer.style.display = 'none';
    videoContainer.style.display = 'block';
    video.play();

    // After 10 seconds, switch back to Pomodoro layout
    setTimeout(() => {
        video.pause();
        video.currentTime = 0;
        videoContainer.style.display = 'none';
        pomodoroContainer.style.display = 'block';
    }, 5000); // 5 seconds
}

// Add event listener for collapse button
collapseBtn.addEventListener('click', collapseApple);
console.log(collapseBtn); // Should not be null


// Initialize display
updateDisplay();
