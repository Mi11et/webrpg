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
        if (helpText.hasOwnProperty(commandToQuery)) {
            pt(commandToQuery, "命令的使用方法如下：");
            for (i in helpText[commandToQuery]) {
                pt(indent(i, "4##16#") + helpText[commandToQuery][i])
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
            let range = [].concat(player.items).concat(player.location.items);
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
            for (i of player.items) {
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
        if (player.tasks.length === 0) {
            pt(indent("你现在没有要做的事。", "4###"));
        } else {
            for (i of player.tasks) {
                pt(indent('【' + i.name + '】' + i.detail, "4###"));
            }
        }
        return true;
    }
}

function checkTasks(playerAction) {
    let taskFinishFlag = false;
    for (taskIndex in player.tasks) {
        if (playerAction === player.tasks[taskIndex].requirement
                && player.location === map[player.tasks[taskIndex].location]) {
            pt("你完成了任务【" + player.tasks[taskIndex].name + "】。");
            if (player.tasks[taskIndex].hasOwnProperty("next")) {
                playerAddTask(player.tasks[taskIndex].next);
                pt("新的任务【" + tasks[player.tasks[taskIndex].next].name + "】已追加。");
            }
            player.tasks.splice(taskIndex, 1);
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
    pt("【" + speaker.name + "】" + speech);
    return;
}

function playerMove(dest) {
    if (map.hasOwnProperty(dest) === false) {
        return;
    }
    player.location = map[dest];
    describeLocation();
    document.getElementById("output").value += '\n';
    return;
}

function playerAddTask(taskName) {
    if (tasks.hasOwnProperty(taskName) === false) {
        return;
    }
    player.tasks.push(tasks[taskName]);
    characterSpeak(player, tasks[taskName].dialogueWhenAccept);
    return;
}

function startTutorial() {
    playerMove("tutorial");
    player.items.push(uniqueItem["beginners_guide"]);
    playerAddTask("tutorial-0")
}

function describeLocation() {
    pt("这里是" + player.location.name + "。");
    pt(player.location.detail);
    pt("这里有：");
    for (i of player.location.items) {
        pt(indent(describeItem(i, 0), "4###"));
    }
}

function describeItem(item, type) {
    // 描述一个物品。
    // type 参数为 0 或 1 分别表示简短描述和详细描述。
    let res = "";
    let itemName = function() {
        itemMaterial = item.hasOwnProperty("material") ? material[item.material].name : "";
        return itemMaterial + names[item.id] + '（' + item.id + '）';
    }
    if (type === 0) {
        if (item.hasOwnProperty("attributes")) {
            for (i of item.attributes) {
                res += attribute[i].name + "的";
            }
        }
        res += itemName();
    }
    if (type === 1) {
        res = "这是";
        if (item.hasOwnProperty("attributes")) {
            for (i of item.attributes) {
                res += attribute[i].name + "的";
            }
        }
        res += itemName() + '。';
        if (item.hasOwnProperty("items")) {
            res += "里面有：\n";
            for (i of item.items) {
                res += indent(describeItem(i, 0), "4###");
            }
        }
    }
    return res;
}