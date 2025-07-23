import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { FeedbackService } from './feedback.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isLoggedIn = false;
  userName = '';
  feedback = { name: '', email: '', message: '' };

  constructor(
    private msal: MsalService,
    private feedbackService: FeedbackService,
    private snackBar: MatSnackBar  // ✅ Added SnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const result = await this.msal.instance.handleRedirectPromise();
      if (result?.account) {
        this.msal.instance.setActiveAccount(result.account);
      }
      this.loadAccount();
    } catch (err) {
      console.error('MSAL redirect error:', err);
    }
  }

  login(): void {
    this.msal.loginRedirect({ scopes: ['openid', 'profile', 'email'], prompt: 'login' });
  }

  logout(): void {
    this.msal.logoutRedirect();
  }

  private loadAccount(): void {
    const account: AccountInfo | null = this.msal.instance.getActiveAccount()
      ?? this.msal.instance.getAllAccounts()[0] ?? null;

    if (!account) {
      this.isLoggedIn = false;
      return;
    }
    this.isLoggedIn = true;
    this.userName = account.username ?? '';
    const claims: any = account.idTokenClaims ?? {};
    this.feedback.name = claims['name'] ?? '';
    this.feedback.email = claims['preferred_username'] ?? account.username ?? '';
  }

  submitFeedback(): void {
    if (!this.feedback.message.trim()) {
      this.snackBar.open('Please enter feedback before submitting.', 'Close', { duration: 3000 });
      return;
    }

    this.feedbackService.submitFeedback(this.feedback).subscribe({
      next: (res) => {
        this.snackBar.open(res.message || 'Feedback submitted successfully!', 'Close', { duration: 3000 });
        this.feedback.message = '';
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        this.snackBar.open('Failed to submit feedback. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}
