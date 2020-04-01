let commandsList = {
    "help" : function() {
        if (arguments[0].length > 1) {
            pterr("一次只能查询一种命令。");
            return false;
        }
        let commandToQuery = "";
        if (arguments[0].length === 0) {
            pt("所有可用的命令如下，使用 help + 命令 来查看详细的使用方法。")
            let outputBuf = [];
            let printBuf = () => {
                let buf = "";
                for (let j of outputBuf) {
                    buf += indent(j, "##16#");
                }
                pt("  " + buf);
                return;
            }
            for (let i in commandsList) {
                if (typeof commandsList[i] === "string") continue;
                outputBuf.push(i);
                if (outputBuf.length === 4) {
                    printBuf();
                    outputBuf = [];
                }
            }
            printBuf();
            return true;
        }
        commandToQuery = arguments[0][0];
        if (gamedata.helpText.hasOwnProperty(commandToQuery)) {
            pt(commandToQuery, "命令的使用方法如下：");
            for (let i in gamedata.helpText[commandToQuery]) {
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
            for (let i of arguments[0]) {
                target += " " + i;
            }
            target = target.substring(1);
            let range = {};
            Object.assign(range, gamedata.player.items, gamedata.player.location.items);
            for (let i in range) {
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
            if (gamedata.player.items.length === 0) {
                pt("你身上什么也没有。");
                return true;
            }
            pt("你看了看你的口袋。");
            pt("里面有：");
            for (let i of gamedata.player.items) {
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
            for (let i of gamedata.player.tasks) {
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
        pt(indent("生命值", "4##10#2") + gamedata.player.health);
        pt(indent("饥饿值", "4##10#2") + gamedata.player.hunger);
        return true;
    },
    "read" : function() {
        if (arguments[0].length === 0) {
            pterr("你要读什么？");
            return false;
        }
        let target = "";
        for (let i of arguments[0]) {
            target += " " + i;
        }
        target = target.substring(1);
        let range = {};
        Object.assign(range, gamedata.player.items, gamedata.player.location.items);
        for (let i in range) {
            if (range[i].id === target) {
                if (!range[i].hasOwnProperty("content")) {
                    pterr(target, "没什么好读的。")
                }
                pt(readContent(range[i]));
                return true;
            }
        }
        pt("这里没有", target, "。");
        return false;
    },
    "move" : function() {
        playerStartMoving();
    },
    "m" : "move",
    "say" : function() {
        let target = "";
        for (let i of arguments[0]) {
            target += " " + i;
        }
        if (target === "") {
            pterr("你要说什么？");
            return false;
        }
        target = target.substring(1);
        characterSpeak("me", target);
        return true;
    },
    "get" : function() {
        let target = "", source = "", sourceFlag = false;
        for (let i = 0; i < arguments[0].length; ++i) {
            if (arguments[0][i] === "from") {
                sourceFlag = true;
                continue;
            }
            if (sourceFlag) {
                source += " " + arguments[0][i];
            } else {
                target += " " + arguments[0][i];
            }
        }
        if (target === "") {
            pterr("你要拿什么？");
            return false;
        }
        if (sourceFlag && source === "") {
            pterr("你要从哪里拿？");
            return false;
        }
        target = target.substring(1);
        source = source.substring(1);
        if (sourceFlag) {
            let sourceRange = gamedata.player.location.items;
            for (let i of sourceRange) {
                if (i.id === source) {
                    if (!i.hasOwnProperty("items")
                        || i.items.length === 0) {
                        pterr(source, "里什么也没有。");
                    }
                    for (let j in i.items) {
                        if (i.items[j].id === target) {
                            gamedata.player.items.push(i.items[j]);
                            pt("你拿起了" + describeItem(i.items[j], 0));
                            i.items.splice(j, 1);
                            return true;
                        }
                    }
                    pt(source, "里没有", target, "。");
                    return false;
                }
            }
            pt("这里没有", source, "。");
            return false;
        } else {
            let range = gamedata.player.location.items;
            for (let i in range) {
                if (range[i].id === target) {
                    gamedata.player.items.push(range[i]);
                    pt("你拿起了" + describeItem(range[i], 0));
                    range.splice(i, 1);
                    return true;
                }
            }
            pt("这里没有", target, "。");
            return false;
        }
    },
    "eat" : function() {
        if (arguments[0].length === 0) {
            pterr("你要吃什么？");
            return false;
        }
        if (gamedata.player.hunger >= 100) {
            pt("你吃不下别的东西了。");
            return false;
        }
        let target = "";
        for (let i of arguments[0]) {
            target += " " + i;
        }
        target = target.substring(1);
        let range = gamedata.player.items;
        for (let i of range) {
            if (i.id === target) {
                if (!i.hasOwnProperty("nutrition")) {
                    pt(describeItem(i, 0) + "不是食物。");
                    return false;
                }
                gamedata.player.hunger += i.nutrition;
                pt("你吃掉了" + describeItem(i, 0));
                range.splice(i, 1);
                return true;
            }
        }
        pt("这里没有", target, "。");
        return false;
    }
}

function checkTasks(playerAction) {
    let taskFinishFlag = false;
    for (let taskIndex in gamedata.player.tasks) {
        if (playerAction === gamedata.player.tasks[taskIndex].requirement
                && (gamedata.player.location === gamedata.map[gamedata.player.tasks[taskIndex].location]
                    || gamedata.player.tasks[taskIndex].location === "any")) {
            pt("你完成了任务【" + gamedata.player.tasks[taskIndex].name + "】。");
            if (gamedata.player.tasks[taskIndex].hasOwnProperty("dialogueWhenFinish")) {
                characterSpeak("me", gamedata.player.tasks[taskIndex].dialogueWhenFinish);
            }
            if (gamedata.player.tasks[taskIndex].hasOwnProperty("next")) {
                playerAddTask(gamedata.player.tasks[taskIndex].next);
                pt("新的任务【" + gamedata.tasks[gamedata.player.tasks[taskIndex].next].name + "】已追加。");
            }
            if (gamedata.player.tasks[taskIndex].hasOwnProperty("afterFinish")) {
                eval(gamedata.player.tasks[taskIndex].afterFinish);
            }
            gamedata.player.tasks.splice(taskIndex, 1);
            taskFinishFlag = true;
        }
    }
    return taskFinishFlag;
}

function playerRecognize() {
    // 将若干个地点添加到玩家认识的地点列表中
    // 默认情况下，主动移动到某一个地点会让玩家自动认识这个地点
    // 当玩家（由于剧情或者别的原因）被带到某一个地方，
    // 需要寻找线索来认识这个地方的时候才要用到这个方法
    for (let i = 0; i < arguments.length; ++i) {
        if (gamedata.map.hasOwnProperty(arguments[i])) {
            gamedata.player.knownLocation.push(arguments[i]);
        }
    }
    return;
}

function gameInit() {
    // 暂时没有用
    pt("这是一个命令行冒险游戏。");
    pt("输入 start new 开始一场新的冒险。");
    return;
}

function characterSpeak(speaker, speech) {
    // 某个人说了某句话
    // speaker 参数不一定是一个角色，也可以是字符串 "me" ，表示玩家自己说了什么
    let speeches = speech.split('\n');
    if (speaker === "me") {
        for (let i of speeches) {
            pt("【我】" + i);
        }
    } else {
        for (let i of speeches) {
            pt("【" + speaker.name + "】" + i);
        }
    }
    return;
}

function playerMove(dest, recognize = true) {
    // 将玩家移动到某一个地点
    if (gamedata.map.hasOwnProperty(dest) === false) {
        return;
    }
    if (recognize) {
        playerRecognize(dest);
    }
    gamedata.player.location = gamedata.map[dest];
    describeLocation();
    document.getElementById("output").value += '\n';
    return;
}

function playerAddTask(taskName) {
    // 给玩家增加一项任务
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
    playerMove("firstTown_hotel_travellers_room", false);
    gamedata.player.name = "？？？";
    playerAddTask("tutorial-whoami")
}

function describeLocation() {
    // 描述玩家所在的地点
    let locationName = "";
    if (gamedata.player.knownLocation.includes(gamedata.player.location.id)) {
        locationName = gamedata.player.location.name;
    } else {
        locationName = "陌生的地方";
    }
    pt("这里是" + locationName + "。");
    pt(gamedata.player.location.detail);
    if (gamedata.player.location.hasOwnProperty("items")
        && gamedata.player.location.items.length !== 0) {
        pt("这里有：");
        for (let i in gamedata.player.location.items) {
            pt(indent(describeItem(gamedata.player.location.items[i], 0), "4###"));
        }
    }
}

function describeItem(item, type) {
    // 描述一个物品。
    // type 参数为 0 或 1 分别表示简短描述和详细描述。
    let res = "";
    let itemName = function() {
        let itemMaterial = item.hasOwnProperty("material") ? gamedata.material[item.material].name : "";
        return itemMaterial + gamedata.names[item.id] + '（' + item.id + '）';
    }
    if (type === 0) {
        if (item.hasOwnProperty("attributes")) {
            for (let i of item.attributes) {
                res += gamedata.attribute[i].name + "的";
            }
        }
        res += itemName();
    }
    if (type === 1) {
        res = "这是";
        if (item.hasOwnProperty("attributes")) {
            for (let i of item.attributes) {
                res += gamedata.attribute[i].name + "的";
            }
        }
        res += itemName() + '。';
        // 物品是一个容器
        if (item.hasOwnProperty("items")) {
            if (item.items.length === 0) {
                res += "里面什么也没有。\n";
            } else {
                res += "里面有：\n";
                for (let i of item.items) {
                    res += indent(describeItem(i, 0), "4###");
                }
            }
        }
        // 物品上有可以阅读的内容
        if (item.hasOwnProperty("content")) {
            res += "使用 read 来阅读其中的内容。";
        }
    }
    return res;
}

function readContent(itemToRead) {
    let textList = itemToRead.content;
    let formattedContent = describeItem(itemToRead, 0) + "中如此写着：";
    for (let i of textList) {
        if (i[0] == '#') {
            // 以 # 开头为标题
            formattedContent += '\n' + indent(i.substring(1), "8###");
        } else if (i[0] == '@') {
            // 以 @ 开头为落款
            formattedContent += '\n' + indent("——" + i.substring(1), "8###");
        } else if (i[0] == '$') {
            // 以 $ 开头为阅读文件后执行的命令
            eval(i.substring(1));
        } else {
            formattedContent += '\n' + indent(i, "4###");
        }
    }
    return formattedContent;
}