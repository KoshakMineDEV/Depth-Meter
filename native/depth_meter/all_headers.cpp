//																														

namespace IdConversion {
	enum Scope {
		ITEM, 
		BLOCK
	};
	int dynamicToStatic(int dynamicId, IdConversion::Scope scope);
	int staticToDynamic(int staticId, IdConversion::Scope scope);
};

class Vec3 {
	public:
	float x, y, z;
};

class Actor {
	public:
	int getDimensionId() const;
	static Actor* wrap(long long);
	Vec3 const& getPos() const;
};

class Mob : public Actor {
	public:
};

class Player : public Mob {
	public:
};

class LocalPlayer : public Player {
	public:
};

namespace GlobalContext {
	LocalPlayer* getLocalPlayer();
};

class Item {
	public:
};

class ItemStack {
	public:
	char filler[256];
	ItemStack(Item const&, int, int);
};

class CompassItem : public Item {
	public:
	int getAnimationFrameFor(Mob*, bool, ItemStack const*, bool) const;
};

namespace ItemRegistry {
	Item* getItemById(int);
};
