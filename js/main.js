const KBSIZE = 5
const keyInput = document.getElementById("key")
const keysetBtn = document.getElementById("key-btn")
let keyboard = Array.from(Array(KBSIZE), () => new Array(KBSIZE))


keysetBtn.addEventListener("click", keySet)


function keySet(){ //make key board
    let key = keyInput.value.replace(/(\s*)/g, "")
    if(!key) {
        alert("Input Key")
        return
    }

    key = key.toUpperCase() //대문자 변환
    //중복제거
    let newkey = ""
    for(let i=0; i<key.length;i++){
        let exi = false
        for(let j=0; j<i; j++) if(key[i]===key[j]) exi = true
        if(exi===false) newkey += key[i]
    }
    key = newkey
    
    //암호판 제작
    let keyidx
    let qzexi = false
    let i = 0, j = 0
    
    for(keyidx = 0; keyidx < key.length; keyidx++){
        if(key.charAt(keyidx) == String.fromCharCode(81) || key.charAt(keyidx) == String.fromCharCode(90)){
            if(qzexi = false){
                keyboard[i][j] = key[keyidx]
                qzexi = true

                if(j>=KBSIZE - 1){
                    i++
                    j = 0
                }else j++
            }
        }else{
            keyboard[i][j] = key[keyidx]
            if(j>=KBSIZE - 1){
                i++
                j = 0
            }else j++
        }
    }
    let alpbt = 65
    while(i<KBSIZE && j<KBSIZE){ //보드 나머지 채우기
        //if Q and Z
        if(alpbt==81 || alpbt==90){
            if(qzexi == false){ //Q나 Z가 아직 없으면
                keyboard[i][j] = String.fromCharCode(alpbt)
                qzexi = true

                if(j>=KBSIZE - 1){
                    i++
                    j = 0
                }else j++
            }
        }
        else{ //Q와 Z를 제외한 모든 알파벳
            if(!key.includes(String.fromCharCode(alpbt))){
                keyboard[i][j] = String.fromCharCode(alpbt)
                if (j >= KBSIZE - 1) {
                    i++
                    j = 0
                }else j++
            }
        }
        alpbt++
    }
    
    let boardplace = document.querySelectorAll("td")
    
    let idx = 0
    for (i = 0; i < KBSIZE; i++) {
		for (j = 0; j < KBSIZE; j++) {
			boardplace[idx++].innerText = keyboard[i][j]
		}
	}

}