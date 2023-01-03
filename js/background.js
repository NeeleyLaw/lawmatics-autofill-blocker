function start() {
    chrome.tabs.query({ url: "https://app.lawmatics.com/*" }).then((tabs) => {
        if (tabs.length == 0) {
            return;
        }
        
        // Execute script in tabs
        for (var i = 0; i < tabs.length; i++) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[i].id },
                files: ["js/script.js"],
            });
        }
    });
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        start();
    }
})

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // if( request.message === "focusLock" ) {
        //     // Attatch debugger to tab
        //     chrome.debugger.attach({
        //         tabId: sender.tab.id
        //     }, "1.3", function () {
        //         // Enable input domain
        //         chrome.debugger.sendCommand({tabId: sender.tab.id}, "Input.enable");
        //     });
            
        //     // Send space key
        //     chrome.debugger.sendCommand({tabId: sender.tab.id}, "Input.dispatchKeyEvent", {
        //         type: "keyDown",
        //         windowsVirtualKeyCode: 32,
        //         nativeVirtualKeyCode: 32,
        //         macCharCode: 32,
        //         unmodifiedText: " ",
        //         text: " ",
        //         keyIdentifier: "U+0020",
        //         code: "Space",
        //         key: " ",
        //         location: 0,
        //         autoRepeat: false,
        //         isKeypad: false,
        //         isSystemKey: false
        //     });
        //     sendResponse({message: "success"});
        // }
    }
);