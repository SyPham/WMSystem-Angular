import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatService } from 'src/app/_core/_service/chat.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { SignalrService } from 'src/app/_core/_service/signalr.service';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as signalr from 'src/assets/js/signalr';

@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.css']
})
export class ChatGroupComponent implements OnInit {
  @ViewChild('attachments') attachment: any;
  selectedFile: File;
  fileList: File[] = [];
  listOfFiles: any[] = [];
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  keyword: '%20';
  room: '';
  projects: any;
  messages: any;
  joinGroupMesasge: string;
  message: string = '';
  typing: string;
  projectName: '';
  isActive: boolean;
  isShowIcon: boolean;
  imageSrcPreview: any;
  showImageList: boolean;
  currentUser = JSON.parse(localStorage.getItem('user')).User.ID;
  urls = [];
  paths = [];
  images = [];
  files: any;
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });
  constructor(
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private alertify: AlertifyService,
    private hub: SignalrService,
    private calendarsService: CalendarsService,
  ) { }

  ngOnInit() {
    this.galleryOptions = [
      { image: false, thumbnailsRemainingCount: true, height: '100px' },
      { breakpoint: 500, width: '100%', thumbnailsColumns: 2 }
    ];

    this.galleryImages = [
      {
        small: 'https://img.thuthuatphanmem.vn/uploads/2018/10/08/anh-anime-phong-canh-dep_093817122.jpg',
        medium: 'https://img.thuthuatphanmem.vn/uploads/2018/10/08/anh-anime-phong-canh-dep_093817122.jpg',
        big: 'https://img.thuthuatphanmem.vn/uploads/2018/10/08/anh-anime-phong-canh-dep_093817122.jpg'
      },
      {
        small: 'https://img.thuthuatphanmem.vn/uploads/2018/10/08/anh-anime-phong-canh-dep_093817122.jpg',
        medium: 'https://img.thuthuatphanmem.vn/uploads/2018/10/08/anh-anime-phong-canh-dep_093817122.jpg',
        big: 'https://img.thuthuatphanmem.vn/uploads/2018/10/08/anh-anime-phong-canh-dep_093817122.jpg'
      },
      {
        small: 'https://img.thuthuatphanmem.vn/uploads/2018/10/08/anh-anime-phong-canh-dep_093817122.jpg',
        medium: 'https://img.thuthuatphanmem.vn/uploads/2018/10/08/anh-anime-phong-canh-dep_093817122.jpg',
        big: 'https://img.thuthuatphanmem.vn/uploads/2018/10/08/anh-anime-phong-canh-dep_093817122.jpg'
      }
    ];
    this.projectName = '';
    this.getProjects();
   // this.hub.startConnection();
    this.receivedMessage();
    this.receiveTyping();
    this.receivedStopTyping();
    this.receivedJoinGroup();
  }
  defaultImage() {
    return '../../../../assets/img/logo-1.png';
  }
  imageBase64(img) {
    if (img == null) {
      return this.defaultImage();
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + img);
    }
  }
  checkShowMessage(user): string {
    // let check = Number(this.currentUser) === Number(user);
    return Number(this.currentUser) === Number(user) ? 'sent' : 'replies';
  }
  checkShowMessageUsername(user): string {
    // let check = Number(this.currentUser) === Number(user);
    return Number(this.currentUser) === Number(user) ? 'username-sent' : 'username-replies';
  }
  sendMessage(event) {
    // console.log(event);
    if (event.type === 'keyup') {
      this.stopTyping();
    }
    this.stillTyping();
    if (event.keyCode === 13) {
      this.sendToGroup();
      // self.$refs.messageBox.scrollTop = self.$refs.messageBox.scrollHeight;
    }
  }
  searchProjects() {
    this.getProjects();
  }
  getProjects() {
    this.chatService.getProjects(this.keyword).subscribe(
      (response: any) => {
        this.projects = response;
      });
  }
  getChatMessage() {
    this.chatService.getChatMessage(this.room).subscribe(
      (response: any) => {
        this.messages = response;
        let objDiv = document.getElementById('messageBox');
        objDiv.scrollTop = objDiv.scrollHeight;
      });
  }
  datetime(d) {
    return this.calendarsService.JSONDateWithTime(d);
  }
  joinGroup(item) {
    this.isActive = true;
    let managers = item.Manager || [];
    let members = item.Members || [];
    if (managers.concat(members).includes(this.currentUser)) {
      this.room = item.Room;
      this.projectName = item.Name;
      signalr.CONNECTION_HUB
        .invoke('JoinGroup', this.room.toString(), this.currentUser.toString())
        .catch((err) => {
          // console.error(err.toString());
        });
      this.getChatMessage();
    } else {
      this.room = '';
      this.alertify.warning('You do not belong in this group!', true);
    }
  }
  sendToGroup() {
    this.addMessageGroup();
    this.isShowIcon = false;
    this.showImageList = false;
    this.message = '';
  }
  stillTyping() {
    // this.typing = 'typing';
    signalr.CONNECTION_HUB
      .invoke('Typing', this.room.toString(), this.currentUser.toString())
      .catch((err) => {
        // console.error(err.toString());
      });
  }
  stopTyping() {
    signalr.CONNECTION_HUB
      .send('StopTyping', this.room.toString(), this.currentUser.toString())
      .catch((err) => {
        // console.error(err.toString());
      });
  }
  receiveTyping() {
    signalr.CONNECTION_HUB.on('ReceiveTyping', (user, username) => {
      if (this.currentUser !== Number(user)) {
        this.typing = `${username} is typing`;
      }
    });
  }
  receivedMessage() {
    signalr.CONNECTION_HUB.on('ReceiveMessageGroup', (message) => {
      this.getChatMessage();
    });
  }
  receivedStopTyping() {
    signalr.CONNECTION_HUB.on('ReceiveStopTyping', (message) => {
      this.typing = '';
    });
  }
  receivedJoinGroup() {
    signalr.CONNECTION_HUB.on('ReceiveJoinGroup', (user, username) => {
      if (Number(this.currentUser) !== Number(user)) {
        this.joinGroupMesasge = `${username} already joined this group!`;
        this.alertify.message(this.joinGroupMesasge);
      }
    });
  }
  emojiSelect($event) {
    this.message += $event.emoji.native;
  }
  onClickIcon() {
    this.isShowIcon = !this.isShowIcon;
  }
  displayImage() {
    document.getElementById('image-file').click();
    this.showImageList = true;
  }
  onChangeImageFile($event) {
    // console.log($event);
    this.urls = [];
    this.paths = [];
    this.fileList =[];
    this.files = $event.target.files;
    // console.log(this.files);
    if (this.files) {
      for (let file of this.files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
          this.images.push(e.target.result);
          this.fileList.push(file);
          this.paths.push(environment.imagePath + file.name);
          this.myForm.patchValue({
            fileSource: this.images,
            file
          });
          // console.log(this.myForm);
        };
        reader.readAsDataURL(file);
      }
    }
    if (this.urls.length > 5) {
      this.urls = [];
      this.alertify.warning('You have picked too many files. Limit is 10', true);
    }
    // console.log(this.urls);
    // console.log(this.paths);
    // console.log(this.fileList);
    this.attachment.nativeElement.value = '';
  }
  bindImagebase64(img) {
    this.sanitizer.bypassSecurityTrustResourceUrl(img);
  }

  removeSelectedFile(index) {
    this.fileList.splice(index, 1);
    this.urls.splice(index, 1);
    if (this.urls.length === 0) {
      this.showImageList = false;
    }
    // console.log(this.fileList);
    // console.log(this.urls);

  }
  onBlurInputChat(event) {
    this.stopTyping();
    this.showImageList = false;
  }
  addMessageGroup() {
    let chat = {
      RoomID: this.room,
      userID: this.currentUser,
      Message: this.message
    };
    this.chatService.addMessageGroup(chat)
      .subscribe(arg => {
        // console.log('Successfully!');
        this.uploadImage(arg);
      });
  }
  uploadImage(chat) {
    if (this.fileList) {
      const formData = new FormData();
      for (const iterator of this.fileList) {
        formData.append('UploadedFile', iterator);
      }
      formData.append('Chat', chat.ID);
      this.chatService.uploadImages(formData).subscribe( res => {
        // console.log(res);
        this.showImageList = false;
        this.urls = [];
        this.paths = [];
        this.fileList =[];
        this.getChatMessage();
      });
    }
  }
  renderGalleryImages(item) {
   let listAll = [];
   for (const iterator of item.Images) {
    let child = {
      small: iterator,
      medium: iterator,
      big: iterator
    };
    listAll.push(child);
   }
   return listAll;
  }
}
