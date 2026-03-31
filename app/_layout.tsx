import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#121212",
                },

                // headerTintColor: "#fff",
                // headerTitleStyle: {
                //     fontWeight: "bold",
                // },
                headerTitleAlign: "center",
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "首页",
                    headerShadowVisible: false, // 显示导航栏
                }}
            />

            <Stack.Screen
                name="detail/[id]"
                options={{
                    // headerShown: false,
                    // title: "详情页",
                    // headerBackTitle: "返回", // iOS 返回按钮文字
                    // presentation: "modal", // 模态框样式
                }}
            />
              <Stack.Screen
                name="search"
                options={{
                    // headerShown: false,
                    // title: "详情页",
                    // headerBackTitle: "返回", // iOS 返回按钮文字
                    // presentation: "modal", // 模态框样式
                }}
            />
        </Stack>
    );
}
