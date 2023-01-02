/*global chrome*/

admins = ["kenn@neeleylaw.com"]

setInterval(() => {
    var inputs = document.querySelectorAll('[id^="contactAttributes"]')
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].setAttribute("autocomplete", "no-autofill")
    }
    makeMatterButtons();

    // If we are in settings
    if (window.location.pathname.includes("settings")) {
        checkAdmin().then((isAdmin) => {
            if (!isAdmin) {
                var buttons = document.querySelectorAll("button, a")
                var forbiddenButtons = Array.from(buttons).filter(element => (element.textContent.includes("Developers") || element.textContent.includes("Pipelines") || element.textContent.includes("Contacts")))
                forbiddenButtons.forEach(element => {
                    element.style.display = "none"
                })
            }
        })
    }
}, 1000)

document.addEventListener("click", (e) => {
    // Wait for stuff to load in
    setTimeout(() => {
        // if path is /notes or /activities and body exists and mentionsList doesn't exist
        if ((window.location.pathname.includes("notes") || window.location.pathname.includes("activities")) && document.getElementById("body") && document.getElementById("mentionsList") == null) {
            insertMentionsList();
        }
    }, 50)

    // Double check deleteEnabled is true
    if (!window.location.href.includes("?del")) {
        deleteEnabled = false;
    }
})

setTimeout(() => {
    var parentElement = document.getElementById("topbar")
    parentElement.insertBefore(headerElement, parentElement.childNodes[1])

    // if "?del" is in the URL, enable delete buttons
    if (window.location.toString().includes("?del")) {
        deleteEnabled = true
    }
}, 1000)

var deleteEnabled = false;

const toggleDeleteEnabled = () => {
    deleteEnabled = !deleteEnabled;
    if (deleteEnabled) {
        window.location.href = window.location.href + "?del";
    }
}

// Get currently focused element
function getFocusedNoteBody() {
    // Check if its a text input
    var focusedElement = document.activeElement;
    // Check if its id is "body"
    if (focusedElement.id == "body") {
        return focusedElement;
    }
    return null;
}

async function checkAdmin() {
    var uid = await getUserCookie();
    // url decode
    uid = decodeURIComponent(uid);
    if (admins.includes(uid)) {
        return true;
    }
}

// {"name":"KennethNeeley","id":"6595"},{"name":"AmberRay","id":"7839"},{"name":"KarenBentley","id":"7840"},{"name":"CarolineZemp","id":"7841"},{"name":"EmmaNeeley","id":"7843"},{"name":"NickVanVleet","id":"7844"},{"name":"NikkiPadgen","id":"7845"},{"name":"GeoffreyKhotim","id":"7846"},{"name":"RosaCarrera","id":"7848"},{"name":"CaleyPesicka","id":"7849"},{"name":"JusticePierce","id":"7850"},{"name":"JocelynRick","id":"7851"},{"name":"TamaraLang","id":"11714"},{"name":"AngieDaniel","id":"11715"}
var mentionsList = `
<style>
    .mention {
        border: 1px solid #9099a8;
        padding: 5px;
        border-radius: 6px;
        margin: 5px 10px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        user-select: none;
        select: none;
    }
    .mention.included {
        background: #d2d8de;
    }
    .mention-label {
        color: #1f344c;
        font-size: 10px;
        line-height: 1.3;
        text-transform: uppercase;
    }
    .mention:hover {
        background: #c1c7ce;
    }
</style>
<label for="mentionsList" class="mention-label">MENTION</label>
<div style="display: flex; flex-direction: row; flex-wrap: wrap;" id="mentionsList">
<div class="mention" id="kln">Kenneth Neeley</div>
<div class="mention" id="acr">Amber Ray</div>
<div class="mention" id="kgb">Karen Bentley</div>
<div class="mention" id="cmz">Caroline Zemp</div>
<div class="mention" id="emn">Emma Neeley</div>
<div class="mention" id="ntv">Nick Van Vleet</div>
<div class="mention" id="nmp">Nikki Padgen</div>
<div class="mention" id="gmk">Geoffrey Khotim</div>
<div class="mention" id="ric">Rosa Carrera</div>
<div class="mention" id="cbp">Caley Pesicka</div>
<div class="mention" id="jdp">Justice Pierce</div>
<div class="mention" id="jcr">Jocelyn Rick</div>
<div class="mention" id="tll">Tamara Lang</div>
<div class="mention" id="add">Angie Daniel</div>
</div>
`

function insertMentionsList() {
    var body = document.getElementById("body")
    body.insertAdjacentHTML("afterend", mentionsList)
    document.querySelectorAll(".mention").forEach((mention) => {
        mention.addEventListener("click", (e) => {
            if (!document.getElementById("body").value.includes("@" + e.target.id)) {
                document.getElementById("body").value += "@" + e.target.id + " ";
                document.getElementById("body").focus();
                document.execCommand("insertText", false, " ");
                document.execCommand("undo");
                e.target.classList.add("included")
            } else {
                document.getElementById("body").value = document.getElementById("body").value.replace("@" + e.target.id + " ", "");
                document.getElementById("body").focus();
                document.execCommand("insertText", false, " ");
                document.execCommand("undo");
                e.target.classList.remove("included")
            }
        })
    })
}

let allowDeleteButtonHTML = `<div id="injected" class="oE-YQbIeEsQILk3Eiv9Ir pt-popover-dismiss" style="height: 35px;background: #ff00003b;cursor: pointer;justify-content: center;align-items: center;color: #000000ad;display: flex;border-top: solid;border-width: 2px;"><i class="icon-warning _119eS8Qie5Aln0TDq33V5K"></i>Enable Delete</div>`

function callbackBoi(records) {
    if (document.readyState != "loading") {
        hideAllDeleteButtons();
        makeMatterButtons();

        var popdowns = document.querySelectorAll("ul > *[class='pv2']")
        var injectedHtmls = document.querySelectorAll("*[id='injected']")
        if (popdowns.length > 0 && injectedHtmls.length == 0) {
            popdowns[0].insertAdjacentHTML("afterend", allowDeleteButtonHTML)
            let justInjected = document.getElementById("injected")
            justInjected.addEventListener("click", toggleDeleteEnabled)
        }
    }
}

var uid;

async function getUserCookie() {
    let cookie = await window.cookieStore.get("uid")
    uid = cookie.value
    return uid
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

// Focus on the textarea and press spacebar
function focusLock() {
    document.getElementById("body").focus();
    chrome.runtime.sendMessage({ message: "focusLock" }).then(function (response) {
        console.log(response)
    });
}

// Turns the background of the matter into a double-clickable link
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


var headerElement = createElementFromHTML(`<div class="flex items-stretch" style="
                        color: #59b6ff;
                        justify-content: center;
                        align-items: center;
                        font-weight: bold;
                        font-size: 13pt;
                        "><a href="http://www.neeleylaw.com">NEELEYLAW</a>
                        </div>`)

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
}