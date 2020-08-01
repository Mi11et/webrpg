let commandsList = {
    "help" : function() {
        if (arguments[0].length > 1) {
            pterr("一次只能查询一种命令。");
            return false;
        }
        let commandToQuery = "";
        if (arguments[0].length === 0) {
            pt("列出所有命令如下，使用 help + 命令 来查看详细的使用方法。")
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
        waitForRounds("look");
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
            Object.assign(range, gamedata.player.items, gamedata.map[gamedata.player.location].items);
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
        Object.assign(range, gamedata.player.items, gamedata.map[gamedata.player.location].items);
        for (let i in range) {
            if (range[i].id === target) {
                if (!range[i].hasOwnProperty("content")) {
                    pterr(target, "没什么好读的。")
                }
                waitForRounds("read");
                pt(readContent(range[i]));
                return true;
            }
        }
        pt("这里没有", target, "。");
        return false;
    },
    "move" : function() {
        playerStartMoving();
        return true;
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
        waitForRounds("say");
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
            let sourceRange = gamedata.map[gamedata.player.location].items;
            for (let i of sourceRange) {
                if (i.id === source) {
                    if (!i.hasOwnProperty("items")
                        || i.items.length === 0) {
                        pterr(describeItem(i, 0), "里什么也没有。");
                        return false;
                    }
                    for (let j in i.items) {
                        if (i.items[j].id === target) {
                            if (i.items[j].hasOwnProperty("carriable") && i.items[j].carriable === true) {
                                waitForRounds("get");
                                gamedata.player.items.push(i.items[j]);
                                pt("你拿起了" + describeItem(i.items[j], 0) + "。");
                                i.items.splice(j, 1);
                                return true;
                            } else {
                                pt("你拿不起" + describeItem(i.items[j], 0) + "。");
                                return false;
                            }
                        }
                    }
                    pt(source, "里没有", target, "。");
                    return false;
                }
            }
            pt("这里没有", source, "。");
            return false;
        } else {
            let range = gamedata.map[gamedata.player.location].items;
            for (let i in range) {
                if (range[i].id === target) {
                    if (range[i].hasOwnProperty("carriable") && range[i].carriable === true) {
                        waitForRounds("get");
                        gamedata.player.items.push(range[i]);
                        pt("你拿起了" + describeItem(range[i], 0) + "。");
                        range.splice(i, 1);
                        return true;
                    } else {
                        pt("你拿不起" + describeItem(range[i], 0) + "。");
                        return false;
                    }
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
                waitForRounds("eat");
                gamedata.player.hunger += i.nutrition;
                pt("你吃掉了" + describeItem(i, 0));
                range.splice(i, 1);
                return true;
            }
        }
        pt("这里没有", target, "。");
        return false;
    },
    "start" : function() {
        let toggleCommandLimit = () => {
            availableCommands.unavailable = ["start", "delete"];
            availableCommands.default = true;
        }
        if (arguments[0].length === 1 && arguments[0][0] === "new") {
            clearTextArea();
            toggleCommandLimit();
            startTutorial();
            return true;
        }
        if (arguments[0].length != 1 
            || !localStorage.hasOwnProperty(arguments[0][0])) {
            pterr("你要载入哪一个存档？");
            return false;
        }
        loadData(arguments[0][0]);
        clearTextArea();
        toggleCommandLimit();
        describeLocation();
        return true;
    },
    "save" : function() {
        // 存档
        if (gamedata.global.currentSaveName === "") {
            if (arguments[0].length != 1) {
                pterr("存档名称只能为一个英文单词。");
                return false;
            }
            gamedata.global.currentSaveName = arguments[0][0];
            saveData(arguments[0][0]);
            pt("存档", gamedata.global.currentSaveName, "已保存。");
            return true;
        } else {
            if (arguments[0].length === 0) {
                saveData(gamedata.global.currentSaveName);
                pt("存档", gamedata.global.currentSaveName, "已保存。");
                return true;
            } else if (arguments[0].length === 1) {
                gamedata.global.currentSaveName = arguments[0][0];
                saveData(arguments[0][0]);
                pt("存档", gamedata.global.currentSaveName, "已保存。");
                return true;
            } else {
                pterr("你要保存到哪一个存档？");
                return false;
            }
        }
    },
    "delete" : function() {
        if (arguments[0].length != 1 
            || !localStorage.hasOwnProperty(arguments[0][0])) {
            pterr("你要删除哪一个存档？");
            return false;
        }
        localStorage.removeItem(arguments[0][0]);
        pt("存档", arguments[0][0] , "已删除。");
        return true;
    },
    "talkwith" : function() {
        let target = "", dialog = "";
        let seekNPC = (NPCName) => {
            for (let i in gamedata.npc) {
                if (gamedata.npc[i].id === NPCName) {
                    return gamedata.npc[i];
                }
            }
            return false;
        }
        let analyze = (argList) => {
            if (argList.includes("about") === true) {
                // 指定对话内容
                dialog = argList.slice(argList.findIndex(i => i === "about") + 1).toString();
                target = argList.slice(0, argList.findIndex(i => i === "about")).toString();
            } else {
                // 默认对话
                dialog = "default";
                target = argList.toString()
            }
            target = seekNPC(target);
        }
        let getDialog = (dialogs, dialog) => {
            for (let cnt = 0; typeof dialogs[dialog] === "string"; cnt++) {
                dialog = dialogs[dialog];
                if (cnt >= 100) {
                    throw new Error("对话跳转陷入了死循环。");
                }
            }
            let speech = dialogs[dialog][Math.floor(dialogs[dialog].length * Math.random())];
            return speech;
        }
        analyze(arguments[0]);
        if (target === false) {
            pterr("你要和谁说话？");
            return false;
        }
        if (target.interactions.talk.hasOwnProperty(dialog)) {
            characterSpeak(target, getDialog(target.interactions.talk, dialog));
            return true;
        } else {
            pt(target.name + "不知道你在说什么。");
            return false;
        }
    }
}

let availableCommands = {
    "default" : false,
    "available" : [],
    "unavailable" : [],
    "alwaysAvailable" : [
        "help"
    ]
}

function checkCommandAvailable(command) {
    if (availableCommands.alwaysAvailable.includes(command)) {
        return true;
    }
    if (availableCommands.available.includes(command)) {
        return true;
    }
    if (availableCommands.unavailable.includes(command)) {
        return false;
    }
    return availableCommands.default;
}