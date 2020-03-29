let commandsList = {
    "help" : function() {
        if (arguments[0].length > 1) {
            pterr("一次只能查询一种命令。");
            return false;
        }
        let commandToQuery = "";
        if (arguments[0].length === 0) {
            commandToQuery = "help";
        } else {
            commandToQuery = arguments[0][0];
        }
        if (gamedata.helpText.hasOwnProperty(commandToQuery)) {
            pt(commandToQuery, "命令的使用方法如下：");
            for (i in gamedata.helpText[commandToQuery]) {
                pt(indent(i, "4##16#4") + gamedata.helpText[commandToQuery][i])
            }
            return true;
        } else {
            pterr("找不到", commandToQuery, "命令的说明");
            return false;
        }
    },
    "look" : function() {
        if (arguments[0].length === 0) {
            pt("你看了看周围。");
            describeLocation();
            return true;
        } else {
            let target = "";
            for (i of arguments[0]) {
                target += " " + i;
            }
            target = target.substring(1);
            let range = [].concat(gamedata.player.items).concat(gamedata.player.location.items);
            for (i in range) {
                if (range[i].id === target) {
                    pt(describeItem(range[i], 1));
                    return true;
                }
            }
            pt("这里没有", target, "。");
            return false;
        }
    },
    "inv" : function() {
        if (arguments[0].length === 0) {
            pt("你看了看你的口袋。");
            pt("里面有：");
            for (i of gamedata.player.items) {
                pt(indent(describeItem(i, 0), "4###"));
            }
            return true;
        } else {
            pterr("参数过多。");
            return false;
        }
    },
    "task" : function() {
        if (arguments[0].length > 0) {
            pterr("参数过多。");
            return false;
        }
        pt("=== 任务列表 ===============");
        if (gamedata.player.tasks.length === 0) {
            pt(indent("你现在没有要做的事。", "4###"));
        } else {
            for (i of gamedata.player.tasks) {
                pt(indent('【' + i.name + '】' + i.detail, "4###"));
            }
        }
        return true;
    },
    "whoami" :　function() {
        if (arguments[0].length > 0) {
            pterr("参数过多。");
            return false;
        }
        pt("=== 角色信息 ===============");
        pt(indent("名字", "4##10#2") + gamedata.player.name);
        return true;
    },
    "read" : function() {
        let target = "";
        for (i of arguments[0]) {
            target += " " + i;
        }
        target = target.substring(1);
        let range = [].concat(gamedata.player.items).concat(gamedata.player.location.items);
        for (i of range) {
            if (i.id === target) {
                if (!i.hasOwnProperty("content")) {
                    pterr(target, "没什么好读的。")
                }
                pt(readContent(i));
                return true;
            }
        }
        pt("这里没有", target, "。");
        return false;

    }
}

function checkTasks(playerAction) {
    let taskFinishFlag = false;
    for (taskIndex in gamedata.player.tasks) {
        if (playerAction === gamedata.player.tasks[taskIndex].requirement
                && gamedata.player.location === gamedata.map[gamedata.player.tasks[taskIndex].location]) {
            pt("你完成了任务【" + gamedata.player.tasks[taskIndex].name + "】。");
            if (gamedata.player.tasks[taskIndex].hasOwnProperty("dialogueWhenFinish")) {
                characterSpeak("me", gamedata.player.tasks[taskIndex].dialogueWhenFinish);
            }
            if (gamedata.player.tasks[taskIndex].hasOwnProperty("next")) {
                playerAddTask(gamedata.player.tasks[taskIndex].next);
                pt("新的任务【" + gamedata.tasks[gamedata.player.tasks[taskIndex].next].name + "】已追加。");
            }
            gamedata.player.tasks.splice(taskIndex, 1);
            taskFinishFlag = true;
        }
    }
    return taskFinishFlag;
}

function gameInit() {
    pt("这是一个命令行冒险游戏。");
    pt("输入 start new 开始一场新的冒险。");
    return;
}

function characterSpeak(speaker, speech) {
    // 某个人说了某句话
    // speaker 参数不一定是一个角色，也可以是字符串 "me" ，表示玩家自己说了什么
    if (speaker === "me") {
        pt("【我】" + speech);
    } else {
        pt("【" + speaker.name + "】" + speech);
    }
    return;
}

function playerMove(dest) {
    if (gamedata.map.hasOwnProperty(dest) === false) {
        return;
    }
    gamedata.player.location = gamedata.map[dest];
    describeLocation();
    document.getElementById("output").value += '\n';
    return;
}

function playerAddTask(taskName) {
    if (gamedata.tasks.hasOwnProperty(taskName) === false) {
        return;
    }
    gamedata.player.tasks.push(gamedata.tasks[taskName]);
    if (gamedata.tasks[taskName].hasOwnProperty("dialogueWhenAccept")) {
        characterSpeak("me", gamedata.tasks[taskName].dialogueWhenAccept);
    }
    return;
}

function startTutorial() {
    playerMove("travellers_room");
    gamedata.player.name = "？？？";
    gamedata.player.items.push(gamedata.uniqueItem["tutorial_letter_to_traveller"]);
    playerAddTask("tutorial-whoami")
}

function describeLocation() {
    let locationName = "";
    if (gamedata.player.knownLocation.hasOwnProperty(gamedata.player.location)) {
        locationName = gamedata.player.location.name;
    } else {
        locationName = "陌生的地方";
    }
    pt("这里是" + locationName + "。");
    pt(gamedata.player.location.detail);
    pt("这里有：");
    for (i of gamedata.player.location.items) {
        pt(indent(describeItem(i, 0), "4###"));
    }
}

function describeItem(item, type) {
    // 描述一个物品。
    // type 参数为 0 或 1 分别表示简短描述和详细描述。
    let res = "";
    let itemName = function() {
        itemMaterial = item.hasOwnProperty("material") ? gamedata.material[item.material].name : "";
        return itemMaterial + gamedata.names[item.id] + '（' + item.id + '）';
    }
    if (type === 0) {
        if (item.hasOwnProperty("attributes")) {
            for (i of item.attributes) {
                res += gamedata.attribute[i].name + "的";
            }
        }
        res += itemName();
    }
    if (type === 1) {
        res = "这是";
        if (item.hasOwnProperty("attributes")) {
            for (i of item.attributes) {
                res += gamedata.attribute[i].name + "的";
            }
        }
        res += itemName() + '。';
        // 物品是一个容器
        if (item.hasOwnProperty("items")) {
            res += "里面有：\n";
            for (i of item.items) {
                res += indent(describeItem(i, 0), "4###");
            }
        }
        // 物品上有可以阅读的内容
        if (item.hasOwnProperty("content")) {
            res += "输入 read 来阅读其中的内容。";
        }
    }
    return res;
}

function readContent(itemToRead) {
    let textList = itemToRead.content;
    let formattedContent = "";
    for (i of textList) {
        if (i[0] == '#') {
            formattedContent += indent(i.substring(1), "8###") + '\n';
        } else if (i[0] == '@') {
            formattedContent += indent("——" + i.substring(1), "8###") + '\n';
        } else {
            formattedContent += indent(i, "4###") + '\n';
        }
    }
    return formattedContent;
}