const data = {
    editedStatus: {
        type: 'main',
        idx: null,
        LPN: {
            name: null,
            period: null
        },
        NPNList: [],
    },
    activ: {
        name: '',
        year: '',
        month: '',
        times: [{
            name: '暖身',
            time: {
                start: '',
                end: '',
                diff: 0
            }
        }, {
            name: '正式',
            time: {
                start: '',
                end: '',
                diff: 0
            }
        }]
    },
    component: {
        output: {
            title: {
                NPN: '共用素材js(PC>置頂分會場、黏人精分為揚、壓標,Phone>置底選單、GOtop、壓標)'
            },
        },
    },
    page: {
        types: {
            main: {
                id: '01-RWD',
                title: {
                    name: '主會場',
                    hint: ' ( 可省略 LPN、NPN 頁名 )'
                },
                output: {
                    title: {
                        LPN: '【01-RWD-主會場-排程連結LPN】********黏人精對外曝光用的',
                        NPN: '【01-RWD-主會場-npn上傳連結】 ********單獨頁********'
                    },
                    LPNList: [],
                    NPNList: [],
                }
            },
            category: {
                id: '02-RWD-01',
                title: {
                    name: '品類日',
                    hint: ' ( 可省略 LPN 頁名 )'
                },
                output: {
                    title: {
                        LPN: '【02-RWD-01-品類日-排程連結LPN】*******黏人精對外曝光用的',
                        NPN: '【02-RWD-01-品類日-npn上傳連結】 ********單獨頁********'
                    },
                    LPNList: [],
                    NPNList: [],
                }
            }, 
            sub: {
                id: '02-RWD-02',
                title: {
                    name: '分會場',
                    hint: null
                },
                output: {
                    title: {
                        LPN: '【02-RWD-02-分會場-排程連結LPN】*******黏人精對外曝光用的',
                        NPN: '【02-RWD-02-分會場-npn上傳連結】 ********單獨頁********'
                    },
                    LPNList: [],
                    NPNList: [],
                }
            }, 
            game: {
                id: '03-RWD',
                title: {
                    name: '遊戲頁',
                    hint: null
                },
                output: {
                    title: {
                        LPN: '【03-RWD-遊戲頁-排程連結LPN】*******黏人精對外曝光用的',
                        NPN: '【03-RWD-遊戲頁-npn上傳連結】 ********單獨頁********'
                    },
                    LPNList: [],
                    NPNList: [],
                }
            }, 
            register: {
                id: '04-RWD',
                title: {
                    name: '登記頁',
                    hint: null
                },
                output: {
                    title: {
                        LPN: '【04-RWD-登記頁-排程連結LPN】*******黏人精對外曝光用的',
                        NPN: '【04-RWD-登記頁-npn上傳連結】 ********單獨頁********'
                    },
                    LPNList: [],
                    NPNList: [],
                }
            }, 
            others: {
                id: 'zz-RWD',
                title: {
                    name: '其他',
                    hint: null
                },
                output: {
                    title: {
                        LPN: '【RWD-其他-排程連結LPN】*******黏人精對外曝光用的',
                        NPN: '【RWD-其他-npn上傳連結】 ********單獨頁********'
                    },
                    LPNList: [],
                    NPNList: [],
                }
            }
        }
    },
}