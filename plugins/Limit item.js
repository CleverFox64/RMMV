//-----------------------------------------------------------------------------
//         DaedraKyne Plugins - Item Limit
//                    -------
//                  Limit item.js
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
 /*:
 * @plugindesc v1.0 Set the gain limit for each item, weapon and armor.
 * 
 * @author DaedraKyne
 * 
 * @param Custom error message | Items
 * @desc
 * @default
 * 
 * @param Custom error message | Weapons
 * @desc
 * @default
 * 
 * @param Custom error message | Armors
 * @desc
 * @default
 * 
 * @param Default item limit
 * @desc 
 * @default 99
 * 
 * @param Default weapon limit
 * @desc 
 * @default 50
 * 
 * @param Default armor limit
 * @desc 
 * @default 50
 * 
 * @help
 * 
 * 
 * ----------------------------------------------------------------------------
 * Introduction
 * ----------------------------------------------------------------------------
 * Here's what you have to do:
 *      1- Set the custom error messages that will appear when the limit has
 *          been reached for an item/weapon/armor. 
 *          (if you don't, the game might crash!)
 * 
 *      2- Set the default limit for all three types.
 *      
 *      3- Set the limit for any item/weapon/armor by putting <limit:x> in
 *          the object's notes, where x is a number.
 * 
 *      4- When you add items/weapons/armors via the event command, the plugin
 *          will automatically run, so you don't have to do anything else! :P
 * ----------------------------------------------------------------------------
 * Script calls
 * ----------------------------------------------------------------------------
 * - this.bootLimit(); sets the limits defined in the database for items + 
 *   weapons + armors.
 * ----------------------------------------------------------------------------
 * Changelog
 * ----------------------------------------------------------------------------
 * 
 * Version 1.00:
 * - Finished Plugin!
 */
//----------------------------------------------------------------------------


( function () {

    var parameters = PluginManager.parameters("Limit item");    


    var _isDatabaseLoaded = DataManager.isDatabaseLoaded;
    var loaded = false;
    DataManager.isDatabaseLoaded = function () {
        if (!_isDatabaseLoaded.call(this)) {
            return false;
        }


        if (!loaded) {
            bootLimit($dataItems, $dataWeapons, $dataArmors);
            loaded = true;
        }
        return true;
    };


    function bootLimit(items, weapons, armors) {
        for (i = 1; i < items.length; i++) {
            var lim = parseInt(items[i].meta.limit);
            if (lim) {
                items[i].limit = lim;           
            } else {
                items[i].limit = Number(parameters["Default item limit"]);
            }
        }
        for (i = 1; i < weapons.length; i++) {
            var lim = parseInt(weapons[i].meta.limit);
            if (lim) {
                weapons[i].limit = lim;    
            } else {
                var lim = Number(parameters["Default weapon limit"]);
                weapons[i].limit = lim;
            }
        }
        for (i = 1; i < armors.length; i++) {
            var lim = parseInt(armors[i].meta.limit);
            if (lim) {
                armors[i].limit = lim;           
            } else {
                armors[i].limit = Number(parameters["Default armor limit"]);
            }
        }
    }


    // Change Items
    Game_Interpreter_command126 = Game_Interpreter.prototype.command126;
    Game_Interpreter.prototype.command126 = function() {
        var num = $gameParty.numItems($dataItems[this._params[0]]);
        var lim = $dataItems[this._params[0]].limit;
        var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        var add = num + value;
        if (add <= lim) {
            $gameParty.gainItem($dataItems[this._params[0]], value);
            return true;
        } else {
            $gameMessage.add(parameters["Custom error message | Items"]);
            return true;
        }
    };

    // Change Weapons
    Game_Interpreter_command127 = Game_Interpreter.prototype.command127;    
    Game_Interpreter.prototype.command127 = function() {
        var num = $gameParty.numItems($dataWeapons[this._params[0]]);
        var lim = $dataWeapons[this._params[0]].limit;
        var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        var add = num + value;
        if (add <= lim) {
            $gameParty.gainItem($dataWeapons[this._params[0]], value, this._params[4]);
            return true;
        } else {
            $gameMessage.add(parameters["Custom error message | Weapons"]);
            return true;
        }
    };

    // Change Armors
    Game_Interpreter_command128 = Game_Interpreter.prototype.command128;    
    Game_Interpreter.prototype.command128 = function() {
        var num = $gameParty.numItems($dataArmors[this._params[0]]);
        var lim = $dataArmors[this._params[0]].limit;
        var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        var add = num + value;
        if (add <= lim) {
            $gameParty.gainItem($dataArmors[this._params[0]], value, this._params[4]);
            return true;
        } else {
            $gameMessage.add(parameters["Custom error message | Armors"]);
            return true;
        }
        return true;
    };

    
})();
