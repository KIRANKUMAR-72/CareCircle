
/* =========================================================
   CareCircle - Messages Page
   File: frontend/js/messages.js

   Features:
   1. Switch between conversations
   2. Search conversations
   3. Filter conversations by unread status
   4. Display the selected conversation's message history
   5. Send demonstration messages locally in the page
   6. Update message previews and timestamps
   7. Count message characters
   8. Display conversation information
   9. Dismiss the demonstration notice
   10. Update the footer year

   IMPORTANT:
   This is frontend-only demonstration functionality.
   Messages are not delivered to other users or saved
   to a database. Reloading restores the original examples.
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", initializeMessagesPage);

function initializeMessagesPage() {
    // ---------------------------------------------------------
    // 1. Select page elements
    // ---------------------------------------------------------

    const conversationList = document.getElementById("conversationList");

    if (!conversationList) {
        return;
    }

    const conversationItems = Array.from(
        conversationList.querySelectorAll(".conversation-item")
    );

    const conversationSearch = document.getElementById("conversationSearch");
    const clearSearchButton = document.getElementById(
        "clearConversationSearch"
    );

    const conversationFilterButtons = document.querySelectorAll(
        "[data-conversation-filter]"
    );

    const conversationEmptyState = document.getElementById(
        "conversationEmptyState"
    );

    const resetSearchButton = document.getElementById(
        "resetConversationSearch"
    );

    const conversationTotal = document.getElementById("conversationTotal");

    const activeChat = document.getElementById("activeChat");
    const chatEmptyState = document.getElementById("chatEmptyState");

    const chatHeaderAvatar = document.getElementById("chatHeaderAvatar");
    const chatHeaderName = document.getElementById("chatHeaderName");
    const chatHeaderRole = document.getElementById("chatHeaderRole");
    const chatHeaderStatus = document.getElementById("chatHeaderStatus");

    const chatContextText = document.getElementById("chatContextText");
    const chatMessages = document.getElementById("chatMessages");

    const messageForm = document.getElementById("messageForm");
    const messageInput = document.getElementById("messageInput");
    const sendMessageButton = document.getElementById("sendMessageButton");
    const messageCharacterCount = document.getElementById(
        "messageCharacterCount"
    );

    const chatFeedback = document.getElementById("chatFeedback");

    const conversationInfoButton = document.getElementById(
        "conversationInfoButton"
    );

    const demoNotice = document.getElementById("messagesDemoNotice");
    const dismissNoticeButton = document.getElementById(
        "dismissMessagesNotice"
    );

    const currentYearElement = document.getElementById("currentYear");

    // ---------------------------------------------------------
    // 2. Conversation data
    // ---------------------------------------------------------

    /*
     * These examples correspond to the conversation IDs in
     * messages.html. The initial conversation's messages are
     * already present in the HTML.
     */

    const conversations = {
        "conversation-001": {
            name: "Ananya Rao",
            role: "Volunteer",
            initials: "AR",
            avatarClass: "avatar-green",
            status: "Demonstration conversation",
            context: "Example conversation about grocery shopping assistance.",
            unread: 2,
            lastMessage: "Hello! Let's coordinate the grocery request.",
            lastTime: "10:45 AM",
            dateLabel: "10 October 2026",
            messages: [
                {
                    sender: "received",
                    text: "Hello! I saw the grocery shopping assistance request. I'd be happy to discuss how I can help.",
                    time: "10:30 AM"
                },
                {
                    sender: "sent",
                    text: "Hello, thank you for reaching out! We can coordinate the details here.",
                    time: "10:35 AM"
                },
                {
                    sender: "received",
                    text: "Of course. Please share only the details needed to coordinate the assistance.",
                    time: "10:40 AM"
                },
                {
                    sender: "sent",
                    text: "That sounds good. Let's confirm the arrangements through the request page.",
                    time: "10:45 AM"
                }
            ]
        },

        "conversation-002": {
            name: "Ravi Kumar",
            role: "Community Member",
            initials: "RK",
            avatarClass: "avatar-blue",
            status: "Demonstration conversation",
            context: "Example conversation about smartphone and digital guidance.",
            unread: 0,
            lastMessage: "Thank you for the smartphone guidance.",
            lastTime: "Yesterday",
            dateLabel: "9 October 2026",
            messages: [
                {
                    sender: "received",
                    text: "Hello! Thank you for helping me understand the smartphone basics.",
                    time: "4:00 PM"
                },
                {
                    sender: "sent",
                    text: "You're welcome! We can go through the steps one at a time.",
                    time: "4:10 PM"
                },
                {
                    sender: "received",
                    text: "Thank you for the smartphone guidance.",
                    time: "4:20 PM"
                }
            ]
        },

        "conversation-003": {
            name: "Meera Sharma",
            role: "Family Member",
            initials: "MS",
            avatarClass: "avatar-purple",
            status: "Demonstration conversation",
            context: "Example conversation about coordinating community assistance.",
            unread: 0,
            lastMessage: "We appreciate the community support.",
            lastTime: "8 Oct",
            dateLabel: "8 October 2026",
            messages: [
                {
                    sender: "received",
                    text: "Hello! I wanted to ask how community assistance requests work.",
                    time: "11:00 AM"
                },
                {
                    sender: "sent",
                    text: "You can review the available services and submit a request through CareCircle.",
                    time: "11:05 AM"
                },
                {
                    sender: "received",
                    text: "We appreciate the community support.",
                    time: "11:15 AM"
                }
            ]
        },

        "conversation-004": {
            name: "Community Support",
            role: "CareCircle Team",
            initials: "CC",
            avatarClass: "avatar-orange",
            status: "Demonstration conversation",
            context: "Example conversation about getting started with CareCircle.",
            unread: 0,
            lastMessage: "Welcome to the CareCircle community!",
            lastTime: "7 Oct",
            dateLabel: "7 October 2026",
            messages: [
                {
                    sender: "received",
                    text: "Welcome to the CareCircle community!",
                    time: "9:00 AM"
                },
                {
                    sender: "received",
                    text: "Explore the available services and learn how members can support one another.",
                    time: "9:05 AM"
                },
                {
                    sender: "sent",
                    text: "Thank you! I look forward to learning more about the community.",
                    time: "9:10 AM"
                }
            ]
        }
    };

    let activeConversationId = "conversation-001";
    let activeConversationFilter = "all";

    /*
     * Keep a reference to the original conversation state so
     * the UI can be restored by reloading the page.
     */

    // ---------------------------------------------------------
    // 3. General helper functions
    // ---------------------------------------------------------

    function getCurrentTimeLabel() {
        return new Date().toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }

    function getCurrentDateLabel() {
        return new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            const replacements = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return replacements[character];
        });
    }

    function showChatFeedback(message) {
        if (!chatFeedback) {
            return;
        }

        chatFeedback.textContent = message;
        chatFeedback.hidden = false;
    }

    function hideChatFeedback() {
        if (!chatFeedback) {
            return;
        }

        chatFeedback.textContent = "";
        chatFeedback.hidden = true;
    }

    // ---------------------------------------------------------
    // 4. Build message elements safely
    // ---------------------------------------------------------

    function createMessageElement(message, conversation) {
        const row = document.createElement("div");

        row.className = message.sender === "sent"
            ? "message-row sent-message"
            : "message-row received-message";

        if (message.sender === "received") {
            const avatar = document.createElement("span");

            avatar.className =
                "message-avatar " + conversation.avatarClass;

            avatar.setAttribute("aria-hidden", "true");
            avatar.textContent = conversation.initials;

            row.appendChild(avatar);
        }

        const wrapper = document.createElement("div");
        wrapper.className = "message-bubble-wrapper";

        if (message.sender === "received") {
            const sender = document.createElement("span");

            sender.className = "message-sender";
            sender.textContent = conversation.name;

            wrapper.appendChild(sender);
        }

        const bubble = document.createElement("div");

        bubble.className = "message-bubble";
        bubble.textContent = message.text;

        const time = document.createElement("time");

        time.className = "message-time";
        time.textContent = message.time;

        wrapper.appendChild(bubble);
        wrapper.appendChild(time);
        row.appendChild(wrapper);

        return row;
    }

    // ---------------------------------------------------------
    // 5. Display a conversation's messages
    // ---------------------------------------------------------

    function renderConversationMessages(conversationId) {
        const conversation = conversations[conversationId];

        if (!conversation || !chatMessages) {
            return;
        }

        chatMessages.replaceChildren();

        const dateDivider = document.createElement("div");
        dateDivider.className = "chat-date-divider";

        const dateLabel = document.createElement("span");
        dateLabel.textContent = conversation.dateLabel;

        dateDivider.appendChild(dateLabel);
        chatMessages.appendChild(dateDivider);

        conversation.messages.forEach(function (message) {
            chatMessages.appendChild(
                createMessageElement(message, conversation)
            );
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ---------------------------------------------------------
    // 6. Update the selected conversation header
    // ---------------------------------------------------------

    function updateChatHeader(conversationId) {
        const conversation = conversations[conversationId];

        if (!conversation) {
            return;
        }

        if (chatHeaderAvatar) {
            chatHeaderAvatar.className =
                "conversation-avatar " +
                conversation.avatarClass +
                " chat-header-avatar";

            chatHeaderAvatar.textContent = conversation.initials;
        }

        if (chatHeaderName) {
            chatHeaderName.textContent = conversation.name;
        }

        if (chatHeaderRole) {
            chatHeaderRole.textContent = conversation.role;
        }

        if (chatHeaderStatus) {
            chatHeaderStatus.textContent = conversation.status;
        }

        if (chatContextText) {
            chatContextText.textContent = conversation.context;
        }

        if (activeChat) {
            activeChat.hidden = false;
        }

        if (chatEmptyState) {
            chatEmptyState.hidden = true;
        }
    }

    // ---------------------------------------------------------
    // 7. Update conversation previews
    // ---------------------------------------------------------

    function updateConversationPreview(conversationId) {
        const conversation = conversations[conversationId];

        const conversationButton = conversationItems.find(function (item) {
            return item.dataset.conversationId === conversationId;
        });

        if (!conversation || !conversationButton) {
            return;
        }

        const previewText = conversationButton.querySelector(
            ".conversation-last-message"
        );

        const previewTime = conversationButton.querySelector(
            ".conversation-preview-top time"
        );

        const unreadBadge = conversationButton.querySelector(
            ".conversation-unread-count"
        );

        if (previewText) {
            previewText.textContent = conversation.lastMessage;
        }

        if (previewTime) {
            previewTime.textContent = conversation.lastTime;
        }

        if (unreadBadge) {
            unreadBadge.textContent = String(conversation.unread);
            unreadBadge.hidden = conversation.unread <= 0;
        } else if (conversation.unread > 0) {
            const badge = document.createElement("span");

            badge.className = "conversation-unread-count";
            badge.dataset.unreadCount = String(conversation.unread);
            badge.textContent = String(conversation.unread);

            const bottomRow = conversationButton.querySelector(
                ".conversation-preview-bottom"
            );

            if (bottomRow) {
                bottomRow.appendChild(badge);
            }
        }

        conversationButton.dataset.search = [
            conversation.name,
            conversation.role,
            conversation.lastMessage,
            conversation.context
        ].join(" ").toLowerCase();
    }

    // ---------------------------------------------------------
    // 8. Update unread conversation counts
    // ---------------------------------------------------------

    function updateConversationCount() {
        const unreadConversationCount = conversationItems.filter(
            function (item) {
                const id = item.dataset.conversationId;
                const conversation = conversations[id];

                return conversation && conversation.unread > 0;
            }
        ).length;

        if (conversationTotal) {
            conversationTotal.textContent = String(conversationItems.length);
            conversationTotal.title =
                unreadConversationCount + " conversations with unread messages";
        }

        conversationItems.forEach(function (item) {
            updateConversationPreview(item.dataset.conversationId);
        });
    }

    // ---------------------------------------------------------
    // 9. Search and filter conversations
    // ---------------------------------------------------------

    function renderConversationList() {
        const searchTerm = conversationSearch
            ? conversationSearch.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        conversationItems.forEach(function (item) {
            const id = item.dataset.conversationId;
            const conversation = conversations[id];

            if (!conversation) {
                item.hidden = true;
                return;
            }

            const searchableText = [
                item.dataset.search || "",
                conversation.name,
                conversation.role,
                conversation.lastMessage,
                conversation.context
            ].join(" ").toLowerCase();

            const matchesSearch = searchableText.includes(searchTerm);

            const matchesFilter =
                activeConversationFilter === "all" ||
                conversation.unread > 0;

            const shouldShow = matchesSearch && matchesFilter;

            item.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });

        if (conversationEmptyState) {
            conversationEmptyState.hidden = visibleCount !== 0;
        }

        if (conversationList) {
            conversationList.hidden = visibleCount === 0;
        }

        if (clearSearchButton && conversationSearch) {
            clearSearchButton.hidden = conversationSearch.value.length === 0;
        }
    }

    function activateConversationFilter(filter) {
        activeConversationFilter = filter;

        conversationFilterButtons.forEach(function (button) {
            const isActive =
                button.dataset.conversationFilter === filter;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        renderConversationList();
    }

    conversationFilterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            activateConversationFilter(
                button.dataset.conversationFilter || "all"
            );
        });
    });

    if (conversationSearch) {
        conversationSearch.addEventListener("input", renderConversationList);
    }

    function clearConversationSearch() {
        if (conversationSearch) {
            conversationSearch.value = "";
        }

        activateConversationFilter("all");
        renderConversationList();
    }

    if (clearSearchButton) {
        clearSearchButton.addEventListener(
            "click",
            clearConversationSearch
        );
    }

    if (resetSearchButton) {
        resetSearchButton.addEventListener(
            "click",
            clearConversationSearch
        );
    }

    // ---------------------------------------------------------
    // 10. Select a conversation
    // ---------------------------------------------------------

    function selectConversation(conversationId) {
        const conversation = conversations[conversationId];

        if (!conversation) {
            return;
        }

        activeConversationId = conversationId;

        conversationItems.forEach(function (item) {
            const isActive =
                item.dataset.conversationId === conversationId;

            item.classList.toggle("active", isActive);
            item.setAttribute("aria-pressed", String(isActive));
        });

        /*
         * In this prototype, selecting a conversation marks its
         * sample messages as read. A real application should
         * track unread messages per authenticated user on the server.
         */

        conversation.unread = 0;

        updateChatHeader(conversationId);
        renderConversationMessages(conversationId);
        updateConversationCount();
        renderConversationList();
        hideChatFeedback();

        if (messageInput) {
            messageInput.value = "";
            updateCharacterCount();
        }
    }

    conversationList.addEventListener("click", function (event) {
        const button = event.target.closest(".conversation-item");

        if (!button || button.hidden) {
            return;
        }

        selectConversation(button.dataset.conversationId);
    });

    // ---------------------------------------------------------
    // 11. Message character counter
    // ---------------------------------------------------------

    function updateCharacterCount() {
        if (!messageInput || !messageCharacterCount) {
            return;
        }

        const currentLength = messageInput.value.length;
        const maxLength = messageInput.maxLength > 0
            ? messageInput.maxLength
            : 1000;

        messageCharacterCount.textContent =
            currentLength + " / " + maxLength;

        if (sendMessageButton) {
            sendMessageButton.disabled =
                messageInput.value.trim().length === 0 ||
                currentLength > maxLength;
        }
    }

    if (messageInput) {
        messageInput.addEventListener("input", function () {
            updateCharacterCount();
            hideChatFeedback();

            // Automatically expand the textarea up to its CSS max-height.
            messageInput.style.height = "auto";

            const computedStyle = window.getComputedStyle(messageInput);
            const maximumHeight = parseFloat(computedStyle.maxHeight) || 140;

            messageInput.style.height =
                Math.min(messageInput.scrollHeight, maximumHeight) + "px";
        });
    }

    // ---------------------------------------------------------
    // 12. Send a demonstration message
    // ---------------------------------------------------------

    if (messageForm) {
        messageForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!messageInput) {
                return;
            }

            const messageText = messageInput.value.trim();

            if (!messageText) {
                showChatFeedback("Please type a message before sending.");
                messageInput.focus();
                return;
            }

            if (messageText.length > 1000) {
                showChatFeedback(
                    "Your message cannot exceed 1,000 characters."
                );
                return;
            }

            const conversation = conversations[activeConversationId];

            if (!conversation) {
                showChatFeedback("Please select a conversation first.");
                return;
            }

            const currentTime = getCurrentTimeLabel();

            const demoMessage = {
                sender: "sent",
                text: messageText,
                time: currentTime
            };

            conversation.messages.push(demoMessage);
            conversation.lastMessage = messageText;
            conversation.lastTime = currentTime;
            conversation.dateLabel = getCurrentDateLabel();

            renderConversationMessages(activeConversationId);
            updateConversationCount();
            renderConversationList();

            messageInput.value = "";
            messageInput.style.height = "auto";

            updateCharacterCount();

            showChatFeedback(
                "Demo message added to this conversation only. It was not delivered or saved to a server."
            );

            if (messageInput) {
                messageInput.focus();
            }
        });
    }

    // ---------------------------------------------------------
    // 13. Conversation information
    // ---------------------------------------------------------

    if (conversationInfoButton) {
        conversationInfoButton.addEventListener("click", function () {
            const conversation = conversations[activeConversationId];

            if (!conversation) {
                return;
            }

            /*
             * A simple browser alert keeps this feature functional
             * without introducing another modal or dependency.
             */
            window.alert(
                "Conversation information\n\n" +
                "Name: " + conversation.name + "\n" +
                "Role: " + conversation.role + "\n\n" +
                conversation.context + "\n\n" +
                "This is demonstration data. No real messages are exchanged."
            );
        });
    }

    // ---------------------------------------------------------
    // 14. Dismiss the demonstration notice
    // ---------------------------------------------------------

    if (dismissNoticeButton && demoNotice) {
        dismissNoticeButton.addEventListener("click", function () {
            demoNotice.hidden = true;
        });
    }

    // ---------------------------------------------------------
    // 15. Footer year
    // ---------------------------------------------------------

    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // ---------------------------------------------------------
    // 16. Initialize page
    // ---------------------------------------------------------

    conversationItems.forEach(function (item) {
        const id = item.dataset.conversationId;
        const conversation = conversations[id];

        if (!conversation) {
            item.hidden = true;
            return;
        }

        updateConversationPreview(id);
    });

    activateConversationFilter("all");
    selectConversation(activeConversationId);
    updateCharacterCount();
}
