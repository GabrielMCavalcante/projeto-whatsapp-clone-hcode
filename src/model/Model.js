import ClassEvents from "../util/ClassEvents";

export default class Model extends ClassEvents
{
    constructor()
    {
        super();
        this._data = new Object();
    }

    fromJSON(json)
    {
        this.data = Object.assign(this.data, json);
        this.trigger('datachange', this.toJSON());
    }

    toJSON() { return this.data; }

    /* ---- Getters ---- */
    get data() { return this._data; }

    /* ---- Setters ---- */
    set data(obj) { this._data = obj; }
}