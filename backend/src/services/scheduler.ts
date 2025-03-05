import cron from 'node-cron';
import { NotificationService } from './notification';

const notificationService = new NotificationService();

export class SchedulerService {
  // Start all scheduler tasks
  public start(): void {
    this.startReminderCron();
    // Add other scheduler tasks here as needed
  }

  // Process reminders every minute
  private startReminderCron(): void {
    cron.schedule('* * * * *', async () => {
      try {
        await notificationService.processEventReminders();
      } catch (error) {
        console.error('Error processing reminders:', error);
      }
    });
  }
} 