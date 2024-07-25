document.addEventListener('DOMContentLoaded', async () => {
    const ngoId = getNgoId();
    const token = localStorage.getItem('token')
    let senderName;
    fetchNgoProfile(ngoId, token)
    try {
        senderName = await fetchNgoProfile(ngoId, token);
        console.log("sender name:", senderName)
        // Fetch chat history
        const chatResponse = await fetch(`/ngos/chats/${ngoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });;
        if (!chatResponse.ok) throw new Error('Network response was not ok');
        const chatData = await chatResponse.json();
        console.log("chat:", chatData)
        // Display chat history
        displayChatHistory(chatData.chats);

        // Set up chat item click listener
        document.getElementById('chatHistory').addEventListener('click', async (event) => {
            const chatItem = event.target.closest('.chat-item');
            if (!chatItem) return;
            console.log("chatitem:", chatItem)
            const chatId = chatItem.dataset.chatId;
            const chatName = chatItem.dataset.chatName;
            const chatAvatar = chatItem.dataset.chatAvatar;
            console.log(`Chat clicked: ${chatName} (ID: ${chatId})`);

            // Update the chat header with the selected chat details
            updateChatHeader(chatName, chatAvatar);

            // Load messages for the selected chat
            console.log("ngoid:", ngoId)
            await loadMessagesForChat(chatId, ngoId, token);
            console.log("current chatid:", chatId);

            // Update the chat ID for the message creation
            setupMessageForm(ngoId, chatId, senderName, token);
        });
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

// Function to extract sender's name
async function fetchNgoProfile(ngoId, token) {
    try {
        const response = await fetch(`/ngos/${ngoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });
        const ngo = await response.json();
        return ngo.name; // Return the sender's name
    } catch (error) {
        console.error('Error fetching ngo name:', error);
    }
}

function getNgoId() {
    return localStorage.getItem('ngoid');
}

async function loadMessagesForChat(chatId, ngoId, token) {
    try {
        // Fetch messages for the selected chat
        const messageResponse = await fetch(`/ngos/${ngoId}/messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            }
        });;
        if (!messageResponse.ok) throw new Error('Network response was not ok');
        const messageData = await messageResponse.json();
        console.log("message data:", messageData)
        const messages = Array.isArray(messageData) ? messageData : [messageData];
        console.log("messages:", messages)
        displayMessages(messages, chatId, ngoId);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function displayMessages(messages, chatId, volunteerId) {
    const chatHistoryContent = document.querySelector('.chat-history');
    chatHistoryContent.innerHTML = '';

    messages.forEach(message => {
        if (Number(message.ngoid) === Number(chatId) && Number(message.volunteerid) === Number(volunteerId)) {
            
            console.log("message sender:", message.volunteerName);
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');


            const messageContent = document.createElement('div');
            messageContent.classList.add('message-content');
            
            const userName = document.createElement('p');
            userName.classList.add('message-username');
            userName.textContent = message.senderName;

            const messageText = document.createElement('p');
            messageText.classList.add('message-text');
            messageText.textContent = message.content;

            const timestamp = document.createElement('span');
            timestamp.classList.add('message-timestamp');
            timestamp.textContent = formatDateTime(message.timestamp);

            messageContent.appendChild(userName);
            messageContent.appendChild(messageText);
            messageContent.appendChild(timestamp);

            messageElement.appendChild(messageContent);

            chatHistoryContent.appendChild(messageElement);
        }
    });
}

function displayChatHistory(chats) {
    const chatHistory = document.getElementById('chatHistory');
    chatHistory.innerHTML = '';

    chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.dataset.chatId = chat.volunteerid;
        chatItem.dataset.chatName = chat.volunteerName;
        chatItem.dataset.chatAvatar = 'https://storage.gignite.ai/mediaengine/Placeholder_view_vector.svg.png';
        chatItem.dataset.senderName = chat.senderName; // Ensure senderName is set
        console.log("sender name in chat:", chatItem.dataset.chatName)
        chatItem.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 16px; padding: 8px; border-radius: 8px; background-color: #e0e0e0; cursor: pointer;">
                <img src="${chatItem.dataset.chatAvatar}" alt="NGO avatar" style="border-radius: 50%; width: 32px; height: 32px; margin-right: 8px;">
                <div>
                    <p style="font-size: 14px; font-weight: 600; color: #4a4a4a;">${chat.volunteerName}</p>
                    <p style="font-size: 14px; color: #7a7a7a;">Chat ID: ${chat.volunteerid}</p>
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

function setupMessageForm(volunteerId, chatId, senderName, token) {
    const messageForm = document.getElementById('messageForm');
    console.log(token)
    messageForm.removeEventListener('submit', handleSubmit); // Remove any existing listener
    messageForm.addEventListener('submit', handleSubmit); // Add the new listener with updated chatId

    async function handleSubmit(event) {
        event.preventDefault();
        const messageInput = document.getElementById('messageInput');
        const messageContent = messageInput.value.trim();

        if (messageContent === '') return;

        console.log("Chat ID (in handleSubmit):", chatId);
        console.log("Volunteer ID (in handleSubmit):", volunteerId);
        console.log("Message content:", messageContent);
        console.log("sender name in create message",senderName);

        const newMessage = {
            volunteerid: volunteerId,
            ngoid: chatId,
            content: messageContent,
            timestamp: new Date().toISOString(),
            senderName:  senderName
        };

        try {
            const response = await fetch(`/ngos/createMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newMessage)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const createdMessage = await response.json();
            console.log('Message sent successfully:', createdMessage);
            await loadMessagesForChat(chatId, volunteerId);
            messageInput.value = ''; // Clear input after sending the message
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}
