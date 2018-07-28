import{AxiosResponse} from "axios";

export async function isMedia(r: AxiosResponse) {
    try {
        const statusType = r.status.toString();
        if (statusType[0] === '4'
            || statusType[0] === '5'
            || !r.headers
            || !r.headers['content-type']) {
            return false;
        }
        return r.headers['content-type'].includes('image');
    } catch (err) {
        console.log('error while getting media');
        console.log(err);
        return false;
    }
}
