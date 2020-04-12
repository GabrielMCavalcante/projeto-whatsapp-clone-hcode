import Firebase from "../util/Firebase";
import Model from "./Model";

export default class User extends Model
{

    constructor(id)
    {
        super();

        if(id) this.getById(id);
    }

    getById(id)
    {
        return new Promise((resolve, reject)=>{

            User.findByEmail(id).get().then(doc=>{

                this.fromJSON(doc.data());
                resolve(doc);

            }).catch(err=>{ reject(err); });
        });
    }

    save() { return User.findByEmail(this.email).set(this.toJSON()); }

    static getRef() { return Firebase.db().collection('/users'); }

    static findByEmail(email) { return User.getRef().doc(email); }

    /* ---- Getters ---- */
    get name()  { return this._data.name;  }
    get email() { return this._data.email; }
    get photo() { return this._data.photo; }

    /* ---- Setters ---- */
    set name(value)  { this._data.name  = value; }
    set email(value) { this._data.email = value; }
    set photo(value) { this._data.photo = value; }
}