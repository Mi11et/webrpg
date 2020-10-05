let ruleList = [
    "map.all.items",
    "player",
    "global",
    "npc",
    "npcInteractions.all.trade.all.sum"
];

function loadData(dataname) {
    // 载入指定数据
    let dataStr = localStorage.getItem(dataname);
    if (dataStr === null) return false;
    let saveData = JSON.parse(dataStr);
    for (let rule of ruleList) {
        rule += '.';
        mergeByRule(gamedata, saveData, rule);
    }
    return true;
}

function mergeByRule(dest, src, rule) {
    // 根据 rule ，将 src 的数据合并到 dest 的数据
    // 即替换数据树中指定的子树
    let dotPos = rule.indexOf('.');
    let target = rule.substring(0, dotPos);
    let nextRule = rule.substring(dotPos + 1);
    if (target === "all") {
        if (nextRule === "") {
            dest = src;
            return;
        }
        for (let i in src) {
            if (!dest.hasOwnProperty(i)) {
                dest[i] = {};
            }
            mergeByRule(dest[i], src[i], nextRule);
        }
    } else {
        if (nextRule === "") {
            dest[target] = src[target];
            return;
        }
        if (!dest.hasOwnProperty(target)) {
            dest[target] = {};
        }
        mergeByRule(dest[target], src[target], nextRule);
    }
    return;
}

function saveData(dataname) {
    // 存储变动的数据
    let saveData = {};
    for (let rule of ruleList) {
        rule += '.';
        mergeByRule(saveData, gamedata, rule);
    }
    let dataStr = JSON.stringify(saveData);
    localStorage.setItem(dataname, dataStr);
    return;
}