document.addEventListener('DOMContentLoaded', async () => {
    const volunteerId = getVolunteerId();
    console.log('volunteerid:', volunteerId);

    try {
        // Fetch chat history
        const chatResponse = await fetch(`/volunteers/chats/${volunteerId}`);
        if (!chatResponse.ok) throw new Error('Network response was not ok');
        const chatData = await chatResponse.json();
        
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
            await loadMessagesForChat(chatId, volunteerId);
            console.log("current chatid:", chatId);

            // Update the chat ID for the message creation
            setupMessageForm(volunteerId, chatId);
        });
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function getVolunteerId() {
    return localStorage.getItem('volunteerid');
}

async function loadMessagesForChat(chatId, volunteerId) {
    try {
        // Fetch messages for the selected chat
        const messageResponse = await fetch(`/volunteers/${volunteerId}/messages`);
        if (!messageResponse.ok) throw new Error('Network response was not ok');
        const messageData = await messageResponse.json();

        const messages = Array.isArray(messageData) ? messageData : [messageData];
        displayMessages(messages, chatId, volunteerId);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function displayMessages(messages, chatId, volunteerId) {
    const chatHistoryContent = document.querySelector('.chat-history');
    chatHistoryContent.innerHTML = '';

    messages.forEach(message => {
        if (Number(message.ngoid) === Number(chatId) && Number(message.volunteerid) === Number(volunteerId)) {
            
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            const avatar = document.createElement('img');
            avatar.src = 'https://storage.gignite.ai/mediaengine/Placeholder_view_vector.svg.png'; 
            avatar.alt = message.senderName;
            avatar.classList.add('message-avatar');

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

            messageElement.appendChild(avatar);
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
        chatItem.dataset.chatId = chat.ngoid;
        chatItem.dataset.chatName = chat.ngoName;
        chatItem.dataset.chatAvatar = 'https://storage.gignite.ai/mediaengine/Placeholder_view_vector.svg.png';
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

function setupMessageForm(volunteerId, chatId) {
    const messageForm = document.getElementById('messageForm');

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

        const newMessage = {
            volunteerid: volunteerId,
            ngoid: chatId,
            content: messageContent,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch(`/volunteers/createMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMessage)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const createdMessage = await response.json();
            console.log('Message sent successfully:', createdMessage);
            messageInput.value = ''; // Clear input after sending the message
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}
