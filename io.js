window.onload = function() {
    // 初始化
    clearTextArea();
    gameInit();
    return;
}

function clearTextArea() {
    document.getElementById("input").value = "";
    document.getElementById("output").value = "";
    inputHistory.init();
    return;
}

function indent(targetString, formatString) {
    // 给字符串添加缩进，返回缩进后的字符串
    // 参数为要缩进的字符串和一个表示缩进方法的字符串。
    // 缩进方法的格式为：左侧空格数 + L/R + 期望长度 + 右侧空格数，用 # 分隔
    // 左/右侧空格数默认为 0 ，缩进方法默认为左对齐（L），期望长度默认为字符串长度
    let getLength = (str) => {
        return str.replace(/[\u4e00-\u9fff]/g, "__").length;
    }
    let tab = (spaceLength) => {
        if (spaceLength <= 0) return "";
        let res = "";
        for (let spaceCnt = 0; spaceCnt < spaceLength; spaceCnt++) {
            res += " ";
        }
        return res;
    }
    let resultString = "";
    let len = getLength(targetString);
    let format = formatString.split('#');
    if (format.length > 4) return;
    for (let i in format) {
        if (format[i] === '' && i != 1) {
            format[i] = 0;
        }
    }
    resultString += tab(parseInt(format[0])); // 左侧空格
    let diff = tab(parseInt(format[2]) - len);
    if (format[1] === 'L' || format[1] === '') resultString += targetString + diff; // 左对齐
    if (format[1] === 'R') resultString += diff + targetString; // 右对齐
    resultString += tab(parseInt(format[3])); // 右侧空格
    return resultString;
}

function pt() {
    // 打印输出，以空格为间隔，以换行结尾。
    let outBuf = "";
    let put = (val) => {
        outBuf += val;
    };
    if (arguments.length > 0) {
        let outs = Array.from(arguments);
        for (let i of outs) {
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
    let put = (val) => {
        outBuf += val;
    };
    let outs = Array.from(arguments);
    // put(" ❌ ");
    for (let i of outs) {
        put(i);
        put(' ');
    };
    put('\n');
    document.getElementById("output").value += outBuf;
    return;
}

function getCommand(inputString) {
    // 接收到命令之后的处理

    // 分割命令
    let command = inputString.split(' ');
    let emptyElement = [];
    for (let i in command) {
        if (command[i] == "") emptyElement.push(i);
    }
    while (emptyElement.length) {
        command.splice(emptyElement.pop(), 1);
    }
    if (command.length === 0) return;
    inputString = "";
    for (let i of command) {
        inputString += ' ' + i;
    }
    inputString = inputString.substring(1);

    // 识别命令
    let result;
    if (commandsList[command[0]] === undefined) {
        pterr("你要做什么？");
        result = false;
    } else if (!checkCommandAvailable(command[0])) {
        pterr("该命令暂时不可用。");
        result = false;
    } else {
        // 执行对应命令
        let commandName = commandsList[command.shift()];
        while (typeof commandName === "string") {
            // 对命令别名/缩写进行跳转
            commandName = commandsList[commandName];
        }
        result = commandName(command);
    }
    document.getElementById("output").value += '\n';
    if ([true, undefined].includes(result)) {
        // 判断是否完成某个任务
        checkTasks(inputString);
    }
    // 自动滚动
    document.getElementById("output").scrollTop = 
        document.getElementById("output").scrollHeight;
    return;
}

function playerStartMoving() {
    printMap();
    document.getElementById("input").readOnly = "readonly";
    document.getElementById("input").value = "移动中，按 m 停止移动";
    document.getElementById("input").style.textAlign = "center";
    gamedata.player.status.moving = true;
    return;
}

function playerEndMoving() {
    document.getElementById("input").readOnly = "";
    document.getElementById("input").value = "";
    document.getElementById("input").style.textAlign = "left";
    gamedata.player.status.moving = false;
    return;
}

function onReturn() {
    // 移动模式
    let moveNear = function(dest) {
        if (gamedata.map[gamedata.player.location].near.hasOwnProperty(dest)) {
            playerMove(gamedata.map[gamedata.player.location].near[dest]);
            nextRound();
        } else {
            pterr("那边无路可走。");
        }
        // 自动滚动
        document.getElementById("output").scrollTop = 
            document.getElementById("output").scrollHeight;
        return;
    }
    if (gamedata.player.status.moving) {
        event.preventDefault();
        if (event.repeat === true) {
            // 避免长按导致多次移动
            return;
        }
        switch (event.keyCode) {
            case 87: {
                moveNear("up"); break; // w
            }
            case 65: {
                moveNear("left"); break; // a
            }
            case 83: {
                moveNear("down"); break; // s
            }
            case 68: {
                moveNear("right"); break; // d
            }
            case 77: {
                playerEndMoving(); break; // m
            }
        }
        return;
    }
    // 非移动模式
    if (event.keyCode === 38) {
        // 上一条历史命令
        event.preventDefault();
        if (inputHistory.focus < inputHistory.list.length - 1) {
            inputHistory.focus++;
        }
        if (inputHistory.focus != -1) {
            document.getElementById("input").value = inputHistory.list[inputHistory.focus];
        }
    }
    if (event.keyCode === 40) {
        // 下一条历史命令
        event.preventDefault();
        if (inputHistory.focus > -1) {
            inputHistory.focus--;
        }
        if (inputHistory.focus != -1) {
            document.getElementById("input").value = inputHistory.list[inputHistory.focus];
        } else {
            document.getElementById("input").value = ""
        }
    }
    if (event.keyCode === 13) {
        // 回车
        event.preventDefault();
        let inputString = document.getElementById("input").value;
        document.getElementById("input").value = "";

        // 记入历史命令
        if (inputString != inputHistory.list[inputHistory.focus]) {
            inputHistory.list = [inputString].concat(inputHistory.list);
        }
        inputHistory.focus = -1;

        // 传递命令
        getCommand(inputString);
        return;
    }
}

let inputHistory = {
    init : () => {
        focus = -1,
        list = [];
    },
    focus : -1,
    list : []
};