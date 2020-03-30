let gamedata = {
    "map" : {
        "travellers_room" : {
            "id" : "travellers_room",
            "name" : "流浪者的房间",
            "detail" : "提示：使用 task 命令来看看下一步要做什么。\n如果对命令不熟悉，可以输入 help + 命令 来查看帮助。",
            "items" : {
                "bed" : {
                    "id" : "bed",
                    "carriable" : false,
                    "material" : "wood"
                },
                "tutorial_letter_to_traveller" : {
                    "id" : "note",
                    "carriable" : false,
                    "content" : [
                        "#给流浪者的一封信：",
                        "这里是为无家可归的人准备的容身之所，在这里休息不需要支付任何费用。",
                        "每天早晨，我会把前一天剩下的食物放在门外走廊的架子上，这些食物也是免费的。",
                        "只要遵守规矩别捣乱，你就可以一直住在这里。",
                        "@旅店老板",
                        "$playerRecognize(\"travellers_room\");"
                    ]
                }
            }
        }
    },

    "player" : {
        "name" : "",
        "location" : {},
        "items" : [],
        "tasks" : [],
        "knownLocation" : []
    },

    "tasks" : {
        "tutorial-whoami" : {
            "name" : "灵魂三问",
            "detail" : "使用 whoami 命令来回答灵魂三问。",
            "dialogueWhenAccept" : "我是谁？我在哪？我要做什么？",
            "dialogueWhenFinish" : "没想到我连自己的名字都想不起来……算了，先看看这里是什么地方吧",
            "location" : "travellers_room",
            "requirement" : "whoami",
            "next" : "tutorial-look"
        },
        "tutorial-read" : {
            "name" : "墙上的字条",
            "detail" : "使用 read 命令来阅读书籍。",
            "dialogueWhenAccept" : "墙上好像有张字条，不知道是谁写的，先读读看吧。",
            "location" : "travellers_room",
            "requirement" : "read note",
            "next" : "tutorial-get",
        },
        "tutorial-look" : {
            "name" : "观察周围",
            "detail" : "使用 look 命令来到处看看。",
            "location" : "travellers_room",
            "requirement" : "look",
            "next" : "tutorial-read"
        },
        "tutorial-get" : {
            "name" : "填饱肚子",
            "detail" : "到房间外的架子上拿吃的。",
            "location" : "firstTown_hotel_corridor"
            //"requirement" : "get sword from chest",
        },
        
    },

    "material" : {
        "wood" : {
            "name" : "木"
        }
    },

    "attribute" : {
        "training" : {
            "name" : "练习用"
        },
        "delicate" : {
            "name" : "精致"
        }
    },

    "names" : {
        "chest" : "箱",
        "bed" : "床",
        "sword" : "剑",
        "note" : "字条"
    },

    "helpText" : {
        "help" : {
            "help" : "显示此帮助。",
            "help + 命令" : "查看某一条命令的说明。"
        },
        "look" : {
            "look" : "查看周围。",
            "look + 对象" : "查看某件东西。"
        },
        "inv" : {
            "inv" : "列出玩家的随身物品。"
        },
        "task" : {
            "task" : "列出玩家当前需要完成的任务。"
        },
        "whoami" : {
            "whoami" : "查看玩家信息。"
        },
        "read" : {
            "read + 对象" : "阅读某一物品上的文字。"
        }
    }
}