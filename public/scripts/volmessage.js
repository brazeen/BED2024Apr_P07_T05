document.addEventListener('DOMContentLoaded', async () => {
    const volunteerId = getVolunteerId();
    const token = localStorage.getItem('token')
    console.log('volunteerid:', volunteerId);
    console.log(token)
    let senderName;
    fetchVolunteerProfile(volunteerId, token)
    try {
        //get sender's name
        senderName = await fetchVolunteerProfile(volunteerId, token);
        // Fetch chat history
        const chatResponse = await fetch(`/volunteers/chats/${volunteerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });;;
        if (!chatResponse.ok) throw new Error('Network response was not ok');
        const chatData = await chatResponse.json();
        console.log("chatData:", chatData)
        // Display chat history
        displayChatHistory(chatData.chats);

        // Set up chat item click listener
        document.getElementById('chatHistory').addEventListener('click', async (event) => {
            const chatItem = event.target.closest('.chat-item');
            if (!chatItem) return;
            console.log("chatitem:", chatItem)
            const ngoId = chatItem.dataset.chatId;
            const chatName = chatItem.dataset.chatName;
            const chatAvatar = chatItem.dataset.chatAvatar;
            console.log(`Chat clicked: ${chatName} (ID: ${ngoId})`);

            // Update the chat header with the selected chat details
            updateChatHeader(chatName, chatAvatar);

            // Load messages for the selected chat
            await loadMessagesForChat(ngoId, volunteerId, token);
            console.log("current ngoId:", ngoId);

            // Update the chat ID for the message creation
            setupMessageForm(volunteerId, ngoId, senderName, token);
        });
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

// Function to extract sender's name
async function fetchVolunteerProfile(volunteerId, token) {
    try {
        const response = await fetch(`/volunteers/${volunteerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });
        const volunteer = await response.json();
        return volunteer.name; // Return the sender's name
    } catch (error) {
        console.error('Error fetching volunteer name:', error);
    }
}

function getVolunteerId() {
    return localStorage.getItem('volunteerid');
}

async function loadMessagesForChat(ngoId, volunteerId, token) {
    try {
        // Fetch messages for the selected chat
        const messageResponse = await fetch(`/volunteers/${volunteerId}/messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });
        if (!messageResponse.ok) throw new Error('Network response was not ok');
        const messageData = await messageResponse.json();

        const messages = Array.isArray(messageData) ? messageData : [messageData];
        displayMessages(messages, ngoId, volunteerId);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function displayMessages(messages, ngoId, volunteerId) {
    const chatHistoryContent = document.querySelector('.chat-history');
    chatHistoryContent.innerHTML = '';

    messages.forEach(message => {
        if (Number(message.ngoid) === Number(ngoId) && Number(message.volunteerid) === Number(volunteerId)) {

            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-bubble');

            const userName = document.createElement('div');
            userName.classList.add('chat-bubble-header');
            userName.textContent = message.senderName;

            const messageText = document.createElement('div');
            messageText.classList.add('chat-bubble-message');
            messageText.textContent = message.content;

            const timestamp = document.createElement('div');
            timestamp.classList.add('chat-bubble-timestamp');
            timestamp.textContent = formatDateTime(message.timestamp);

            messageElement.appendChild(userName);
            messageElement.appendChild(messageText);
            messageElement.appendChild(timestamp);

            chatHistoryContent.appendChild(messageElement);
        }
    });
}

function displayChatHistory(chats) {
    const chatHistory = document.getElementById('chatHistory');
    chatHistory.innerHTML = '';

    chats.forEach(chat => {
        console.log("chats:", chat)
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.dataset.chatId = chat.ngoid;
        chatItem.dataset.chatName = chat.ngoName;
        chatItem.dataset.chatAvatar = 'https://storage.gignite.ai/mediaengine/Placeholder_view_vector.svg.png';
        chatItem.dataset.senderName = chat.senderName; // Ensure senderName is set
        console.log("sender name in chat:", chatItem.dataset.senderName)
        chatItem.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 16px; padding: 8px; border-radius: 8px; background-color: #e0e0e0; cursor: pointer;">
                <img src="${chatItem.dataset.chatAvatar}" alt="NGO avatar" style="border-radius: 50%; width: 32px; height: 32px; margin-right: 8px;">
                <div>
                    <p style="font-size: 14px; font-weight: 600; color: #4a4a4a;">${chat.ngoName}</p>
                    <p style="font-size: 14px; color: #7a7a7a;">Chat ID: ${chat.ngoid}</p>
                </div>
            </div>
        `;
        chatHistory.appendChild(chatItem);
    });
}


function updateChatHeader(name, avatar) {
    const chatHeader = document.querySelector('.chat-header');
    const chatHeaderName = chatHeader.querySelector('.chat-header-name');
    const chatHeaderAvatar = chatHeader.querySelector('.chat-header-avatar');

    chatHeaderName.textContent = name;
    chatHeaderAvatar.src = avatar;
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const options = {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

function setupMessageForm(volunteerId, ngoId, senderName, token) {
    console.log(token)
    const messageForm = document.getElementById('messageForm');

    messageForm.removeEventListener('submit', handleSubmit); // Remove any existing listener
    messageForm.addEventListener('submit', handleSubmit); // Add the new listener with updated ngoId

    async function handleSubmit(event) {
        event.preventDefault();
        const messageInput = document.getElementById('messageInput');
        const messageContent = messageInput.value.trim();

        if (messageContent === '') return;

        console.log("Chat ID (in handleSubmit):", ngoId);
        console.log("Volunteer ID (in handleSubmit):", volunteerId);
        console.log("Message content:", messageContent);
        console.log("sender name in create message",senderName);

        const newMessage = {
            volunteerid: volunteerId,
            ngoid: ngoId,
            content: messageContent,
            timestamp: new Date().toISOString(),
            senderName:  senderName
        };

        try {
            const response = await fetch(`/volunteers/createMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorisation': `Bearer ${token}`
                },
                body: JSON.stringify(newMessage)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const createdMessage = await response.json();
            console.log('Message sent successfully:', createdMessage);
            await loadMessagesForChat(ngoId, volunteerId);
            messageInput.value = ''; // Clear input after sending the message
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}
