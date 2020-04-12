import ClassEvents from "../util/ClassEvents";

export default class MicrophoneController extends ClassEvents
{
    constructor(audioEl)
    {
        super();
        this._audioEl = audioEl;
        this._mimeType = 'audio/webm';
    }

    activateTimer()
    {
        const start = Date.now();
        this._recordMicrophoneInterval = setInterval(()=>{
            const timer = (Date.now() - start);
            this.trigger('recordtimer', timer); 
        }, 1000);
    } // activateTimer

    deactivateTimer()
    {
        clearInterval(this._recordMicrophoneInterval);
        this.trigger('stoptimer');
    }

    activateMicrophone()
    {
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream=>{
            this._stream = stream;
            this.trigger('ready', this.stream);
        }).catch(err=>{ console.error(err); });
    }

    deactivateMicrophone()
    {
        this.stream.getTracks().forEach(track=>{ track.stop(); })
    }

    startRecorder()
    {
        if(this.stream)
        {
            this._mediaRecorder = new MediaRecorder(this.stream, { mimeType: this.mimeType });
            this._recordedChunks = new Array();
            this.mediaRecorder.addEventListener('dataavailable', e => {
                if(e.data.size > 0)
                    this.recordedChunks.push(e.data);
            });

            this.mediaRecorder.addEventListener('stop', e => {

                const blob = new Blob(this.recordedChunks, { type: this.mimeType });

                const filename = `rec${Date.now()}.webm`;
               
                const file = new File([blob], filename, {
                    type: this.mimeType,
                    lastModified: Date.now()

                });

                console.log(file);
            });

            this.mediaRecorder.start();
            this.activateTimer();
        }
    }

    stopRecorder()
    {
        if(this.stream)
        {
            this.mediaRecorder.stop();
            this.deactivateMicrophone();
            this.deactivateTimer();
        }
    }

    /* ---- Getters ---- */
    get stream()
    {
        return this._stream;
    }

    get mimeType()
    {
        return this._mimeType;
    }

    get mediaRecorder()
    {
        return this._mediaRecorder;
    }

    get recordedChunks()
    {
        return this._recordedChunks;
    }
}