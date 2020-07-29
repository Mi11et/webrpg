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
                    "deviation" : -30,
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
                "up" : "firstTown_hotel_travellers_room",
                "down" : "firetTown_hotel_lobby"
            }
        },
        "firetTown_hotel_lobby" : {
            "id" : "firetTown_hotel_lobby",
            "name" : "旅店的前厅",
            "detail" : "前厅里没有什么人，只有老板百无聊赖地坐在柜台后面，似乎在打盹。",
            "items" : [
                {
                    "id" : "list",
                    "content" : "firetTown_hotel_lobby_list"
                }
            ],
            "near" : {
                "up" : "firstTown_hotel_corridor"
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
            "dialogueWhenAccept" : "墙上好像有张字条，用 read 命令读读看吧。",
            "location" : "firstTown_hotel_travellers_room",
            "requirement" : "read note",
            "next" : "tutorial-get",
            "additional" : [
                "tutorial-help"
            ]
        },
        "tutorial-look" : {
            "name" : "观察周围",
            "detail" : "使用 look 命令来到处看看。",
            "location" : "firstTown_hotel_travellers_room",
            "requirement" : "look",
            "next" : "tutorial-read"
        },
        "tutorial-help" : {
            "name" : "查看帮助",
            "detail" : "使用 help read 来查看 read 命令的使用方法。",
            "dialogueWhenAccept" : "……\nread 命令怎么用来着？",
            "dialogueWhenFinish" : "总而言之，赶紧看看字条里写了什么吧",
            "location" : "any",
            "requirement" : "help read",
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
        "clock" : "钟",
        "list" : "表格"
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
            "get <对象>" : "拿起某样东西。",
            "get <对象> from <容器>" : "从某个容器内取出某样东西。"
        },
        "start" : {
            "start new" : "建立新的存档。",
            "start <存档名>" : "读取某一个存档。"
        },
        "delete" : {
            "delete <存档名>" : "删除某一个存档。"
        },
        "save" : {
            "save" : "保存到当前存档，初次保存将决定存档名称。",
            "save <存档名>" : "保存到指定存档。如果不存在将会新建。"
        },
        "talkwith" : {
            "talkwith <对象>" : "和某人聊聊天。",
            "talkwith <对象> about <内容>" : "和某人聊聊某件事。"
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

    "npc" : {
        "10001" : {
            "id" : "boss",
            "name" : "旅店老板",
            "location" : "firetTown_hotel_lobby",
            "items" : [],
            "health" : 100,
            "interactions" : {
                "talk" : {
                    "hotel" : "here",
                    "here" : [
                        "这间旅店是我祖上传下来的，有几十年历史了。",
                        "这个小镇位于两国边境，平时来往的旅人很多，所以旅店的生意很好。",
                        "虽然附近的两国在边境时有冲突，但这个边境小镇一直很安宁。"
                    ],
                    "default" : "here",
                    "meal" : [
                        "这边的饭菜怎么样？今天可是我掌勺！",
                        "我年轻的时候在王都的一间面包店做过厨师，在这镇上没有人比我更懂面包了！"
                    ]
                }
            }
        }
    },

    "global" : {
        "time" : 480,
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
        ],
        "firetTown_hotel_lobby_list" : [
            "本店提供住宿及餐饮。客房在二楼，餐厅在一楼。"
        ]
    },

    "needTime" : {
        "help" : 0,
        "task" : 0,
        "look" : 1,
        "inv" : 0,
        "eat" : 1,
        "read" : 1,
        "save" : 0,
        "load" : 0,
        "get" : 1,
        "move" : 0, // 移动所需回合数应特殊判断
        "say" : 1,
        "whoami" : 0,
    }
}

let tempdata = {
    "player" : {
        "interrupted" : false
    }
}

let gameTitleBig = "\
     _   _  _____    _   _  _____  _    _  _____\n\
    | \\ | ||  _  |  | \\ | ||  _  || \\  / ||  ___|\n\
    |  \\| || | | |  |  \\| || | | ||  \\/  || |___\n\
    | \\ \\ || | | |  | \\ \\ || |_| || \\  / ||  ___|\n\
    | |\\  || |_| |  | |\\  ||  _  || |\\/| || |___\n\
    |_| \\_||_____|  |_| \\_||_| |_||_|  |_||_____|\n"