import {
  Component,
  ElementRef,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Message } from '../../services/models/message';
import { MessageService } from '../../services/message.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.scss',
})
export class MessengerComponent implements OnInit {
  notificationService: NotificationService = inject(NotificationService);
  messageService: MessageService = inject(MessageService);
  showLoader: boolean = false;
  messages: Message[] = [];
  @Output() messengerVisibility = new EventEmitter<boolean>();
  @ViewChild('messageInput') messageInput: ElementRef;
  toggleMessengerVisibility() {
    this.messengerVisibility.emit(false);
  }
  sendMessage(msg: string) {
    let message = new Message('cashier', msg);
    this.messageService.sendMessage(message).subscribe({
      next: () => {
        this.notificationService.showSuccessfulSnackBar('پیام ارسال شد.');
        this.fetchMessages();
        this.messageInput.nativeElement.value = '';
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  fetchMessages() {
    this.showLoader = true;
    this.messages = [];
    return this.messageService.fetchMessage().subscribe({
      next: (message) => {
        this.messages = message;
        this.showLoader = false;
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
        this.showLoader = false;
      },
    });
  }
  deleteMessage(messageId: string) {
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
        this.notificationService.showSuccessfulSnackBar('پیام حذف شد.');
        this.fetchMessages();
      },
      error: () => {
        this.notificationService.showErrorSnackBar('خطایی رخ داد!');
      },
    });
  }
  ngOnInit() {
    this.fetchMessages();
  }
}
