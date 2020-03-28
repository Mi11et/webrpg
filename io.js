window.onload = function() {
    // 初始化
    document.getElementById("input").value = "";
    document.getElementById("output").value = "";
    // gameInit();
    startTutorial();
    return;
}

function tab(tabLength) {
    if (tabLength === 0) return;
    let tabStr = "";
    for (tabCnt = 0; tabCnt < tabLength; tabCnt++) {
        tabStr += "    ";
    }
    return tabStr.substring(1);
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
    put("错误：");
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
        pterr("命令", command[0], "不存在");
        result = false;
    } else {
        result = commandsList[command.shift()](command);
    }
    document.getElementById("output").value += '\n';
    if (result && checkTasks(inputString)) document.getElementById("output").value += '\n';
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