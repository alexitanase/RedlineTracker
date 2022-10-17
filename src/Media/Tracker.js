class RLTracker extends Phaser.Scene {

    constructor ()
    {
        super();
    }

    // Partner Details
    PartnerName = '%PARTNER_NAME%';
    Structure = '%STRUCTURE_NAME%';

    // Style colors
    WIDGET_COLORS = {
        TEAM_HOME:      "#083FB5",
        TEAM_HOME_FILL: 0x083FB5,
        TEAM_AWAY:      "#751357",
        TEAM_AWAY_FILL: 0x751357,
        TIMEBG:         0x004900,
        TIMEBG_TEXT:    "#00cb00",
        TIMEBG_S2:      0x4597cb,
        TIMEBG_TEXT_S2: "#FFFFFF",
        TIMEBG_S3:      0x71350A,
        TIMEBG_TEXT_S3: "#FFFFFF",
        TIMEBG_S4:      0x114174,
        TIMEBG_TEXT_S4: "#FFFFFF",
        GENERIC_TEXT:   "#FFFFFF",
        LIGHT_TEXT:     "#fff90d"
    };

    WIDGET_FONT = "Geometos";

    WIDGET_OPTIONS = {
        ENABLE_SPLITER: true,
        ENABLE_EVENT_LEG: true,
        BACKGROUND_TRANSPARENT: false,
        DEBUG_MODE: false
    };

    EventId = 0;
    EventDetails = null;
    EventUpdate = null;
    DemoDetails = {
        Soccer: {
            "en":"Fundacion Tenerife - Atletico Union Guimar",
            "es":1,
            "ste":1665170100000,
            "sn":"Soccer",
            "si":1,
            "cgn":"Spain. Tercera Division. Women",
            "cgi":0,
            "cn":"Spain",
            "ci":0,
            "th":{
                "id":0,
                "name":"Fundacion Tenerife",
                "logo":"https:\/\/eventsstat.com\/sfiles\/logo_teams\/96ab7d8b9656f80febefffa7d474388f.png"
            },
            "ta":{
                "id":0,
                "name":"Atletico Union Guimar",
                "logo":"https:\/\/eventsstat.com\/sfiles\/logo_teams\/241313.png"
            },
            "esc":"2:2",
            "etsc":["2:2","0:0"],
            "ecp":"2",
            "ect":4586,
            "eht":false,
            "eas":null,
            "ests":{"YELLOW_CARD":{"name":"Yellow Card","home":"1","away":"0"},"RED_CARD":{"name":"Red Card","home":"0","away":"0"},"ATTACKS":{"name":"Attacks","home":"80","away":"95"},"DANGER_ATTACKS":{"name":"Dangerous Attacks","home":"44","away":"81"},"POSSESSION":{"name":"Possession","home":"43","away":"57"},"SHOT_ON_TARGET":{"name":"Shot on Target","home":"3","away":"8"},"SHOT_OFF_TARGET":{"name":"Shot off Target","home":"2","away":"9"},"CORNER":{"name":"Corner","home":"7","away":"3"}},
            "ecourse":[],
            "pos":{"x_zone":403081632},
            "internalOptions":{
                "status":true
            },
            "live":true
        }
    };
    DemoMode = false;

    // Elements
    Elements = {
        Loader: {
            lbl: null,
            viewer: null
        },
        Parts: {
            header: null
        },
        Soccer: [],
        Hockey: [],
        Basket: []
    };

    // Game Config
    ConfigPhaser = {
        type: Phaser.CANVAS,
        width: 800,
        height: 600,
        parent: 'tracker',
        transparent: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 }
            }
        },
        scene: this
    };
    GamePhaser = null;
    GameThis = null;

    //Public Media
    MediaPath = '//trkt.weibcon.com/';

    preload(){
        const self = this;

        self.Elements.Loader.lbl = this.add.text(400, 300, '-', { fontSize: '26px', fill: '#fff', fontFamily: self.WIDGET_FONT });
        let loader_position_w = self.Elements.Loader.lbl.width;
        self.Elements.Loader.lbl.setDepth(4).setPosition((400-loader_position_w), 300);

        this.load.on('fileprogress', function (file, value) {
            self.Elements.Loader.lbl.setText("Load assets: "+file.key);
            let loader_position_w = self.Elements.Loader.lbl.width;
            self.Elements.Loader.lbl.setPosition((400-(loader_position_w/2)), 300);
        });

        this.load.on('complete', function () {
            self.Elements.Loader.lbl.setText('Load completed');
            setTimeout(function(){
                self.Elements.Loader.lbl.setVisible(false);
            }, 2999);
            let loader_position_w = self.Elements.Loader.lbl.width;
            self.Elements.Loader.lbl.setPosition((400-(loader_position_w/2)), 300);
        });

        this.load.image("background", this.MediaPath+"media/imgs/4.3/background.png");

        //soccer
        this.load.image("scheme-soccer", this.MediaPath+"media/imgs/4.3/scheme_soccer.png");
        this.load.image("footer-soccer", this.MediaPath+"media/imgs/4.3/footer-soccer.png");
        this.load.atlas('anims-soccer', this.MediaPath+"media/imgs/4.3/soccer.png", this.MediaPath+"media/imgs/4.3/soccer.json");

        //tennis
        this.load.image("scheme-tennis", this.MediaPath+"media/imgs/4.3/scheme_tennis.png");
        this.load.atlas('anims-tennis', this.MediaPath+"media/imgs/4.3/tennis.png", this.MediaPath+"media/imgs/4.3/tennis.json");

        //volley
        this.load.image("scheme-volley", this.MediaPath+"media/imgs/4.3/scheme_volleyball.png");
        this.load.atlas('anims-volley', this.MediaPath+"media/imgs/4.3/volleyball-anim.png", this.MediaPath+"media/imgs/4.3/volleyball-anim.json");
        this.load.image("footer-generic", this.MediaPath+"media/imgs/4.3/footer-generic-table.png");

        //basketball
        this.load.image("scheme-basketball", this.MediaPath+"media/imgs/4.3/scheme_basketball.png");

        //hockey
        this.load.image("scheme-hockey", this.MediaPath+"media/imgs/4.3/scheme_hockey_v2.png");
        this.load.image("footer-hockey", this.MediaPath+"media/imgs/4.3/footer-hockey.png");

        //plugins
        this.load.plugin('rexcircularprogresscanvasplugin', this.MediaPath+'media/js/circular-progress.js', true);
    }

    create(){
        this.GameThis = this;
        this.eventExecutor();
    }

    update(){

    }

    checkDependencies(){
        if(typeof Phaser === 'undefined')return false;
        if(typeof io === 'undefined') return false;
        return true;
    }

    async request(options){
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(options.method || "GET", options.url);
            if (options.headers) {
                Object.keys(options.headers).forEach(key => {
                    xhr.setRequestHeader(key, options.headers[key]);
                });
            }
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    Response = JSON.parse(xhr.response);
                    if(Response.resultCode !== 0){
                        resolve({
                            error: Response.responseInfo
                        });
                    }else{
                        resolve(Response.responseInfo);
                    }
                } else {
                    resolve({
                        error: xhr.statusText
                    });
                }
            };
            xhr.onerror = () => {
                resolve({
                    error: xhr.statusText
                });
            };
            xhr.send(options.body);
        });
    }

    async requestExecutor(type, data){
        let Response;
        const self = this;
        switch (type){
            case "EVENT_DETAILS":
                Response = await this.request({
                    url: `http://redline.bo/widgets/tracker/${self.PartnerName}`,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams(data)
                });
                break;
            default:
                Response = {
                    error: "Invalid operation type."
                }
        }
        return Response;
    }

    eventUpdate(){

    }

    eventExecutor(){
        const self = this;
        if(self.EventDetails === null){
            throw new DOMException("Event not found!");
        }
        self.buildPartsConstructor('BACKGROUND');
        switch (self.EventDetails.si){
            case 1:
                self.buildPartsConstructor('HEADER');
                self.buildPartsConstructor('TIME');
                self.buildPartsConstructor('SCORE');
                self.buildPartsConstructor('BODY_SOCCER');
                self.buildPartsConstructor('FOOTER_SOCCER');
                break;
            case 2:
                self.buildPartsConstructor('HEADER');
                self.buildPartsConstructor('TIME_HOCKEY');
                self.buildPartsConstructor('SCORE');
                self.buildPartsConstructor('BODY_HOCKEY');
                self.buildPartsConstructor('FOOTER_HOCKEY');
                break;
            case 3:
                self.buildPartsConstructor('HEADER');
                self.buildPartsConstructor('TIME_BASKET');
                self.buildPartsConstructor('SCORE');
                self.buildPartsConstructor('BODY_BASKET');
                self.buildPartsConstructor('FOOTER_BASKET');
                break;
            case 4:
                self.buildPartsConstructor('HEADER');
                self.buildPartsConstructor('TIME_TENNIS');
                self.buildPartsConstructor('SCORE_TENNIS');
                self.buildPartsConstructor('BODY_TENNIS');
                break;
            default:

        }
    }

    buildPartsConstructor(part){
        const self = this;
        let wPos = 0;
        let tablea_position_w = 0;
        let stats;
        switch (part){
            case "BACKGROUND":
                if(!this.WIDGET_OPTIONS.BACKGROUND_TRANSPARENT){
                    this.Elements.Parts.Background = this.add.image(400, 300, "background");
                    this.Elements.Parts.Background.setDepth(0);
                }
                break;
            case "HEADER":
                //Home
                let textHomeName = self.EventDetails.th.name;
                if(self.EventDetails.th.name.length > 15){
                    let splitName = textHomeName.split(' ');
                    textHomeName = "";
                    for(let x = 0; x < splitName.length; x++){
                        if(x < 2) textHomeName = textHomeName+(x === 0 ? '' : ' ')+splitName[x];
                    }
                }

                if(typeof self.Elements.Parts.TeamHome !== 'undefined' && self.Elements.Parts.TeamHome !== null){
                    self.Elements.Parts.TeamHome.setText(textHomeName);
                }else{
                    self.Elements.Parts.TeamHome = self.GameThis.add.text(0, 32, textHomeName, { fontSize: '22px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    self.Elements.Parts.TeamHomeSubScore = self.GameThis.add.rectangle(365, 75, 50, 5, self.WIDGET_COLORS.TEAM_HOME_FILL, 0.9);
                }
                wPos = self.Elements.Parts.TeamHome.width;
                self.Elements.Parts.TeamHome.setPosition((330-wPos), 32);
                self.Elements.Parts.TeamHome.setDepth(1);
                self.Elements.Parts.TeamHomeSubScore.setDepth(1);

                //Away
                let textAwayName = self.EventDetails.ta.name;
                if(self.EventDetails.ta.name.length > 15){
                    let splitName = textAwayName.split(' ');
                    textAwayName = "";
                    for(let x = 0; x < splitName.length; x++){
                        textAwayName = textAwayName+(x === 0 ? '' : ' ')+splitName[x];
                    }
                }

                if(typeof self.Elements.Parts.TeamAway !== 'undefined' && self.Elements.Parts.TeamAway !== null){
                    self.Elements.Parts.TeamAway.setText(textAwayName);
                }else{
                    self.Elements.Parts.TeamAway = self.GameThis.add.text(465, 32, textAwayName, { fontSize: '22px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    self.Elements.Parts.TeamAwaySubScore = self.GameThis.add.rectangle(425, 75, 50, 5, self.WIDGET_COLORS.TEAM_AWAY_FILL, 0.9);
                }
                self.Elements.Parts.TeamAway.setDepth(1);
                self.Elements.Parts.TeamAwaySubScore.setDepth(1);

                //Header line
                if(self.WIDGET_OPTIONS.ENABLE_SPLITER && typeof self.Elements.Parts.HeaderSpliter === 'undefined'){
                    self.Elements.Parts.HeaderSpliter = self.GameThis.add.rectangle(400, 78, 800, 1, 0xDCDCDC, 0.4);
                    self.Elements.Parts.HeaderSpliter.setDepth(1);
                }

                //League
                if(self.WIDGET_OPTIONS.ENABLE_EVENT_LEG && typeof self.Elements.Parts.LeagueDetails === 'undefined'){
                    self.Elements.Parts.LeagueDetails = self.GameThis.add.text(400, 100, self.EventDetails.sn+" / "+self.EventDetails.cn+" / "+self.EventDetails.cgn, { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    wPos = self.Elements.Parts.LeagueDetails.width;
                    self.Elements.Parts.LeagueDetails.setPosition((400-(wPos/2)), 100);
                }else if(self.WIDGET_OPTIONS.ENABLE_EVENT_LEG && typeof self.Elements.Parts.LeagueDetails !== 'undefined'){
                    self.Elements.Parts.LeagueDetails.setText(self.EventDetails.sn+" / "+self.EventDetails.cn+" / "+self.EventDetails.cgn);
                    wPos = self.Elements.Parts.LeagueDetails.width;
                    self.Elements.Parts.LeagueDetails.setPosition((400-(wPos/2)), 100);
                }
                self.Elements.Parts.LeagueDetails.setDepth(1);
                break;
            case "TIME":
                self.Elements.Parts.TimeBox = self.GameThis.add.rectangle(400, 153, 150, 40, self.WIDGET_COLORS.TIMEBG, 0.85);
                self.Elements.Parts.TimeBox.setDepth(5);
                self.Elements.Parts.TimeText = self.GameThis.add.text(400, 140, self.labelCurrentTime(), { fontSize: '20px', fill: self.WIDGET_COLORS.TIMEBG_TEXT, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TimeText.width;
                self.Elements.Parts.TimeText.setPosition((400-(wPos/2)), 140);
                self.Elements.Parts.TimeText.setDepth(6);
                break;
            case "TIME_HOCKEY":
                self.Elements.Parts.TimeBox = self.GameThis.add.rectangle(400, 169, 100, 40, self.WIDGET_COLORS.TIMEBG_S2, 0.85);
                self.Elements.Parts.TimeBox.setDepth(5);
                self.Elements.Parts.TimeText = self.GameThis.add.text(400, 155, self.labelCurrentTime(), { fontSize: '20px', fill: self.WIDGET_COLORS.TIMEBG_TEXT_S2, fontFamily: 'Geometos' });
                wPos = self.Elements.Parts.TimeText.width;
                self.Elements.Parts.TimeText.setPosition((400-(wPos/2)), 155);
                self.Elements.Parts.TimeText.setDepth(6);
                break;
            case "TIME_BASKET":
                self.Elements.Parts.TimeBox = self.GameThis.add.rectangle(400, 153, 150, 40, self.WIDGET_COLORS.TIMEBG_S3, 0.85);
                self.Elements.Parts.TimeBox.setDepth(5);
                self.Elements.Parts.TimeText = self.GameThis.add.text(400, 140, self.labelCurrentTime(), { fontSize: '20px', fill: self.WIDGET_COLORS.TIMEBG_TEXT_S3, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TimeText.width;
                self.Elements.Parts.TimeText.setPosition((400-(wPos/2)), 140);
                self.Elements.Parts.TimeText.setDepth(6);
                break;
            case "TIME_TENNIS":
                self.Elements.Parts.TimeBox = self.GameThis.add.rectangle(400, 153, 150, 40, self.WIDGET_COLORS.TIMEBG_S4, 0.85);
                self.Elements.Parts.TimeBox.setDepth(5);
                self.Elements.Parts.TimeText = self.GameThis.add.text(400, 140, self.labelCurrentTime(), { fontSize: '20px', fill: self.WIDGET_COLORS.TIMEBG_TEXT_S4, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TimeText.width;
                self.Elements.Parts.TimeText.setPosition((400-(wPos/2)), 140);
                self.Elements.Parts.TimeText.setDepth(6);
                break;
            case "SCORE":
                let Score = self.EventDetails.esc.split(':');
                //Home
                self.Elements.Parts.TeamHomeScore = self.GameThis.add.text(365, 25, Score[0], { fontSize: '30px', fill: self.WIDGET_COLORS.LIGHT_TEXT, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TeamHomeScore.width;
                self.Elements.Parts.TeamHomeScore.setPosition((365-(wPos/2)), 25);
                self.Elements.Parts.TeamHomeScore.setDepth(1);

                //Away
                self.Elements.Parts.TeamAwayScore = self.GameThis.add.text(423, 25, Score[1], { fontSize: '30px', fill: self.WIDGET_COLORS.LIGHT_TEXT, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TeamAwayScore.width;
                self.Elements.Parts.TeamAwayScore.setPosition((423-(wPos/2)), 25);
                self.Elements.Parts.TeamAwayScore.setDepth(1);
                break;
            case "SCORE_TENNIS":
                let ScoreTennis = self.EventDetails.eas.split(':');
                //Home
                self.Elements.Parts.TeamHomeScore = self.GameThis.add.text(365, 25, ScoreTennis[0], { fontSize: '30px', fill: self.WIDGET_COLORS.LIGHT_TEXT, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TeamHomeScore.width;
                self.Elements.Parts.TeamHomeScore.setPosition((365-(wPos/2)), 25);
                self.Elements.Parts.TeamHomeScore.setDepth(1);

                //Away
                self.Elements.Parts.TeamAwayScore = self.GameThis.add.text(423, 25, ScoreTennis[1], { fontSize: '30px', fill: self.WIDGET_COLORS.LIGHT_TEXT, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TeamAwayScore.width;
                self.Elements.Parts.TeamAwayScore.setPosition((423-(wPos/2)), 25);
                self.Elements.Parts.TeamAwayScore.setDepth(1);
                break;
            case "SCORE_CHANGED":

                break;
            case "BODY_SOCCER":
                //BASIC GRAPHICS
                self.Elements.Parts.Scene = self.GameThis.add.image(400, 300, "scheme-soccer");
                self.Elements.Parts.Scene.setDepth(4);
                break;
            case "BODY_HOCKEY":
                //BASIC GRAPHICS
                self.Elements.Parts.Scene = self.GameThis.add.image(400, 300, "scheme-hockey");
                self.Elements.Parts.Scene.setDepth(4);
                break;
            case "BODY_TENNIS":
                //BASIC GRAPHICS
                self.Elements.Parts.Scene = self.GameThis.add.image(400, 300, "scheme-tennis");
                self.Elements.Parts.Scene.setDepth(4);
                break;
            case "BODY_VOLLEY":
                //BASIC GRAPHICS
                self.Elements.Parts.Scene = self.GameThis.add.image(400, 300, "scheme-volley");
                self.Elements.Parts.Scene.setDepth(4);
                break;
            case "BODY_BASKET":
                //BASIC GRAPHICS
                self.Elements.Parts.Scene = self.GameThis.add.image(400, 300, "scheme-basketball");
                self.Elements.Parts.Scene.setDepth(4);
                break;
            case "FOOTER_SOCCER":
                self.Elements.Parts.FooterScene = self.GameThis.add.image(400, 300, "footer-soccer");
                self.Elements.Parts.FooterScene.setDepth(5);

                let Possession_Percent = [0,0];
                let Shot_On_Target = [0,0];
                let Shot_Off_Target = [0,0];
                let YellowCards = [0,0];
                let RedCards = [0,0];
                let Offsides = [0,0];
                let Attacks = [0,0];
                let Corners = [0,0];

                stats = Object.entries(self.EventDetails.ests);
                if(stats.length > 0){
                    for(let i = 0; i < stats.length; i++) {
                        let key = stats[i][0];
                        if(key === "POSSESSION"){
                            Possession_Percent = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "CORNER"){
                            Corners = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "SHOT_ON_TARGET"){
                            Shot_On_Target = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "SHOT_OFF_TARGET"){
                            Shot_Off_Target = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "YELLOW_CARD"){
                            YellowCards = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "RED_CARD"){
                            RedCards = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "ATTACKS"){
                            Attacks = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }
                    }
                }

                let iv = 0;
                //CALC POSSESSION
                var calcTotal = (parseInt(Possession_Percent[0])+parseInt(Possession_Percent[1]));
                var calcHomePercet = (parseInt(Possession_Percent[0])/calcTotal*100);
                var calcProgressHWidth = (150*(calcHomePercet/100));
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(400, 505, 180, 15, 0x9b0951, 1);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(410, 480, 'Possession', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((410-(tablea_position_w/2)), 480);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 505, calcProgressHWidth, 15, 0x225772, 1);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(300, 496.5, Possession_Percent[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((300-tablea_position_w), 496.5);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(500, 496.5, Possession_Percent[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                iv++;
                //CALC SHOTS ON TARGET
                calcTotal = (parseInt(Shot_On_Target[0])+parseInt(Shot_On_Target[1]));
                calcHomePercet = (parseInt(Shot_On_Target[0])/calcTotal*100);
                calcProgressHWidth = (150*(calcHomePercet/100));
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(400, 540, 180, 15, 0x9b0951, 1);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(400, 515, 'Shots On Target', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((400-(tablea_position_w/2)), 515);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 540, calcProgressHWidth, 15, 0x225772, 1);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(300, 531.5, Shot_On_Target[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((300-tablea_position_w), 531.5);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(500, 531.5, Shot_On_Target[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                iv++;
                //CALC SHOTS OFF TARGET
                calcTotal = (parseInt(Shot_Off_Target[0])+parseInt(Shot_Off_Target[1]));
                calcHomePercet = (parseInt(Shot_Off_Target[0])/calcTotal*100);
                calcProgressHWidth = (150*(calcHomePercet/100));
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(400, 575, 180, 15, 0x9b0951, 1);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(400, 550, 'Shots Off Target', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((400-(tablea_position_w/2)), 550);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 575, calcProgressHWidth, 15, 0x225772, 1);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(300, 566.5, Shot_Off_Target[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((300-tablea_position_w), 566.5);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(500, 566.5, Shot_Off_Target[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(230, 565, Offsides[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((230-tablea_position_w), 565);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(230, 530, RedCards[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((230-tablea_position_w), 530);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(230, 496.5, YellowCards[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((230-tablea_position_w), 496.5);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(570, 565, Offsides[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(570, 530, RedCards[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(570, 496.5, YellowCards[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                iv++;
                try {
                    let calcTotal = (parseInt(Attacks[0])+parseInt(Attacks[1]));
                    let calcHomePercet = (parseInt(Attacks[0])/calcTotal*100);
                    let calcProgressHWidth = (100*(calcHomePercet/100));
                    self.Elements.Soccer[iv] = self.GameThis.add.rexCircularProgressCanvas({
                        x: 100, y: 530,
                        radius: 30,
                        trackColor: 0x225772,
                        barColor: 0x9b0951,
                        centerColor: 0x000000,
                        textColor: 0x000000,
                        textStrokeColor: 'black',
                        textStrokeThickness: 3,
                        textSize: '30px',
                        textStyle: 'bold',
                        textFormatCallback: function (value) {
                            return 0;
                        },
                        value: 0
                    });

                    self.GameThis.tweens.add({
                        targets: self.Elements.Soccer[iv],
                        value: (1-(calcProgressHWidth/100)),
                        duration: 2000,
                        ease: 'Cubic',
                    });
                    iv++;
                    self.Elements.Soccer[iv] = self.GameThis.add.text(145, 565, "Attacks", { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Soccer[iv].width;
                    self.Elements.Soccer[iv].setPosition((145-tablea_position_w), 565);
                    iv++;
                    self.Elements.Soccer[iv] = self.GameThis.add.text(65, 522, Attacks[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Soccer[iv].width;
                    self.Elements.Soccer[iv].setPosition((65-tablea_position_w), 522);
                    iv++;
                    self.Elements.Soccer[iv] = self.GameThis.add.text(135, 522, Attacks[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    iv++;
                }catch(err){
                    //console.error(err);
                }
                try {
                    let calcTotal = (parseInt(Corners[0])+parseInt(Corners[1]));
                    let calcHomePercet = (parseInt(Corners[0])/calcTotal*100);
                    let calcProgressHWidth = (100*(calcHomePercet/100));
                    self.Elements.Soccer[iv] = self.GameThis.add.rexCircularProgressCanvas({
                        x: 700, y: 530,
                        radius: 30,
                        trackColor: 0x225772,
                        barColor: 0x9b0951,
                        centerColor: 0x000000,
                        textColor: 0x000000,
                        textStrokeColor: 'black',
                        textStrokeThickness: 3,
                        textSize: '30px',
                        textStyle: 'bold',
                        textFormatCallback: function (value) {
                            return 0;
                        },
                        value: 0
                    });

                    self.GameThis.tweens.add({
                        targets: self.Elements.Soccer[iv],
                        value: (1-(calcProgressHWidth/100)),
                        duration: 2000,
                        ease: 'Cubic',
                    });
                    iv++;
                    self.Elements.Soccer[iv] = self.GameThis.add.text(745, 565, "Corners", { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Soccer[iv].width;
                    self.Elements.Soccer[iv].setPosition((735-tablea_position_w), 565);
                    iv++;
                    self.Elements.Soccer[iv] = self.GameThis.add.text(665, 522, Corners[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Soccer[iv].width;
                    self.Elements.Soccer[iv].setPosition((665-tablea_position_w), 522);
                    iv++;
                    self.Elements.Soccer[iv] = self.GameThis.add.text(735, 522, Corners[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    iv++;
                }catch(err){
                    //console.error(err);
                }
                break;
            case "FOOTER_HOCKEY":
                self.Elements.Parts.FooterScene = self.GameThis.add.image(400, 300, "footer-hockey");
                self.Elements.Parts.FooterScene.setDepth(5);
                let ih = 0;
                self.Elements.Hockey[ih] = self.GameThis.add.text(57, 495, (parseInt(self.EventDetails.ecp) === 0 ? 'Ended' : self.EventDetails.ecp+" Period"), { fontSize: '18px', fill: '#b1b1b1', fontFamily: self.WIDGET_FONT });
                ih++;
                self.Elements.Hockey[ih] = self.GameThis.add.text(73, 528, self.EventDetails.th.name, { fontSize: '22px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ih++;
                self.Elements.Hockey[ih] = self.GameThis.add.text(73, 563, self.EventDetails.ta.name, { fontSize: '22px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ih++;

                let scorePeriodHome = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[0] !== 'undefined') scorePeriodHome = self.EventDetails.etsc[0].split(':')[0];
                }
                self.Elements.Hockey[ih] = self.GameThis.add.text(553, 530, scorePeriodHome, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ih++;
                let scorePeriodAway = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[0] !== 'undefined') scorePeriodAway = self.EventDetails.etsc[0].split(':')[1];
                }
                self.Elements.Hockey[ih] = self.GameThis.add.text(553, 565, scorePeriodAway, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ih++;

                scorePeriodHome = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[1] !== 'undefined') scorePeriodHome = self.EventDetails.etsc[1].split(':')[0];
                }
                self.Elements.Hockey[ih] = self.GameThis.add.text(612, 530, scorePeriodHome, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ih++;
                scorePeriodAway = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[1] !== 'undefined') scorePeriodAway = self.EventDetails.etsc[1].split(':')[1];
                }
                self.Elements.Hockey[ih] = self.GameThis.add.text(612, 565, scorePeriodAway, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ih++;

                scorePeriodHome = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[2] !== 'undefined') scorePeriodHome = self.EventDetails.etsc[2].split(':')[0];
                }
                self.Elements.Hockey[ih] = self.GameThis.add.text(672, 530, scorePeriodHome, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ih++;
                scorePeriodAway = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[2] !== 'undefined') scorePeriodAway = self.EventDetails.etsc[2].split(':')[1];
                }
                self.Elements.Hockey[ih] = self.GameThis.add.text(672, 565, scorePeriodAway, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ih++;

                let score = self.EventDetails.esc.split(':');
                self.Elements.Hockey[ih] = self.GameThis.add.text(727, 530, score[0], { fontSize: '18px', fill: '#ffed24', fontFamily: self.WIDGET_FONT });
                ih++;
                self.Elements.Hockey[ih] = self.GameThis.add.text(727, 565, score[1], { fontSize: '18px', fill: '#ffed24', fontFamily: self.WIDGET_FONT });
                break;
            case "FOOTER_BASKET":
                let TwoPointersMade = [0,0];
                let ThreePointersMade = [0,0];
                let Fouls = [0,0];
                let FreeThrowsTotal = [0,0];
                let FreeThrowsScored = [0,0];
                stats = Object.entries(self.EventDetails.ests);
                if(stats.length > 0){
                    for(let i = 0; i < stats.length; i++) {
                        let key = stats[i][0];
                        if(key === "2PTS_GOALS"){
                            TwoPointersMade = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "3PTS_GOALS"){
                            ThreePointersMade = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "FAULTS"){
                            Fouls = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "FREE_KICKS"){
                            FreeThrowsTotal = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "GOAL_FREE_KICKS"){
                            FreeThrowsScored = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }
                    }
                }
                let ib = 0;
                calcHomePercet = (parseInt(TwoPointersMade[0])/calcTotal*100);
                calcProgressHWidth = (150*(calcHomePercet/100));
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(400, 505, 180, 15, 0x9b0951, 1);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(400, 480, '2Pts goals', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Basket[ib].width;
                self.Elements.Basket[ib].setPosition((400-(tablea_position_w/2)), 480);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 505, calcProgressHWidth, 15, 0x225772, 1);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(300, 496.5, TwoPointersMade[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Basket[ib].width;
                self.Elements.Basket[ib].setPosition((300-tablea_position_w), 496.5);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(500, 496.5, TwoPointersMade[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ib++;
                calcTotal = (parseInt(ThreePointersMade[0])+parseInt(ThreePointersMade[1]));
                calcHomePercet = (parseInt(ThreePointersMade[0])/calcTotal*100);
                calcProgressHWidth = (150*(calcHomePercet/100));
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(400, 540, 180, 15, 0x9b0951, 1);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(400, 515, '3Pts goals', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Basket[ib].width;
                self.Elements.Basket[ib].setPosition((400-(tablea_position_w/2)), 515);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 540, calcProgressHWidth, 15, 0x225772, 1);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(300, 531.5, ThreePointersMade[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Basket[ib].width;
                self.Elements.Basket[ib].setPosition((300-tablea_position_w), 531.5);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(500, 531.5, ThreePointersMade[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ib++;
                calcTotal = (parseInt(Fouls[0])+parseInt(Fouls[1]));
                calcHomePercet = (parseInt(Fouls[0])/calcTotal*100);
                calcProgressHWidth = (150*(calcHomePercet/100));
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(400, 575, 180, 15, 0x9b0951, 1);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(400, 550, 'Faults', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Basket[ib].width;
                self.Elements.Basket[ib].setPosition((400-(tablea_position_w/2)), 550);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 575, calcProgressHWidth, 15, 0x225772, 1);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(300, 566.5, Fouls[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Basket[ib].width;
                self.Elements.Basket[ib].setPosition((300-tablea_position_w), 566.5);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(500, 566.5, Fouls[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ib++;
                try {
                    calcTotal = (parseInt(FreeThrowsTotal[0])+parseInt(FreeThrowsTotal[1]));
                    calcHomePercet = (parseInt(FreeThrowsTotal[0])/calcTotal*100);
                    calcProgressHWidth = (100*(calcHomePercet/100));
                    self.Elements.Basket[ib] = self.GameThis.add.rexCircularProgressCanvas({
                        x: 100, y: 530,
                        radius: 30,

                        trackColor: 0x225772,
                        barColor: 0x9b0951,
                        centerColor: 0x000000,
                        // anticlockwise: true,

                        textColor: 0x000000,
                        textStrokeColor: 'black',
                        textStrokeThickness: 3,
                        textSize: '30px',
                        textStyle: 'bold',
                        textFormatCallback: function (value) {
                            return 0;
                        },
                        value: 0
                    });

                    self.GameThis.tweens.add({
                        targets: self.Elements.Basket[ib],
                        value: (1-(calcProgressHWidth/100)),
                        duration: 2000,
                        ease: 'Cubic',
                    });
                    ib++;
                    self.Elements.Basket[ib] = self.GameThis.add.text(100, 565, 'FREE KICKS', { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Basket[ib].width;
                    self.Elements.Basket[ib].setPosition((100-(tablea_position_w/2)), 565);
                    ib++;
                    self.Elements.Basket[ib] = self.GameThis.add.text(65, 522, FreeThrowsTotal[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Basket[ib].width;
                    self.Elements.Basket[ib].setPosition((65-tablea_position_w), 522);
                    ib++;
                    self.Elements.Basket[ib] = self.GameThis.add.text(135, 522, FreeThrowsTotal[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    ib++;
                }catch(err){
                    console.error(err);
                }
                try {
                    calcTotal = (parseInt(FreeThrowsScored[0])+parseInt(FreeThrowsScored[1]));
                    calcHomePercet = (parseInt(FreeThrowsScored[0])/calcTotal*100);
                    calcProgressHWidth = (100*(calcHomePercet/100));
                    self.Elements.Basket[ib] = self.GameThis.add.rexCircularProgressCanvas({
                        x: 700, y: 530,
                        radius: 30,

                        trackColor: 0x225772,
                        barColor: 0x9b0951,
                        centerColor: 0x000000,
                        // anticlockwise: true,

                        textColor: 0x000000,
                        textStrokeColor: 'black',
                        textStrokeThickness: 3,
                        textSize: '30px',
                        textStyle: 'bold',
                        textFormatCallback: function (value) {
                            return 0;
                        },
                        value: 0
                    });

                    self.GameThis.tweens.add({
                        targets: self.Elements.Basket[ib],
                        value: (1-(calcProgressHWidth/100)),
                        duration: 2000,
                        ease: 'Cubic',
                    });
                    ib++;
                    self.Elements.Basket[ib] = self.GameThis.add.text(705, 565, 'GOAL FREE KICK ', { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Basket[ib].width;
                    self.Elements.Basket[ib].setPosition((705-(tablea_position_w/2)), 565);
                    ib++;
                    self.Elements.Basket[ib] = self.GameThis.add.text(665, 522, FreeThrowsScored[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Basket[ib].width;
                    self.Elements.Basket[ib].setPosition((665-tablea_position_w), 522);
                    ib++;
                    self.Elements.Basket[ib] = self.GameThis.add.text(735, 522, FreeThrowsScored[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    ib++;
                }catch(err){
                    console.error(err);
                }
                break;
            case "CLEAR":
                try {
                    if(!self.WIDGET_OPTIONS.BACKGROUND_TRANSPARENT){
                        self.Elements.Parts.Background.destroy();
                    }
                }catch (e){}
                try {
                    if(self.Elements.Soccer.length > 0){
                        self.Elements.Soccer.forEach(function(v,i){
                            self.Elements.Soccer[i].destroy();
                        });
                    }
                }catch (e){}
                try {
                    if(self.Elements.Hockey.length > 0){
                        self.Elements.Hockey.forEach(function(v,i){
                            self.Elements.Hockey[i].destroy();
                        });
                    }
                }catch (e){}
                try {
                    if(self.Elements.Basket.length > 0){
                        self.Elements.Basket.forEach(function(v,i){
                            self.Elements.Basket[i].destroy();
                        });
                    }
                }catch (e){}
                try {
                    self.Elements.Parts.Scene.destroy();
                }catch (e){}
                try {
                    self.Elements.Parts.FooterScene.destroy();
                }catch (e){}
                try {
                    self.Elements.Parts.TeamHomeScore.destroy();
                    self.Elements.Parts.TeamAwayScore.destroy();
                }catch (e){}
                try {
                    self.Elements.Parts.TimeBox.destroy();
                    self.Elements.Parts.TimeText.destroy();
                }catch (e){}
                break;
        }
        return true;
    }

    updatePartsConstructor(part){
        const self = this;
        switch (part){
            case "STATISTICS":
                switch (self.EventDetails.si){
                    case 1:
                        try {
                            if(self.Elements.Soccer.length > 0){
                                self.Elements.Soccer.forEach(function(v,i){
                                    self.Elements.Soccer[i].destroy();
                                });
                            }
                        }catch (e){}
                        self.buildPartsConstructor('FOOTER_SOCCER');
                        break;
                    case 2:
                        try {
                            if(self.Elements.Hockey.length > 0){
                                self.Elements.Hockey.forEach(function(v,i){
                                    self.Elements.Hockey[i].destroy();
                                });
                            }
                        }catch (e){}
                        self.buildPartsConstructor('FOOTER_HOCKEY');
                        break;
                    case 3:
                        try {
                            if(self.Elements.Basket.length > 0){
                                self.Elements.Basket.forEach(function(v,i){
                                    self.Elements.Basket[i].destroy();
                                });
                            }
                        }catch (e){}
                        self.buildPartsConstructor('FOOTER_BASKET');
                        break;
                    default:
                }
                break;
            case "TIME":
                try {
                    self.Elements.Parts.TimeBox.destroy();
                    self.Elements.Parts.TimeText.destroy();
                }catch (e){}
                switch (self.EventDetails.si){
                    case 1:
                        self.buildPartsConstructor('TIME');
                        break;
                    case 2:
                        self.buildPartsConstructor('TIME_HOCKEY');
                        break;
                    case 3:
                        self.buildPartsConstructor('TIME_BASKET');
                        break;
                    case 4:
                        self.buildPartsConstructor('TIME_TENNIS');
                        break;
                    default:
                }
                break;
            case "SCORE":
                let scoreArrived = '';
                let lastHScore = 0;
                let lastAScore = 0;
                switch (self.EventDetails.si){
                    case 1:
                        scoreArrived = self.EventDetails.esc.split(':');
                        lastHScore = parseInt(self.Elements.Parts.TeamHomeScore.text);
                        lastAScore = parseInt(self.Elements.Parts.TeamAwayScore.text);
                        if(lastHScore !== parseInt(scoreArrived[0]) || lastAScore !== parseInt(scoreArrived[1])){
                            console.debug("New Score Detected");
                        }
                        try {
                            self.Elements.Parts.TeamHomeScore.destroy();
                            self.Elements.Parts.TeamAwayScore.destroy();
                        }catch (e){}
                        self.buildPartsConstructor('SCORE');
                        break;
                    case 2:
                        scoreArrived = self.EventDetails.esc.split(':');
                        lastHScore = parseInt(self.Elements.Parts.TeamHomeScore.text);
                        lastAScore = parseInt(self.Elements.Parts.TeamAwayScore.text);
                        if(lastHScore !== parseInt(scoreArrived[0]) || lastAScore !== parseInt(scoreArrived[1])){
                            console.debug("New Score Detected");
                        }
                        try {
                            self.Elements.Parts.TeamHomeScore.destroy();
                            self.Elements.Parts.TeamAwayScore.destroy();
                        }catch (e){}
                        self.buildPartsConstructor('SCORE');
                        break;
                    case 3:
                        scoreArrived = self.EventDetails.esc.split(':');
                        lastHScore = parseInt(self.Elements.Parts.TeamHomeScore.text);
                        lastAScore = parseInt(self.Elements.Parts.TeamAwayScore.text);
                        if(lastHScore !== parseInt(scoreArrived[0]) || lastAScore !== parseInt(scoreArrived[1])){
                            console.debug("New Score Detected");
                        }
                        try {
                            self.Elements.Parts.TeamHomeScore.destroy();
                            self.Elements.Parts.TeamAwayScore.destroy();
                        }catch (e){}
                        self.buildPartsConstructor('SCORE');
                        break;
                    case 4:
                        scoreArrived = self.EventDetails.eas.split(':');
                        lastHScore = parseInt(self.Elements.Parts.TeamHomeScore.text);
                        lastAScore = parseInt(self.Elements.Parts.TeamAwayScore.text);
                        if(lastHScore !== parseInt(scoreArrived[0]) || lastAScore !== parseInt(scoreArrived[1])){
                            console.debug("New Score Detected");
                        }
                        try {
                            self.Elements.Parts.TeamHomeScore.destroy();
                            self.Elements.Parts.TeamAwayScore.destroy();
                        }catch (e){}
                        self.buildPartsConstructor('SCORE_TENNIS');
                        break;
                }
                break;
        }
        return true;
    }

    labelCurrentTime(){
        const self = this;
        let lblStatus = self.EventDetails.ecp;
        switch (self.EventDetails.si){
            case 1:
                if(self.EventDetails.eht){
                    lblStatus = 'HT';
                }else{
                    lblStatus = self.EventDetails.ecp+'p - '+parseInt(self.EventDetails.ect/60)+"'";
                }
                break;
            case 2:
                lblStatus = self.EventDetails.ecp+'p - '+((20*parseInt(self.EventDetails.ecp))-parseInt(self.EventDetails.ect/60))+"'";
                break;
            case 3:
                lblStatus = self.EventDetails.ecp+'q - '+((10*parseInt(self.EventDetails.ecp))-parseInt(self.EventDetails.ect/60))+"'";
                break;
            case 4:
                lblStatus = "SET "+self.EventDetails.ecp;
                break;
            case 5:
                lblStatus = "SET "+self.EventDetails.ecp;
                break;
        }
        if(parseInt(self.EventDetails.ecp) === 0 || !self.EventDetails.live){
            lblStatus = 'Ended';
        }
        return lblStatus;
    }

    async updateEventDetails(self){
        let Response = await self.requestExecutor("EVENT_DETAILS", {
            opName: "GetEventDetails",
            eventId: self.EventId
        });
        if(typeof Response.error !== "undefined"){
            throw new DOMException("Error received: "+Response.error);
        }
        self.EventDetails = Response;
        self.updatePartsConstructor("SCORE");
        self.updatePartsConstructor("TIME");
        self.updatePartsConstructor("STATISTICS");
    }

    async initTracker(settings){
        if(!this.checkDependencies()){
            throw new DOMException("Dependencies required!");
        }
        if(typeof settings.demo !== 'undefined' && settings.demo === true){
            this.DemoMode = true;
            this.EventDetails = this.DemoDetails.Soccer;
        }else{
            if(typeof settings.match_id === 'undefined'){
                throw new DOMException("Match Id undefined");
            }else{
                this.EventId = settings.match_id;
            }
            let Response = await this.requestExecutor("EVENT_DETAILS", {
                opName: "GetEventDetails",
                eventId: this.EventId
            });
            if(typeof Response.error !== "undefined"){
                throw new DOMException("Error received: "+Response.error);
            }
            this.EventDetails = Response;
        }
        if(typeof settings.container === 'undefined'){
            throw new DOMException("Container undefined");
        }else{
            this.ConfigPhaser.parent = settings.container;
        }
        if(this.GameThis === null){
            this.GamePhaser = new Phaser.Game(this.ConfigPhaser);
        }else{
            this.buildPartsConstructor('CLEAR');
            this.eventExecutor();
        }
        clearInterval(this.EventUpdate);
        this.EventUpdate = setInterval(this.updateEventDetails, 5000, this);
    }
}