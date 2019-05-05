//Set 'defaultTweet' in node and set the variable in script tags on the page
//Feel free to change the IDs



//To Run When Tweet button is pressed, making textarea and button appear
function prepTweet(str){
    let container = document.querySelector('whatever');
    let div = document.createElement('div');
    div.id = 'divId';
    let input = document.createElement('textarea');
    input.id = 'tweetBody';
    input.value = defaultTweet;
    div.appendChild(input);
    let finalizeTweetButton = document.createElement('button');
    finalizeTweetButton.appendChild(document.createTextNode('Send Tweet'));
    finalizeTweetButton.addEventListener('click', sendTweet());
    div.appendChild(finalizeTweetButton); 
}

//say something after request goes through
function displayStatusMessage(msg) {
    let messageDiv = document.createElement('div'),
        cont = document.querySelector('#divID'); 
        clearChildren(cont);
        messageDiv.appendChild(document.createElement(msg));
        cont.appendChild(messageDiv);
}

//auxiliary function
function clearChildren(elem){
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

//send tweet with body being textarea's value
async function sendTweet(){
    let input = document.querySelector('tweetBody');
    return fetch('/tweet?status=' + encodeURIComponent(input.value), {
        method: 'GET',
        headers : {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
    .then(response => {
        let data = response.json();
        if(response.status !== 200){
            displayStatusMessage('Didn\'t Work. :(');
        } else {
            if (data.body.msg === 'failue'){
                displayStatusMessage('Didn\'t Work. :(');
            } else {
                displayStatusMessage('It Worked! :)');
            }
        }
    });
}