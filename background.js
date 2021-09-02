chrome.runtime.onInstalled.addListener(() =>{
    chrome.storage.local.set({
        webhook: ""
    });
});

chrome.storage.local.get("webhook", webhook =>{

});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.status === 'complete' && /^http/.test(tab.url)){
        chrome.scripting.insertCSS({
            target: { tabId: tabId},
            files: ["./forground_styles.css"]
        })
        .then( () => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["./foreground.js"],
            })
                .then(() => {
                    console.log('Injected the forground script');
                })
            })
                .catch( err => console.log(err));
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.message === 'post_to_teams'){
        var text = request.payload.location + " is now " + request.payload.status;
        var testMessage = {
            "type":"message",
            "attachments":[
                {
                    "contentType":"application/vnd.microsoft.card.adaptive",
                    "contentUrl":null,
                    "content":{
                    "$schema":"http://adaptivecards.io/schemas/adaptive-card.json",
                    "type":"AdaptiveCard",
                    "version":"1.2",
                    "body":[
                        {
                            "type": "TextBlock",
                            "text": "**Title**: " + request.payload.title,
                            "wrap": true
                        },
                        {
                            "type": "TextBlock",
                            "text": "**Status**: " + request.payload.status,
                            "wrap": true
                        },
                        ],
                        "actions": [
                            {
                                "type": "Action.OpenUrl",
                                "title": "View JIRA Ticket",
                                "url": request.payload.location
                            }
                        ]
                        }
                    }
                ]
            }
        var teamsHook = "";
        chrome.storage.local.get("webhook", data =>{
            if(chrome.runtime.lastError){
                sendResponse({
                    message: 'fail'
                });
                return;
            }
            teamsHook = data.webhook;
            console.log(teamsHook);
            fetch("", {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testMessage)
            });
        });

        return true;
    }
    else if(request.message === 'update_webhook'){
        chrome.storage.local.set({
            webhook: request.payload.webhook
        });
        return true;
    }
});