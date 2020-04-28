import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatService } from 'src/app/_core/_service/chat.service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { SignalrService } from 'src/app/_core/_service/signalr.service';
import { CalendarsService } from 'src/app/_core/_service/calendars.service';

@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.css']
})
export class ChatGroupComponent implements OnInit {
  keyword: '%20';
  room: '';
  projects: any;
  messages: any;
  message: string;
  typing: string;
  projectName: '';
  isActive: boolean;
  currentUser = JSON.parse(localStorage.getItem('user')).User.ID;
  constructor(
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private alertify: AlertifyService,
    private hub: SignalrService,
    private calendarsService: CalendarsService,
  ) { }

  ngOnInit() {
    this.projectName = '';
    this.getProjects();
    this.hub.startConnection();
    this.hub.currentreceiveMessageGroup.subscribe(res => {
      if (res > 0) {
        debugger
        this.getChatMessage();
      }
    });
  }
  defaultImage() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAJYAA
      ACWBAMAAADOL2zRAAAAG1BMVEVsdX3////Hy86jqK1+ho2Ql521ur7a3N7s7e5Yhi
      PTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtH
      OTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJ
      J0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvF
      IXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOy
      qPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP
      2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg==`);
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
    console.log(event);
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
      this.hub.hubConnection
        .send('JoinGroup', this.room, this.currentUser)
        .catch((err) => {
          console.error(err.toString());
        });
      this.getChatMessage();
    } else {
      this.room = '';
      this.alertify.warning('You do not belong in this group!', true);
    }
  }
  sendToGroup() {
    this.hub.hubConnection
      .send('SendMessageToGroup', this.room, this.message, this.currentUser)
      .catch((err) => {
        console.error(err.toString());
      });
    this.message = '';
    this.getChatMessage();
  }
  stillTyping() {
    this.hub.typing(this.room, this.currentUser);
    // this.typing = 'typing';
  }
  stopTyping() {
    this.hub.hubConnection
    .send('Typing', this.room, this.currentUser)
    .catch((err) => {
       console.error(err.toString());
    });
    this.typing = '';
  }
  receiveTyping() {
    this.hub.receiveTyping((user, username) => {
      if (this.currentUser !== Number(user)) {
        this.typing = `${username} is typing`;
      }
    });
  }
}
