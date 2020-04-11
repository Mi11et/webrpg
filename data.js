let gamedata = {
    "map" : {
        "firstTown_hotel_travellers_room" : {
            "id" : "firstTown_hotel_travellers_room",
            "name" : "流浪者的房间",
            "detail" : "提示：使用 task 命令来看看下一步要做什么。\n使用 help 来查看所有命令\n如果对命令不熟悉，可以输入 help + 命令 来查看帮助。",
            "items" : [
                {
                    "id" : "bed",
                    "carriable" : false,
                    "material" : "wood"
                },
                {
                    "id" : "note",
                    "carriable" : false,
                    "content" : "firstTown_hotel_travellers_room_note"
                },
                {
                    "id" : "clock",
                    "deviation" : -0.5,
                    "placed" : true,
                    "material" : "wood"
                }
            ],
            "near" : {
                "down" : "firstTown_hotel_corridor"
            },
            "nowindow" : true
        },
        "firstTown_hotel_corridor" : {
            "id" : "firstTown_hotel_corridor",
            "name" : "旅店的走廊",
            "detail" : "周围很安静。隐约可以闻到不远处的食堂传来的饭菜香味。",
            "items" : [
                {
                    "id" : "shelf",
                    "material" : "wood",
                    "carriable" : false,
                    "items" : [
                        {
                            "id" : "bread",
                            "carriable" : true,
                            "nutrition" : 30
                        },
                        {
                            "id" : "bread",
                            "carriable" : true,
                            "nutrition" : 30
                        }
                    ]
                }
            ],
            "near" : {
                "up" : "firstTown_hotel_travellers_room"
            }
        }
    },

    "tasks" : {
        "tutorial-whoami" : {
            "name" : "灵魂三问",
            "detail" : "使用 whoami 命令来回答灵魂三问。",
            "dialogueWhenAccept" : "我是谁？我在哪？我要做什么？",
            "dialogueWhenFinish" : "没想到我连自己的名字都想不起来……算了，先看看这里是什么地方吧",
            "location" : "any",
            "requirement" : "whoami",
            "next" : "tutorial-look"
        },
        "tutorial-read" : {
            "name" : "墙上的字条",
            "detail" : "使用 read 命令来阅读文字。",
            "dialogueWhenAccept" : "总而言之，赶紧看看字条里写了什么吧",
            "location" : "firstTown_hotel_travellers_room",
            "requirement" : "read note",
            "next" : "tutorial-get",
        },
        "tutorial-look" : {
            "name" : "观察周围",
            "detail" : "使用 look 命令来到处看看。",
            "location" : "firstTown_hotel_travellers_room",
            "requirement" : "look",
            "next" : "tutorial-help"
        },
        "tutorial-help" : {
            "name" : "查看帮助",
            "detail" : "使用 help read 来查看 read 命令的使用方法。",
            "dialogueWhenAccept" : "墙上好像有张字条，用 read 命令读读看吧。\n……\nread 命令怎么用来着？",
            "location" : "any",
            "requirement" : "help read",
            "next" : "tutorial-read"
        },
        "tutorial-get" : {
            "name" : "填饱肚子",
            "detail" : "使用 move 移动到走廊，用 look 查看架子上是否有食物，用 get 来获取食物，用 eat 来吃掉食物。如果命令不起作用，记得看看帮助。",
            "dialogueWhenAccept" : "原来外面有免费的食物吗……正好我也有一点饿了……\n（将饥饿值恢复到 50 点以上吧）",
            "location" : "firstTown_hotel_corridor",
            "requirement" : "$gamedata.player.hunger >= 50",
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
        "note" : "字条",
        "bread" : "面包",
        "shelf" : "架",
        "clock" : "钟"
    },

    "helpText" : {
        "help" : {
            "help" : "显示此帮助。",
            "help <命令>" : "查看某一条命令的说明。"
        },
        "look" : {
            "look" : "查看周围。",
            "look <对象>" : "查看某件东西。"
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
            "read <对象>" : "阅读某一物品上的文字。"
        },
        "move" : {
            "move（或缩写 m ）" : "进入移动模式。移动完成后按下 m 停止移动。"
        },
        "say" : {
            "say <内容>" : "说一句话。"
        },
        "eat" : {
            "eat <对象>" : "吃掉某样东西。"
        },
        "get" : {
            "get <对象>" : "拿起某样东西",
            "get <对象> from <容器>" : "从某个容器内取出某样东西"
        }
    },

    "player" : {
        "name" : "",
        "location" : {},
        "items" : [],
        "tasks" : [],
        "knownLocation" : [],
        "status" : {
            "moving" : false
        },
        "health" : 100,
        "hunger" : 10
    },

    "global" : {
        "time" : 8,
        "date" : 1,
        "currentSaveName" : ""
    },

    "content" : {
        "firstTown_hotel_travellers_room_note" : [
            "#给流浪者的一封信：",
            "这里是为无家可归的人准备的容身之所，在这里休息不需要支付任何费用。",
            "每天早晨，我会把前一天剩下的食物放在门外走廊的架子上，这些食物也是免费的。",
            "只要遵守规矩别捣乱，你就可以一直住在这里。",
            "@旅店老板",
            "$playerRecognize(\"firstTown_hotel_travellers_room\");"
        ]
    }
}

let gameTitleBig = "\
     _   _  _____    _   _  _____  _    _  _____\n\
    | \\ | ||  _  |  | \\ | ||  _  || \\  / ||  ___|\n\
    |  \\| || | | |  |  \\| || | | ||  \\/  || |___\n\
    | \\ \\ || | | |  | \\ \\ || |_| || \\  / ||  ___|\n\
    | |\\  || |_| |  | |\\  ||  _  || |\\/| || |___\n\
    |_| \\_||_____|  |_| \\_||_| |_||_|  |_||_____|\n"