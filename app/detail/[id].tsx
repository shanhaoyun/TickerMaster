import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getEventDetail } from "../../apis";

const { width: screenWidth } = Dimensions.get("window");

export default function Detail() {
    const { id } = useLocalSearchParams();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const fetchEventDetail = async () => {
            if (id) {
                try {
                    setLoading(true);
                    const data = await getEventDetail(id as string);
                    setEvent(data);
                    setError(null);
                } catch (err) {
                    setError("Failed to fetch event details");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchEventDetail();
    }, [id]);

    const handleImagePress = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / screenWidth);
        setActiveIndex(index);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Event not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {event.images && event.images.length > 0 && (
                    <View style={styles.carouselContainer}>
                        <ScrollView
                            ref={scrollViewRef}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            style={styles.carousel}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                        >
                            {event.images.map((image: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleImagePress(image.url)}
                                    style={styles.imageContainer}
                                >
                                    <Image
                                        source={{ uri: image.url }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <View style={styles.pagination}>
                            {event.images.map((_: any, index: number) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.paginationDot,
                                        {
                                            opacity:
                                                index === activeIndex ? 1 : 0.5,
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                )}
                <View style={styles.content}>
                    <Text style={styles.title}>{event.name}</Text>
                    <Text style={styles.type}>{event.type}</Text>
                    <Text style={styles.info}>ID: {event.id}</Text>
                    <Text style={styles.info}>Locale: {event.locale}</Text>
                    <Text style={styles.info}>Height: {event.height}</Text>
                    <Text style={styles.info}>Span: {event.span}</Text>
                    {event.url && (
                        <Text style={styles.url}>URL: {event.url}</Text>
                    )}

                    {event.info && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Info</Text>
                            <Text style={styles.sectionContent}>
                                {event.info}
                            </Text>
                        </View>
                    )}

                    {event.products && event.products.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Products</Text>
                            {event.products.map(
                                (product: any, index: number) => (
                                    <View
                                        key={index}
                                        style={styles.productItem}
                                    >
                                        <Text style={styles.productName}>
                                            {product.name}
                                        </Text>
                                        {product.description && (
                                            <Text
                                                style={
                                                    styles.productDescription
                                                }
                                            >
                                                {product.description}
                                            </Text>
                                        )}
                                        {product.price && (
                                            <Text style={styles.productPrice}>
                                                Price: {product.price}
                                            </Text>
                                        )}
                                    </View>
                                ),
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            <Modal
                visible={!!selectedImage}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closeModal}
                >
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.fullScreenImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollView: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 16,
        color: "#ff3b30",
    },
    carouselContainer: {
        position: "relative",
    },
    carousel: {
        height: 300,
    },
    imageContainer: {
        width: screenWidth,
        height: 300,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    pagination: {
        position: "absolute",
        bottom: 10,
        flexDirection: "row",
        alignSelf: "center",
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#fff",
        marginHorizontal: 4,
    },
    content: {
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    type: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    info: {
        fontSize: 14,
        color: "#333",
        marginBottom: 8,
    },
    url: {
        fontSize: 14,
        color: "#007AFF",
        marginTop: 10,
        textDecorationLine: "underline",
    },
    section: {
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    sectionContent: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    productItem: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    productName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 5,
        color: "#333",
    },
    productDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
        lineHeight: 18,
    },
    productPrice: {
        fontSize: 14,
        color: "#007AFF",
        fontWeight: "500",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    fullScreenImage: {
        width: "100%",
        height: "100%",
    },
});
