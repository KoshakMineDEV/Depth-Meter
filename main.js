//Translation

Translation.addTranslation("Depth Meter", { ru: "Высотомер" });
Translation.addTranslation("You are §a", { ru: "Ты на §a" });
Translation.addTranslation(" blocks §3above the sea level", { ru: " блока(-ов) §3выше уровня моря" });
Translation.addTranslation(" blocks §3below the sea level", { ru: " блока(-ов) §3ниже уровня моря" });

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

let lastRandom = java.util.Random(1);
let nextRandom = java.util.Random(1);
nextRandom.nextFloat();

function interpolate(a, b, x) {
	let ft = x * Math.PI;
	let f = (1 - Math.cos(ft)) * 0.5
	return a * (1 - f) + b * f
}

const F_COUNT = 18;
const SPEED = 0.1;
let k = 0;
let lastPoint = 0;
let nextPoint = 8;

function updatePoints() {
	k = 0;
	lastPoint = lastRandom.nextFloat() * F_COUNT;
	nextPoint = nextRandom.nextFloat() * F_COUNT;
};

Callback.addCallback("LocalTick", function() {
	k += SPEED;
	if (k > 1) updatePoints();
});

Item.registerIconOverrideFunction(ItemID.depthmeter, function(item, isModUI) {
	let height = Math.floor(Player.getPosition().y) - 1;
	let frame = Math.round(Math.max(Math.min(height + 40, 154), 0) / 8.6);
	if (Player.getDimension() != 0) frame = Math.round(interpolate(lastPoint, nextPoint, k));
	//Game.tipMessage("Frame: " + frame + "\nMultiplier: " + k.toFixed(2) + "\nlastRand: " + lastRand.toFixed(2) + "\nnextRand: " + nextRand.toFixed(2));
	return { name: "depth", data: frame };
});

/*let last = "depth_surf";

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
});*/

//Server

Item.registerUseFunction("depthmeter", function(coords, item, block, player) {
	let height = Math.floor(Entity.getPosition(player).y);
	let higher = height >= 64;
	height = higher ? height - 64 : 64 - height;
	Network.sendToAllClients("depthmeter.message", {
		message: Translation.translate("You are §a") + height + (higher ? Translation.translate(" blocks §3above the sea level") : Translation.translate(" blocks §3below the sea level"))
	});
});
