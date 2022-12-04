class RLTracker extends Phaser.Scene {

    constructor ()
    {
        super();
    }

    // Partner Details
    PartnerName = '%PARTNER_NAME%';
    PartnerLogo = '%PARTNER_LOGO%';
    Structure   = '%STRUCTURE_NAME%';

    //API Server
    APIPath     = '%API_PATH%';

    //WebSocket Server
    WebSocket   = "//127.0.0.1:8095/";
    WSClient    = null;

    //Media Server
    MediaPath   = '//trkt.weibcon.com/';

    // Style colors
    WIDGET_COLORS = {
        TEAM_HOME:      "#225772",
        TEAM_AWAY:      "#751357",
        HEADER_LINE:    "#DCDCDC",
        TIMEBG:         "#004900",
        TIMEBG_TEXT:    "#00cb00",
        TIMEBG_S2:      "#4597cb",
        TIMEBG_TEXT_S2: "#FFFFFF",
        TIMEBG_S3:      "#71350A",
        TIMEBG_TEXT_S3: "#FFFFFF",
        TIMEBG_S4:      "#114174",
        TIMEBG_TEXT_S4: "#FFFFFF",
        GENERIC_TEXT:   "#FFFFFF",
        GENERIC_TEXT_2ND:"#b1b1b1",
        LIGHT_TEXT:     "#fff90d",
        TIMEBG_S6:      "#e16a11",
        BALL_COLOR:     "#ffffff",
        CHART_CIRCLE: {
            TRACK:      "#225772",
            BAR:        "#751357",
            BG:         "#000000"
        },
        PROGRESS_BAR: {
            BG:         "#751357",
            LG:         "#225772"
        },
        IMPORTANT_MSG: {
            BOX:        "#225772",
            MIN:        "#751357",
            TXT:        "#FFF",
        }
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
        ImportantMessage: [],
        Soccer: [],
        Hockey: [],
        Basket: [],
        Tennis: [],
        Volley: [],
        Animations: [],
        Teams: {
            Home: [],
            Away: []
        }
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

    preload(){
        const self = this;

        self.Elements.Loader.lbl = this.add.text(400, 300, '-', { fontSize: '26px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
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
        //this.load.image("footer-hockey", this.MediaPath+"media/imgs/4.3/footer-hockey.png");

        //others
        this.load.image("home-possession", this.MediaPath+"media/imgs/4.3/home-possession.png");
        this.load.image("away-possession", this.MediaPath+"media/imgs/4.3/away-possession.png");
        this.load.image("home-attack", this.MediaPath+"media/imgs/4.3/home-attack.png");
        this.load.image("away-attack", this.MediaPath+"media/imgs/4.3/away-attack.png");

        //plugins
        this.load.plugin('rexcircularprogresscanvasplugin', this.MediaPath+'media/js/circular-progress.js', true);
    }

    create(){
        this.GameThis = this;

        //SOCCER BALL
        if(this.Elements.Soccer.Ball == null){
            this.Elements.Soccer.Ball = this.GameThis.add.circle(400, 302, 5, Phaser.Display.Color.HexStringToColor(this.WIDGET_COLORS.BALL_COLOR).color);
            this.Elements.Soccer.Ball.setDepth(5).setVisible(false);
            this.GameThis.tweens.add({
                targets: this.Elements.Soccer.Ball,
                scale: 0.75,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        this.Elements.Soccer.BallLines = [this.GameThis.add.graphics()];

        this.eventExecutor();
    }

    update(){

    }

    checkDependencies(){
        if(typeof Phaser === 'undefined') return false;
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

    requestExecutor(type){
        const self = this;
        if(self.WSClient===null) return;
        switch (type){
            case "CHECK_CLIENT":
                self.WSClient.emit('verify_client', {
                    Partner: self.PartnerName
                });
                break;
            case "READY":
                self.WSClient.emit('client_ready', {
                    EventId: self.EventId
                });
                break;
            case "EVENT_DETAILS":
                self.WSClient.emit('get_event_details', {
                    EventId: self.EventId
                });
                break;
            default:
                break;
        }
    }

    eventExecutor(){
        const self = this;
        if(self.EventDetails === null){
            throw new DOMException("Event not found!");
        }
        self.buildPartsConstructor('BACKGROUND');
        self.buildPartsConstructor('ANIMATIONS');
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
                self.buildPartsConstructor('FOOTER_TENNIS');
                break;
            case 6:
                self.buildPartsConstructor('HEADER');
                self.buildPartsConstructor('TIME_VOLLEY');
                self.buildPartsConstructor('SCORE_VOLLEY');
                self.buildPartsConstructor('BODY_VOLLEY');
                self.buildPartsConstructor('FOOTER_VOLLEY');
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
            case "ANIMATIONS":
                try {
                    if(self.Elements.Animations.length > 0){
                        self.Elements.Animations.forEach(function(v,i){
                            self.Elements.Animations[i].destroy();
                        });
                    }
                    if(self.Elements.Teams.Home.length > 0){
                        self.Elements.Teams.Home.forEach(function(v,i){
                            self.Elements.Teams.Home[i].destroy();
                        });
                    }
                    if(self.Elements.Teams.Away.length > 0){
                        self.Elements.Teams.Away.forEach(function(v,i){
                            self.Elements.Teams.Away[i].destroy();
                        });
                    }
                }catch (e){}

                let iam = 0;
                self.Elements.Animations[iam] = self.GameThis.add.image(397, 302, "home-possession");
                self.Elements.Animations[iam].setVisible(false).setDepth(5);
                iam++;
                self.Elements.Animations[iam] = self.GameThis.add.image(397, 302, "away-possession");
                self.Elements.Animations[iam].setVisible(false).setDepth(5);
                iam++;
                self.Elements.Animations[iam] = self.GameThis.add.image(397, 302, "home-attack");
                self.Elements.Animations[iam].setVisible(false).setDepth(5);
                iam++;
                self.Elements.Animations[iam] = self.GameThis.add.image(397, 302, "away-attack");
                self.Elements.Animations[iam].setVisible(false).setDepth(5);

                let ihmt = 0;
                self.Elements.Teams.Home[ihmt] = self.GameThis.add.rectangle(380, 300, 10, 60, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.TEAM_HOME).color, 0.9);
                self.Elements.Teams.Home[ihmt].setDepth(5).setVisible(false);
                ihmt++;
                let homeTeam = '';
                if(homeTeam.length > 16) homeTeam = homeTeam.substr(0, 16)+'...';
                self.Elements.Teams.Home[ihmt] = self.GameThis.add.text(370, 275, homeTeam, { fontSize: '22px', fill: self.WIDGET_COLORS.TEAM_HOME, fontFamily: self.WIDGET_FONT });
                self.Elements.Teams.Home[ihmt].setPosition((370-self.Elements.Teams.Home[ihmt].width), 275);
                self.Elements.Teams.Home[ihmt].setDepth(5).setVisible(false);
                ihmt++;
                self.Elements.Teams.Home[ihmt] = self.GameThis.add.text(370, 295, 'ACTION NAME', { fontSize: '26px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                self.Elements.Teams.Home[ihmt].setPosition((370-self.Elements.Teams.Home[ihmt].width), 295);
                self.Elements.Teams.Home[ihmt].setDepth(5).setVisible(false);

                let iamt = 0;
                self.Elements.Teams.Away[iamt] = self.GameThis.add.rectangle(420, 300, 10, 60, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.TEAM_AWAY).color, 0.9);
                self.Elements.Teams.Away[iamt].setDepth(5).setVisible(false);
                iamt++;
                let awayTeam = '';
                if(awayTeam.length > 16) awayTeam = awayTeam.substr(0, 16)+'...';
                self.Elements.Teams.Away[iamt] = self.GameThis.add.text(430, 275, awayTeam, { fontSize: '22px', fill: self.WIDGET_COLORS.TEAM_AWAY, fontFamily: self.WIDGET_FONT });
                self.Elements.Teams.Away[iamt].setDepth(5).setVisible(false);
                iamt++;
                self.Elements.Teams.Away[iamt] = self.GameThis.add.text(430, 295, 'ACTION NAME', { fontSize: '26px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                self.Elements.Teams.Away[iamt].setDepth(5).setVisible(false);

                break;
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
                    self.Elements.Parts.TeamHomeSubScore = self.GameThis.add.rectangle(365, 75, 50, 5, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.TEAM_HOME).color, 0.9);
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
                        if(x < 2) textAwayName = textAwayName+(x === 0 ? '' : ' ')+splitName[x];
                    }
                }

                if(typeof self.Elements.Parts.TeamAway !== 'undefined' && self.Elements.Parts.TeamAway !== null){
                    self.Elements.Parts.TeamAway.setText(textAwayName);
                }else{
                    self.Elements.Parts.TeamAway = self.GameThis.add.text(465, 32, textAwayName, { fontSize: '22px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    self.Elements.Parts.TeamAwaySubScore = self.GameThis.add.rectangle(425, 75, 50, 5, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.TEAM_AWAY).color, 0.9);
                }
                self.Elements.Parts.TeamAway.setDepth(1);
                self.Elements.Parts.TeamAwaySubScore.setDepth(1);

                //Header line
                if(self.WIDGET_OPTIONS.ENABLE_SPLITER && typeof self.Elements.Parts.HeaderSpliter === 'undefined'){
                    self.Elements.Parts.HeaderSpliter = self.GameThis.add.rectangle(400, 78, 800, 1, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.HEADER_LINE).color, 0.4);
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
                try {
                    self.Elements.Parts.TimeBox.destroy();
                    self.Elements.Parts.TimeText.destroy();
                }catch (e){}
                self.Elements.Parts.TimeBox = self.GameThis.add.rectangle(400, 153, 150, 40, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.TIMEBG).color, 0.85);
                self.Elements.Parts.TimeBox.setDepth(5);
                self.Elements.Parts.TimeText = self.GameThis.add.text(400, 140, self.labelCurrentTime(), { fontSize: '20px', fill: self.WIDGET_COLORS.TIMEBG_TEXT, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TimeText.width;
                self.Elements.Parts.TimeText.setPosition((400-(wPos/2)), 140);
                self.Elements.Parts.TimeText.setDepth(6);
                break;
            case "TIME_HOCKEY":
                try {
                    self.Elements.Parts.TimeBox.destroy();
                    self.Elements.Parts.TimeText.destroy();
                }catch (e){}
                self.Elements.Parts.TimeBox = self.GameThis.add.rectangle(400, 169, 100, 40, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.TIMEBG_S2).color, 0.85);
                self.Elements.Parts.TimeBox.setDepth(5);
                self.Elements.Parts.TimeText = self.GameThis.add.text(400, 155, self.labelCurrentTime(), { fontSize: '20px', fill: self.WIDGET_COLORS.TIMEBG_TEXT_S2, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TimeText.width;
                self.Elements.Parts.TimeText.setPosition((400-(wPos/2)), 155);
                self.Elements.Parts.TimeText.setDepth(6);
                break;
            case "TIME_BASKET":
                try {
                    self.Elements.Parts.TimeBox.destroy();
                    self.Elements.Parts.TimeText.destroy();
                }catch (e){}
                self.Elements.Parts.TimeBox = self.GameThis.add.rectangle(400, 153, 150, 40, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.TIMEBG_S3).color, 0.85);
                self.Elements.Parts.TimeBox.setDepth(5);
                self.Elements.Parts.TimeText = self.GameThis.add.text(400, 140, self.labelCurrentTime(), { fontSize: '20px', fill: self.WIDGET_COLORS.TIMEBG_TEXT_S3, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TimeText.width;
                self.Elements.Parts.TimeText.setPosition((400-(wPos/2)), 140);
                self.Elements.Parts.TimeText.setDepth(6);
                break;
            case "TIME_TENNIS":
                try {
                    self.Elements.Parts.TimeBox.destroy();
                    self.Elements.Parts.TimeText.destroy();
                }catch (e){}
                self.Elements.Parts.TimeBox = self.GameThis.add.rectangle(400, 153, 150, 40, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.TIMEBG_S4).color, 0.85);
                self.Elements.Parts.TimeBox.setDepth(5);
                self.Elements.Parts.TimeText = self.GameThis.add.text(400, 140, self.labelCurrentTime(), { fontSize: '20px', fill: self.WIDGET_COLORS.TIMEBG_TEXT_S4, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TimeText.width;
                self.Elements.Parts.TimeText.setPosition((400-(wPos/2)), 140);
                self.Elements.Parts.TimeText.setDepth(6);
                break;
            case "TIME_VOLLEY":
                try {
                    self.Elements.Parts.TimeBox.destroy();
                    self.Elements.Parts.TimeText.destroy();
                }catch (e){}
                self.Elements.Parts.TimeBox = self.GameThis.add.rectangle(400, 153, 150, 40, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.TIMEBG_S6), 0.85);
                self.Elements.Parts.TimeBox.setDepth(5);
                self.Elements.Parts.TimeText = self.GameThis.add.text(400, 140, self.labelCurrentTime(), { fontSize: '20px', fill: self.WIDGET_COLORS.TIMEBG_TEXT_S4, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TimeText.width;
                self.Elements.Parts.TimeText.setPosition((400-(wPos/2)), 140);
                self.Elements.Parts.TimeText.setDepth(6);
                break;
            case "SCORE":
                try {
                    self.Elements.Parts.TeamHomeScore.destroy();
                    self.Elements.Parts.TeamAwayScore.destroy();
                }catch (e){}
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
                try {
                    self.Elements.Parts.TeamHomeScore.destroy();
                    self.Elements.Parts.TeamAwayScore.destroy();
                }catch (e){}
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
            case "SCORE_VOLLEY":
                try {
                    self.Elements.Parts.TeamHomeScore.destroy();
                    self.Elements.Parts.TeamAwayScore.destroy();
                }catch (e){}
                let ScoreVolley = self.EventDetails.esc.split(':');
                //Home
                self.Elements.Parts.TeamHomeScore = self.GameThis.add.text(365, 25, ScoreVolley[0], { fontSize: '30px', fill: self.WIDGET_COLORS.LIGHT_TEXT, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TeamHomeScore.width;
                self.Elements.Parts.TeamHomeScore.setPosition((365-(wPos/2)), 25);
                self.Elements.Parts.TeamHomeScore.setDepth(1);

                //Away
                self.Elements.Parts.TeamAwayScore = self.GameThis.add.text(423, 25, ScoreVolley[1], { fontSize: '30px', fill: self.WIDGET_COLORS.LIGHT_TEXT, fontFamily: self.WIDGET_FONT });
                wPos = self.Elements.Parts.TeamAwayScore.width;
                self.Elements.Parts.TeamAwayScore.setPosition((423-(wPos/2)), 25);
                self.Elements.Parts.TeamAwayScore.setDepth(1);
                break;
            case "SCORE_CHANGED":

                break;
            case "BODY_SOCCER":
                try {
                    self.Elements.Parts.Scene.destroy();
                }catch (e){}
                //BASIC GRAPHICS
                self.Elements.Parts.Scene = self.GameThis.add.image(400, 300, "scheme-soccer");
                self.Elements.Parts.Scene.setDepth(4);
                break;
            case "BODY_HOCKEY":
                try {
                    self.Elements.Parts.Scene.destroy();
                }catch (e){}
                //BASIC GRAPHICS
                self.Elements.Parts.Scene = self.GameThis.add.image(400, 300, "scheme-hockey");
                self.Elements.Parts.Scene.setDepth(4);
                break;
            case "BODY_TENNIS":
                try {
                    self.Elements.Parts.Scene.destroy();
                }catch (e){}
                //BASIC GRAPHICS
                self.Elements.Parts.Scene = self.GameThis.add.image(400, 300, "scheme-tennis");
                self.Elements.Parts.Scene.setDepth(4);
                break;
            case "BODY_VOLLEY":
                try {
                    self.Elements.Parts.Scene.destroy();
                }catch (e){}
                //BASIC GRAPHICS
                self.Elements.Parts.Scene = self.GameThis.add.image(400, 300, "scheme-volley");
                self.Elements.Parts.Scene.setDepth(4);
                break;
            case "BODY_BASKET":
                try {
                    self.Elements.Parts.Scene.destroy();
                }catch (e){}
                //BASIC GRAPHICS
                self.Elements.Parts.Scene = self.GameThis.add.image(400, 300, "scheme-basketball");
                self.Elements.Parts.Scene.setDepth(4);
                break;
            case "FOOTER_SOCCER":
                try {
                    if(self.Elements.Soccer.length > 0){
                        self.Elements.Soccer.forEach(function(v,i){
                            self.Elements.Soccer[i].destroy();
                        });
                    }
                }catch (e){}
                try {
                    self.Elements.Parts.FooterScene.destroy();
                }catch (e){}
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
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(400, 505, 180, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.BG).color, 1);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(410, 480, 'Possession', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((410-(tablea_position_w/2)), 480);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 505, calcProgressHWidth, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.LG).color, 1);
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
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(400, 540, 180, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.BG).color, 1);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(400, 515, 'Shots On Target', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((400-(tablea_position_w/2)), 515);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 540, calcProgressHWidth, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.LG).color, 1);
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
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(400, 575, 180, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.BG).color, 1);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.text(400, 550, 'Shots Off Target', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Soccer[iv].width;
                self.Elements.Soccer[iv].setPosition((400-(tablea_position_w/2)), 550);
                iv++;
                self.Elements.Soccer[iv] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 575, calcProgressHWidth, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.LG).color, 1);
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
                        trackColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.TRACK).color,
                        barColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BAR).color,
                        centerColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textStrokeColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
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
                        trackColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.TRACK).color,
                        barColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BAR).color,
                        centerColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textStrokeColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
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
                try {
                    if(self.Elements.Hockey.length > 0){
                        self.Elements.Hockey.forEach(function(v,i){
                            self.Elements.Hockey[i].destroy();
                        });
                    }
                }catch (e){}
                //self.Elements.Parts.FooterScene = self.GameThis.add.image(400, 300, "footer-hockey");
                //self.Elements.Parts.FooterScene.setDepth(5);
                let ih = 0;
                self.Elements.Hockey[ih] = self.GameThis.add.text(57, 495, (parseInt(self.EventDetails.ecp) === 0 ? 'Ended' : self.EventDetails.ecp+" Period"), { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
                ih++;
                self.Elements.Hockey[ih] = self.GameThis.add.text(57, 528, self.EventDetails.th.name, { fontSize: '22px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ih++;
                self.Elements.Hockey[ih] = self.GameThis.add.text(57, 563, self.EventDetails.ta.name, { fontSize: '22px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ih++;

                //TOP LABELS
                self.Elements.Volley[ih] = self.GameThis.add.text(553, 495, "P1", { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
                ih++;
                self.Elements.Volley[ih] = self.GameThis.add.text(612, 495, "P2", { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
                ih++;
                self.Elements.Volley[ih] = self.GameThis.add.text(672, 495, "P3", { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
                ih++;
                self.Elements.Volley[ih] = self.GameThis.add.text(727, 495, "T", { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
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
                self.Elements.Hockey[ih] = self.GameThis.add.text(727, 530, score[0], { fontSize: '18px', fill: self.WIDGET_COLORS.LIGHT_TEXT, fontFamily: self.WIDGET_FONT });
                ih++;
                self.Elements.Hockey[ih] = self.GameThis.add.text(727, 565, score[1], { fontSize: '18px', fill: self.WIDGET_COLORS.LIGHT_TEXT, fontFamily: self.WIDGET_FONT });
                break;
            case "FOOTER_BASKET":
                try {
                    if(self.Elements.Basket.length > 0){
                        self.Elements.Basket.forEach(function(v,i){
                            self.Elements.Basket[i].destroy();
                        });
                    }
                }catch (e){}
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
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(400, 505, 180, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.BG).color, 1);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(400, 480, '2Pts goals', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Basket[ib].width;
                self.Elements.Basket[ib].setPosition((400-(tablea_position_w/2)), 480);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 505, calcProgressHWidth, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.LG).color, 1);
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
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(400, 540, 180, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.BG).color, 1);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(400, 515, '3Pts goals', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Basket[ib].width;
                self.Elements.Basket[ib].setPosition((400-(tablea_position_w/2)), 515);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 540, calcProgressHWidth, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.LG).color, 1);
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
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(400, 575, 180, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.BG).color, 1);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.text(400, 550, 'Faults', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Basket[ib].width;
                self.Elements.Basket[ib].setPosition((400-(tablea_position_w/2)), 550);
                ib++;
                self.Elements.Basket[ib] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 575, calcProgressHWidth, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.LG).color, 1);
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
                        trackColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.TRACK).color,
                        barColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BAR).color,
                        centerColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textStrokeColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
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
                        trackColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.TRACK).color,
                        barColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BAR).color,
                        centerColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textStrokeColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
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
            case "FOOTER_TENNIS":
                try {
                    if(self.Elements.Tennis.length > 0){
                        self.Elements.Tennis.forEach(function(v,i){
                            self.Elements.Tennis[i].destroy();
                        });
                    }
                }catch (e){}
                let AcesScore = [0,0];
                let BreakScore = [0,0];
                let FirstServeWinPercentage = [0,0];
                let DoubleFaultScore = [0,0];
                let BreakPointConversionPercentage = [0,0];
                stats = Object.entries(self.EventDetails.ests);
                if(stats.length > 0){
                    for(let i = 0; i < stats.length; i++) {
                        let key = stats[i][0];
                        if(key === "ACES"){
                            AcesScore = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "BREAK_POINTS"){
                            BreakPointConversionPercentage = [
                                stats[i][1].home.replace('%', ''),
                                stats[i][1].away.replace('%', '')
                            ]
                        }else if(key === "DOUBLE_FAULTS"){
                            DoubleFaultScore = [
                                stats[i][1].home,
                                stats[i][1].away
                            ]
                        }else if(key === "WIN_FIRST_SERVE"){
                            FirstServeWinPercentage = [
                                stats[i][1].home.replace('%', ''),
                                stats[i][1].away.replace('%', '')
                            ]
                        }
                    }
                }

                let it = 0;
                calcTotal = (parseInt(FirstServeWinPercentage[0])+parseInt(FirstServeWinPercentage[1]));
                calcHomePercet = (parseInt(FirstServeWinPercentage[0])/calcTotal*100);
                calcProgressHWidth = (150*(calcHomePercet/100));
                self.Elements.Tennis[it] = self.GameThis.add.rectangle(400, 505, 180, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.BG).color, 1);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.text(410, 480, 'First Serve Win %', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Tennis[it].width;
                self.Elements.Tennis[it].setPosition((410-(tablea_position_w/2)), 480);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 505, calcProgressHWidth, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.LG).color, 1);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.text(300, 496.5, FirstServeWinPercentage[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Tennis[it].width;
                self.Elements.Tennis[it].setPosition((300-tablea_position_w), 496.5);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.text(500, 496.5, FirstServeWinPercentage[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                it++;
                //CALC
                calcTotal = (parseInt(DoubleFaultScore[0])+parseInt(DoubleFaultScore[1]));
                calcHomePercet = (parseInt(DoubleFaultScore[0])/calcTotal*100);
                calcProgressHWidth = (150*(calcHomePercet/100));
                self.Elements.Tennis[it] = self.GameThis.add.rectangle(400, 540, 180, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.BG).color, 1);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.text(400, 515, 'Double Fault Score', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Tennis[it].width;
                self.Elements.Tennis[it].setPosition((400-(tablea_position_w/2)), 515);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 540, calcProgressHWidth, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.LG).color, 1);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.text(300, 531.5, DoubleFaultScore[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Tennis[it].width;
                self.Elements.Tennis[it].setPosition((300-tablea_position_w), 531.5);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.text(500, 531.5, DoubleFaultScore[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                it++;
                //CALC
                calcTotal = (parseInt(BreakPointConversionPercentage[0])+parseInt(BreakPointConversionPercentage[1]));
                calcHomePercet = (parseInt(BreakPointConversionPercentage[0])/calcTotal*100);
                calcProgressHWidth = (150*(calcHomePercet/100));
                self.Elements.Tennis[it] = self.GameThis.add.rectangle(400, 575, 180, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.BG).color, 1);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.text(400, 550, 'Break Point Conversion %', { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Tennis[it].width;
                self.Elements.Tennis[it].setPosition((400-(tablea_position_w/2)), 550);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.rectangle(310+(calcProgressHWidth/2), 575, calcProgressHWidth, 15, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.PROGRESS_BAR.LG).color, 1);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.text(300, 566.5, BreakPointConversionPercentage[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                tablea_position_w = self.Elements.Tennis[it].width;
                self.Elements.Tennis[it].setPosition((300-tablea_position_w), 566.5);
                it++;
                self.Elements.Tennis[it] = self.GameThis.add.text(500, 566.5, BreakPointConversionPercentage[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                it++;
                try {
                    calcTotal = (parseInt(AcesScore[0])+parseInt(AcesScore[1]));
                    calcHomePercet = (parseInt(AcesScore[0])/calcTotal*100);
                    calcProgressHWidth = (100*(calcHomePercet/100));
                    self.Elements.Tennis[it] = self.GameThis.add.rexCircularProgressCanvas({
                        x: 100, y: 530,
                        radius: 30,
                        trackColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.TRACK).color,
                        barColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BAR).color,
                        centerColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textStrokeColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textStrokeThickness: 3,
                        textSize: '30px',
                        textStyle: 'bold',
                        textFormatCallback: function (value) {
                            return 0;
                        },
                        value: 0
                    });

                    self.GameThis.tweens.add({
                        targets: self.Elements.Tennis[it],
                        value: (1-(calcProgressHWidth/100)),
                        duration: 2000,
                        ease: 'Cubic',
                    });
                    it++;
                    self.Elements.Tennis[it] = self.GameThis.add.text(100, 565, 'Aces Score', { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Tennis[it].width;
                    self.Elements.Tennis[it].setPosition((100-(tablea_position_w/2)), 565);
                    it++;
                    self.Elements.Tennis[it] = self.GameThis.add.text(65, 522, AcesScore[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Tennis[it].width;
                    self.Elements.Tennis[it].setPosition((65-tablea_position_w), 522);
                    it++;
                    self.Elements.Tennis[it] = self.GameThis.add.text(135, 522, AcesScore[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    it++;
                }catch(err){
                    console.error(err);
                }
                try {
                    calcTotal = (parseInt(BreakScore[0])+parseInt(BreakScore[1]));
                    calcHomePercet = (parseInt(BreakScore[0])/calcTotal*100);
                    calcProgressHWidth = (100*(calcHomePercet/100));
                    self.Elements.Tennis[it] = self.GameThis.add.rexCircularProgressCanvas({
                        x: 700, y: 530,
                        radius: 30,
                        trackColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.TRACK).color,
                        barColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BAR).color,
                        centerColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textStrokeColor: Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.CHART_CIRCLE.BG).color,
                        textStrokeThickness: 3,
                        textSize: '30px',
                        textStyle: 'bold',
                        textFormatCallback: function (value) {
                            return 0;
                        },
                        value: 0
                    });

                    self.GameThis.tweens.add({
                        targets: self.Elements.Tennis[it],
                        value: (1-(calcProgressHWidth/100)),
                        duration: 2000,
                        ease: 'Cubic',
                    });
                    it++;
                    self.Elements.Tennis[it] = self.GameThis.add.text(705, 565, 'Break Score', { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Tennis[it].width;
                    self.Elements.Tennis[it].setPosition((705-(tablea_position_w/2)), 565);
                    it++;
                    self.Elements.Tennis[it] = self.GameThis.add.text(665, 522, BreakScore[0], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    tablea_position_w = self.Elements.Tennis[it].width;
                    self.Elements.Tennis[it].setPosition((665-tablea_position_w), 522);
                    it++;
                    self.Elements.Tennis[it] = self.GameThis.add.text(735, 522, BreakScore[1], { fontSize: '14px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                    it++;
                }catch(err){
                    console.error(err);
                }
                break;
            case "FOOTER_VOLLEY":
                try {
                    if(self.Elements.Volley.length > 0){
                        self.Elements.Volley.forEach(function(v,i){
                            self.Elements.Volley[i].destroy();
                        });
                    }
                }catch (e){}
                //self.Elements.Parts.FooterScene = self.GameThis.add.image(400, 300, "footer-hockey");
                //self.Elements.Parts.FooterScene.setDepth(5);
                let ivl = 0;
                self.Elements.Volley[ivl] = self.GameThis.add.text(57, 495, (parseInt(self.EventDetails.ecp) === 0 ? 'Ended' : self.EventDetails.ecp+" Set"), { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
                ivl++;
                self.Elements.Volley[ivl] = self.GameThis.add.text(57, 528, self.EventDetails.th.name, { fontSize: '22px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;
                self.Elements.Volley[ivl] = self.GameThis.add.text(57, 563, self.EventDetails.ta.name, { fontSize: '22px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;

                //TOP LABELS
                self.Elements.Volley[ivl] = self.GameThis.add.text(435, 495, "S1", { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
                ivl++;
                self.Elements.Volley[ivl] = self.GameThis.add.text(494, 495, "S2", { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
                ivl++;
                self.Elements.Volley[ivl] = self.GameThis.add.text(553, 495, "S3", { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
                ivl++;
                self.Elements.Volley[ivl] = self.GameThis.add.text(612, 495, "S4", { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
                ivl++;
                self.Elements.Volley[ivl] = self.GameThis.add.text(672, 495, "S5", { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
                ivl++;
                self.Elements.Volley[ivl] = self.GameThis.add.text(727, 495, "T", { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT_2ND, fontFamily: self.WIDGET_FONT });
                ivl++;

                //SCORES
                let scorePeriodHomeVolley = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[0] !== 'undefined') scorePeriodHomeVolley = self.EventDetails.etsc[0].split(':')[0];
                }
                self.Elements.Volley[ivl] = self.GameThis.add.text(435, 530, scorePeriodHomeVolley, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;
                let scorePeriodAwayVolley = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[0] !== 'undefined') scorePeriodAwayVolley = self.EventDetails.etsc[0].split(':')[1];
                }
                self.Elements.Volley[ivl] = self.GameThis.add.text(435, 565, scorePeriodAwayVolley, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;

                scorePeriodHomeVolley = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[1] !== 'undefined') scorePeriodHomeVolley = self.EventDetails.etsc[1].split(':')[0];
                }
                self.Elements.Volley[ivl] = self.GameThis.add.text(494, 530, scorePeriodHomeVolley, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;
                scorePeriodAwayVolley = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[1] !== 'undefined') scorePeriodAwayVolley = self.EventDetails.etsc[1].split(':')[1];
                }
                self.Elements.Volley[ivl] = self.GameThis.add.text(494, 565, scorePeriodAwayVolley, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;

                scorePeriodHomeVolley = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[2] !== 'undefined') scorePeriodHomeVolley = self.EventDetails.etsc[2].split(':')[0];
                }
                self.Elements.Volley[ivl] = self.GameThis.add.text(553, 530, scorePeriodHomeVolley, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;
                scorePeriodAwayVolley = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[2] !== 'undefined') scorePeriodAwayVolley = self.EventDetails.etsc[2].split(':')[1];
                }
                self.Elements.Volley[ivl] = self.GameThis.add.text(553, 565, scorePeriodAwayVolley, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;

                scorePeriodHomeVolley = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[3] !== 'undefined') scorePeriodHomeVolley = self.EventDetails.etsc[3].split(':')[0];
                }
                self.Elements.Volley[ivl] = self.GameThis.add.text(612, 530, scorePeriodHomeVolley, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;
                scorePeriodAwayVolley = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[3] !== 'undefined') scorePeriodAwayVolley = self.EventDetails.etsc[3].split(':')[1];
                }
                self.Elements.Volley[ivl] = self.GameThis.add.text(612, 565, scorePeriodAwayVolley, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;

                scorePeriodHomeVolley = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[4] !== 'undefined') scorePeriodHomeVolley = self.EventDetails.etsc[4].split(':')[0];
                }
                self.Elements.Volley[ivl] = self.GameThis.add.text(672, 530, scorePeriodHomeVolley, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;
                scorePeriodAwayVolley = '0';
                if(typeof self.EventDetails.etsc !== 'undefined'){
                    if(typeof self.EventDetails.etsc[4] !== 'undefined') scorePeriodAwayVolley = self.EventDetails.etsc[4].split(':')[1];
                }
                self.Elements.Volley[ivl] = self.GameThis.add.text(672, 565, scorePeriodAwayVolley, { fontSize: '18px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;

                let scoreVolley = self.EventDetails.esc.split(':');
                self.Elements.Volley[ivl] = self.GameThis.add.text(727, 530, scoreVolley[0], { fontSize: '18px', fill: self.WIDGET_COLORS.LIGHT_TEXT, fontFamily: self.WIDGET_FONT });
                ivl++;
                self.Elements.Volley[ivl] = self.GameThis.add.text(727, 565, scoreVolley[1], { fontSize: '18px', fill: self.WIDGET_COLORS.LIGHT_TEXT, fontFamily: self.WIDGET_FONT });
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
                    if(self.Elements.Tennis.length > 0){
                        self.Elements.Tennis.forEach(function(v,i){
                            self.Elements.Tennis[i].destroy();
                        });
                    }
                }catch (e){}
                try {
                    if(self.Elements.Volley.length > 0){
                        self.Elements.Volley.forEach(function(v,i){
                            self.Elements.Volley[i].destroy();
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
                try {
                    if(self.Elements.Animations.length > 0){
                        self.Elements.Animations.forEach(function(v,i){
                            self.Elements.Animations[i].destroy();
                        });
                    }
                    if(self.Elements.Teams.Home.length > 0){
                        self.Elements.Teams.Home.forEach(function(v,i){
                            self.Elements.Teams.Home[i].destroy();
                        });
                    }
                    if(self.Elements.Teams.Away.length > 0){
                        self.Elements.Teams.Away.forEach(function(v,i){
                            self.Elements.Teams.Away[i].destroy();
                        });
                    }
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
                    case 4:
                        try {
                            if(self.Elements.Tennis.length > 0){
                                self.Elements.Tennis.forEach(function(v,i){
                                    self.Elements.Tennis[i].destroy();
                                });
                            }
                        }catch (e){}
                        self.buildPartsConstructor('FOOTER_TENNIS');
                        break;
                    case 6:
                        try {
                            if(self.Elements.Volley.length > 0){
                                self.Elements.Volley.forEach(function(v,i){
                                    self.Elements.Volley[i].destroy();
                                });
                            }
                        }catch (e){}
                        self.buildPartsConstructor('FOOTER_VOLLEY');
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
                    case 6:
                        self.buildPartsConstructor('TIME_VOLLEY');
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
                    case 6:
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
                        self.buildPartsConstructor('SCORE_VOLLEY');
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
            case 6:
                lblStatus = "SET "+self.EventDetails.ecp;
                break;
        }
        if(parseInt(self.EventDetails.ecp) === 0 || !self.EventDetails.live){
            lblStatus = 'Ended';
            self.showImportantMessage("Match ended");
            self.executeBallPosition(0, 0, false, false);
        }
        return lblStatus;
    }

    async updateEventDetails(self){
        self.requestExecutor("EVENT_DETAILS");
    }

    showImportantMessage(message, team){
        const self = this;
        try {
            if(self.Elements.ImportantMessage.length > 0){
                self.Elements.ImportantMessage.forEach(function(v,i){
                    self.Elements.ImportantMessage[i].destroy();
                });
            }
        }catch (e){}

        if(typeof message !== "undefined"){
            if(typeof team === 'undefined' || team === ''){
                let idx = 0;
                self.Elements.ImportantMessage[idx] = self.GameThis.add.rectangle((800/2), (530/2)+40, 380, 70, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.IMPORTANT_MSG.BOX).color, 0.75);
                self.Elements.ImportantMessage[idx].setDepth(95);
                idx++;
                self.Elements.ImportantMessage[idx] = self.GameThis.add.text((800/2), (530/2), message, { fontSize: '24px', fill: self.WIDGET_COLORS.IMPORTANT_MSG.TXT, fontFamily: self.WIDGET_FONT });
                self.Elements.ImportantMessage[idx].setPosition(((800/2)-(self.Elements.ImportantMessage[idx].width/2)), (580/2));
                self.Elements.ImportantMessage[idx].setDepth(96);
            }else{
                let idx = 0;
                self.Elements.ImportantMessage[idx] = self.GameThis.add.rectangle((800/2), (530/2)+40, 380, 70, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.IMPORTANT_MSG.BOX).color, 0.75);
                self.Elements.ImportantMessage[idx].setDepth(95);
                idx++;
                self.Elements.ImportantMessage[idx] = self.GameThis.add.rectangle((800/2)+150, (530/2)+40, 50, 50, Phaser.Display.Color.HexStringToColor(self.WIDGET_COLORS.IMPORTANT_MSG.MIN).color, 0.60);
                self.Elements.ImportantMessage[idx].setDepth(96);
                idx++;
                self.Elements.ImportantMessage[idx] = self.GameThis.add.text((800/2)-175, (530/2)+15, message, { fontSize: '24px', fill: self.WIDGET_COLORS.IMPORTANT_MSG.TXT, fontFamily: self.WIDGET_FONT });
                self.Elements.ImportantMessage[idx].setDepth(96);
                idx++;
                self.Elements.ImportantMessage[idx] = self.GameThis.add.text((800/2)-175, (530/2)+45, (team === 'home' ? self.EventDetails.th.name : team === 'away' ? self.EventDetails.ta.name : ''), { fontSize: '16px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                self.Elements.ImportantMessage[idx].setDepth(96);
                idx++;
                self.Elements.ImportantMessage[idx] = self.GameThis.add.text((800/2)+140, (530/2)+30, parseInt(self.EventDetails.ect/60)+"'", { fontSize: '19px', fill: self.WIDGET_COLORS.GENERIC_TEXT, fontFamily: self.WIDGET_FONT });
                self.Elements.ImportantMessage[idx].setDepth(97);
            }
        }
    }

    countLinesCreated = 0;
    lastTeamHaveTeam = '';
    eventBallActive = false;
    disableLines = false;
    soccerBallLines = [];
    actualTeamHaveBall='';
    lastPercentBall = [0,0];
    targetBallPossition;
    targetLastBallPossition;
    animAttackDynHome = null;
    animAttackDynAway = null;

    executeBallPosition(x,y,v,f){
        const self = this;
        if(parseFloat(x) > 1.05 || parseFloat(y) > 1.05){
            this.Elements.Soccer.Ball.setVisible(false);
            return false;
        }
        if(self.EventDetails.si !== 1) return false;

        if(typeof f === 'undefined' || !f) self.eventBallActive = true;
        self.lastPercentBall = [0,0];

        let position_x = (678*parseFloat(x));
        let position_x_3d = 0;
        let position_y = (305*parseFloat(y));
        if(parseFloat(x) > 0.5){
            if(parseFloat(y) > 0.5){
                position_x = (position_x+position_x_3d);
            }else{
                position_x = (position_x+position_x_3d);
            }
        }else{
            if(parseFloat(y) > 0.5){
                position_x = (position_x-position_x_3d);
            }else{
                position_x = (position_x-position_x_3d);
            }
        }
        position_x = (60+position_x);
        position_y = (150+position_y);
        this.Elements.Soccer.Ball.setVisible(v);
        self.targetBallPossition.x = position_x;
        self.targetBallPossition.y = position_y;

        self.GameThis.tweens.add({
            targets: this.Elements.Soccer.Ball,
            x: self.targetBallPossition.x,
            y: self.targetBallPossition.y,
            duration: 500,
            ease: 'Cubic',
        });

        if(typeof f === 'undefined' || !f){
            this.Elements.Soccer.BallLines[0].lineStyle(2, 0xC0C0C0).setDepth(5);
            if(self.targetLastBallPossition.x !== 0 && self.targetLastBallPossition.y !== 0){
                self.Elements.Soccer.BallLines[0].lineBetween(self.targetLastBallPossition.x, (self.targetLastBallPossition.y), self.targetBallPossition.x, (self.targetBallPossition.y));
            }
            if(self.lastTeamHaveTeam === self.actualTeamHaveBall){
                self.countLinesCreated++;
            }else{
                self.countLinesCreated = 0;
                self.Elements.Soccer.BallLines[0].clear();
            }
        }
        self.lastTeamHaveTeam = self.actualTeamHaveBall;
        if(!v || self.disableLines) {
            self.Elements.Soccer.BallLines[0].clear();
            self.disableLines = false;
        }
        self.targetLastBallPossition.x = self.targetBallPossition.x;
        self.targetLastBallPossition.y = self.targetBallPossition.y;

        if(self.actualTeamHaveBall === 'home'){
            if(parseFloat(x) > 0.5){
                let percentToGo = (215*parseFloat(x));
                self.Elements.Animations[2].setX((397+percentToGo));
            }
        }else{
            if(parseFloat(x) < 0.5){
                let totalPX = 1; totalPX = (totalPX-x);
                let percentToGo = (215*parseFloat(totalPX));
                self.Elements.Animations[3].setX((397-percentToGo));
            }
        }
    };

    executeAnimations(anim_name, team){
        const self = this;

        self.Elements.Animations[0].setVisible(false);
        self.Elements.Animations[1].setVisible(false);
        self.Elements.Animations[2].setVisible(false);
        self.Elements.Animations[3].setVisible(false);

        self.Elements.Teams.Home[0].setVisible(false);
        self.Elements.Teams.Home[1].setVisible(false);
        self.Elements.Teams.Home[2].setVisible(false);

        self.Elements.Teams.Away[0].setVisible(false);
        self.Elements.Teams.Away[1].setVisible(false);
        self.Elements.Teams.Away[2].setVisible(false);

        if(team === 'home'){
            self.Elements.Teams.Home[2].setText(anim_name.toUpperCase());
            self.Elements.Teams.Home[2].setPosition((370-self.Elements.Teams.Home[2].width), 295);
            self.Elements.Teams.Home[0].setVisible(true);
            self.Elements.Teams.Home[1].setText(self.EventDetails.th.name);
            self.Elements.Teams.Home[1].setPosition((370-self.Elements.Teams.Home[1].width), 275);
            self.Elements.Teams.Home[1].setVisible(true);
            self.Elements.Teams.Home[2].setVisible(true);
        }else if(team === 'away'){
            self.Elements.Teams.Away[2].setText(anim_name.toUpperCase());
            self.Elements.Teams.Away[0].setVisible(true);
            self.Elements.Teams.Away[1].setVisible(true);
            self.Elements.Teams.Away[1].setText(self.EventDetails.ta.name);
            self.Elements.Teams.Away[1].setPosition(430, 275);
            self.Elements.Teams.Away[2].setVisible(true);
        }

        /*if(volleyball_items.ball !== null){
            volleyball_items.ball.setVisible(false);
        }

        if(tennis_items.ball !== null){
            tennis_items.ball.setVisible(false);
        }

        if(soccer_items.light !== null){
            soccer_items.light.setVisible(false);
            clearTimeout(timerLightAnim);
        }*/

        if(anim_name === 'safe' || anim_name === 'possession' || anim_name === 'rally') {
            if (team === 'home') {
                self.Elements.Animations[0].setVisible(true);
                if(!self.eventBallActive) self.executeBallPosition(0.45, 0.5, true, true);
            }else{
                self.Elements.Animations[1].setVisible(true);
                if(!self.eventBallActive) self.executeBallPosition(0.55, 0.5, true, true);
            }
        }else if(anim_name === 'stat') {
            /*if(volleyball_items.ball !== null){
                if (team == 'home') {
                    volleyball_items.ball.angle = 180;
                    volleyball_items.ball.setScale(1.5).setPosition(150, 360);
                    volleyball_items.ball.setVisible(true);
                }else{
                    volleyball_items.ball.angle = 0;
                    volleyball_items.ball.setScale(1.5).setPosition(650, 250);
                    volleyball_items.ball.setVisible(true);
                }

                homeAnimationIdent[0].setVisible(false);
                homeAnimationIdent[1].setVisible(false);
                homeAnimationIdent[2].setVisible(false);
                awayAnimationIdent[0].setVisible(false);
                awayAnimationIdent[1].setVisible(false);
                awayAnimationIdent[2].setVisible(false);
            }else{
                if (team == 'home') {
                    animPossessionDynHome.setVisible(true);
                    if(!eventBallActive) executeBallPosition(0.45, 0.5, true, true);
                }else{
                    animPossessionDynAway.setVisible(true);
                    if(!eventBallActive) executeBallPosition(0.55, 0.5, true, true);
                }
            }*/
        }else if(anim_name === 'serve') {
            /*if(tennis_items.ball !== null){
                if (team == 'home') {
                    tennis_items.ball.angle = 180;
                    tennis_items.ball.setScale(1.5).setPosition(150, 360);
                    tennis_items.ball.setVisible(true);
                }else{
                    tennis_items.ball.angle = 0;
                    tennis_items.ball.setScale(1.5).setPosition(650, 250);
                    tennis_items.ball.setVisible(true);
                }

                homeAnimationIdent[0].setVisible(false);
                homeAnimationIdent[1].setVisible(false);
                homeAnimationIdent[2].setVisible(false);
                awayAnimationIdent[0].setVisible(false);
                awayAnimationIdent[1].setVisible(false);
                awayAnimationIdent[2].setVisible(false);
            }else{
                if (team == 'home') {
                    animPossessionDynHome.setVisible(true);
                    if(!self.eventBallActive) self.executeBallPosition(0.45, 0.5, true, true);
                }else{
                    animPossessionDynAway.setVisible(true);
                    if(!self.eventBallActive) self.executeBallPosition(0.55, 0.5, true, true);
                }
            }*/
        }else if(anim_name === 'attack'){
            if (team === 'home') {
                self.Elements.Animations[2].setVisible(true);
                if(!self.eventBallActive) self.executeBallPosition(0.65, 0.5, true, true);
            }else{
                self.Elements.Animations[3].setVisible(true);
                if(!self.eventBallActive) self.executeBallPosition(0.35, 0.5, true, true);
            }
        }else if(anim_name === 'danger-attack'){
            if (team === 'home') {
                self.Elements.Animations[2].setVisible(true);
                if(!self.eventBallActive) self.executeBallPosition(0.85, 0.5, true, true);
            }else{
                self.Elements.Animations[3].setVisible(true);
                if(!self.eventBallActive) self.executeBallPosition(0.15, 0.5, true, true);
            }
        }else if(anim_name === 'corner' || anim_name === 'corner-bottom'){
            if(team === 'home'){
                if(!self.eventBallActive) self.executeBallPosition(1, 0.01, true, true);
                else{
                    self.Elements.Soccer.BallLines[0].clear();
                }
                /*timerLightAnim = setTimeout(function(){
                    if(lastPercentBall[0] > 0.5){
                        if(lastPercentBall[1] > 0.5){
                            soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x-22, soccerBallPosition.y-56).angle=240;
                        }else{
                            soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x-33, soccerBallPosition.y+50).angle=115;
                        }
                    }
                }, 600);*/
            }else{
                if(!self.eventBallActive) self.executeBallPosition(0, 0.99, true, true);
                else{
                    self.Elements.Soccer.BallLines[0].clear();
                }
                /*timerLightAnim = setTimeout(function(){
                    if(lastPercentBall[0] < 0.5){
                        if(lastPercentBall[1] > 0.5){
                            soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x+28, soccerBallPosition.y-50).angle=290;
                        }else{
                            soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x+23, soccerBallPosition.y+56).angle=60;
                        }
                    }
                }, 600);*/
            }
            self.disableLines=true;
        }else if(anim_name === 'throw'){
            if(team === 'home'){
                if(!self.eventBallActive) self.executeBallPosition(0.70, 0, true, true);
                else{
                    self.Elements.Soccer.BallLines[0].clear();
                }
                /*timerLightAnim = setTimeout(function(){
                    if(soccerBallPosition.y > 400){
                        soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x+4, soccerBallPosition.y-58).angle=266;
                    }else{
                        soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x-7, soccerBallPosition.y+58).angle=88;
                    }
                },600)*/
            }else{
                if(!self.eventBallActive) self.executeBallPosition(0.30, 1, true, true);
                else{
                    self.Elements.Soccer.BallLines[0].clear();
                }
                /*timerLightAnim = setTimeout(function(){
                    if(soccerBallPosition.y > 400){
                        soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x+4, soccerBallPosition.y-58).angle=266;
                    }else{
                        soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x-7, soccerBallPosition.y+58).angle=88;
                    }
                },600);*/
            }
            self.disableLines=true;
        }else if(anim_name === 'goal-kick'){
            if(team === 'home'){
                if(!self.eventBallActive) self.executeBallPosition(0.10, 0.50, true, true);
                else{
                    self.Elements.Soccer.BallLines[0].clear();
                }

                /*timerLightAnim = setTimeout(function(){
                    soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x+56, soccerBallPosition.y+8).angle=0;
                }, 600);*/
            }else{
                if(!self.eventBallActive) self.executeBallPosition(0.90, 0.50, true, true);
                else{
                    self.Elements.Soccer.BallLines[0].clear();
                }

                /*timerLightAnim = setTimeout(function(){
                    soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x-56, soccerBallPosition.y-8).angle=180;
                }, 600)*/
            }
            self.disableLines=true;
        }else if(anim_name === 'safe-free-kick'){
            if(team === 'home'){
                if(!self.eventBallActive) self.executeBallPosition(0.40, 0.5, true, true);
                else{
                    self.Elements.Soccer.BallLines[0].clear();
                }

                /*timerLightAnim = setTimeout(function(){
                    soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x+56, soccerBallPosition.y+8).angle=0;
                }, 600);*/
            }else{
                if(!self.eventBallActive) self.executeBallPosition(0.60, 0.50, true, true);
                else{
                    self.Elements.Soccer.BallLines[0].clear();
                }

                /*timerLightAnim = setTimeout(function(){
                    soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x-56, soccerBallPosition.y-8).angle=180;
                }, 600)*/
            }
            self.disableLines=true;
        }else if(anim_name === 'danger-free-kick'){
            if(team === 'home'){
                if(!self.eventBallActive) self.executeBallPosition(0.65, 0.50, true, true);
                else{
                    self.Elements.Soccer.BallLines[0].clear();
                }

                /*timerLightAnim = setTimeout(function(){
                    soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x+56, soccerBallPosition.y+8).angle=0;
                }, 600);*/
            }else{
                if(!self.eventBallActive) self.executeBallPosition(0.35, 0.50, true, true);
                else{
                    self.Elements.Soccer.BallLines[0].clear();
                }

                /*timerLightAnim = setTimeout(function(){
                    soccer_items.light.setVisible(true).setPosition(soccerBallPosition.x-56, soccerBallPosition.y-8).angle=180;
                }, 600)*/
            }
            self.disableLines=true;
        }else if(anim_name === 'shot-on-target'){
            if(team === 'home'){

            }else{

            }
            self.disableLines=true;
        }else if(anim_name === 'shot-off-target'){
            if(team === 'home'){

            }else{

            }
            self.disableLines=true;
        }
    };

    startWSCommunication(){
        const self = this;
        self.WSClient = io.connect(self.WebSocket, {
            forceNew: true
        });
        self.WSClient.on('connect', function(data) {
            self.requestExecutor("CHECK_CLIENT");
        });
        self.WSClient.on('verified', function(data) {
            self.buildPartsConstructor('CLEAR');
            self.requestExecutor("READY");
            self.eventExecutor();
        });
        self.WSClient.on('constructor', function(data) {
            self.EventDetails = data.message;
            self.eventExecutor();
            self.showImportantMessage();
            clearInterval(self.EventUpdate);
            self.EventUpdate = setInterval(self.updateEventDetails, 5000, self);
        });
        self.WSClient.on('event_details', function(data) {
            self.EventDetails = data.message;
            self.updatePartsConstructor("SCORE");
            self.updatePartsConstructor("TIME");
            self.updatePartsConstructor("STATISTICS");
        });
        self.WSClient.on('update_event', function(data) {

            self.showImportantMessage();

            if(data.Team !== '') self.actualTeamHaveBall = data.Team;

            if(self.EventDetails.si === 1){
                if(data.BallPosition.length > 0){
                    //console.debug("Execute ball position", data.BallPosition[0], data.BallPosition[1]);
                    self.executeBallPosition(data.BallPosition[0], data.BallPosition[1], true, false);
                }
            }

            if(data.Action !== '' && data.Team !== ''){

                switch (data.Action) {
                    case "danger-attack":
                        self.executeAnimations("danger-attack", data.Team);
                        break;
                    case "attack":
                        self.executeAnimations("attack", data.Team);
                        break;
                    case "possession":
                        self.executeAnimations("possession", data.Team);
                        break;
                    case "corner":
                        self.executeAnimations("corner", data.Team);
                        self.Elements.Soccer.BallLines[0].clear();
                        break;
                    case "yellow-card":
                        self.Elements.Soccer.BallLines[0].clear();
                        self.showImportantMessage("Yellow card", data.Team);
                        break;
                    case "red-card":
                        self.Elements.Soccer.BallLines[0].clear();
                        self.showImportantMessage("Red card", data.Team);
                        break;
                    case "goal-kick":
                        self.executeAnimations("goal-kick", data.Team);
                        self.Elements.Soccer.BallLines[0].clear();
                        break;
                    case "throw":
                        self.executeAnimations("throw", data.Team);
                        self.Elements.Soccer.BallLines[0].clear();
                        break;
                    case "substitution":
                        self.executeAnimations('', '');
                        self.Elements.Soccer.BallLines[0].clear();
                        self.showImportantMessage("Substitution", data.Team);
                        break;
                    case "kickoff":
                        self.Elements.Soccer.BallLines[0].clear();
                        self.showImportantMessage("Kickoff", data.Team);
                        break;
                    case "halftime":
                        self.executeAnimations('', '');
                        self.Elements.Soccer.BallLines[0].clear();
                        self.showImportantMessage("Halftime");
                        break;
                    case "secound-half":
                        self.executeAnimations('', '');
                        self.Elements.Soccer.BallLines[0].clear();
                        self.showImportantMessage("Secound Half");
                        break;
                    case "fulltime":
                        self.executeAnimations('', '');
                        self.Elements.Soccer.BallLines[0].clear();
                        self.showImportantMessage("Fulltime");
                        break;
                    case "extra-time-1":
                    case "extra-time-ht":
                    case "extra-time-2":
                        self.showImportantMessage("Extra time");
                        break;
                    case "extra-time-ended":
                        self.showImportantMessage("Extra time ended");
                        break;
                    case "penalty-shoot":
                        self.showImportantMessage("Penalty shoot", data.Team);
                        break;
                    case "penalty-missing":
                        self.showImportantMessage("Penalty missing", data.Team);
                        break;
                    case "injury":
                        self.Elements.Soccer.BallLines[0].clear();
                        self.showImportantMessage("Injury", data.Team);
                        break;
                    case "injury-time":
                        self.showImportantMessage("Injury time");
                        break;
                    case "shot-on-target":
                        self.executeAnimations("shot-on-target", data.Team);
                        break;
                    case "safe-free-kick":
                        self.executeAnimations("safe-free-kick", data.Team);
                        break;
                    case "danger-free-kick":
                        self.executeAnimations("danger-free-kick", data.Team);
                        break;
                    case "offside":
                        self.executeAnimations('', '');
                        self.Elements.Soccer.BallLines[0].clear();
                        self.showImportantMessage("Offside", data.Team);
                        break;
                    case "goal":
                        self.Elements.Soccer.BallLines[0].clear();
                        self.showImportantMessage("Goal", data.Team);
                        break;
                    case "penalty-take":
                        self.showImportantMessage("Penalty Take", data.Team);
                        break;
                    case "penalty-scored":
                        self.showImportantMessage("Penalty Scored", data.Team);
                        break;
                    case "match-ended":
                        self.executeAnimations('', '');
                        self.showImportantMessage("Match ended");
                        self.executeBallPosition(0, 0, false, false);
                        self.Elements.Soccer.BallLines[0].clear();
                        break;
                    case "penalty":
                        self.showImportantMessage("Penalty", data.Team);
                        break;
                    case "penalty-overplay":
                        self.showImportantMessage("Penalty Overplay", data.Team);
                        break;
                    case "shot":
                        self.showImportantMessage("Shot", data.Team);
                        break;
                    case "penalty-shot":
                        self.showImportantMessage("Penalty Shot", data.Team);
                        break;
                    case "penalty-shot-missed":
                        self.showImportantMessage("Penalty Shot Missed", data.Team);
                        break;
                    case "pulled-keeper":
                        self.showImportantMessage("Pulled Keeper", data.Team);
                        break;
                    case "keeper-back-in-goal":
                        self.showImportantMessage("Keeper Back In Goal", data.Team);
                        break;
                    case "faceoff":
                        self.showImportantMessage("Faceoff", data.Team);
                        break;
                    case "puck-dropped":
                        self.showImportantMessage("Puck Dropped", data.Team);
                        break;
                    case "faceoff-winner":
                        self.showImportantMessage("Faceoff Winner", data.Team);
                        break;
                    case "event-timeout":
                        self.showImportantMessage("Event timeout", data.Team);
                        break;
                    case "icing":
                        self.showImportantMessage("Icing", data.Team);
                        break;
                    case "powerplay":
                        self.showImportantMessage("Powerplay", data.Team);
                        break;
                    case "1-pts":
                        self.showImportantMessage("+1 PTS", data.Team);
                        break;
                    case "2-pts":
                        self.showImportantMessage("+2 PTS", data.Team);
                        break;
                    case "3-pts":
                        self.showImportantMessage("+3 PTS", data.Team);
                        break;
                    case "freethrow":
                        self.showImportantMessage("Freethrow", data.Team);
                        break;
                    case "freethrow-scored":
                        self.showImportantMessage("Freethrow Scored", data.Team);
                        break;
                    case "freethrow-missed":
                        self.showImportantMessage("Freethrow Missed", data.Team);
                        break;
                    case "throw-missed":
                        self.showImportantMessage("Throw Missed", data.Team);
                        break;
                    case "timeout":
                        self.showImportantMessage("Timeout");
                        break;
                    case "quarter-end":
                        self.executeAnimations('', '');
                        self.showImportantMessage("Quarter end");
                        break;
                    case "half-end":
                        self.executeAnimations('', '');
                        self.showImportantMessage("Half end");
                        break;
                    case "overtime":
                        self.showImportantMessage("Overtime");
                        break;
                    case "foul":
                        self.showImportantMessage("Foul", data.Team);
                        break;
                    case "quarter-1":
                        self.showImportantMessage("Quarter 1");
                        break;
                    case "quarter-2":
                        self.showImportantMessage("Quarter 2");
                        break;
                    case "quarter-3":
                        self.showImportantMessage("Quarter 3");
                        break;
                    case "quarter-4":
                        self.showImportantMessage("Quarter 4");
                        break;
                    case "half-first":
                        self.showImportantMessage("Half first");
                        break;
                    case "half-second":
                        self.showImportantMessage("Half second");
                        break;
                    case "serve":

                        break;
                    case "point-scored":
                        self.showImportantMessage("Point Scored", data.Team);
                        break;
                    case "fault":
                        self.showImportantMessage("Fault", data.Team);
                        break;
                    case "game":
                        self.showImportantMessage("Game", data.Team);
                        break;
                    case "doble-fault":
                        self.showImportantMessage("Doble Fault", data.Team);
                        break;
                    case "break-points":
                        self.showImportantMessage("Break Points", data.Team);
                        break;
                    case "stat":
                        self.showImportantMessage("Stat", data.Team);
                        break;
                    case "let-1st-serve":
                        self.showImportantMessage("Let 1st Serve", data.Team);
                        break;
                    case "let-2nd-serve":
                        self.showImportantMessage("Let 2nd Serve", data.Team);
                        break;
                    case "game-set-match":
                        self.showImportantMessage("Game Set Match", data.Team);
                        break;
                    case "end-of-set":
                        self.showImportantMessage("End Of Set", data.Team);
                        break;
                    case "tie-break":
                        self.showImportantMessage("Tie Break", data.Team);
                        break;
                    case "rain-delay":
                        self.showImportantMessage("Rain Delay");
                        break;
                    case "second-set":
                        self.showImportantMessage("Second Set");
                        break;
                    case "third-set":
                        self.showImportantMessage("Third Set");
                        break;
                    case "fourth-set":
                        self.showImportantMessage("Fourth Set");
                        break;
                    case "final-set":
                        self.showImportantMessage("Final Set");
                        break;
                    case "rally":
                        self.showImportantMessage("Rally");
                        break;
                    case "?-timeout":
                        self.showImportantMessage("? Timeout");
                        break;
                    case "golden-set":
                        self.showImportantMessage("Golden Set");
                        break;
                    default:
                        break;
                }
            }
        });
        self.WSClient.on('error_msg', function(data) {
            if(typeof data.message !== 'undefined'){
                console.error(data.message);
            }
        });
        self.WSClient.on('disconnect', function(reason) {
            // TODO: create disconnected message
        });
        self.WSClient.on('reconnect', function(attemptNumber) {
            // TODO: create reconnecting message
        });
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
            if(typeof settings.options !== 'undefined'){
                this.WIDGET_OPTIONS = {...this.WIDGET_OPTIONS, ...settings.options}
            }
            if(typeof settings.colors !== 'undefined'){
                this.WIDGET_COLORS = {...this.WIDGET_COLORS, ...settings.colors}
            }
            if(typeof settings.font !== 'undefined'){
                this.WIDGET_FONT = settings.font
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
            this.targetBallPossition = new Phaser.Math.Vector2();
            this.targetLastBallPossition = new Phaser.Math.Vector2();
        }else{
            this.buildPartsConstructor('CLEAR');
            this.eventExecutor();
        }
        if(this.WSClient === null){
            this.startWSCommunication();
        }else{
            this.requestExecutor("CHECK_CLIENT");
        }
    }
}