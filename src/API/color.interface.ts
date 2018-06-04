export interface ColorFractions {
    [hex: string]: number | null;
    r: number | null;
    g: number | null;
    b: number | null;
}

export interface ColorResponse {
    hex: {
        value: string;
    }
    rgb: {
        fraction: ColorFractions;
    }
    name: {
        value: string;
        closest_named_hex: string;
        exact_match_name: boolean;
        distance: number;
    }
    image: {
        bare: string;
    }
}
