const KBSIZE = 5 //암호판 규격
const R = 0, C = 1
const keyInput = document.getElementById("key")
const keysetBtn = document.getElementById("key-btn")
const encryption_btn = document.getElementById("plain-txt-btn")
const decryption_btn = document.getElementById("cipher-txt-btn")
const cipherResult = document.getElementById("result-cipher-txt")
const plainResult = document.getElementById("result-plain-txt")
const plainInput = document.getElementById("plain-txt")
const cipherInput = document.getElementById("cipher-txt")
const clearBtn = document.getElementById("clear")
const cipherCopyBtn = document.getElementById("copy-cipher-btn")
const plainCopyBtn = document.getElementById("copy-plain-btn")
const boardplace = document.querySelectorAll("td")

let keyboard = Array.from(Array(KBSIZE), () => new Array(KBSIZE)) //암호판
let key, raw_key

let key_exi = false //암호키 입력 여부



//리스너 추가
if(keysetBtn) keysetBtn.addEventListener("click", keySet)
if(encryption_btn) encryption_btn.addEventListener("click", encryption)
if(decryption_btn) decryption_btn.addEventListener("click", decryption)
if(clearBtn) clearBtn.addEventListener("click", clearAll)
if(cipherCopyBtn) cipherCopyBtn.addEventListener("click", copyCipher)
if(plainCopyBtn) plainCopyBtn.addEventListener("click", copyPlain)



function copyCipher(){
    cipherResult.select()
    document.execCommand("copy")
    alert("Copied!")
}
function copyPlain(){
    plainResult.select()
    document.execCommand("copy")
    alert("Copied!")
}



function resize(obj) { //textarea 사이즈 자동 조절
    obj.style.height = "1px";
    obj.style.height = (5+obj.scrollHeight)+"px";
}


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


//암호화 함수
function encryption(){

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

    const raw_plain = plainInput.value

    plain = plain.toUpperCase() //대문자 변환
    plain = processPlainTxt(plain) //중복문자&홀수종료 뒤 X 대입

    let playfairProcessed = PlayfairProcessing(plain)
    //결과 암호문 출력
    cipherResult.value = playfairProcessed.slice(0, playfairProcessed.length-1)

    resize(cipherResult)
    
}

function getIndex(c){
    for(let i=0; i<KBSIZE; i++){
        for(let j=0; j<KBSIZE; j++){
            if(keyboard[i][j].includes(c)) {
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

//복호화 함수
function decryption(){
    if(!key_exi){ //키 입력 확인
        alert("Input key")
        return
    }

    //암호문 입력 확인
    let cipher = cipherInput.value.replace(/(\s*)/g, "") //스페이스 제거
    if(!cipher) {
        alert("Input cipher text")
        return
    }
    const raw_cipher = cipherInput.value

    cipher.toUpperCase() //대문자 변환
    let playfairProcessed = PlayfairProcessing(cipher)
    //결과 평문 출력
    plainResult.value = (playfairProcessed.slice(0, playfairProcessed.length-1)).toLowerCase()
    
    resize(plainResult)
}

//keyboard를 사용한 변환
function PlayfairProcessing(text){
    let cipher_txt = '' //암호문
    let fair_i = 0

    while(fair_i < text.length){
        // var = [row, col]
        let left = getIndex(text[fair_i])
        let right = getIndex(text[fair_i + 1])
        //alert(`한세트 ${left} ${right}`)

        //어차피 같을 일이 없기 때문에 두개를 각각 비교>> 만약 행렬중 하나 인덱스가 같다면
        if(left[R] == right[R]){ //row가 같다면
            let left_col, right_col
            if(left[C] < KBSIZE-1) left_col = left[C] + 1
            else left_col = 0
            if(right[C] < KBSIZE-1) right_col = right[C] + 1
            else right_col = 0
            cipher_txt += keyboard[left[R]][left_col]
            cipher_txt += keyboard[right[R]][right_col]
        }
        else if(left[C] == right[C]){ //col이 같다면
            let left_row, right_row
            if(left[R] < KBSIZE - 1) left_row = left[R] + 1
            else left_row = 0
            if(right[R] < KBSIZE - 1) right_row = right[R] + 1
            else right_row = 0
            cipher_txt += keyboard[left_row][left[C]]
            cipher_txt += keyboard[right_row][right[C]]
        }
        //같은 인덱스가 없다면
        else{
            cipher_txt += keyboard[right[R]][left[C]]
            cipher_txt += keyboard[left[R]][right[C]]
        }
        
        fair_i += 2
        cipher_txt += " "
    }
    return cipher_txt

}

function clearAll(){
    let idx = 0
    //암호판 지우기
    for(let i=0; i<KBSIZE; i++){ 
        for(let j=0; j<KBSIZE; j++){
            boardplace[idx++].innerText = null
        }
    }

    //모든 input 칸 지우기
    cipherResult.value = null
    plainResult.value = null
    plainInput.value = null
    cipherInput.value = null
    keyInput.value = null
}