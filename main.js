//Native

let DepthMeter = WRAP_NATIVE("DepthMeterModule");

//Translation

Translation.addTranslation("Depth Meter", { ru: "Высотомер" });
Translation.addTranslation("You are §a", { ru: "Ты на §a" });
Translation.addTranslation(" blocks §3above the ", { ru: " блока(-ов) §3выше уровня " });
Translation.addTranslation(" blocks §3below the ", { ru: " блока(-ов) §3ниже уровня " });
Transaltion.addTranslation("sea level", { ru: "моря" });
Translation.addTranslation("lava level", { ru: "лавы" });

//Item registry

IDRegistry.genItemID("depthmeter");
Item.createItem("depthmeter", "Depth Meter", { name: "depth_surf", meta: 0 }, { stack: 1 });

//Recipe

Recipes.addShaped({ id: ItemID.depthmeter, count: 1, data: 0 }, [
    " x ",
    "xax",
    " x "
], ['x', 336, 0, 'a', 331, 0]);

//Client

Network.addClientPacket("depthmeter.message", function(packet) {
	Game.tipMessage(packet.message);
});

Item.registerIconOverrideFunction(ItemID.depthmeter, function(item, isModUI) {
	return { name: "depth", data: DepthMeter.getFrame() };
});

//Server

Item.registerUseFunction("depthmeter", function(coords, item, block, player) {
	let dimension = Entity.getDimension(player);
	if (dimension == 1 || dimension == 0) {
		let height = Math.floor(Entity.getPosition(player).y);
		let higher = height >= 64;
		height = higher ? height - 64 : 64 - height;
		let client = Network.getClientForPlayer(player);
		if (!!client) client.send("depthmeter.message", {
			message: Translation.translate("You are §a") + height + (higher ? Translation.translate(" blocks §3above the ") : Translation.translate(" blocks §3below the ")) + (dimension == 0 ? Transaltion.translate("sea level") : Translation.translate("lava level"))
		});
	}
});