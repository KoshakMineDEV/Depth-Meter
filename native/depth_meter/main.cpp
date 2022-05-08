//																																					
//horizon headers
#include <hook.h>
#include <mod.h>
#include <logger.h>
#include <symbol.h>
#include <nativejs.h>

//my headers
#include "all_headers.cpp"

//C++ headers
#include <cmath>

const char* TAG = "DEPTH-METER";

template<typename...T>
void debug(const char* tag,const char* text, T...t){
	Logger::debug(tag,text,t...);
	Logger::flush();
};

template<typename...T>
void debug(const char* text, T...t){
	debug(TAG,text,t...);
};

void debug(const char* tag, const char* text){
	Logger::debug(tag, text);
	Logger::flush();
};

void debug(const char* text){
	debug(TAG, text);
};

template<class T> 
const T& min(const T& a, const T& b){
	return (b < a) ? b : a;
};

template<class T> 
const T& max(const T& a, const T& b){
	return (a < b) ? b : a;
};

class DMModule : public Module {
public:
	DMModule(): Module("depth_meter") {};
	virtual void initialize(){
		DLHandleManager::initializeHandle("libminecraftpe.so", "mcpe");
		
	};
};

JS_MODULE_VERSION(DepthMeterModule, 1);

JS_EXPORT(DepthMeterModule, getFrame, "I()", (JNIEnv* env) {
	LocalPlayer* player = GlobalContext::getLocalPlayer();
	if(player == nullptr) return 0;
	float height = player->getPos().y - 1.0;
	int result = round(max(min(height + 40.0, 154.0), 0.0) / 8.6);
	if(player->getDimensionId() != 0) {
		CompassItem* item = (CompassItem*) ItemRegistry::getItemById(IdConversion::staticToDynamic(345, IdConversion::Scope::ITEM));
		if(item == nullptr) return 0;
		ItemStack stack(*item, 1, 0);
		if(&stack == nullptr) return 0;
		float frameProgress = (float) item->getAnimationFrameFor((Mob*) player, false, &stack, false) / 31.0;
		result = round(frameProgress * 23.0);
	}
	return NativeJS::wrapIntegerResult(result);
});

MAIN {
	new DMModule();
};
