if(typeof init === 'undefined'){
    const init = function() {
        const injectElement = document.createElement('button');
        injectElement.className = "teams-post-btn";
        injectElement.innerHTML = "Update Team";
        const elms = document.querySelectorAll('div[data-test-id*=status-and-approvals]');
        const hasExisting = document.getElementsByClassName("teams-post-btn")

        if(elms.length > 0){
            
            elms[0].children[0].appendChild(injectElement);

            injectElement.addEventListener('click', ()=>{
                console.log('clicked');
                var payload = {
                    location : window.location.href,
                    status : ""
                }

                var nStatus = "n/a";

                try{
                    nStatus = document.querySelectorAll('div[data-test-id*=ref-spotlight-target-status-spotlight]')[0].children[0].children[0].children[0].children[0].children[0].innerText;
                } catch (e){}

                
                var titleTag = document.querySelectorAll('h1[data-test-id*=heading]');
                
                payload.status = nStatus;
                
                if(titleTag.length > 0){
                    payload.title = titleTag[0].innerText
                }
                chrome.runtime.sendMessage({
                    message: "post_to_teams",
                    payload : payload
                })
            });
        }
    }

    init();
}