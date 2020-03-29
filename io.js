window.onload = function() {
    // 初始化
    document.getElementById("input").value = "";
    document.getElementById("output").value = "";
    // gameInit();
    startTutorial();
    return;
}

function indent(targetString, formatString) {
    // 给字符串添加缩进，返回缩进后的字符串
    // 参数为要缩进的字符串和一个表示缩进方法的字符串。
    // 缩进方法的格式为：左侧空格数 + L/R + 期望长度 + 右侧空格数，用 # 分隔
    // 左/右侧空格数默认为 0 ，缩进方法默认为左对齐（L），期望长度默认为字符串长度
    let getLength = function(str) {
        return str.replace(/[\u4e00-\u9fff]/g, "__").length;
    }; 
    let tab = function(spaceLength) {
        if (spaceLength <= 0) return "";
        let res = "";
        for (spaceCnt = 0; spaceCnt < spaceLength; spaceCnt++) {
            res += " ";
        }
        return res;
    }
    let resultString = "";
    let stringList = Array.from(arguments);
    let len = getLength(targetString);
    let format = formatString.split('#');
    resultString += tab(parseInt(format[0]));
    let diff = tab(parseInt(format[2]) - len);
    if (format[1] === 'L' || format[1] === '') resultString += targetString + diff;
    if (format[1] === 'R') resultString += diff + targetString;
    resultString += tab(parseInt(format[3]));
    return resultString;
}

function pt() {
    // 打印输出，以空格为间隔，以换行结尾。
    let outBuf = "";
    let put = function(val) {
        outBuf += val;
    };
    if (arguments.length > 0) {
        let outs = Array.from(arguments);
        for (i of outs) {
            put(i);
            put(' ');
        }
    }
    put('\n');
    document.getElementById("output").value += outBuf;
    return;
}

function pterr() {
    // 打印错误，和 pt() 类似。
    let outBuf = "";
    let put = function(val) {
        outBuf += val;
    };
    let outs = Array.from(arguments);
    put(" ❌ ");
    for (i of outs) {
        put(i);
        put(' ');
    };
    put('\n');
    document.getElementById("output").value += outBuf;
    return;
}

function getCommand(inputString) {
    // 调用命令
    {
        let tmpString = inputString.replace("  ", " ");
        while (tmpString !== inputString) {
            inputString = tmpString;
            tmpString = inputString.replace("  ", " ");
        }
        if (inputString[0] === ' ') {
            inputString = inputString.substring(1);
        }
    }
    if (inputString === "") return;
    let command = inputString.split(' ');
    let result;
    if (commandsList[command[0]] === undefined) {
        pterr("你要做什么？");
        result = false;
    } else {
        result = commandsList[command.shift()](command);
    }
    document.getElementById("output").value += '\n';
    if ((result || result === undefined) && checkTasks(inputString)) {
        document.getElementById("output").value += '\n';
    }
    document.getElementById("output").scrollTop = 
        document.getElementById("output").scrollHeight;
    return;
}

function onReturn() {
    // 传递命令
    if (event.keyCode === 13) {
        event.preventDefault();
        getCommand(document.getElementById("input").value);
        document.getElementById("input").value = "";
        return;
    }
}