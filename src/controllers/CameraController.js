export default class CameraController {
    constructor(videoEl) {
        this._videoEl = videoEl;
    } // constructor

    openCamera()
    {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            this._stream = stream;
            this.videoEl.srcObject = stream;
            this.videoEl.play();
        }).catch(err => { console.error(err); });
    }

    closeCamera()
    {
        this.stream.getTracks().forEach(track=>{ track.stop(); });
    }

    takePicture(mimeType = 'image/png')
    {
        const canvas = document.createElement('canvas');

        canvas.setAttribute('height', this.videoEl.videoHeight);
        canvas.setAttribute('width', this.videoEl.videoWidth);
        
        const context = canvas.getContext('2d');

        context.drawImage(this.videoEl, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL(mimeType);
    }

    /* ---- Getters ---- */
    get videoEl() {
        return this._videoEl;
    }

    get stream()
    {
        return this._stream;
    }
}