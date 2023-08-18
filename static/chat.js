const form = document.querySelector('#form-panel');
const input = document.querySelector('#messageinput');
const button = document.querySelector('#submit');
const messages = document.querySelector('#messagebox');

const messageHistory = [];
const audioHistory = [];

input.setAttribute("style", "height:" + Math.max(input.scrollHeight - 10, 28) + "px;overflow-y:hidden;");
input.addEventListener("input", OnInput, false);
input.addEventListener("change", OnInput, false);
window.addEventListener("resize", OnInput, false);

function OnInput() {
    input.style.height = 0;
    input.style.height = (input.scrollHeight) + "px";
}

function SetAudio(index, playing) {
    const audio = document.querySelector(`#audio-${index}`);
    if(playing) {
        audioHistory[index].play();
        audio.innerHTML = `<use xlink:href="/static/svg/pause.svg#id"/>`;
    } else {
        audioHistory[index].pause();
        audio.innerHTML = `<use xlink:href="/static/svg/play.svg#id"/>`;
    }
}

function PlayAudio(index) {
    for(let i = 0; i < audioHistory.length; i++) {
        if(i != index) SetAudio(i, false);
        else {
            if(audioHistory[i].paused) {
                audioHistory[i].currentTime = 0;
                SetAudio(i, true);
            } else SetAudio(i, false);
        }
    }
}

function Submit() {
    // Get message
    const message = input.value;

    // Disable button & remove text
    input.value = '';
    button.disabled = true;

    // Add message to history
    messages.innerHTML += `<div class="panel message">
        <svg class="profile" width="32" height="32">
            <use xlink:href="/static/svg/person.svg#id"/>
        </svg>
        <p>${message}</p>
    </div>`;
    messages.scrollTop = messages.scrollHeight;
    messageHistory.push(message);
    
    // REQUEST DATA FROM SERVER
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/', true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            // Get response
            response = JSON.parse(xhr.responseText);

            // Add message to history
            messages.innerHTML += `<div class="message panel">
                <svg class="profile" width="32" height="32">
                    <use xlink:href="/static/svg/ai.svg#id"/>
                </svg>
                <p>${response.message}</p>
                <button class="audiobutton" onclick="PlayAudio(${audioHistory.length})">
                    <svg id="audio-${audioHistory.length}" width="18" height="18">
                        <use xlink:href="/static/svg/play.svg#id"/>
                    </svg>
                </button>
            </div>`;
            messages.scrollTop = messages.scrollHeight;
            messageHistory.push(response.message);

            // Add audio to history
            let audio = new Audio();
            audio.src = "data:audio/wav;base64," + response.audio;
            audio.id = audioHistory.length;
            audio.onended = function(e) {
                SetAudio(e.target.id, false);
            }
            audioHistory.push(audio);
            PlayAudio(audioHistory.length - 1);

            // Re-enable button
            button.disabled = false;
        }
    }
    xhr.send(JSON.stringify({messageHistory: messageHistory}));
}

form.onsubmit = function(event) {
    event.preventDefault();
    Submit();
}

input.addEventListener('keypress', function (event) {
    if (event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault();
        if (!button.disabled) Submit();
    }
});