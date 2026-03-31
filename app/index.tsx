import { Link, Stack } from "expo-router";
import type { FC, ReactElement } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import {
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
} from "react-native";

import MasonryList from "@react-native-seoul/masonry-list";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DataItem, getEventSearch } from "../apis";

const FurnitureCard: FC<{ item: DataItem; style: StyleProp<ViewStyle> }> = ({
    item,
    style,
}) => {
    const randomBool = useMemo(() => Math.random() < 0.5, []);
    // const { theme } = useTheme();

    return (
        <View key={item.id} style={[{ marginTop: 12, flex: 1 }, style]}>
            <Link
                style={{ flex: 1 }}
                href={{ pathname: "/detail/[id]", params: { id: item.id } }}
            >
                <Image
                    source={{ uri: item.images[0].url }}
                    style={{
                        width: "100%",
                        height: randomBool ? 150 : 280,
                        alignSelf: "stretch",
                        borderRadius: 10,
                    }}
                    resizeMode="cover"
                />
                <Text
                    style={{
                        marginTop: 8,
                        // color: theme.text,
                        color: "white",
                    }}
                >
                    {item.name}
                </Text>
            </Link>
        </View>
    );
};

const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
        <Text style={{ color: "red" }}>暂无数据</Text>
    </View>
);

const LogoTitle = ({ onSearch }: { onSearch: (text: string) => void }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Image
                source={require("../assets/images/tickermaster.png")}
                resizeMode="contain"
                style={{ width: 150 }}
            />
            {/* <Link href="/search" asChild> */}
            <TextInput
                style={styles.searchBox}
                placeholder="Search events..."
                // enablesReturnKeyAutomatically={true}
                clearButtonMode="while-editing"
                onSubmitEditing={(e) => {
                    console.log("onSubmitEditing", e.nativeEvent.text);
                    onSearch(e.nativeEvent.text);
                }}
            />
            {/* </Link> */}
        </View>
    );
};

const App: FC = () => {
    const isDarkMode = useColorScheme() === "dark";
    const backgroundStyle = {
        // backgroundColor: isDarkMode ? "#242424" : "#f4f4f4",
        backgroundColor: "#121212",
        flex: 1,
    };
    const pageRef = useRef({ page: 0, size: 15, keyword: "", end: false, loading: false });
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [DATA, setDATA] = useState<DataItem[]>([]);

    const renderItem = ({ item, i }: any): ReactElement => {
        return (
            <FurnitureCard
                item={item}
                style={{ marginLeft: i % 2 === 0 ? 0 : 12 }}
            />
        );
    };

    const getData = (isRefresh: boolean = false) => {
        if (pageRef.current.end || pageRef.current.loading) {
            return;
        }

        const { page, size, keyword } = pageRef.current;
        pageRef.current.loading = true;
        setIsLoading(true);

        return getEventSearch({
            page,
            size,
            keyword,
            apikey: process.env.EXPO_PUBLIC_API_KEY1,
        }).then((res) => {
            setIsLoading(false);
            pageRef.current.loading = false;

            // console.log("res", res, res._embedded?.events);
            if (res._embedded?.events?.length) {
                const events = res._embedded.events.map((m, i) => ({
                    ...m,
                    height: !i ? 150 : 130,
                }));
                setDATA(isRefresh ? events : [...DATA, ...events]);
            }

            if (!!res.errors || res.page.totalPages === res.page.number) {
                pageRef.current.end = true;
            } else {
                pageRef.current.page++;
            }
        });
    };
    useEffect(() => {
        // return;
        getData();
    }, []);

    // 刷新
    const onRefresh = async () => {
        // console.log("onRefresh");
        pageRef.current.page = 0;
        pageRef.current.end = false;
        getData(true);
    };

    // 加载更多
    const loadNext = () => {
        if (pageRef.current.loading) {
            return;
        }
        // console.log("loadNext");
        getData(false);
    };

    // 搜索
    const onSearch = (text: string) => {
        pageRef.current.page = 0;
        pageRef.current.end = false;
        pageRef.current.keyword = text;
        getData(true);
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <Stack.Screen
                options={{
                    headerTitle: (props) => <LogoTitle onSearch={onSearch} />,
                    headerTitleAlign: "center",
                }}
            />
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            <MasonryList
                keyExtractor={(item: DataItem): string => item.id}
                ListHeaderComponent={<View />}
                ListEmptyComponent={<EmptyComponent />}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    alignSelf: "stretch",
                }}
                numColumns={2}
                data={DATA}
                renderItem={renderItem}
                refreshing={isRefreshing}
                loading={isLoading}
                onRefresh={onRefresh}
                onEndReachedThreshold={0.1}
                onEndReached={loadNext}
            />
        </SafeAreaView>
    );
};

export default App;

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    searchBox: {
        marginLeft: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        flex: 1,
        maxWidth: 200,
    },
    searchPlaceholder: {
        color: "#999",
        fontSize: 14,
    },
});
