/**
 * Voice actor object returned
 * from graphql quries @ AniList
 */
export interface IVoiceActor {
    id: number;
    description?: string;
    name?: {
        first?: string;
        last?: string;
        native?: string;
    }
    siteUrl?: string;
}

/**
 * Anime/Manga objects returned
 * from graphql queries @ AniList
 *
 * Only applies to edges in Character queries
 * getAnimeQueryResponse interface is
 * used for detailed anime queries
 */
export interface IMediaEdge {
    voiceActors: ({
        id: number
    })[]
    node: {
        title: {
            native?: string;
            english?: string;
            userPreferred?: string;
        }
        type?: 'ANIME' | 'MANGA';
        averageScore?: number;
        siteUrl?: string;
    }
}

/**
 * Character Queries returned
 * from graphql queries @ AniList
 */
export interface ICharacter {
    name: {
        first?: string;
        last?: string;
        native?: string;
        alternative?: string[];
    }
    media?: {
        edges: IMediaEdge[];
    }
    image: {
        large?: string;
        medium?: string;
    }

    description?: string;
    siteUrl?: string;
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

/**
 * Character interface used for
 * getAnimeQueryResponse
 */
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

export interface MALMedia {
    id: number;
    name: string;
    type: 'anime' | 'manga';
    url: string;
    image_irl: string;
    thumbnail_url: string;
    payload: {
        media_type: string;
        start_year: number;
        aired: string;
        score: string;
        status: string;
    }
    es_score: number;
}

interface MALCategory {
    type: 'anime' | 'manga';
    items: MALMedia[];
}

export interface MALResponse {
    categories: MALCategory[];
}


interface WhatAnimeDocs{
    from: number;
    to: number;
    anilist_id: number;
    at: number;
    episode: number | 'OVA/OAD' | 'Special' | '';
    similarity: number;
    mal_id?: number;
    is_adult: boolean;
    title_native?: string;
    title_chinese?: string;
    title_english?: string;
    title_romaji?: string;
    synonyms: string[];
    synonyms_chinese: string[];
    filename: string;
    tokenThumb: string;
}

export interface WhatAnimeSearchResponse {
    RawDocsCount: number;
    RawDocsSearchTime: number;
    ReRankSearchTime: number;
    CacheHit: boolean;
    trial: number;
    quota: number;
    expire: number;
    docs: WhatAnimeDocs[];
}
