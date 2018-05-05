export default class SuggestionManager {
    private static _instance: SuggestionManager;
    private constructor(){}
    public static get instance(){
        if (!SuggestionManager._instance){
            SuggestionManager._instance = new this();
        }
        return SuggestionManager._instance;
    }
}
