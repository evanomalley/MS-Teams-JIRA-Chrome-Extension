const saveBtn = document.getElementById("saveBtn");
const webhookInput = document.getElementById("webhookInput");

if(saveBtn){
    saveBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({
            message: "update_webhook",
            payload: {
                webhook : webhookInput.value
            }
        });
        webhookInput.value = "";
    });
}