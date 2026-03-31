import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { Stack, Link } from "expo-router";
import { DataItem } from "../apis";

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<DataItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        // 这里可以实现搜索逻辑
        setIsLoading(true);
        // 模拟搜索结果
        setTimeout(() => {
            setSearchResults([]);
            setIsLoading(false);
        }, 500);
    };

    const renderItem = ({ item }: { item: DataItem }) => (
        <Link
            href={{ pathname: "/detail/[id]", params: { id: item.id } }}
            asChild
        >
            <TouchableOpacity style={styles.resultItem}>
                <Text style={styles.resultTitle}>{item.name}</Text>
                <Text style={styles.resultType}>{item.type}</Text>
            </TouchableOpacity>
        </Link>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    // headerShown: false,
                }}
            />
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search events..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text>Searching...</Text>
                </View>
            ) : searchResults.length > 0 ? (
                <FlatList
                    data={searchResults}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.resultsContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text>Enter a search query to find events</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },
    searchContainer: {
        flexDirection: "row",
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        marginRight: 10,
    },
    searchButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#007AFF",
        borderRadius: 20,
        justifyContent: "center",
    },
    searchButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    resultsContainer: {
        padding: 16,
    },
    resultItem: {
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 5,
    },
    resultType: {
        fontSize: 14,
        color: "#666",
    },
});

export default SearchPage;
