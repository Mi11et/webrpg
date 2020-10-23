let commandsList = {
    "help" : function() {
        // help ( ... )
        // 打印所有命令或查看某一个命令的帮助
        if (arguments[0].length > 1) {
            pterr("一次只能查询一种命令。");
            return false;
        }
        let commandToQuery = "";
        if (arguments[0].length === 0) {
            // 列出所有命令
            pt("列出所有命令如下，使用 help + 命令 来查看详细的使用方法。");
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
            // 打印指定命令的帮助文本
            pt(commandToQuery, "命令的使用方法如下：");
            for (let i in gamedata.helpText[commandToQuery]) {
                pt(indent(i, "4##16#4") + gamedata.helpText[commandToQuery][i])
            }
            return true;
        } else {
            // 玩家指定的命令不存在或暂无帮助
            pterr("找不到", commandToQuery, "命令的说明");
            return false;
        }
    },
    "look" : function() {
        // look ( ... )
        // 观察周围或观察某一个物品
        waitForRounds("look");
        if (arguments[0].length === 0) {
            // 观察周围
            pt("你看了看周围。");
            pt();
            describeLocation();
            return true;
        } else {
            // 观察某个物品
            let target = "";
            for (let i of arguments[0]) {
                target += " " + i;
            }
            target = target.substring(1);
            let range = {};
            // 从当前场景和玩家物品栏中搜索指定物品
            Object.assign(range, gamedata.player.items, gamedata.map[gamedata.player.location].items);
            for (let i in range) {
                if (range[i].id === target) {
                    pt(describeItem(range[i], 1));
                    return true;
                }
            }
            // 没有找到指定的物品
            pt("这里没有", target, "。");
            return false;
        }
    },
    "inv" : function() {
        // inv
        // 查看玩家物品栏
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
        // task ( accept/reject ... )
        // 查看玩家任务
        let acceptedTasks = [], acceptableTasks = [];
        // 将玩家任务分成已接受和未接受
        for (let i of gamedata.player.tasks) {
            if (i.hasOwnProperty("acceptRequirement")) {
                // 可接受的任务
                acceptableTasks.push(i);
            } else {
                // 已经接受的任务
                acceptedTasks.push(i);
            }
        }
        if (arguments[0].length === 0) {
            pt("=== 任务列表 ===============");
            if (acceptedTasks.length === 0) {
                pt(indent("你现在没有要做的事。", "4###"));
            } else {
                for (let i in acceptedTasks) {
                    let task = acceptedTasks[i];
                    pt(indent((parseInt(i) + 1).toString(), "4##2#") + indent('【' + task.name + '】' + task.detail, "1###"));
                }
            }
            if (acceptableTasks.length != 0) {
                pt();
                pt("=== 可接受的任务 ===============");
                for (let i in acceptableTasks) {
                    let task = acceptableTasks[i];
                    pt(indent((parseInt(i) + 1).toString(), "4##2#") + indent('【' + task.name + '】' + task.detail, "1###"));
                }
            }
            return true;
        }
        if (arguments[0][0] === "accept") {
            // 接受任务
            targetId = arguments[0][1];
            if (/^[1-9]\d*$/.test(targetId)) {
                targetId = parseInt(targetId);
                if (targetId > acceptableTasks.length) {
                    // 输入的编号过大
                    pterr("你要接受哪一个任务？");
                    return false;
                }
                targetId -= 1; // 转换成下标
                // 判断玩家是否满足接受任务的要求
                for (let i of acceptableTasks[targetId].acceptRequirement) {
                    if (eval(parseScript(i)) === false) {
                        pt("你目前无法接受该任务。");
                        return false;
                    }
                }
                // 从未接受列表中删除此任务
                let targetTask = acceptableTasks.splice(targetId, 1)[0];
                delete targetTask.acceptRequirement // 删除acceptRequirement属性
                acceptedTasks.push(targetTask);
                pt("你接受了任务【" + targetTask.name + "】。");
                let newTaskList = acceptableTasks.concat(acceptedTasks);
                gamedata.player.tasks = newTaskList;
                if (targetTask.hasOwnProperty("additional")) {
                    for (let i of targetTask.additional) {
                        playerAddTask(i, targetTask.name);
                    }
                }
                // 接受附加任务
            } else {
                // 输入的编号不是正整数
                pterr("你要接受哪一个任务？");
                return false;
            }
        }
        if (arguments[0][0] === "reject") {
            // 拒绝任务
            targetId = arguments[0][1];
            if (/^[1-9]\d*$/.test(targetId)) {
                targetId = parseInt(targetId);
                if (targetId > acceptableTasks.length) {
                    // 输入的编号过大
                    pterr("你要拒绝哪一个任务？");
                    return false;
                }
                targetId -= 1; // 转换成下标
                let targetTask = acceptableTasks.splice(targetId, 1)[0];
                pt("你拒绝了任务【" + targetTask.name + "】。");
                let newTaskList = acceptableTasks.concat(acceptedTasks);
                gamedata.player.tasks = newTaskList;
            } else {
                // 输入的编号不是正整数
                pterr("你要拒绝哪一个任务？");
            }
        }
    },
    "whoami" :　function() {
        // whoami
        pt("=== 角色信息 ===============");
        pt(indent("名字", "4##10#2") + gamedata.player.name);
        pt(indent("生命值", "4##10#2") + gamedata.player.health);
        pt(indent("饥饿值", "4##10#2") + gamedata.player.hunger);
        pt(indent("金钱", "4##10#2") + gamedata.player.money + "G");
        return true;
    },
    "read" : function() {
        // read ...
        // 阅读指定物品上的文字
        if (arguments[0].length === 0) {
            // 玩家未指定阅读的物品
            pterr("你要读什么？");
            return false;
        }
        let target = "";
        for (let i of arguments[0]) {
            target += " " + i;
        }
        target = target.substring(1);
        // 从当前场景和玩家物品栏中搜索指定物品
        let range = {};
        Object.assign(range, gamedata.player.items, gamedata.map[gamedata.player.location].items);
        for (let i in range) {
            if (range[i].id === target) {
                if (!range[i].hasOwnProperty("content")) {
                    // 指定的物品上没有内容
                    pterr(target, "没什么好读的。")
                }
                waitForRounds("read");
                pt(readContent(range[i]));
                return true;
            }
        }
        // 没有找到指定的物品
        pt("这里没有", target, "。");
        return false;
    },
    "move" : function() {
        // move/m
        if (/Mobi/.test(navigator.userAgent)) {
            // 当前处于移动端
            pterr("当前处于移动端，move命令已禁用，输入w/a/s/d来移动。");
            return false;
        }
        playerStartMoving();
        return true;
    },
    "m" : "move",
    "w" : function (){
        // w
        return playerMoveNear('up');
    },
    "a" : function (){
        // a
        return playerMoveNear('left');
    },
    "s" : function (){
        // s
        return playerMoveNear('down');
    },
    "d" : function (){
        // d
        return playerMoveNear('right');
    },
    "say" : function() {
        // say ...
        let target = "";
        for (let i of arguments[0]) {
            target += " " + i;
        }
        if (target === "") {
            // 玩家未输入要说的话
            pterr("你要说什么？");
            return false;
        }
        target = target.substring(1);
        waitForRounds("say");
        characterSpeak("me", target);
        return true;
    },
    "get" : function() {
        // get ... ( from ... )
        let target = "", source = "", sourceFlag = false;
        // 切分命令
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
            // 玩家未指定要拿取的物品
            pterr("你要拿什么？");
            return false;
        }
        if (sourceFlag && source === "") {
            // 玩家指定的容器不存在
            pterr("你要从哪里拿？");
            return false;
        }
        target = target.substring(1);
        source = source.substring(1);
        if (sourceFlag) {
            // 玩家指定了容器
            let sourceRange = gamedata.map[gamedata.player.location].items;
            for (let i of sourceRange) {
                if (i.id === source) {
                    if (!i.hasOwnProperty("items")
                        || i.items.length === 0) {
                        // 玩家指定的容器中没有物品，或玩家指定的不是容器
                        pterr(describeItem(i, -1) + "里什么也没有。");
                        return false;
                    }
                    for (let j in i.items) {
                        if (i.items[j].id === target) {
                            if (i.items[j].hasOwnProperty("carriable") && i.items[j].carriable === true) {
                                waitForRounds("get");
                                gamedata.player.items.push(i.items[j]);
                                pt("你拿起了" + describeItem(i.items[j], -1) + "。");
                                i.items.splice(j, 1); // 从容器中删除对应的物品
                                return true;
                            } else {
                                // 玩家指定的物品不可携带
                                pt("你拿不起" + describeItem(i.items[j], -1) + "。");
                                return false;
                            }
                        }
                    }
                    // 玩家指定的容器中没有指定的物品
                    pt(source, "里没有", target, "。");
                    return false;
                }
            }
            // 场景中没有玩家指定的容器
            pt("这里没有", source, "。");
            return false;
        } else {
            // 玩家未指定容器，从场景中拿取物品
            let range = gamedata.map[gamedata.player.location].items;
            for (let i in range) {
                // 遍历场景中的物品
                if (range[i].id === target) {
                    if (range[i].hasOwnProperty("carriable") && range[i].carriable === true) {
                        waitForRounds("get");
                        gamedata.player.items.push(range[i]);
                        pt("你拿起了" + describeItem(range[i], -1) + "。");
                        range.splice(i, 1); // 从场景中删去对应物品
                        return true;
                    } else {
                        // 玩家指定的物品不可携带
                        pt("你拿不起" + describeItem(range[i], -1) + "。");
                        return false;
                    }
                }
            }
            // 场景中没有玩家指定的物品
            pt("这里没有", target, "。");
            return false;
        }
    },
    "eat" : function() {
        // eat ...
        if (arguments[0].length === 0) {
            // 未指定目标
            pterr("你要吃什么？");
            return false;
        }
        if (gamedata.player.hunger >= 100) {
            // 玩家饱食度过高
            pt("你吃不下别的东西了。");
            return false;
        }
        let target = "";
        for (let i of arguments[0]) {
            target += " " + i;
        }
        target = target.substring(1); // 删除多余空格
        let range = gamedata.player.items;
        for (let i of range) {
            if (i.id === target) {
                if (!i.hasOwnProperty("nutrition")) {
                    // 玩家指定的物品不是食物
                    pt(describeItem(i, 0) + "不是食物。");
                    return false;
                }
                waitForRounds("eat");
                gamedata.player.hunger += i.nutrition;
                pt("你吃掉了" + describeItem(i, -1));
                // 从玩家物品栏中删去目标
                range.splice(i, 1);
                return true;
            }
        }
        // 找不到玩家指定的物品
        pt("这里没有", target, "。");
        return false;
    },
    "start" : function() {
        // start new/...
        // 以某个存档/新存档开始游戏
        let toggleCommandLimit = () => {
            // 切换可用的命令
            availableCommands.unavailable = ["start", "delete", "savelist"];
            availableCommands.default = true;
        }
        if (arguments[0].length === 1 && arguments[0][0] === "new") {
            // 创建新存档
            clearTextArea();
            toggleCommandLimit();
            // 存档数据初始化
            startTutorial();
            return true;
        }
        if (arguments[0].length != 1 
            || !localStorage.hasOwnProperty(arguments[0][0])) {
            // 存档名不规范或指定的存档不存在
            pterr("你要载入哪一个存档？");
            return false;
        }
        // 读取存档数据
        if (!loadData(arguments[0][0])) {
            pterr("存档载入失败。");
        }
        clearTextArea();
        toggleCommandLimit();
        describeLocation();
        return true;
    },
    "save" : function() {
        // save ( ... )
        // 把游戏状态保存到新存档或当前存档
        if (gamedata.global.currentSaveName === "") {
            // 正在使用一个新存档，玩家需指定一个存档名
            if (arguments[0].length != 1) {
                // 存档名不规范
                pterr("存档名称只能为一个英文单词。");
                return false;
            }
            if (arguments[0][0] === "new") {
                pterr("存档名称不能为new。");
                return false;
            }
            gamedata.global.currentSaveName = arguments[0][0];
            saveData(arguments[0][0]);
            pt("存档", gamedata.global.currentSaveName, "已保存。");
            return true;
        } else {
            // 正在使用一个已保存的存档
            if (arguments[0].length === 0) {
                // 保存到原有存档
                saveData(gamedata.global.currentSaveName);
                pt("存档", gamedata.global.currentSaveName, "已保存。");
                return true;
            } else if (arguments[0].length === 1) {
                // 保存到新存档
                if (arguments[0][0] === "new") {
                    pterr("存档名称不能为new。");
                    return false;
                }
                gamedata.global.currentSaveName = arguments[0][0];
                saveData(arguments[0][0]);
                pt("存档", gamedata.global.currentSaveName, "已保存。");
                return true;
            } else {
                // 存档名不规范
                pterr("你要保存到哪一个存档？");
                return false;
            }
        }
    },
    "delete" : function() {
        // delete ...
        if (arguments[0].length != 1 
            || (!localStorage.hasOwnProperty(arguments[0][0]) || arguments[0][0] === "new")) {
            // 存档名不规范或指定的存档不存在
            pterr("你要删除哪一个存档？");
            return false;
        }
        localStorage.removeItem(arguments[0][0]);
        pt("存档", arguments[0][0], "已删除。");
        return true;
    },
    "talkwith" : function() {
        // talkwith ... ( about ... )
        let target = "", dialog = "";
        let seekNPC = (NPCName) => {
            for (let i in gamedata.npc) {
                if (gamedata.npc[i].id === NPCName
                    && gamedata.npc[i].location === gamedata.player.location) {
                    return i;
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
        let getDialog = (dialogNode) => {
            // 在对话树中跳转到指定的对话，并输出
            if (typeof dialogNode === "string") {
                if (dialogNode[0] === "$") {
                    //执行命令
                    eval(parseScript(dialogNode));
                    return "";
                } else if (dialogNode[0] === "@") {
                    // 跳转
                    getDialog(gamedata.npcInteractions[target].talk[dialogNode.substring(1)]);
                } else {
                    characterSpeak(gamedata.npc[target], dialogNode + "\n");
                }
            }
            if (typeof dialogNode === "object") {
                if (dialogNode.hasOwnProperty("requirement")) {
                    if (eval(parseScript(dialogNode.requirement)) === false) {
                        // 未达成触发对话所需条件
                        return "";
                    }
                }
                if (dialogNode.hasOwnProperty("type")) {
                    if (dialogNode.type === "all") {
                        for (let i of dialogNode.content) {
                            getDialog(i);
                        }
                    }
                    if (dialogNode.type === "random") {
                        getDialog(dialogNode.content[Math.floor(Math.random() * dialogNode.content.length)]);
                    }
                }
            }
        }
        analyze(arguments[0]);
        if (target === false) {
            // 玩家未指定交谈对象或交谈对象不存在
            pterr("你要和谁说话？");
            return false;
        }
        if (!gamedata.npcInteractions[target].hasOwnProperty("talk")) {
            // 该NPC无对话选项
            pt(gamedata.npc[target].name + "不想和你说话。")
        }
        if (gamedata.npcInteractions[target].talk.hasOwnProperty(dialog)) {
            // 打印对话
            getDialog(gamedata.npcInteractions[target].talk[dialog]);
            return true;
        } else {
            // 该NPC没有指定的对话选项
            pt(gamedata.npc[target].name + "不知道你在说什么。");
            return false;
        }
    },
    "savelist" : function() {
        // savelist
        pt("本地存档列表：");
        pt(indent("编号", "2##4#") + indent("存档名", "4##16#"));
        pt(indent("----", "2##4#") + indent("----------------", "4##16#"));
        for (let i = 0; i < localStorage.length; i++) {
            let saveName = localStorage.key(i);
            if (!localStorage[localStorage.key(i)].hasOwnProperty("signature") 
                || localStorage[localStorage.key(i)].signature !== gameSaveDataSignature) {
                continue;
            }
            if (saveName === "new") {
                continue;
            }
            pt(indent((i + 1).toString(), "2##4#") + indent(saveName, "4##16#"));
        }
        return true;
    },
    "map" : function() {
        // map
        printMap();
        return true;
    },
    "buy" : function() {
        // buy ... from ...
        let target = "", source = "", sourceFlag = false;
        let seekNPC = (NPCName) => {
            for (let i in gamedata.npc) {
                if (gamedata.npc[i].id === NPCName 
                    && gamedata.npc[i].location === gamedata.player.location) {
                    return i;
                }
            }
            return false;
        }
        // 切分命令
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
        // 判断输入的命令是否符合语法
        if (target === "") {
            pterr("你要买什么？");
            return false;
        }
        if (!sourceFlag || source === "") {
            pterr("你要买谁的东西？");
            return false;
        }
        // 删除多余空格
        target = target.substring(1);
        source = source.substring(1);
        // 玩家指定了从哪里买东西
        source = seekNPC(source);
        if (source == false) {
            // 玩家指定的NPC不存在
            pterr("你要买谁的东西？");
            return false;
        }
        if (!gamedata.npcInteractions[source].hasOwnProperty("trade")) {
            // 该NPC无法交易
            pt("这个人什么也不卖……");
            return false;
        }
        // NPC可以交易
        let sourceRange = gamedata.npcInteractions[source].trade;
        for (let i of sourceRange) {
            if (i.item.id === target) {
                if (i.sum === 0) {
                    // 该物品已经被NPC卖完了
                    characterSpeak(gamedata.npc[source], "我的" + describeItem(i.item, -1) + "已经卖完了……");
                    return false;
                }
                if (i.price > gamedata.player.money) {
                    // 玩家没有足够的钱
                    pt("你买不起" + describeItem(i.item, -1) + "。");
                    return false;
                }
                // 购买物品
                gamedata.player.items.push(i.item);
                gamedata.player.money -= i.price;
                if (i.sum > 0) {
                    i.sum -= 1;
                }
                pt("你从" + gamedata.npc[source].name + "那里购买了" + describeItem(i.item, -1) + "。");
                pt("你付给" + gamedata.npc[source].name + "" + i.price + "G。");
                return true;
            }
        }
        // NPC不卖该物品
        pt("这个人没有", target, "。");
        return false;
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