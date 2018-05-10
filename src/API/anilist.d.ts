export interface IAnilistAccessTokenRequest {
    [key: string]: string | undefined;
    grant_type: 'client_credentials';
    client_id: string;
    client_secret: string;
    code?: string;
}

export interface IAnilistAccessTokenResponse {
    access_token: string;
    token_type: 'bearer';
    expires: number;
    expires_in: number;
}

export interface IAnilistDate {
    year: number;
    month: number;
    day: number;
}

export interface IAnilistStudio {
    node: {
        name: string;
    }
}

export interface IAnilistCharacter {
    name: {
        first?: string;
        last?: string;
        native?: string;
    }
}

export interface getAnimeQueryResponse {
    title: {
        english?: string;
        native?: string;
        userPreferred?: string;
        romaji?: string;
    }
    genres?: string[];
    isAdult: boolean;
    siteUrl: string;
    description: string;
    episodes: number;
    duration: number;
    bannerImage?: string;
    status: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED';
    coverImage: {
        large?: string;
        medium: string;
    }
    startDate: IAnilistDate;
    endDate: IAnilistDate;
    averageScore?: number;
    popularity?: number;
    nextAiringEpisode: {
        episode: number;
        timeUntilAiring: number;
    }
    modNotes?: string;
    studios?: {
        edges: IAnilistStudio[]
    }
    characters: {
        nodes: IAnilistCharacter[];
    }
}

export interface getCharacterQueryResponse {
    name: {
        first: string;
        last: string;
        native: string;
    }
    image: {
        large: string;
        medium: string;
    }
    description?: string;
}
