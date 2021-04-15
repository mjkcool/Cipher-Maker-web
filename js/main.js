const keyInput = document.getElementById("key")
const keysetBtn = document.getElementById("key-btn")

keysetBtn.addEventListener("click", keySet)


function keySet(){
    let key = keyInput.value.replace(/(\s*)/g, "")
    if(!key) {
        alert("Input Key")
        return
    }
    //암호판 배치

}