"use strict";
var KBSIZE = 5; //암호판 규격
var R = 0, C = 1;
var keyInput = document.getElementById("key");
var keysetBtn = document.getElementById("key-btn");
var encryption_btn = document.getElementById("plain-txt-btn");
var decryption_btn = document.getElementById("cipher-txt-btn");
var cipherResult = document.getElementById("result-cipher-txt");
var plainResult = document.getElementById("result-plain-txt");
var plainInput = document.getElementById("plain-txt");
var cipherInput = document.getElementById("cipher-txt");
var clearBtn = document.getElementById("clear");
var cipherCopyBtn = document.getElementById("copy-cipher-btn");
var plainCopyBtn = document.getElementById("copy-plain-btn");
var boardplace = document.querySelectorAll("td");
var keyboard = new Array()[KBSIZE][KBSIZE]; //암호판
var key, raw_key;
var key_exi = false; //암호키 입력 여부
//리스너 추가
if (keysetBtn)
    keysetBtn.addEventListener("click", keySet);
if (encryption_btn)
    encryption_btn.addEventListener("click", encryption);
if (decryption_btn)
    decryption_btn.addEventListener("click", decryption);
if (clearBtn)
    clearBtn.addEventListener("click", clearAll);
if (cipherCopyBtn)
    cipherCopyBtn.addEventListener("click", function () { copy(0); });
if (plainCopyBtn)
    plainCopyBtn.addEventListener("click", function () { copy(1); });
alert("야!!!!!!!!!!!!");
function copy(type) {
}
function removeDupplication(key) {
    var newkey = "";
    for (var i = 0; i < key.length; i++) {
        var exi = false;
        for (var j = 0; j < i; j++)
            if (key[i] === key[j])
                exi = true;
        if (exi === false)
            newkey += key[i];
    }
    return newkey;
}
function keySet() {
    key = keyInput.value.replace(/(\s*)/g, ""); //스페이스 제거
    if (!key) {
        alert("Input Key");
        key_exi = false;
        return;
    }
    raw_key = keyInput === null || keyInput === void 0 ? void 0 : keyInput.value;
    key = key.toUpperCase(); //대문자 변환
    key = removeDupplication(key); //중복제거
    //암호판 제작
    var keyidx;
    var qzexi = false;
    var i = 0, j = 0;
    for (keyidx = 0; keyidx < key.length; keyidx++) {
        if (key.charAt(keyidx) == String.fromCharCode(81) || key.charAt(keyidx) == String.fromCharCode(90)) {
            if (!qzexi) {
                keyboard[i][j] = key[keyidx];
                qzexi = true;
                if (j >= KBSIZE - 1) {
                    i++;
                    j = 0;
                }
                else
                    j++;
            }
        }
        else {
            keyboard[i][j] = key[keyidx];
            if (j >= KBSIZE - 1) {
                i++;
                j = 0;
            }
            else
                j++;
        }
    }
    var alpbt = 65;
    while (i < KBSIZE && j < KBSIZE) { //보드 나머지 채우기
        //if Q and Z
        if (alpbt == 81 || alpbt == 90) {
            if (qzexi == false) { //Q나 Z가 아직 없으면
                keyboard[i][j] = String.fromCharCode(alpbt);
                qzexi = true;
                if (j >= KBSIZE - 1) {
                    i++;
                    j = 0;
                }
                else
                    j++;
            }
        }
        else { //Q와 Z를 제외한 모든 알파벳
            if (!key.search(String.fromCharCode(alpbt))) {
                keyboard[i][j] = String.fromCharCode(alpbt);
                if (j >= KBSIZE - 1) {
                    i++;
                    j = 0;
                }
                else
                    j++;
            }
        }
        alpbt++;
    }
    //Key board set
    var idx = 0;
    for (i = 0; i < KBSIZE; i++) {
        for (j = 0; j < KBSIZE; j++) {
            var char = void 0;
            if (keyboard[i][j] == String.fromCharCode(81) || keyboard[i][j] == String.fromCharCode(90))
                char = 'Q/Z';
            else
                char = keyboard[i][j];
            boardplace[idx++].innerText = char;
        }
    }
    key_exi = true;
}
function encryption() {
    var raw_plain;
    if (!key_exi) { //키 입력 확인
        alert("Input key");
        return;
    }
    //평문 입력 확인
    var plain = plainInput === null || plainInput === void 0 ? void 0 : plainInput.value.replace(/(\s*)/g, ""); //스페이스 제거
    if (!plain) {
        alert("Input plain text");
        return;
    }
    raw_plain = plainInput === null || plainInput === void 0 ? void 0 : plainInput.value;
    plain = plain.toUpperCase(); //대문자 변환
    plain = processPlainTxt(plain); //중복문자&홀수종료 뒤 X 대입
    var cipher_txt = ''; //암호문
    var fair_i = 0;
    while (fair_i < plain.length) {
        // var = [row, col]
        var left = getIndex(plain[fair_i]);
        var right = getIndex(plain[fair_i + 1]);
        //alert(`한세트 ${left} ${right}`)
        //어차피 같을 일이 없기 때문에 두개를 각각 비교>> 만약 행렬중 하나 인덱스가 같다면
        if (left[R] == right[R]) { //row가 같다면
            var left_col = void 0, right_col = void 0;
            if (left[C] < KBSIZE - 1)
                left_col = left[C] + 1;
            else
                left_col = 0;
            if (right[C] < KBSIZE - 1)
                right_col = right[C] + 1;
            else
                right_col = 0;
            cipher_txt += keyboard[left[R]][left_col];
            cipher_txt += keyboard[right[R]][right_col];
        }
        else if (left[C] == right[C]) { //col이 같다면
            var left_row = void 0, right_row = void 0;
            if (left[R] < KBSIZE - 1)
                left_row = left[R] + 1;
            else
                left_row = 0;
            if (right[R] < KBSIZE - 1)
                right_row = right[R] + 1;
            else
                right_row = 0;
            cipher_txt += keyboard[left_row][left[C]];
            cipher_txt += keyboard[right_row][right[C]];
        }
        //같은 인덱스가 없다면
        else {
            cipher_txt += keyboard[right[R]][left[C]];
            cipher_txt += keyboard[left[R]][right[C]];
        }
        fair_i += 2;
        cipher_txt += " ";
    }
    //결과 암호문 출력
    cipherResult.value = cipher_txt;
}
function getIndex(c) {
    for (var i = 0; i < KBSIZE; i++) {
        for (var j = 0; j < KBSIZE; j++) {
            if (keyboard[i][j].indexOf(c) > -1) {
                return [i, j];
            }
        }
    }
}
function processPlainTxt(text) {
    var i;
    var newstr = '';
    newstr += text[0];
    for (i = 1; i < text.length; i++) {
        if (text[i - 1] == text[i] && i % 2 == 1) { //전 문자와 중복되며 쌍자의 두번째이면
            newstr += 'X';
        }
        newstr += text[i];
    }
    if (newstr.length % 2 == 1) { //홀수자일시 마지막에 x대입
        newstr += 'X';
    }
    return newstr;
}
function decryption() {
    if (!key_exi) { //키 입력 확인
        alert("Input key");
        return;
    }
    var raw_cipher = cipherInput.value;
    //암호문 입력 확인
    var cipher = cipherInput.value.replace(/(\s*)/g, ""); //스페이스 제거
    if (!cipher) {
        alert("Input cipher text");
        return;
    }
    cipher.toUpperCase(); //대문자 변환
}
function clearAll() {
    var idx = 0;
    //암호판 지우기
    for (var i = 0; i < KBSIZE; i++) {
        for (var j = 0; j < KBSIZE; j++) {
            boardplace[idx++].value = "";
        }
    }
    //모든 input 칸 지우기
    cipherResult.value = "";
    plainResult.value = "";
    plainInput.value = "";
    cipherInput.value = "";
    keyInput.value = "";
}
