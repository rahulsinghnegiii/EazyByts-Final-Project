import * as nodemailer from 'nodemailer';
import { Event } from '../models/Event';
import { User } from '../models/User';

export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // Configure your email service here
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Send verification email
  public async sendVerificationEmail(email: string, verificationUrl: string) {
    const emailTemplate = this.getVerificationEmailTemplate(verificationUrl);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your Email Address',
      html: emailTemplate,
    });
  }

  // Send password reset email
  public async sendPasswordResetEmail(email: string, resetUrl: string) {
    const emailTemplate = this.getPasswordResetTemplate(resetUrl);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset Your Password',
      html: emailTemplate,
    });
  }

  // Send event reminder
  public async sendEventReminder(event: any, user: any, minutesBefore: number) {
    const emailTemplate = this.getEventReminderTemplate(event, minutesBefore);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Reminder: ${event.title} starts in ${minutesBefore} minutes`,
      html: emailTemplate,
    });
  }

  // Send registration confirmation
  public async sendRegistrationConfirmation(event: any, user: any) {
    const emailTemplate = this.getRegistrationTemplate(event);
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Registration Confirmed: ${event.title}`,
      html: emailTemplate,
    });
  }

  // Send event update notification
  public async sendEventUpdateNotification(event: any, updateType: string) {
    const attendees = await User.find({ _id: { $in: event.attendees } });
    const emailTemplate = this.getEventUpdateTemplate(event, updateType);

    for (const attendee of attendees) {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: attendee.email,
        subject: `Event Update: ${event.title}`,
        html: emailTemplate,
      });
    }
  }

  // Process event reminders
  public async processEventReminders() {
    const now = new Date();
    const events = await Event.find({
      startDate: { $gt: now },
      'reminders.time': { $exists: true },
    }).populate('attendees');

    for (const event of events) {
      for (const reminder of event.reminders) {
        const reminderTime = new Date(event.startDate.getTime() - reminder.time * 60000);
        
        if (now >= reminderTime) {
          for (const attendee of event.attendees) {
            if (reminder.type === 'email') {
              await this.sendEventReminder(event, attendee, reminder.time);
            }
          }
        }
      }
    }
  }

  private getVerificationEmailTemplate(verificationUrl: string): string {
    return `
      <h2>Verify Your Email Address</h2>
      <p>Thank you for registering! Please click the link below to verify your email address:</p>
      <p><a href="${verificationUrl}">Verify Email</a></p>
      <p>If you did not create an account, please ignore this email.</p>
      <p>This link will expire in 24 hours.</p>
    `;
  }

  private getPasswordResetTemplate(resetUrl: string): string {
    return `
      <h2>Reset Your Password</h2>
      <p>You have requested to reset your password. Click the link below to proceed:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
      <p>This link will expire in 10 minutes.</p>
    `;
  }

  private getEventReminderTemplate(event: any, minutesBefore: number): string {
    return `
      <h2>Event Reminder</h2>
      <p>Your event "${event.title}" starts in ${minutesBefore} minutes.</p>
      <p><strong>Date:</strong> ${event.startDate.toLocaleString()}</p>
      <p><strong>Location:</strong> ${event.location?.name || 'Online'}</p>
      <p><strong>Description:</strong> ${event.description}</p>
    `;
  }

  private getRegistrationTemplate(event: any): string {
    return `
      <h2>Registration Confirmed</h2>
      <p>You have successfully registered for "${event.title}".</p>
      <p><strong>Date:</strong> ${event.startDate.toLocaleString()}</p>
      <p><strong>Location:</strong> ${event.location?.name || 'Online'}</p>
      <p><strong>Description:</strong> ${event.description}</p>
    `;
  }

  private getEventUpdateTemplate(event: any, updateType: string): string {
    return `
      <h2>Event Update</h2>
      <p>The event "${event.title}" has been updated.</p>
      <p><strong>Update Type:</strong> ${updateType}</p>
      <p><strong>New Date:</strong> ${event.startDate.toLocaleString()}</p>
      <p><strong>Location:</strong> ${event.location?.name || 'Online'}</p>
      <p><strong>Description:</strong> ${event.description}</p>
    `;
  }
} 