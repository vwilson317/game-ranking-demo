import signalR, * as SignalR from '@microsoft/signalr';

const connection = (() => {
    debugger
    return new signalR.HubConnectionBuilder().withUrl("http://localhost:3000/matchhub").build()})();
debugger
export function ReceiveMessage() {
    connection.on("ReceiveMessage", function (user, message) {
        console.log(message);
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var encodedMsg = user + " says " + msg;
        var li = document.createElement("li");
        li.textContent = encodedMsg;
    });
}

connection.start().catch(function (err) {
    return console.error(err.toString());
});

// document.getElementById("sendButton").addEventListener("click", function (event) {
//     var user = document.getElementById("userInput").value;
//     var message = document.getElementById("messageInput").value;
//     connection.invoke("SendMessage", user, message).catch(function (err) {
//         return console.error(err.toString());
//     });
//     event.preventDefault();
// });