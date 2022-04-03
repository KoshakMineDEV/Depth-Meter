//Translation

Translation.addTranslation("Depth Meter", { "ru_RU": "Высотомер" });
Translation.addTranslation("You are §a", { "ru_RU": "Ты на §a" });
Translation.addTranslation(" blocks §3above the sea level", { "ru_RU": " блока(-ов) §3выше уровня моря" });
Translation.addTranslation(" blocks §3below the sea level", { "ru_RU": " блока(-ов) §3ниже уровня моря" });

//Item registry

IDRegistry.genItemID("depthmeter");
Item.createItem("depthmeter", "Depth Meter", {name: "depth_surf", meta: 0}, {stack: 1}); 

//Recipe

Recipes.addShaped({id: ItemID.depthmeter, count: 1, data: 0}, [
    " x ", 
    "xax", 
    " x "
], ['x', 336, 0, 'a', 331, 0]); 

//Client

Network.addClientPacket("depthmeter.depth", function(pd) {
   Game.tipMessage(Translation.translate("You are §a") + pd.coord + Translation.translate(" blocks §3below the sea level"));
});

Network.addClientPacket("depthmeter.height", function(pd) {
   Game.tipMessage(Translation.translate("You are §a") + pd.coord + Translation.translate(" blocks §3above the sea level"));
});

let last = "depth_surf";

Item.registerIconOverrideFunction(ItemID.depthmeter, function(item) {
    if(World.getThreadTime() % 20 == 0) {
        const height = Math.floor(Entity.getPosition(Player.get()).y) - 1;
        let icon = "depth_";
        if(height > 128) icon += "sky";
        else if(height >= 63) icon += "surf";
        else if(height > 0) icon += "cave";
        else icon += "void";
        last = icon;
        return { name: icon, data: 0 };
    }
    return { name: last, data: 0 };
});

//Server

Item.registerUseFunction("depthmeter", function(coords, item, block, player){
if(Math.floor(Entity.getPosition(player).y) >= 64) {
   let coord = Math.floor(Entity.getPosition(player).y) - 63 - 1;
   Network.sendToAllClients("depthmeter.height", {
      coord: coord
      });
   } else {
   let coord = 63 - Math.floor(Entity.getPosition(player).y) + 1;
   Network.sendToAllClients("depthmeter.depth", {
      coord: coord
      }); 
   }
});

