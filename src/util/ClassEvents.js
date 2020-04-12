export default class ClassEvents
{
    constructor()
    {
        this._events = {};
    }

    on(eventName, fn)
    {
        if(!this.events[eventName]) this.events[eventName] = new Array();

        this.events[eventName].push(fn);
    }

    trigger()
    {
        const args = [...arguments];
        
        const eventName = args.shift();
        
        args.push(new Event(eventName));

        if(this.events[eventName] instanceof Array)
        {
            this.events[eventName].forEach(fn=>{
                fn.apply(null, args);
            });
        }
    }


    /* ---- Getters ---- */
    get events()
    {
        return this._events;
    }
    /* ---- Setters ---- */
    set events(event)
    {
        this._events = event;
    }
}