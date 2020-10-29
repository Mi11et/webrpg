function checkTasks(playerAction) {
    // 检查角色的一个动作是否满足一个任务的达成条件
    let checkRequirement = (task) => {
        // 判断是否满足任务的达成条件
        if (task.requirement[0] === '$') return eval(parseScript(task.requirement));
        else return playerAction === task.requirement;
    }
    let playerTasks = gamedata.player.tasks;
    let deletedTasks = [];
    for (let currentTask of playerTasks) {
        if (checkRequirement(currentTask)
            && [gamedata.player.location, "any"].includes(currentTask.location)) {
            // 如果玩家（在指定地点）完成了任务
            pt("你完成了任务【" + currentTask.name + "】。");
            if (currentTask.hasOwnProperty("additional")) {
                // 完成任务之后跳过附加任务
                for (let i of currentTask.additional) {
                    for (let j of playerTasks) {
                        if (j.name === gamedata.tasks[i].name) {
                            pt("已跳过附加任务【" + j.name + "】。")
                            deletedTasks.push(j.name);
                        }
                    }
                }
            }
            if (currentTask.hasOwnProperty("reward")) {
                // 完成任务后的奖励
                let reward = currentTask.reward;
                if (reward.hasOwnProperty("money")) {
                    gamedata.player.money += reward.money;
                    pt("你获得了" + reward.money + "G。");
                }
                if (reward.hasOwnProperty("items")) {
                    for (let i of reward.items) {
                        addItem(gamedata.player, i, 1);
                        pt("你获得了" + describeItem(i, -1) + "。");
                    }
                }
            }
            if (currentTask.hasOwnProperty("dialogueWhenFinish")) {
                // 完成任务之后的对话
                characterSpeak("me", currentTask.dialogueWhenFinish);
            }
            if (currentTask.hasOwnProperty("next")) {
                // 完成任务之后获得新任务
                playerAddTask(currentTask.next);
            }
            if (currentTask.hasOwnProperty("afterFinish")) {
                // 完成任务之后执行的命令
                eval(currentTask.afterFinish);
            }
            deletedTasks.push(currentTask.name);
        }
    }
    for (let i of deletedTasks) {
        nowDeleting = playerTasks.map((x) => x.name).indexOf(i);
        playerTasks.splice(nowDeleting, 1);
    }
    pt();
    return;
}

function playerRecognize() {
    // 将若干个地点添加到玩家认识的地点列表中
    // 默认情况下，主动移动到某一个地点会让玩家自动认识这个地点
    // 当玩家（由于剧情或者别的原因）被带到某一个地方，
    // 需要寻找线索来认识这个地方的时候才要用到这个方法
    for (let i = 0; i < arguments.length; ++i) {
        if (gamedata.map.hasOwnProperty(arguments[i])
            && !gamedata.player.knownLocation.includes(arguments[i])) {
            gamedata.player.knownLocation.push(arguments[i]);
        }
    }
    return;
}

function gameInit() {
    // 暂时没有用
    generateEmptySaveData();
    gameMainMenu();
    return;
}

function gameMainMenu() {
    // 显示主界面
    pt(gameTitleBig);
    pt("这是一个命令行冒险游戏，名字还没想好。应该会尽量中二一点。");
    pt();
    pt("输入 start new 创建新存档。");
    pt("输入 savelist 列出所有存档。");
    pt("输入 start <存档名> 载入某一存档。");
    pt("输入 delete <存档名> 删除某一存档。");
    pt("注意：清除浏览器缓存数据可能导致存档丢失。");
    pt();
    availableCommands.available = ["start", "delete", "savelist"];
    availableCommands.default = false;
    return;
}

function characterSpeak(speaker, speech) {
    // 某个人说了某句话
    // speaker 参数不一定是一个角色，也可以是字符串 "me" ，表示玩家自己说了什么
    // speech 可以是单个字符串或字符串数组
    let speeches = [];
    if (typeof speech === "string") {
        speeches = speech.split('\n');
    } else {
        for (let i of speech) {
            speeches = speeches.concat(i.split('\n'));
        }
    }
    if (speaker === "me") {
        for (let i in speeches) {
            if (speeches[i] === "") {
                continue;
            }
            pt("【我】" + speeches[i]);
        }
    } else {
        for (let i in speeches) {
            if (speeches[i] === "") {
                continue;
            }
            pt("【" + speaker.name + "】" + speeches[i]);
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
    gamedata.player.location = dest;
    describeLocation();
    pt();
    return;
}

function playerAddTask(taskName, from = null) {
    // 给玩家增加一项任务
    // from 表示该任务所属于的父级任务的名称
    if (gamedata.tasks.hasOwnProperty(taskName) === false) {
        console.warn("任务" + taskName + "不存在。");
        return;
    }
    let taskToAdd = gamedata.tasks[taskName];
    gamedata.player.tasks.push(taskToAdd);
    if (taskToAdd.hasOwnProperty("dialogueWhenAccept")) {
        // 接受任务时的对话
        characterSpeak("me", taskToAdd.dialogueWhenAccept);
    }
    if (from === null) {
        // 该任务不属于任何任务的附加任务
        if (taskToAdd.hasOwnProperty("acceptRequirement")) {
            pt("可选任务【" + taskToAdd.name + "】已追加。");
        } else {
            pt("新的任务【" + taskToAdd.name + "】已追加。");
        }
    } else {
        // 该任务属于附加任务
        pt("【" + from + "】的附加任务【" + taskToAdd.name + "】已追加。");
    }
    if (taskToAdd.hasOwnProperty("additional")) {
        // 接受附加任务
        for (let i of taskToAdd.additional) {
            playerAddTask(i, taskToAdd.name);
        }
    }
    return;
}

function startTutorial() {
    playerMove("firstTown_hotel_travellers_room", false);
    gamedata.player.name = "？？？";
    playerAddTask("tutorial-whoami");
    gamedata.player.money = 10
}

function describeLocation() {
    // 描述玩家所在的地点
    let locationName = "";
    let nowLocation = gamedata.map[gamedata.player.location];
    // 获取地点名称
    if (gamedata.player.knownLocation.includes(nowLocation.id)) {
        locationName = nowLocation.name;
    } else {
        locationName = "陌生的地方";
    }
    pt("这里是" + locationName + "。");
    pt();
    if (nowLocation.hasOwnProperty("detail")) {
        pt(nowLocation.detail);
        pt();
    }
    // 描述场景内的物品
    if (nowLocation.hasOwnProperty("items")
        && nowLocation.items.length !== 0) {
        pt("这里有：");
        for (let i in nowLocation.items) {
            pt(indent(describeItem(nowLocation.items[i], 0), "4###"));
        }
        pt();
    }
    // 描述当前的时间
    let currentTime = getTime(gamedata.player);
    if (currentTime[0] != null) {
        let formatTime = (time) => {
            // 将分钟数转换为X时X分
            while (time < 0) time += 24 * 60
            let hour = Math.floor(time / 60), minute = time % 60;
            let result = hour.toString() + "点";
            return minute ? result + minute.toString() + "分" : result;
        }
        switch (currentTime[1]) {
            case "watch" : {
                pt("你看了看你的表，现在是" + formatTime(currentTime[0]) + "。");
                break;
            }
            case "clock" : {
                pt("你看了看钟，现在是" + formatTime(currentTime[0]) + "。");
                break;
            }
            case "sky" : {
                pt("你看了看天色，现在大概是" + formatTime(currentTime[0]) + "。");
                break;
            }
            case null : {
                pt("你不知道现在是几点。");
                break;
            }
        }
    }
    pt();
    // 打印地图
    printMap();
}

function printMap() {
    pt("周围的地点：");
    let nowLocation = gamedata.map[gamedata.player.location];
    if (nowLocation.near.hasOwnProperty("up")) {
        pt(indent(gamedata.map[nowLocation.near["up"]].name, "12###"));
    } else {
        pt();
    }
    let middleLine = ""
    if (nowLocation.near.hasOwnProperty("left")) {
        middleLine += indent(gamedata.map[nowLocation.near["left"]].name, "2##8#2");
    } else {
        middleLine = indent("", "##12#");
    }
    middleLine += indent('【' + nowLocation.name + '】', "##8#2");
    if (nowLocation.near.hasOwnProperty("right")) {
        middleLine += gamedata.map[nowLocation.near["right"]].name;
    }
    pt(middleLine);
    if (nowLocation.near.hasOwnProperty("down")) {
        pt(indent(gamedata.map[nowLocation.near["down"]].name, "12###"));
    } else {
        pt();
    }
    return;
}

function describeItem(item, type) {
    // 描述一个物品。
    // type 参数为 0 或 1 分别表示简短描述和详细描述。
    // type 为 -1 表示省略id的简短描述
    let res = "";
    let itemName = () => {
        let itemMaterial = item.hasOwnProperty("material") ? gamedata.material[item.material].name : "";
        return itemMaterial + gamedata.names[item.id] + (type >= 0 ? ('（' + item.id + '）') : "");
    }
    if (type === 0 || type === -1) {
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
                let outputBuf = [];
                let printBuf = () => {
                    let buf = "";
                    for (let j of outputBuf) {
                        buf += indent(j, "##16#");
                    }
                    res += ("  " + buf + "\n");
                    return;
                }
                res += "里面有：\n";
                for (let i of item.items) {
                    outputBuf.push(describeItem(i, 0));
                    if (outputBuf.length === 4) {
                        printBuf();
                        outputBuf = [];
                    }
                }
                printBuf();
            }
        }
        // 物品上有可以阅读的内容
        if (item.hasOwnProperty("content")) {
            res += "使用 read 来阅读其中的内容。";
        }
    }
    return res;
}

function generateEmptySaveData() {
    saveData("new");
    return;
}

function getTime(character) {
    // 返回某个角色**认为**当前是什么时间，返回时间和得知时间的方法
    // 有表先看表（需要把表装备在手臂上，一个人只能戴一块表）
    // 如果无表，附近有钟，则会看钟（一个地点只能**安放**一个钟）
    // 如果无表无钟，则会看天色，得到大致的时间
    // 如果看不了天色，返回 null
    let haveProperty = (target, prop) => {
        return target.hasOwnProperty(prop) && target[prop].length;
    }
    let time = gamedata.global.time;
    if (haveProperty(character, "equipment")) {
        for (let i of character.equipment) {
            if (i.id === "watch") {
                return [time + i.deviation, "watch"];
            }
        }
    }
    let location = gamedata.map[character.location];
    if (haveProperty(location, "items")) {
        for (let i of location.items) {
            if (i.id === "clock" && i.placed) {
                return [time + i.deviation, "clock"];
            }
        }
    }
    if (location.hasOwnProperty("nowindow") && location.nowindow) {
        return [null, null];
    }
    return [Math.round(time / 60) * 60, "sky"];
}

function readContent(itemToRead) {
    let textList = gamedata.content[itemToRead.content];
    let formattedContent = describeItem(itemToRead, -1) + "中如此写着：";
    for (let i of textList) {
        if (i[0] == '#') {
            // 以 # 开头为标题
            formattedContent += '\n' + indent(i.substring(1), "8###");
        } else if (i[0] == '@') {
            // 以 @ 开头为落款
            formattedContent += '\n' + indent("——" + i.substring(1), "8###");
        } else if (i[0] == '$') {
            // 以 $ 开头为阅读文件后执行的命令
            eval(parseScript(i));
        } else {
            formattedContent += '\n' + indent(i, "4###");
        }
    }
    return formattedContent;
}

function nextRound() {
    // 进入下一回合
    let timePass = () => {
        let time = gamedata.global.time;
        time += 5;
        if (time > 24 * 60) {
            time -= 24 * 60;
            gamedata.global.date += 1;
        }
        gamedata.global.time = time;
        return;
    }
    timePass();
    checkEvents();
    return;
}

function waitForRounds(command) {
    // 玩家进行某项行为需要若干回合，若玩家当前行为被打断则返回 false
    let rounds = 0;
    if (gamedata.needTime.hasOwnProperty(command)) {
        rounds = gamedata.needTime[command];
    }
    for (let i = 0; i < rounds; ++i) {
        nextRound();
        if (rounds > 1 && tempdata.player.interrupted === true) {
            return false;
        }
    }
    return true;
}

function addItem(target, item, num = 1) {
    // 给某个对象一定数量的物品
    if (!target.hasOwnProperty("items")) {
        console.warn("指定的对象没有items属性，已添加。");
        target.items = [];
    }
    for (let i = 0; i < num; i++) {
        target.items.push(item);
    }
    return;
}

function checkEvents() {
    // 检查事件是否发生
    for (let i of gamedata.events) {
        if (!i.hasOwnProperty("requirement")) {
            // 该事件发生不需要任何条件
            if (i.hasOwnProperty("event")) {
                i.event();
                continue;
            }
        }
        if (typeof i.requirement === "string") {
            if (i.requirement[0] === "$" && eval(parseScript(i.requirement))) {
                // 满足事件发生条件
                if (i.hasOwnProperty("event")) {
                    i.event();
                    continue;
                }
            }
        }
    }
    return;
}

function countItem(range, targetAttr) {
    // 在range中寻找满足targetAttr的物品，返回个数
    if (!range.hasOwnProperty("items")) {
        // 若range无items属性，返回0
        return 0;
    }
    let cnt = 0; // 满足条件的物品数量
    for (let i of range.items) {
        let flag = true;
        for (let j in targetAttr) {
            // 对于range中的每一个物品，检查targetAttr的每一个参数
            if (!i.hasOwnProperty(j) || i.j !== targetAttr.j) {
                flag = false;
                break;
            }
        }
        if (flag === true) {
            cnt += 1;
        }
    }
    return cnt;
}

function parseScript(script) {
    // 将一段形如"$..."的字符串转换为合法的js语句
    let replace = (str, keyword, replacement) => {
        // 代替replaceAll
        let matchAll = (str) => {
            return new RegExp(str, "g");
        }
        str = str.replace(matchAll(replacement), keyword);
        str = str.replace(matchAll(keyword), replacement);
        return str;
    }
    let transTable = {
        "#time" : "gamedata.global.time",
        "#playerLocation" : "gamedata.player.location"
    }
    if (script[0] === "$") { 
        script = script.substring(1);
    }
    for (let i in transTable) {
        script = replace(script, i, transTable[i]);
    }
    return script;
}