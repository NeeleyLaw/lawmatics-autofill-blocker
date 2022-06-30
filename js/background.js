/*global chrome*/
setInterval(() => {
    var inputs = document.querySelectorAll('[id^="contactAttributes"]')
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].setAttribute("autocomplete", "no-autofill")
    }
    makeMatterButtons();
}, 1000)

var deleteEnabled = false;

const toggleDeleteEnabled = () => {
    deleteEnabled = !deleteEnabled;
}


let allowDeleteButtonHTML = `<div id="injected" class="oE-YQbIeEsQILk3Eiv9Ir pt-popover-dismiss" style="height: 35px;background: #ff00003b;cursor: pointer;justify-content: center;align-items: center;color: #000000ad;display: flex;border-top: solid;border-width: 2px;"><i class="icon-warning _119eS8Qie5Aln0TDq33V5K"></i>Toggle Delete</div>`

function callbackBoi(records) {
    if (document.readyState != "loading") {
        hideAllDeleteButtons();
        makeMatterButtons();

        var popdowns = document.querySelectorAll("*[class='pv2']")
        var injectedHtmls = document.querySelectorAll("*[id='injected']")
        if (popdowns.length > 0 && injectedHtmls.length == 0) {
            popdowns[0].insertAdjacentHTML("afterend", allowDeleteButtonHTML)
            let justInjected = document.getElementById("injected")
            justInjected.addEventListener("click", toggleDeleteEnabled)
        }
    }
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
    if (document.readyState != "loading" && !deleteEnabled) {
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

function makeMatterButtons() {
    if (window.location.pathname.includes("matters") && document.readyState != "loading") {
        var nodes = document.querySelectorAll("*[role='row']")
        for (var i = 1; i < nodes.length; i++) {
            let link = nodes[i].querySelector('*[data-cy="matter-details-link"]').href
            nodes[i].style.cursor = "pointer"
            nodes[i].addEventListener("dblclick", function (e) {
                window.location.href = link
            })
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
