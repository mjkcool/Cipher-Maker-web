const KBSIZE = 5
const keyInput = document.getElementById("key")
const keysetBtn = document.getElementById("key-btn")
const encryption_btn = document.getElementById("plain-txt-btn")
const decryption_btn = document.getElementById("cipher-txt-btn")
const plainInput = document.getElementById("plain-txt")
const cipherInput = document.getElementById("cipher-txt")
let keyboard = Array.from(Array(KBSIZE), () => new Array(KBSIZE))
let key, raw_key

let key_exi = false //암호키 입력 여부

//리스너 추가
if(keysetBtn) keysetBtn.addEventListener("click", keySet)
if(encryption_btn) encryption_btn.addEventListener("click", encryption)
if(decryption_btn) decryption_btn.addEventListener("click", decryption)

function removeDupplication(key){
    let newkey = ""
    for(let i=0; i<key.length;i++){
        let exi = false
        for(let j=0; j<i; j++) if(key[i]===key[j]) exi = true
        if(exi===false) newkey += key[i]
    }
    return newkey
}


function keySet(){ //make key board
    key = keyInput.value.replace(/(\s*)/g, "")
    if(!key) {
        alert("Input Key")
        key_exi = false
        return
    }
    raw_key = keyInput.value

    key = key.toUpperCase() //대문자 변환
    key = removeDupplication(key) //중복제거
    
    //암호판 제작
    let keyidx
    let qzexi = false
    let i = 0, j = 0
    
    for(keyidx = 0; keyidx < key.length; keyidx++){
        if(key.charAt(keyidx) == String.fromCharCode(81) || key.charAt(keyidx) == String.fromCharCode(90)){
            if(!qzexi){
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
    
    //Key board set
    let idx = 0
    for (i = 0; i < KBSIZE; i++) {
		for (j = 0; j < KBSIZE; j++) {
            let char
            if(keyboard[i][j] == String.fromCharCode(81) || keyboard[i][j] == String.fromCharCode(90)) char = 'Q/Z'
            else char = keyboard[i][j]
			boardplace[idx++].innerText = char
		}
	}
    key_exi = true
}


function encryption(){
    if(!key_exi){ //키 입력 확인
        alert("Input key")
        return
    }
    //평문 입력 확인
    let plain = plainInput.value

}


function decryption(){
    if(!key_exi){ //키 입력 확인
        alert("Input key")
        return
    }
    //암호문 입력 확인
    let cipher = cipherInput.value

}