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

            const chatId = chatItem.dataset.chatId;
            const chatName = chatItem.dataset.chatName; // Get the chat name
            const chatAvatar = chatItem.dataset.chatAvatar; // Get the chat avatar

            console.log(`Chat clicked: ${chatName} (ID: ${chatId})`);

            // Update the chat header with the selected chat details
            updateChatHeader(chatName, chatAvatar);

            // Load messages for the selected chat
            await loadMessagesForChat(chatId, volunteerId);
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

        // Check if messageData is an array
        const messages = Array.isArray(messageData) ? messageData : [messageData];
        // Display messages
        displayMessages(messages, chatId, volunteerId);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function displayMessages(messages, chatId, volunteerId) {
    const chatHistoryContent = document.querySelector('.chat-history');
    chatHistoryContent.innerHTML = ''; // Clear existing messages

    let messageMatched = false; // Flag to track if any message matches

    messages.forEach(message => {


        // Ensure both sides of the comparison are of the same type
        if (Number(message.ngoid) === Number(chatId) && Number(message.volunteerid) === Number(volunteerId)) {
            messageMatched = true; // Set flag to true if a message matches
            
            console.log("Message matches criteria:", message);
            
            const messageElement = document.createElement('div');
            messageElement.style.display = 'flex';
            messageElement.style.gap = '8px';
            messageElement.style.maxWidth = '640px';
            messageElement.style.margin = '0 auto';

            const avatar = document.createElement('img');
            avatar.src = 'https://storage.gignite.ai/mediaengine/Placeholder_view_vector.svg.png'; // Placeholder URL
            avatar.alt = message.senderName;
            avatar.style.borderRadius = '50%';
            avatar.style.width = '32px';
            avatar.style.height = '32px';

            const messageContent = document.createElement('div');
            
            const userName = document.createElement('p');
            userName.style.fontWeight = '500';
            userName.textContent = message.senderName;

            const messageText = document.createElement('p');
            messageText.style.backgroundColor = '#ffffff';
            messageText.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            messageText.style.padding = '12px';
            messageText.style.borderRadius = '8px';
            messageText.style.wordBreak = 'break-word';
            messageText.textContent = message.content;

            const timestamp = document.createElement('span');
            timestamp.style.display = 'block';
            timestamp.style.fontSize = '14px';
            timestamp.style.marginTop = '8px';
            timestamp.textContent = formatDateTime(message.timestamp);

            messageContent.appendChild(userName);
            messageContent.appendChild(messageText);
            messageContent.appendChild(timestamp);

            messageElement.appendChild(avatar);
            messageElement.appendChild(messageContent);

            chatHistoryContent.appendChild(messageElement);
        } else {
            console.log("Message does not match criteria:", message);
        }
    });

    if (!messageMatched) {
        console.log("No messages matched the criteria.");
    }
}





function displayChatHistory(chats) {
    const chatHistory = document.getElementById('chatHistory');
    chatHistory.innerHTML = ''; // Clear existing chat history

    chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.dataset.chatId = chat.ngoid; // Use data attribute for chat ID
        chatItem.dataset.chatName = chat.ngoName; // Use data attribute for chat name
        chatItem.dataset.chatAvatar = 'https://storage.gignite.ai/mediaengine/Placeholder_view_vector.svg.png'; // Placeholder for chat avatar
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
