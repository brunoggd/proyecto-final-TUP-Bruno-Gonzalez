interface Weather {
    name: string;
    main: {
        temp: number;
        humidity: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
}

interface Movie {
    Title: string;
    Year: string;
    Actors: string;
    Poster: string;
}

interface News {
    articles: {
        title: string;
        author: string;
        url: string;
        publishedAt: string;
    }[];
}

interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    }
}

interface Song {
    resultCount: number;
    results: {
        trackName: string;
        artistName: string;
        collectionName: string;
        releaseDate: string;
        previewUrl: string;
    }[];
}

interface Book {
    items: {
        id: string;
        volumeInfo: {
            title: string;
            authors: string[];
            publishedDate: string;
            pageCount: number;
            categories: string[];
            imageLinks: {
                thumbnail: string;
            }
        }
    }[];
}

interface Meal {
    meals: {
        idMeal: string;
        strMeal: string;
        strCategory: string;
        strArea: string;
        strInstructions: string;
        strMealThumb: string;
        strTags: string;
        strYoutube: string;
    }[];
}

interface Game {
    results: {
        id: number;
        name: string;
        released: string;
        rating: number;
        background_image: string;
        platforms: {
            platform: {
                name: string;
            }
        }[];
    }[];
}

interface Repository {
    id: number;
    name: string;
    full_name: string;
    owner: {
        login: string;
        id: number;
    };
    description: string;
    stargazers_count: number;
    language: string;
    license: {
        key: string;
        name: string;
    }
}

interface Transport {
    station_name: string;
    departures: {
        all: {
            aimed_departure_time: string;
            destination_name: string;
            status: string;
            platform: string;
        }[];
    }
}