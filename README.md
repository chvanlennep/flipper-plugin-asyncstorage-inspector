# AsyncStorage Inspector Flipper Plugin

Flipper plugin for inspecting contents of AsyncStorage in React Native

## Installation

1. Install [async-storage-inspector-flipper](https://github.com/chvanlennep/asyncstorage-inspector-flipper) middleware and `react-native-flipper` in your React Native app:

```bash
yarn add async-storage-inspector-flipper react-native-flipper
# for iOS
cd ios && pod install
```

2. Middleware configuration:

```javascript
import { initAsyncStorageInspector } from "asyncstorage-inspector-flipper";

// Call function only once, eg in App.tsx
initAsyncStorageInspector();
```

3. Install [flipper-plugin-asyncstorage-inspector](https://github.com/chvanlennep/flipper-plugin-asyncstorage-inspector) in your Flipper desktop client:

```
Manage Plugins > Install Plugins > search "flipper-plugin-asyncstorage-inspector" > Install
```

4. Restart flipper with your React Native App running and you should be able to see the plugin as 'AsyncStorage Inspector'.

**Note: The plugin does not display live values from AsyncStorage. Press the 'Sync' button to see the latest values.**
