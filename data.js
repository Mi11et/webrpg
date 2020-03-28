let map = {
    "tutorial" : {
        "name" : "陌生房间",
        "detail" : "你也不知道这是哪里。\n提示：使用 task 命令来看看下一步要做什么。\n如果对命令不熟悉，可以输入 help + 命令 来查看帮助。",
        "items" : [
            {
                "id" : "bed",
                "carriable" : false,
                "material" : "wood"
            },
            {
                "id" : "chest",
                "carriable" : false,
                "material" : "wood",
                "items" : [
                    {
                        "id" : "sword",
                        "material" : "wood",
                        "carriable" : true,
                        "attributes" : [
                            "training"
                        ]
                    }
                ]
            }
        ]
    }
}

let player = {
    "name" : "我",
    "location" : {},
    "items" : [],
    "tasks" : []
}

let tasks = {
    "tutorial-0" : {
        "name" : "包里有东西",
        "detail" : "使用 inv 来查看自己的随身物品。",
        "dialogueWhenAccept" : "口袋里好像有什么东西，赶紧看看吧。",
        "location" : "tutorial",
        "requirement" : "inv",
        "next" : "tutorial-1"
    },
    "tutorial-1" : {
        "name" : "一本奇怪的书",
        "detail" : "使用 read 命令来阅读书籍。",
        "dialogueWhenAccept" : "不知道这是甚么书，先读读看吧。",
        "location" : "tutorial",
        "requirement" : "read beginners_guide",
        "next" : "tutorial-2"
    },
    "tutorial-2" : {
        "name" : "观察周围",
        "detail" : "使用 look 命令来到处看看。",
        "location" : "tutorial",
        "requirement" : "look",
        "next" : "tutorial-3"
    },
    "tutorial-3" : {
        "name" : "寻找武器",
        "detail" : "找到并且取走房间里的剑。",
        "location" : "tutorial",
        "requirement" : "get sword from chest",
        // "next" : "tutorial-3"
    },
    
}

let material = {
    "wood" : {
        "name" : "木"
    }
}

let attribute = {
    "training" : {
        "name" : "练习用"
    },
    "delicate" : {
        "name" : "精致"
    }
}

let names = {
    "chest" : "箱",
    "bed" : "床",
    "sword" : "剑",
    "beginners_guide" : "新手引导书"
}

let uniqueItem = {
    "beginners_guide" : {
        "id" : "beginners_guide",
        "carriable" : true,
        "attributes" : [
            "delicate"
        ]
    }
}