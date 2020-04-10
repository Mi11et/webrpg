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
            let sourceRange = gamedata.map[gamedata.player.location].items;
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
            let range = gamedata.map[gamedata.player.location].items;
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

