function checkTasks(playerAction) {
    // 检查角色的一个动作是否满足一个任务的达成条件
    let checkRequirement = (task) => {
        // 判断是否满足任务的达成条件
        if (task.requirement[0] === '$') return eval(task.requirement.substring(1));
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
    gameMainMenu();
    return;
}

function gameMainMenu() {
    // 显示主界面
    pt(gameTitleBig);
    pt("这是一个命令行冒险游戏，名字还没想好。应该会尽量中二一点。");
    pt("输入 start new 开始新的冒险。");
    pt("输入 start <存档名> 来继续过去的冒险。");
    pt("输入 delete <存档名> 来忘却过去的冒险。");
    pt("注意：清楚浏览器缓存数据可能导致存档丢失。");
    pt();
    availableCommands.available = ["start", "delete"];
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
            pt("【我】" + speeches[i]);
        }
    } else {
        for (let i in speeches) {
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
    if (gamedata.tasks.hasOwnProperty(taskName) === false) {
        return;
    }
    gamedata.player.tasks.push(gamedata.tasks[taskName]);
    if (gamedata.tasks[taskName].hasOwnProperty("dialogueWhenAccept")) {
        // 接受任务时的对话
        characterSpeak("me", gamedata.tasks[taskName].dialogueWhenAccept);
    }
    if (from === null) {
        pt("新的任务【" + gamedata.tasks[taskName].name + "】已追加。");
    } else {
        pt("【" + gamedata.tasks[from].name + "】的附加任务【" + gamedata.tasks[taskName].name + "】已追加。");
    }
    if (gamedata.tasks[taskName].hasOwnProperty("additional")) {
        // 接受附加任务
        for (let i of gamedata.tasks[taskName].additional) {
            playerAddTask(i, taskName);
        }
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
    if (gamedata.player.knownLocation.includes(gamedata.map[gamedata.player.location].id)) {
        locationName = gamedata.map[gamedata.player.location].name;
    } else {
        locationName = "陌生的地方";
    }
    pt("这里是" + locationName + "。");
    pt(gamedata.map[gamedata.player.location].detail);
    // 描述场景内的物品
    if (gamedata.map[gamedata.player.location].hasOwnProperty("items")
        && gamedata.map[gamedata.player.location].items.length !== 0) {
        pt("这里有：");
        for (let i in gamedata.map[gamedata.player.location].items) {
            pt(indent(describeItem(gamedata.map[gamedata.player.location].items[i], 0), "4###"));
        }
    }
    // 描述当前的时间
    let currentTime = getTime(gamedata.player);
    if (currentTime[0] != null) {
        let formatTime = (time) => {
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

function nextRound() {
    // 进入下一回合
    let timePass = () => {
        let time = gamedata.global.time;
        time += 10;
        if (time > 24 * 60) {
            time -= 24 * 60;
            gamedata.global.date += 1;
        }
        gamedata.global.time = time;
        return;
    }
    timePass();
    return;
}

function waitForRounds(command) {
    // 玩家进行某项行为需要若干回合，若玩家当前行为被打断则返回 false
    let rounds = gamedata.needTime[command];
    for (let i = 0; i < rounds; ++i) {
        nextRound();
        if (rounds > 1 && tempdata.player.interrupted === true) {
            return false;
        }
    }
    return true;
}