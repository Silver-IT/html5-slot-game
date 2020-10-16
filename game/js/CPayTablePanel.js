function CPayTablePanel(){
    var _aNumSymbolComboText;
    var _aWinComboText;
    var _oWildText;
    var _oBonusText;
    var _oBg;
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('paytable'));
        _oContainer.addChild(_oBg);

        this._createPayouts();
        
        _oWildText = new createjs.Text(TEXT_HELP_WILD,"21px "+FONT_GAME, "#ffff00");
        _oWildText.textAlign = "center";
        _oWildText.lineWidth = 220;
        _oWildText.lineHeight = 22;
        _oWildText.x = 635;
        _oWildText.y = 284;
        _oContainer.addChild(_oWildText);
        
        _oBonusText = new createjs.Text(TEXT_HELP_BONUS,"21px "+FONT_GAME, "#ffff00");
        _oBonusText.textAlign = "center";
        _oBonusText.lineHeight = 22;
        _oBonusText.lineWidth = 220;
        _oBonusText.x = 1012;
        _oBonusText.y = 294;
        _oContainer.addChild(_oBonusText);
        
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        var oParent = this;
        _oContainer.on("pressup",function(){oParent._onExit()});
    };
    
    this.unload = function(){
        var oParent = this;
        _oContainer.off("pressup",function(){oParent._onExit()});
        
        s_oStage.removeChild(_oContainer);
        
        for(var i=0;i<_aNumSymbolComboText.length;i++){
            _oContainer.removeChild(_aNumSymbolComboText[i]);
        }
        
        for(var j=0;j<_aWinComboText.length;j++){
            _oContainer.removeChild(_aWinComboText[j]);
        }
        
    };
    
    this._createPayouts = function(){
        _aNumSymbolComboText = new Array();
        _aWinComboText = new Array();
        
        var aPos = [{x:430,y:92},{x:630,y:92},{x:860,y:92},{x:1100,y:92},{x:430,y:195},{x:650,y:195},{x:870,y:195},{x:1100,y:195}];
        var iCurPos = 0;
        for(var i=0;i<s_aSymbolWin.length;i++){
            
            var aSymbolPayouts = new Array();
            for(var k=0;k<s_aSymbolWin[i].length;k++){
                aSymbolPayouts[k] = s_aSymbolWin[i][k];
            }
                    
            
            do{
                var iIndex = aSymbolPayouts.indexOf(0);
                if(iIndex !== -1){
                    aSymbolPayouts.splice(iIndex, 1);
                }
                
            }while(iIndex !== -1);
            
            var iLen = aSymbolPayouts.length;
            
            if(iLen === 0){
                continue;
            }
            
            var iOffsetY = 30;
            if(iLen === 4){
                iOffsetY = 22;
            }

            var iYPos = aPos[iCurPos].y;
            _aNumSymbolComboText[i] = new Array();
            _aWinComboText[i] = new Array();

            for(var j=0;j<iLen;j++){
                var oTextMult = new createjs.Text("X"+(5-j),"25px "+FONT_GAME, "#ffffff");
                oTextMult.textAlign = "center";
                oTextMult.x = aPos[iCurPos].x;
                oTextMult.y = iYPos;
                oTextMult.textBaseline = "alphabetic";
                _oContainer.addChild(oTextMult);

                _aNumSymbolComboText[i][j] = oTextMult;
                
                var oText = new createjs.Text(aSymbolPayouts[iLen-j-1],"25px "+FONT_GAME, "#ffff00");
                oText.textAlign = "center";
                oText.x = oTextMult.x + 50;
                oText.y = oTextMult.y;
                oText.textBaseline = "alphabetic";
                _oContainer.addChild(oText);

                _aWinComboText[i][j] = oText;
            
                iYPos += iOffsetY;
            }
            
            iCurPos++;
        }
    };
    
    this.show = function(){
        _oContainer.visible = true;
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    this.resetHighlightCombo = function(){
        for(var i=0;i<_aNumSymbolComboText.length;i++){
            for(var j=0;j<_aNumSymbolComboText[i].length;j++){
                _aNumSymbolComboText[i][j].color = "#ffffff";
                _aWinComboText[i][j].color = "#ffff00";
                createjs.Tween.removeTweens(_aWinComboText[i][j]);
                _aWinComboText[i][j].alpha = 1;
            }
        } 
    };
    
    this.highlightCombo = function(iSymbolValue,iNumCombo){
        if(iSymbolValue === BONUS_SYMBOL){
            return;
        }
        _aWinComboText[iSymbolValue-1][NUM_REELS-iNumCombo].color = "#ff0000";
        
        this.tweenAlpha(_aWinComboText[iSymbolValue-1][NUM_REELS-iNumCombo],0);
        
    };
    
    this.tweenAlpha = function(oText,iAlpha){
        var oParent = this;
        createjs.Tween.get(oText).to({alpha:iAlpha}, 200).call(function(){if(iAlpha === 1){
                                                                                    oParent.tweenAlpha(oText,0);
                                                                                }else{
                                                                                    oParent.tweenAlpha(oText,1);
                                                                                }
        });
    };
    
    this._onExit = function(){
        s_oGame.hidePayTable();
    };
    
    this.isVisible = function(){
        return _oContainer.visible;
    };
    
    this._init();
}