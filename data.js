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
                "down" : "firstTown_hotel_lobby",
                "left" : "firstTown_hotel_dining_room"
            }
        },
        "firstTown_hotel_lobby" : {
            "id" : "firstTown_hotel_lobby",
            "name" : "旅店的前厅",
            "detail" : "前厅里没有什么人，只有老板百无聊赖地坐在柜台后面，似乎在打盹。",
            "items" : [
                {
                    "id" : "list",
                    "content" : "firstTown_hotel_lobby_list"
                }
            ],
            "near" : {
                "up" : "firstTown_hotel_corridor"
            }
        },
        "firstTown_hotel_dining_room" : {
            "id" : "firstTown_hotel_dining_room",
            "name" : "旅店的食堂",
            "detail" : "旅客们在这里进餐，四周都是饭菜的香气。人们的说话声、碗筷碰撞声和后厨传来的锅铲撞击声交织在一起。\n柜台后面便是厨房。女主人正在柜台接待食客。",
            "items" : [
                {
                    "id" : "list",
                    "content" : "firstTown_hotel_dining_room_list"
                }
            ],
            "near" : {
                "right" : "firstTown_hotel_corridor",
                "left" : "firstTown_hotel_kitchen"
            }
        },
        "firstTown_hotel_kitchen" : {
            "id" : "firstTown_hotel_kitchen",
            "name" : "旅店的厨房",
            "detail" : "厨房与餐厅只由一列柜台隔开。厨师们在这里卖力地工作。",
            "items" : [],
            "near" : {
                "right" : "firstTown_hotel_dining_room"
            },
            "nowindow" : true
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
            "next" : "tutorial-talkwith"
        },
        "tutorial-talkwith" : {
            "name" : "和老板说说话",
            "detail" : "移动到旅店的前厅，使用 talkwith 向老板询问关于自己的事情。",
            "dialogueWhenAccept" : "话说回来，对于今天早上以前的事情，我是一点都想不起来，就连我是怎么到这里的都不知道。\n不如问问这间旅店的老板，他应该会知道些什么。",
            "location" : "firstTown_hotel_lobby",
            "requirement" : "talkwith boss about me"
        },
        "firstTown_hotel-food_delivery" : {
            "name" : "给老板带饭",
            "detail" : "把老板娘给的三明治带给老板。",
            "acceptRequirement" : [
                "$#playerLocation === \"firstTown_hotel_dining_room\"",
                "$(#time >= 720 && #time < 780) || (#time >= 1080 && #time < 1140)"
            ],
            "location" : "firstTown_hotel_lobby",
            "requirement" : "give sandwich to boss",
            "reward" : {
                "money" : 5
            }
        }
    },

    "events" : [
        {
            "requirement" : "$#time === 300",
            "event" : () => {
                for (let i of gamedata.map["firstTown_hotel_corridor"].items) {
                    if (i.id === "shelf" && countItem(i, { "id" : "bread" }) <= 4) {
                        addItem(i, {
                            "id" : "bread",
                            "carriable" : true,
                            "nutrition" : 30
                        }, 2);
                        return true;
                    }
                }
                return false;
            }
        },
        {
            "event" : () => {
                if (gamedata.player.hunger > 0) {
                    // 玩家每回合损失饱食度
                    if (gamedata.player.hunger > 30) {
                        gamedata.player.hunger -= 2;
                    } else {
                        gamedata.player.hunger -= 1;
                    }
                } else {
                    // 若饱食度为0则损失生命值
                    if (gamedata.player.health > 10) {
                        gamedata.player.health -= 2;
                    }
                }
            }
        }
    ],

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
            "move（或缩写 m ）" : "进入移动模式。移动完成后按下 m 停止移动。",
            "【移动端注意】" : "移动端不可使用move命令，可以使用w/a/s/d命令来移动。"
        },
        "w" : {
            "w" : "向地图上方移动。"
        },
        "a" : {
            "a" : "向地图左方移动。"
        },
        "s" : {
            "s" : "向地图下方移动。"
        },
        "d" : {
            "d" : "向地图右方移动。"
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
        },
        "savelist" : {
            "savelist" : "查看所有存档。"
        },
        "map" : {
            "map" : "查看周围的地点。"
        },
        "buy" : {
            "buy <物品> from <对象>" : "从某人那里买某件东西。"
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
        "hunger" : 10,
        "money" : 0
    },

    "npc" : {
        "10001" : {
            "id" : "boss",
            "name" : "旅店老板",
            "location" : "firstTown_hotel_lobby",
            "items" : [],
            "health" : 100
        },
        "10002" : {
            "id" : "hostress",
            "name" : "旅店女主人",
            "location" : "firstTown_hotel_dining_room",
            "items" : [],
            "health" : 100
        }
    },

    "npcInteractions" : {
        "10001" : {
            "talk" : {
                "hotel" : {
                    "type" : "random",
                    "content" : [
                        "这间旅店是我祖上传下来的，有几十年历史了。",
                        "这个小镇位于两国边境，平时来往的旅人很多，所以旅店的生意很好。",
                    ]
                },
                "here" : {
                    "type" : "random",
                    "content" : [
                        "@hotel",
                        "虽然附近的两国在边境时有冲突，但这个边境小镇一直很安宁。"
                    ]
                },
                "default" : "@hotel",
                "meal" : {
                    "type" : "all",
                    "content" : [
                        {
                            "type" : "random",
                            "content" : [
                                "这边的饭菜怎么样？今天可是我掌勺！",
                                "我年轻的时候在王都的一间面包店做过厨师，在这镇上没有人比我更懂面包了！"
                            ]
                        },
                        {
                            "type" : "all",
                            "requirement" : "$(#time >= 720 && #time < 780) || (#time >= 1080 && #time < 1140)",
                            "content" : [
                                "我肚子有点饿了，但我有点忙，脱不开身。你能帮我从餐厅带一个三明治过来吗？",
                                "$playerAddTask(\"firstTown_hotel-food_delivery\")"
                            ]
                        }
                    ]
                },
                "me" : {
                    "type" : "random",
                    "content" : [
                        "你？我昨天要打烊的时候看到你昏倒在旅店外面，就把你背了进来，让你躺着休息。"
                    ]
                }
            }
        },
        "10002" : {
            "talk" : {
                "hotel" : {
                    "type" : "random",
                    "content" : [
                        "这间旅店是我丈夫祖上传下来的。听他说，这间旅店在这里开了几十年了。",
                    ]
                },
                "here" : {
                    "type" : "random",
                    "content" : [
                        "这里白天不是特别热闹，但一到晚上，各种各样的人们都聚在这里吃喝谈天，直到半夜。",
                        "@hotel"
                    ]
                },
                "default" : "@meal",
                "meal" : {
                    "type" : "all",
                    "content" : [
                        {
                            "type" : "random",
                            "content" : [
                                "你知道吗？这里的玉米浓汤可是镇上的一绝。",
                                "我不太懂做饭，你可以去厨房和我们的大厨聊一聊。"
                            ]
                        },
                        {
                            "type" : "all",
                            "requirement" : "$(#time >= 720 && #time < 780) || (#time >= 1080 && #time < 1140)",
                            "content" : [
                                "已经到了吃饭时间，可以请你把这个三明治带给我丈夫吗？他就在旅店的前台。",
                                "$playerAddTask(\"firstTown_hotel-food_delivery\")"
                            ]
                        }
                    ]
                }
            },
            "trade" : [
                {
                    "item" : {
                        "id" : "bread",
                        "carriable" : true,
                        "nutrition" : 30
                    },
                    "price" : 10,
                    "sum" : -1
                }
            ]
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
        "firstTown_hotel_lobby_list" : [
            "本店提供住宿及餐饮。客房在二楼，餐厅在一楼。",
            "餐厅营业时间：早上6点到下午2点，下午6点到次日上午2点。",
            "“流浪汉之家”24小时开放，每天早上6点提供免费面包。"
        ],
        "firstTown_hotel_dining_room_list" : [
            "#菜单",
            "【主食类】",
            "黑面包 -- 5G",
            "面包 -- 10G",
            "鸡肉三明治 -- 20G",
            "牛排 -- 70G",
            "【饮品类】",
            "淡茶水 -- 免费",
            "牛奶 -- 5G",
            "玉米浓汤 -- 15G"
        ]
    },

    "needTime" : {
        "look" : 1,
        "eat" : 1,
        "read" : 1,
        "get" : 1,
        "say" : 1,
        "talkwith" : 1,
        "buy" : 1
    }
}

let tempdata = {
    "player" : {
        "interrupted" : false
    }
}

const gameTitleBig = "\
     _   _  _____    _   _  _____  _    _  _____\n\
    | \\ | ||  _  |  | \\ | ||  _  || \\  / ||  ___|\n\
    |  \\| || | | |  |  \\| || | | ||  \\/  || |___\n\
    | \\ \\ || | | |  | \\ \\ || |_| || \\  / ||  ___|\n\
    | |\\  || |_| |  | |\\  ||  _  || |\\/| || |___\n\
    |_| \\_||_____|  |_| \\_||_| |_||_|  |_||_____|\n"

const gameSaveDataSignature = "SAVE DATA OF WEBRPG"