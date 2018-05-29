export namespace DoggoEndpoint {
    export const placeholders = [
        'Blowing my doggo whistle!',
        'Fetching the fluffies.',
        'Searching for puppers...',
        'Making canine friends.',
        'Looking for a good boy.'
    ];

    export interface IDoggoResponse {
        status: string;
        message: string;
    }
    export const random = 'https://dog.ceo/api/breeds/image/random';
}
