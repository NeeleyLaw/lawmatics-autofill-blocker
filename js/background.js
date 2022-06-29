/*global chrome*/
setInterval(() => {
    var inputs = document.querySelectorAll('[id^="contactAttributes"]')
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].setAttribute("autocomplete", "no-autofill")
    }
    //hideAllDeleteButtons();
}, 1000)

function callbackBoi(records) {
    hideAllDeleteButtons();
}

var uid;

function getUserCookie() {
    chrome.cookies.get({ "url": "https://app.lawmatics.com", "name": "uid" }, function (cookie) {
        uid = cookie.value;
        console.log(uid)
    });
}

var observer = new MutationObserver(callbackBoi);

var targetNode = document.body;

observer.observe(targetNode, { childList: true, subtree: true });


safeSelectors = ["matters", "clients", "companies", "contacts"]

function hideAllDeleteButtons() {
    if (document.readyState != "loading") {
        // getUserCookie();
        // console.log(uid)
        for (var i = 0; i < safeSelectors.length; i++) {
            if (window.location.pathname.includes(safeSelectors[i]) && !window.location.toString().includes("?del")) {
                var buttons = document.querySelectorAll("button, li")
                var deleteButtons = Array.from(buttons).filter(element => element.textContent.includes("Delete"))
                for (var i = 0; i < deleteButtons.length; i++) {
                    deleteButtons[i].style.display = "none"
                }

                break;
            }
        }
    }
}

setTimeout(() => {
    document.querySelector('[class*="_1pxMkFFwX3lo_o_1IJVuTD"]').insertAdjacentHTML("beforebegin", headerElement)
}, 1000)

var headerElement = `<div class="flex items-stretch" style="
                        color: #59b6ff;
                        justify-content: center;
                        align-items: center;
                        font-weight: bold;
                        font-size: 13pt;
                        "><a href="http://www.neeleylaw.com">NEELEYLAW</a>
                        </div>`
