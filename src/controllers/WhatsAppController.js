import Format from './../util/Format';
import CameraController from './CameraController';
import MicrophoneController from './MicrophoneController';
import DocumentPreviewController from './DocumentPreviewController';
import Firebase from '../util/Firebase';
import User from '../model/User';
import { response } from 'express';

export default class WhatsAppController
{
    constructor()
    {
        /* ----------- Firebase Init ----------- */
        this._firebase = new Firebase();
        this.initAuth();
        /* ----------- Initialization ----------- */
        this.elementsPrototype();
        this.loadElements();

        this._camera = new CameraController(this.el.videoCamera);
        this._documentPreviewController = new DocumentPreviewController();
        this._microphoneController = new MicrophoneController();

        this.initEvents();
    } // constructor

    initAuth()
    {
        this.firebase.initAuth().then(data=>{
            
            this._user = new User(data.user.email);

            this.user.on('datachange', user => {
                document.querySelector('title').innerHTML = 
                    user.name + ' - Whatsapp Web Clone';

                this.el.inputNamePanelEditProfile.innerHTML = user.name;

                if(user.photo)
                {
                    const photo1 = this.el.imgPanelEditProfile;
                    const photo2 = this.el.myPhoto.querySelector('img');
                    
                    photo1.src = user.photo;
                    photo2.src = user.photo;
                    
                    this.el.imgDefaultPanelEditProfile.hide();
                    
                    photo1.show();
                    photo2.show();
                }
            });

            this.user.name = response.displayName;
            this.user.email = response.email;
            this.user.photo = response.photoURL;

            this.user.save().then(()=>{ this.el.appContent.css({ display: 'flex' }); });

        }).catch(err=>{ console.error(err); });
    } // initAuth

    elementsPrototype()
    {
        /* ----------- Display ----------- */
        Element.prototype.hide = function() {
            this.style.display = 'none';
            return this;
        }
        Element.prototype.show = function() {
            this.style.display = 'block';
            return this;
        }
        Element.prototype.toggle = function() {
            this.style.display = (this.style.display === 'block') ? 'none' : 'block';
            return this;
        }
        /* ----------- Event Listeners ----------- */
        Element.prototype.on = function(events, fn) {
            events.split(' ').forEach(event=>{
                this.addEventListener(event, fn);
            });
            return this;
        }
        /* ----------- CSS Properties ----------- */
        Element.prototype.css = function(styles) {
            for(const property in styles)
                this.style[property] = styles[property];
            return this;
        }
        /* ----------- HTML Classes ----------- */
        Element.prototype.addClass = function(className) {
            this.classList.add(className);
            return this;
        }
        Element.prototype.removeClass = function(className) {
            this.classList.remove(className);
            return this;
        }
        Element.prototype.toggleClass = function(className) {
            this.classList.toggle(className);
            return this;
        }
        Element.prototype.hasClass = function(className) {
            return this.classList.contains(className);
        }
        Element.prototype.getClasses = function() {
            return [...this.classList];
        }
        /* ----------- HTML Formularies ----------- */
        HTMLFormElement.prototype.getForm = function() {
            return new FormData(this);
        }
        HTMLFormElement.prototype.toJSON = function() {
            let json = {};
            this.getForm().forEach((value, key)=>{ json[key] = value });
            return json;
        }
    } // elementsPrototype
   
    loadElements()
    {
        this.el = {};
        /* ----------- Loads all html elements into el object ----------- */
        document.querySelectorAll('[id]').forEach(element=>{
            this.el[Format.getCamelCase(element.id)] = element;
        });
    } // loadElements

    initEvents()
    {
        /* ----------- Profile edit ----------- */
        this.el.myPhoto.on('click', e=>{
            this.closeAllLeftPanels();
            this.el.panelEditProfile.show();
            setTimeout(()=>{ this.el.panelEditProfile.addClass('open'); }, 300);
        });

        this.el.btnClosePanelEditProfile.on('click', e=>{
            this.el.panelEditProfile.removeClass('open');
        });

        this.el.photoContainerEditProfile.on('click', e=>{
            this.el.inputProfilePhoto.click();
        });

        this.el.inputNamePanelEditProfile.on('keypress', e=>{
            if(e.key === 'Enter')
            {
                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();
            }
        });

        this.el.btnSavePanelEditProfile.on('click', e=>{
            console.log(this.el.inputNamePanelEditProfile.innerHTML);
        });

        /* ----------- New Contact ----------- */
        this.el.btnNewContact.on('click', e=>{
            this.closeAllLeftPanels();
            this.el.panelAddContact.show();
            setTimeout(()=>{ this.el.panelAddContact.addClass('open'); }, 300);
        });

        this.el.btnClosePanelAddContact.on('click', e=>{
            this.el.panelAddContact.removeClass('open');
        });

        this.el.formPanelAddContact.on('submit', function(e) {
            e.preventDefault();
            const formData = this.toJSON();
        });

        /* ----------- Contacts List ----------- */
        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(contact=>{
            contact.on('click', e=>{
                this.el.home.hide();
                this.el.main.css({ display: 'flex' });
            });
        });

        /* ----------- Attach File ----------- */
        this.el.btnAttach.on('click', e=>{
            e.stopPropagation();
            this.el.menuAttach.addClass('open');
            document.addEventListener('click', this.closeMenuAttach.bind(this));
        });

            /* ----------- Send Photo ----------- */
        this.el.btnAttachPhoto.on('click', e=>{
            this.el.inputPhoto.click();
        });

        this.el.inputPhoto.on('change', e=>{
            console.log(this.el.inputPhoto.files);
            [...this.el.inputPhoto.files].forEach(file => {
                console.log(file);
            });
        });

            /* ----------- Take Photo ----------- */
        this.el.btnAttachCamera.on('click', e=>{
            this.camera.openCamera();
            this.closeAllMainPanels();
            this.el.panelCamera.addClass('open').css({"height": "calc(100%)"});
        });

        this.el.btnClosePanelCamera.on('click', e => {
            this.camera.closeCamera();
            this.closeAllMainPanels();
            this.el.panelMessagesContainer.show();
        });

        this.el.btnTakePicture.on('click', e => { // TAKE PICTURE
            const dataUrl = this.camera.takePicture();

            this.el.btnReshootPanelCamera.show();
            this.el.containerTakePicture.hide();
            this.el.pictureCamera.src = dataUrl;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this.el.containerSendPicture.show();
        });

        this.el.btnReshootPanelCamera.on('click', e =>{
            this.camera.openCamera();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerTakePicture.show();
            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.containerSendPicture.hide();
        });

        this.el.btnSendPicture.on('click', e => {
            this.camera.closeCamera();
            console.log(this.el.pictureCamera.src);
        });

            /* ----------- Send Document ----------- */
        this.el.btnAttachDocument.on('click', e=>{
            this.closeAllMainPanels();
            this.el.panelDocumentPreview.addClass('open').css({"height": "100%"});
            this.el.inputDocument.click();
        });

        this.el.inputDocument.on('change', e => {
            if(this.el.inputDocument.files.length)
            {
                const file = this.el.inputDocument.files[0];
                this.documentPreviewController.file = file;

                this.documentPreviewController.getPreviewData().then(data=>{
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();
                    this.el.imgPanelDocumentPreview.src = data.src;
                    this.el.infoPanelDocumentPreview.innerHTML = data.info;
                }).catch(() => {

                    this.el.filePanelDocumentPreview.show();

                    switch(file.type)
                    {
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        case 'application/vnd.ms-word':
                            {
                                this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                                break;
                            }
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                        case 'application/vnd.ms-excel':
                            {
                                this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                                break;
                            }
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                        case 'application/vnd.ms-powerpoint':
                            {
                                this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                                break;
                            }
                        default: 
                            {
                                this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                            }
                    }
                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                });
            }
        });

        this.el.btnClosePanelDocumentPreview.on('click', e => {
            this.el.filePanelDocumentPreview.hide();
            this.closeAllMainPanels();
            this.el.panelMessagesContainer.show();
        });

        this.el.btnSendDocument.on('click', e => { // SEND DOCUMENT
            console.log('send document');
        });

            /* ----------- Send Contact ----------- */
        this.el.btnAttachContact.on('click', e=>{
            this.closeAllMainPanels();
            this.el.modalContacts.show();
        });

        this.el.btnCloseModalContacts.on('click', e => {
            this.closeAllMainPanels();
            this.el.panelMessagesContainer.show();
        });

        /* ----------- Record Audio ----------- */
        this.el.btnSendMicrophone.on('click', e => {
            this.el.btnSendMicrophone.hide();
            this.el.recordMicrophone.show();
            
            this.microphoneController.activateMicrophone();
            
            this.microphoneController.on('ready', ()=>{
                console.log('ready event');
                this.microphoneController.startRecorder();
            });

            this.microphoneController.on('recordtimer', timer=>{
                this.el.recordMicrophoneTimer.innerHTML = Format.getTime(timer);
            });

            this.microphoneController.on('stoptimer', ()=>{
                this.el.btnSendMicrophone.show();
                this.el.recordMicrophone.hide();
                this.el.recordMicrophoneTimer.innerHTML = '0:00';
            });
        });

        this.el.btnCancelMicrophone.on('click', e => {
            this.microphoneController.stopRecorder();
        });

        this.el.btnFinishMicrophone.on('click', e => {
            this.microphoneController.stopRecorder();
        });
        
        /* ----------- Keyboard ----------- */
        this.el.inputText.on('keyup', e => {

            if(this.el.inputText.innerHTML.length)
                this.hidePlaceholderMicrophone();
            else 
                this.showPlaceholderMicrophone();
        });

        this.el.inputText.on('keypress', e => {
            if(e.key === 'Enter' && !e.ctrlKey)
            {
                e.preventDefault();
                this.el.btnSend.click();
            }
        })
    
        this.el.btnSend.on('click', e => {
            console.log(this.el.inputText.innerHTML);
            this.el.inputText.innerHTML = '';
            
            this.showPlaceholderMicrophone();
        });

        /* ----------- Emoji Panel ----------- */ 
        this.el.btnEmojis.on('click', e => {
            this.el.panelEmojis.toggleClass('open');
        });
            /* ----------- Emoji Addition ----------- */
        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji=>{
            emoji.on('click', e => {
                this.hidePlaceholderMicrophone();
                
                const img = this.el.imgEmojiDefault.cloneNode();
                
                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;
                
                emoji.classList.forEach(name=>{ img.addClass(name); });

                let cursor = window.getSelection();

                if(!cursor.focusNode || !cursor.focusNode.id === 'input-text')
                {
                    this.el.inputText.focus();
                    cursor = window.getSelection();
                }

                let range = document.createRange();

                range = cursor.getRangeAt(0);
                
                range.deleteContents();

                const fragment = document.createDocumentFragment();

                fragment.appendChild(img);

                range.insertNode(fragment);

                range.setStartAfter(img);

            });
        });
    } // initEvents

    showPlaceholderMicrophone()
    {
        this.el.inputPlaceholder.show();
        this.el.btnSendMicrophone.show();
        this.el.btnSend.hide();
    } // showPlaceholderMicrophone

    hidePlaceholderMicrophone()
    {
        this.el.inputPlaceholder.hide();
        this.el.btnSendMicrophone.hide();
        this.el.btnSend.show();
    } // hidePlaceholderMicrophone

    closeAllMainPanels()
    {
        this.el.panelMessagesContainer.hide();
        this.el.panelCamera.removeClass('open');
        this.el.panelDocumentPreview.removeClass('open');
        this.el.modalContacts.hide();
    } // closeAllMainPanels

    closeAllLeftPanels()
    {
        this.el.panelEditProfile.hide();
        this.el.panelAddContact.hide();
        this.el.panelDocumentPreview.hide();
    } // closeAllLeftPanels

    closeMenuAttach()
    {
        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');
    } // closeMenuAttach

    /* ---- Getters ---- */
    get camera() { return this._camera; }
    get documentPreviewController() { return this._documentPreviewController; }
    get microphoneController() { return this._microphoneController; }
    get firebase() { return this._firebase; }
    get user() { return this._user; }
}