import { registerWebModule, NativeModule } from "expo";

// AnimatedTextModule is not available on the web platform.
class AnimatedTextModule extends NativeModule<{}> {}

export default registerWebModule(AnimatedTextModule, "AnimatedTextModule");
