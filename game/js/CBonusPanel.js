function CBonusPanel(){
    var _bChickenClicked;
    var _iBonusMoney;
    var _iCurBet;
    var _aChickens;
    var _aBonusValue;
    var _aEggSprites;
    var _aEggPrizes;
    var _oEgg;
    var _oWinText;
    var _oContainer;
    
    this._init = function(){        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bonus_bg'));
        _oContainer.alpha = 0;
        _oContainer.visible= false;
        _oContainer.addChild(oBg);
        
        var oData = {   // image to use
                        framerate: 3,
                        images: [s_oSpriteLibrary.getSprite('chicken')], 
                        // width, height & registration point of each sprite
                        frames: {width: CHICKEN_WIDTH, height: CHICKEN_HEIGHT,regX: CHICKEN_WIDTH/2, regY:CHICKEN_HEIGHT/2}, 
                        animations: {  idle: [0, 5,"idle"],lay_egg:[6,9,"lay_egg"],idle_rand_0:[1,5,"idle"],
                        idle_rand_1:[2,5,"idle"],idle_rand_2:[3,5,"idle"],idle_rand_3:[4,5,"idle"],right:[3],left:[4]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _aChickens = new Array();
        
        var iXPos = 420;
        var iYPos = 286;
        for(var i=0;i<5;i++){
            var oChicken = createSprite(oSpriteSheet, "idle",CHICKEN_WIDTH/2,CHICKEN_HEIGHT/2,CHICKEN_WIDTH,CHICKEN_HEIGHT);
            oChicken.on("click", this._onChickenReleased, this,false,i);
            oChicken.x = iXPos;
            oChicken.y = iYPos;
            oChicken.stop();
            oChicken.visible = false;
            
            _oContainer.addChild(oChicken);

            iXPos += 164;
            
            _aChickens[i] = oChicken;
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('egg');
        oData = {   // image to use
                        framerate: 10,
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: Math.floor(oSprite.width/NUM_PRIZES), height: oSprite.height,regX:Math.floor(oSprite.width/NUM_PRIZES)/2,regY:oSprite.height/2}, 
                        animations: {  egg_0: [0],egg_1:[1],egg_2:[2]}
        };

        oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oEgg = createSprite(oSpriteSheet, "egg_0",Math.floor(oSprite.width/NUM_PRIZES)/2,oSprite.height/2,Math.floor(oSprite.width/NUM_PRIZES),oSprite.height);
        _oContainer.addChild(_oEgg);
        
        var _oMaskEgg = new createjs.Shape();
        _oMaskEgg.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(110, 390, 800,160);
        _oContainer.addChild(_oMaskEgg);
        
        _oEgg.mask = _oMaskEgg;
        
        _aEggSprites = new Array();
        _aEggPrizes = new Array();
        
        _aEggSprites[0] = createSprite(oSpriteSheet, "egg_0",Math.floor(oSprite.width/NUM_PRIZES)/2,oSprite.height/2,Math.floor(oSprite.width/NUM_PRIZES),oSprite.height);
        _aEggSprites[0].x = 350;
        _aEggSprites[0].y = CANVAS_HEIGHT - 70;
        _oContainer.addChild(_aEggSprites[0]);
        
        var oText = new createjs.Text("100","34px "+FONT_GAME, "#ffff00");
        oText.textAlign = "left";
        oText.x = _aEggSprites[0].x + (oSprite.width/NUM_PRIZES)/2 + 6;
        oText.y = _aEggSprites[0].y + 12;
        oText.textBaseline = "alphabetic";
        _oContainer.addChild(oText);
        _aEggPrizes.push(oText);
        
        _aEggSprites[1] = createSprite(oSpriteSheet, "egg_1",Math.floor(oSprite.width/NUM_PRIZES)/2,oSprite.height/2,Math.floor(oSprite.width/NUM_PRIZES),oSprite.height);
        _aEggSprites[1].x = 650;
        _aEggSprites[1].y = CANVAS_HEIGHT - 70;
        _oContainer.addChild(_aEggSprites[1]);
        
        oText = new createjs.Text("200","34px "+FONT_GAME, "#ffff00");
        oText.textAlign = "left";
        oText.x = _aEggSprites[1].x + + (oSprite.width/NUM_PRIZES)/2 + 6;
        oText.y = _aEggSprites[1].y + 12;
        oText.textBaseline = "alphabetic";
        _oContainer.addChild(oText);
        _aEggPrizes.push(oText);
        
        _aEggSprites[2] = createSprite(oSpriteSheet, "egg_2",Math.floor(oSprite.width/NUM_PRIZES)/2,oSprite.height/2,Math.floor(oSprite.width/NUM_PRIZES),oSprite.height);
        _aEggSprites[2].x = 950;
        _aEggSprites[2].y = CANVAS_HEIGHT - 70;
        _oContainer.addChild(_aEggSprites[2]);
        
        oText = new createjs.Text("300","34px "+FONT_GAME, "#ffff00");
        oText.textAlign = "left";
        oText.x = _aEggSprites[2].x + + (oSprite.width/NUM_PRIZES)/2+ 6;
        oText.y = _aEggSprites[2].y + 12;
        oText.textBaseline = "alphabetic";
        _oContainer.addChild(oText);
        _aEggPrizes.push(oText);
        
        _oWinText = new createjs.Text("X 300$","80px "+FONT_GAME, "#ffff00");
        _oWinText.alpha = 0;
        _oWinText.textAlign = "center";
        _oWinText.shadow = new createjs.Shadow("#000", 2, 2, 2);
        _oWinText.x = CANVAS_WIDTH/2;
        _oWinText.y = 150;
        _oWinText.textBaseline = "alphabetic";
        _oContainer.addChild(_oWinText);
    };
    
    this.unload = function(){
        for(var i=0;i<5;i++){
            _aChickens[i].off("click", this._onChickenReleased);
        }   
    };
    
    this.show = function(iNumChicken,iCurBet){
        $(s_oMain).trigger("bonus_start");
        
        _iCurBet = iCurBet;
        _bChickenClicked = false;
        _oWinText.alpha = 0;
        
        switch(iNumChicken){
            case 3:{
                    _aBonusValue = BONUS_PRIZE[0];
                    break;
            }
            case 4:{
                    _aBonusValue = BONUS_PRIZE[1];
                    break;
            }
            case 5:{
                    _aBonusValue = BONUS_PRIZE[2];
                    break;
            }
            default:{
                    _aBonusValue = BONUS_PRIZE[0];
            }
        }
        
        _aEggPrizes[0].text = "X" + _aBonusValue[0];
        _aEggPrizes[1].text = "X" + _aBonusValue[1];
        _aEggPrizes[2].text = "X" + _aBonusValue[2];
        
        _oEgg.x = 118;
        _oEgg.y = 308;
        _oEgg.rotation = 0;
        _oEgg.gotoAndStop("egg_0");
        
        for(var i=0;i<iNumChicken;i++){
            var iRand = Math.floor(Math.random()* 4);
            _aChickens[i].framerate = 3;
            _aChickens[i].visible = true;
            _aChickens[i].gotoAndPlay("idle_rand_"+iRand);
        }
        
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha:1}, 1000);  
		
        
        setVolume("soundtrack",0);
        playSound("soundtrack_bonus",1,true);
        
    };
    
    this._onChickenReleased = function(event,oData){
        if(_bChickenClicked){
            return;
        }
        
        _bChickenClicked = true;
        var iIndex = oData;
        
        do{
            var iRandEgg = Math.floor(Math.random()* s_aEggOccurence.length);
        }while(_aBonusValue[s_aEggOccurence[iRandEgg]]*_iCurBet > SLOT_CASH);
        
        this.playChickenLayAnim(iIndex,s_aEggOccurence[iRandEgg]);
		
        
        playSound("choose_chicken",1,false);
        
    };
    
    this.playChickenLayAnim = function(iIndex,iRandEgg){
        _iBonusMoney = _aBonusValue[iRandEgg];

        _oEgg.gotoAndStop("egg_"+iRandEgg);
        
        for(var i=0;i<5;i++){
            if(i<iIndex){
                _aChickens[i].gotoAndStop("right");
            }else if(i === iIndex){
                _aChickens[iIndex].framerate = 10;
                _aChickens[iIndex].gotoAndPlay("lay_egg");
            }else{
                _aChickens[i].gotoAndStop("left");
            }
        }

        var oParent = this;
        setTimeout(function(){oParent.layEgg(iIndex);}, 2500);
    };
    
    this.layEgg = function(iIndex){
        _aChickens[iIndex].gotoAndStop(5);
        
        _oEgg.x = _aChickens[iIndex].x ;
        var oParent = this;
        createjs.Tween.get(_oEgg).to({y:460}, 300).call(function(){oParent.endBonus();});  
		
        
        playSound("reveal_egg",1,false);
        
    };
    
    this.endBonus = function(){
        //SHOW PRIZE WON
        _oWinText.text = "X "+_iBonusMoney;
        createjs.Tween.get(_oWinText).to({alpha:1}, 500);
        
        //ROTATE THE EGG
        createjs.Tween.get(_oEgg).to({rotation:110}, 500);  
        
        setTimeout(function(){_oContainer.alpha = 0;
                                _oContainer.visible= false;
				for(var i=0;i<_aChickens.length;i++){
                                    _aChickens[i].visible = false;
                                }
                                
                                setVolume("soundtrack",SOUNDTRACK_VOLUME);
                                stopSound("soundtrack_bonus");
                                
                                s_oGame.endBonus(_iBonusMoney)},4000);
    };
    
    this._init();
}