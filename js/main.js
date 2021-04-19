const KBSIZE = 5 //암호판 규격
const keyInput = document.getElementById("key")
const keysetBtn = document.getElementById("key-btn")
const encryption_btn = document.getElementById("plain-txt-btn")
const decryption_btn = document.getElementById("cipher-txt-btn")
const plainInput = document.getElementById("plain-txt")
const cipherInput = document.getElementById("cipher-txt")
let keyboard = Array.from(Array(KBSIZE), () => new Array(KBSIZE)) //암호판
let key, raw_key

let key_exi = false //암호키 입력 여부

//리스너 추가
if(keysetBtn) keysetBtn.addEventListener("click", keySet)
if(encryption_btn) encryption_btn.addEventListener("click", encryption)
if(decryption_btn) decryption_btn.addEventListener("click", decryption)


function removeDupplication(key){ //중복제거함수
    let newkey = ""
    for(let i=0; i<key.length; i++){
        let exi = false
        for(let j=0; j<i; j++) if(key[i]===key[j]) exi = true
        if(exi===false) newkey += key[i]
    }
    return newkey
}


function keySet(){ //make key board
    key = keyInput.value.replace(/(\s*)/g, "") //스페이스 제거
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
    let raw_plain

    if(!key_exi){ //키 입력 확인
        alert("Input key")
        return
    }

    //평문 입력 확인
    let plain = plainInput.value.replace(/(\s*)/g, "") //스페이스 제거
    if(!plain) {
        alert("Input plain text")
        return
    }

    raw_plain = plainInput.value

    plain = plain.toUpperCase() //대문자 변환
    plain = processPlainTxt(plain) //중복문자&홀수종료 뒤 X 대입

    let cipher_txt = '' //암호문
    let fair_i = 0
    
    while(fair_i < plain.length){
        // var = [row, col]
        let left = getIndex(plain[fair_i])
        let right = getIndex(plain[fair_i + 1])
        //alert(`한세트 ${left} ${right}`)

        //어차피 같을 일이 없기 때문에 두개를 각각 비교>> 만약 행렬중 하나 인덱스가 같다면
        if(left[0] == right[0]){
            let val_left, val_right
            if(left[1] < KBSIZE-1) val_left = left[1] + 1
            else val_left = 0
            if(right[1] < KBSIZE-1) val_right = right[1] + 1
            else val_right = 0
            cipher_txt += keyboard[left[0]][val_left]
            cipher_txt += keyboard[right[0]][val_right]
        }
        else if(left[1] == right[1]){
            let val_left, val_right
            if(left[0] < KBSIZE - 1) val_left = left[0] + 1
            else val_left = 0
            if(right[0] < KBSIZE - 1) val_right = left[0] +1
            else val_right = 0
            cipher_txt += keyboard[val_left][left[1]]
            cipher_txt += keyboard[val_right][right[1]]
        }
        //같은 인덱스가 없다면
        else{
            let max_row, max_col
            if(left[0] < right[0]) max_row = right[0]
            else max_row = left[0]
            cipher_txt += keyboard[max_row][left[1]]
            if(left[1] < right[1]) max_col = right[1]
            else max_col = left[1]
            cipher_txt += keyboard[right[0]][max_col]
        }
        
        fair_i += 2
    }

    alert(cipher_txt)
    
}

function getIndex(c){
    for(let i=0; i<KBSIZE; i++){
        for(let j=0; j<KBSIZE; j++){
            if(keyboard[i][j] == c) {
                return [i, j]
            }
        }
    }
}


function processPlainTxt(text){
    let i
    let newstr = ''

    newstr += text[0]
    for(i = 1; i < text.length; i++){
        if(text[i-1] == text[i] && i%2==1){ //전 문자와 중복되며 쌍자의 두번째이면
            newstr += 'X'
        }
        newstr += text[i]
    }
    if(newstr.length % 2==1){ //홀수자일시 마지막에 x대입
        newstr += 'X'
    }
    return newstr
}


function decryption(){
    if(!key_exi){ //키 입력 확인
        alert("Input key")
        return
    }
    let raw_cipher = cipherInput.value

    //암호문 입력 확인
    let cipher = cipherInput.value.replace(/(\s*)/g, "") //스페이스 제거
    if(!cipher) {
        alert("Input cipher text")
        return
    }
    cipher.toUpperCase() //대문자 변환
    

}