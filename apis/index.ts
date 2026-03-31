import httpProxy from "./request";

export type DataItem = {
    name: string;
    type: string;
    id: string;
    test: boolean;
    height: number;
    span: number;
    url: string;
    locale: string;
    images: [
        {
            ratio: string;
            url: string;
            width: number;
            height: number;
            fallback: boolean;
        },
    ];
};

type EventResponse = {
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
    _embedded: {
        events: DataItem[];
    };
    _links: {
        self: {
            href: string;
        };
        next: {
            href: string;
        };
    };
    errors?: [];
};

// size , page ,apikey
export const getEventSearch = (params: any) => {
    return httpProxy<EventResponse>({
        method: "GET",
        url: "/discovery/v2/events.json",
        params,
    });
};

export const getEventDetail = (id: string) => {
    return httpProxy<DataItem>({
        method: "GET",
        url: `/discovery/v2/events/${id}.json`,
    });
};
