'use strict';
//Set 'defaultTweet' in node and set the variable in script tags on the page
//Feel free to change the IDs



//To Run When Tweet button is pressed, making textarea and button appear
function prepTweet(){
    let container = document.querySelector('#bill-more');
    let div = document.createElement('div');
    div.id = 'divId';
    let input = document.createElement('textarea');
    input.id = 'tweetBody';
    input.value = defaultTweet;
    div.appendChild(input);
    let finalizeTweetButton = document.createElement('button');
    finalizeTweetButton.appendChild(document.createTextNode('Send Tweet'));
    finalizeTweetButton.addEventListener('click', ()=>{sendTweet();});
    div.appendChild(finalizeTweetButton); 
    container.appendChild(div);
    document.querySelector('#prepTweetButton').style.display = 'none';
    document.querySelector('#tweetBody').style.color = '#000000';

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
    let input = document.querySelector('#tweetBody');
    let nonce = document.querySelector('#nonce').value;
    let data = fetch('/tweet?status=' + encodeURIComponent(input.value) + '&nonce=' + nonce, {
        method: 'GET',
        headers : {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })
    .then(response => response.json());

}